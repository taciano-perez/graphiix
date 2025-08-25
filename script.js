document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const generateButton = document.getElementById('generate');
    const bitPatternArea = document.getElementById('bitPattern');
    const clearButton = document.getElementById('clear');
    const invertedPatternArea = document.getElementById('invertedPattern');
    const saveButton = document.getElementById('save');
    const loadButton = document.getElementById('load');
    const fileInput = document.getElementById('fileInput');

    for (let i = 0; i < 64; i++) {
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
        for (let r = 0; r < 8; r++) {
            let line = '';
            for (let c = 0; c < 8; c++) {
                const cell = cells[r * 8 + c];
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
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = cells[r * 8 + c];
                if (lines[r] && lines[r][c] === '1') {
                    cell.classList.add('active');
                } else {
                    cell.classList.remove('active');
                }
            }
        }
    };

    const updateInverted = () => {
        if (!invertedPatternArea) return;
        const lines = bitPatternArea.value.split('\n');
        const inverted = lines.map(line => line.split('').reverse().join(''));
        invertedPatternArea.value = inverted.join('\n');
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
        });
    }
});
