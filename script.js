document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const generateButton = document.getElementById('generate');
    const bitPatternArea = document.getElementById('bitPattern');
    const clearButton = document.getElementById('clear');
    const invertedPatternArea = document.getElementById('invertedPattern');
    const hexPatternArea = document.getElementById('hexPattern');
    const saveButton = document.getElementById('save');
    const loadButton = document.getElementById('load');
    const fileInput = document.getElementById('fileInput');

    const ROWS = 8;
    const COLS = 7;
    for (let i = 0; i < ROWS * COLS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => {
            cell.classList.toggle('active');
        });
        grid.appendChild(cell);
    }

    const generatePattern = () => {
        const cells = grid.children;
        const rows = [];
        for (let r = 0; r < ROWS; r++) {
            let line = '0';
            for (let c = 0; c < COLS; c++) {
                const cell = cells[r * COLS + c];
                line += cell.classList.contains('active') ? '1' : '0';
            }
            rows.push(line);
        }
        const pattern = rows.join('\n');
        if (bitPatternArea) bitPatternArea.value = pattern;
        updateInverted();
        return pattern;
    };

    const applyPatternToGrid = (pattern) => {
        const lines = pattern.split(/\r?\n/);
        const cells = grid.children;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = cells[r * COLS + c];
                if (lines[r] && lines[r][c + 1] === '1') {
                    cell.classList.add('active');
                } else {
                    cell.classList.remove('active');
                }
            }
        }
    };

    const updateInverted = () => {
        if (!bitPatternArea) return;
        const lines = bitPatternArea.value.split('\n');
        const inverted = lines.map(line => line.split('').reverse().join(''));
        if (invertedPatternArea) {
            invertedPatternArea.value = inverted.join('\n');
        }
        if (hexPatternArea) {
            const hex = inverted.map(line => {
                if (!line.trim()) return '';
                const value = parseInt(line, 2);
                return '$' + value.toString(16).toUpperCase().padStart(2, '0');
            });
            hexPatternArea.value = hex.join('\n');
        }
    };

    if (bitPatternArea) {
        bitPatternArea.addEventListener('input', updateInverted);
    }

    if (generateButton && bitPatternArea) {
        generateButton.addEventListener('click', generatePattern);
    }

    if (saveButton && bitPatternArea) {
        saveButton.addEventListener('click', () => {
            const pattern = generatePattern();
            const blob = new Blob([pattern], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'bit-pattern.txt';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }

    if (loadButton && fileInput && bitPatternArea) {
        loadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const content = ev.target.result.trim();
                bitPatternArea.value = content;
                applyPatternToGrid(content);
                updateInverted();
            };
            reader.readAsText(file);
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            const cells = grid.children;
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove('active');
            }
            if (bitPatternArea) bitPatternArea.value = '';
            if (invertedPatternArea) invertedPatternArea.value = '';
            if (hexPatternArea) hexPatternArea.value = '';
        });
    }
});
