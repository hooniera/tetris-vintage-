const SHAPES = [
    [[1, 1, 1, 1]], // I shape
    [[2, 2], [2, 2]], // O shape
    [[0, 3, 0], [3, 3, 3]], // T shape
    [[4, 4, 0], [0, 4, 4]], // S shape
    [[0, 5, 5], [5, 5, 0]], // Z shape
    [[6, 0, 0], [6, 6, 6]], // J shape
    [[0, 0, 7], [7, 7, 7]]  // L shape
];

function createPiece(index) {
    return SHAPES[index].map(row => row.slice());
}

function randomPieceIndex() {
    return Math.floor(Math.random() * SHAPES.length);
}

export { createPiece, randomPieceIndex };