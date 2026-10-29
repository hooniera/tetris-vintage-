const themes = {
    night: {
        background: 'radial-gradient(circle at top, #44392b 0%, #1a150f 55%, #0f0c09 100%)',
        text: '#e7d9b8',
        secondaryText: '#c8b294',
        panelBg: 'rgba(255, 255, 255, 0.04)',
        panelBorder: 'rgba(255, 255, 255, 0.08)',
        canvasBg: '#120f0c',
        canvasBorder: '#3f3529',
        buttonBg: '#7a6b55',
        buttonHover: '#8f7a60',
    },
    day: {
        background: 'radial-gradient(circle at top, #d4e4f7 0%, #e8f4ff 55%, #f5faff 100%)',
        text: '#2c3e50',
        secondaryText: '#34495e',
        panelBg: 'rgba(52, 152, 219, 0.08)',
        panelBorder: 'rgba(52, 152, 219, 0.2)',
        canvasBg: '#f0f8ff',
        canvasBorder: '#bdd7ee',
        buttonBg: '#3498db',
        buttonHover: '#2980b9',
    },
    summer: {
        background: 'radial-gradient(circle at top, #ffb347 0%, #ff9500 55%, #ff8c00 100%)',
        text: '#fff5e6',
        secondaryText: '#ffe4b5',
        panelBg: 'rgba(255, 200, 100, 0.15)',
        panelBorder: 'rgba(255, 200, 100, 0.3)',
        canvasBg: '#fff0d9',
        canvasBorder: '#ffd89b',
        buttonBg: '#ff8c42',
        buttonHover: '#ff7620',
    },
    winter: {
        background: 'radial-gradient(circle at top, #b0d4e3 0%, #d4e6f1 55%, #ebf5fb 100%)',
        text: '#e8f4f8',
        secondaryText: '#d4e6f1',
        panelBg: 'rgba(174, 214, 241, 0.1)',
        panelBorder: 'rgba(174, 214, 241, 0.25)',
        canvasBg: '#ecf0f1',
        canvasBorder: '#aed6f1',
        buttonBg: '#5dade2',
        buttonHover: '#3498db',
    },
    fall: {
        background: 'radial-gradient(circle at top, #8b4513 0%, #a0522d 55%, #8b3a0f 100%)',
        text: '#f5deb3',
        secondaryText: '#daa520',
        panelBg: 'rgba(218, 165, 32, 0.12)',
        panelBorder: 'rgba(218, 165, 32, 0.25)',
        canvasBg: '#2f1b0c',
        canvasBorder: '#8b4513',
        buttonBg: '#b8860b',
        buttonHover: '#daa520',
    },
    spring: {
        background: 'radial-gradient(circle at top, #d8f5e2 0%, #e8f8ee 55%, #f0fbf5 100%)',
        text: '#2d5016',
        secondaryText: '#3d6b2f',
        panelBg: 'rgba(144, 238, 144, 0.15)',
        panelBorder: 'rgba(144, 238, 144, 0.3)',
        canvasBg: '#f0fff0',
        canvasBorder: '#98fb98',
        buttonBg: '#3fa796',
        buttonHover: '#2d8a78',
    },
};

function changeTheme(theme) {
    const selectedTheme = themes[theme];
    document.body.style.background = selectedTheme.background;
    document.body.style.color = selectedTheme.text;
    // Apply other styles as needed
}

export { themes, changeTheme };