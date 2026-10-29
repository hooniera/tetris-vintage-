const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPiece');
const nextCtx = nextCanvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const restartButton = document.getElementById('restartBtn');

let currentTheme = 'night';
const themeColors = {
    night: ['#000000', '#C9A66B', '#BF7F5F', '#5C7A6D', '#7C7A8A', '#B68A5E', '#A24B4B', '#61685F'],
    day: ['#000000', '#4A90E2', '#7B68EE', '#50C878', '#FFD700', '#FF6B6B', '#FF8C42', '#20B2AA'],
    summer: ['#000000', '#FF6B35', '#F7931E', '#FDB462', '#FFD700', '#FF1493', '#FF69B4', '#FFB347'],
    winter: ['#000000', '#E8F4F8', '#B0E0E6', '#87CEEB', '#4682B4', '#1E90FF', '#00BFFF', '#00CED1'],
    fall: ['#000000', '#8B4513', '#CD853F', '#DAA520', '#D2691E', '#B8860B', '#A0522D', '#DC143C'],
    spring: ['#000000', '#90EE90', '#3CB371', '#2E8B57', '#6495ED', '#FFB6C1', '#FF69B4', '#DDA0DD']
};
let COLORS = themeColors.night;

const COLS = 10;
const ROWS = 20;
const BLOCK = 24;
const SHAPES = [
    [[1,1,1,1]],
    [[2,2],[2,2]],
    [[0,3,0],[3,3,3]],
    [[4,4,0],[0,4,4]],
    [[0,5,5],[5,5,0]],
    [[6,0,0],[6,6,6]],
    [[0,0,7],[7,7,7]]
];

const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece;
let nextPiece;
let position = { x: 0, y: 0 };
let score = 0;
let lines = 0;
let level = 1;
let dropInterval = 1000;
let dropTime = 0;
let lastTime = 0;
let isPaused = false;
let gameOver = false;

function createPiece(index) {
    return SHAPES[index].map(row => row.slice());
}

function randomPieceIndex() {
    return Math.floor(Math.random() * SHAPES.length);
}

function collide(piece, pos) {
    return piece.some((row, dy) =>
        row.some((value, dx) => {
            if (!value) return false;
            const x = pos.x + dx;
            const y = pos.y + dy;
            return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x]);
        })
    );
}

function merge() {
    currentPiece.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value && position.y + dy >= 0) {
                board[position.y + dy][position.x + dx] = value;
            }
        });
    });
}

function rotate(matrix) {
    return matrix[0].map((_, index) => matrix.map(row => row[row.length - 1 - index]));
}

function resetPiece() {
    currentPiece = createPiece(nextPiece);
    position = { x: Math.floor((COLS - currentPiece[0].length) / 2), y: -1 };
    nextPiece = randomPieceIndex();
    drawNext();
    if (collide(currentPiece, position)) {
        gameOver = true;
    }
}

function sweep() {
    let count = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            count++;
            y++;
        }
    }
    if (count > 0) {
        lines += count;
        score += [0, 40, 100, 300, 1200][count] * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(200, 1000 - (level - 1) * 80);
        updateStats();
    }
}

function updateStats() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    linesEl.textContent = lines;
}

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK - 1, BLOCK - 1);
}

function drawBoard() {
    ctx.fillStyle = '#120f0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) drawCell(x, y, COLORS[value]);
        });
    });
}

function drawPiece(piece, offset) {
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value && offset.y + y >= 0) {
                drawCell(offset.x + x, offset.y + y, COLORS[value]);
            }
        });
    });
}

function drawNext() {
    nextCtx.fillStyle = '#120f0c';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    const preview = createPiece(nextPiece);
    const scale = 24;
    const offsetX = 1;
    const offsetY = 1;
    preview.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextCtx.fillStyle = COLORS[value];
                nextCtx.fillRect((x + offsetX) * scale, (y + offsetY) * scale, scale - 2, scale - 2);
            }
        });
    });
}

function move(offset) {
    const newPos = { x: position.x + offset, y: position.y };
    if (!collide(currentPiece, newPos)) {
        position = newPos;
    }
}

function drop() {
    position.y++;
    if (collide(currentPiece, position)) {
        position.y--;
        merge();
        sweep();
        resetPiece();
    }
    dropTime = 0;
}

function hardDrop() {
    while (!collide(currentPiece, { x: position.x, y: position.y + 1 })) {
        position.y++;
    }
    merge();
    sweep();
    resetPiece();
    dropTime = 0;
}

function rotatePiece() {
    const rotated = rotate(currentPiece);
    if (!collide(rotated, position)) {
        currentPiece = rotated;
        return;
    }
    for (let offset of [-1, 1, -2, 2]) {
        const newPos = { x: position.x + offset, y: position.y };
        if (!collide(rotated, newPos)) {
            position = newPos;
            currentPiece = rotated;
            return;
        }
    }
}

function restart() {
    board.forEach(row => row.fill(0));
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    isPaused = false;
    gameOver = false;
    nextPiece = randomPieceIndex();
    resetPiece();
    updateStats();
    drawNext();
}

function drawOverlay(text) {
    ctx.fillStyle = 'rgba(18,16,15,0.9)';
    ctx.fillRect(0, canvas.height / 2 - 24, canvas.width, 48);
    ctx.fillStyle = '#f5e9c9';
    ctx.font = '18px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 6);
}

function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    if (!isPaused && !gameOver) {
        dropTime += delta;
        if (dropTime > dropInterval) drop();
    }
    drawBoard();
    drawPiece(currentPiece, position);
    if (gameOver) drawOverlay('GAME OVER');
    else if (isPaused) drawOverlay('PAUSED');
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.repeat) return;
    switch (event.key) {
        case 'ArrowLeft': move(-1); break;
        case 'ArrowRight': move(1); break;
        case 'ArrowDown': drop(); break;
        case 'ArrowUp': rotatePiece(); break;
        case ' ': hardDrop(); break;
        case 'p':
        case 'P': isPaused = !isPaused; break;
        case 'r':
        case 'R': restart(); break;
    }
});

restartButton.addEventListener('click', restart);
nextPiece = randomPieceIndex();
resetPiece();
updateStats();
drawNext();
update();