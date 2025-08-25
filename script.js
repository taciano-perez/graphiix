document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const generateButton = document.getElementById('generate');
    const bitPatternArea = document.getElementById('bitPattern');

    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => {
            cell.classList.toggle('active');
        });
        grid.appendChild(cell);
    }

    if (generateButton && bitPatternArea) {
        generateButton.addEventListener('click', () => {
            const cells = grid.children;
            const rows = [];
            for (let r = 0; r < 8; r++) {
                let line = '';
                for (let c = 0; c < 8; c++) {
                    const cell = cells[r * 8 + c];
                    line += cell.classList.contains('active') ? '1' : '0';
                }
                rows.push(line);
            }
            bitPatternArea.value = rows.join('\n');
        });
    }
});
