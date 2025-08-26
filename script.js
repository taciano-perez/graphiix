document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const generateButton = document.getElementById('generate');
    const bitPatternArea = document.getElementById('bitPattern');
    const clearButton = document.getElementById('clear');
    const hexPatternArea = document.getElementById('hexPattern');
    const decPatternArea = document.getElementById('decPattern');
    const basicCommandsArea = document.getElementById('basicCommands');
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
            line = line.split('').reverse().join('');
            rows.push(line);
        }
        const pattern = rows.join('\n');
        if (bitPatternArea) bitPatternArea.value = pattern;
        updateHex();
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

    const updateHex = () => {
        if (!bitPatternArea) return;
        const lines = bitPatternArea.value.split('\n');
        const dec = lines.map(line => {
            if (!line.trim()) return '';
            const value = parseInt(line, 2);
            return value.toString(10);
        });
        if (hexPatternArea) {
            const hex = lines.map(line => {
                if (!line.trim()) return '';
                const value = parseInt(line, 2);
                return '$' + value.toString(16).toUpperCase().padStart(2, '0');
            });
            hexPatternArea.value = hex.join('\n');
        }
        if (decPatternArea) {
            decPatternArea.value = dec.join('\n');
        }
        if (basicCommandsArea) {
            const basic = dec.map((value, index) => {
                if (!lines[index].trim()) return '';
                const lineNumber = 100 + index * 10;
                const offset = index * 1024;
                const address = offset === 0 ? 'BA%' : `BA% + ${offset}`;
                return `${lineNumber} POKE ${address},${value}`;
            });
            basicCommandsArea.value = basic.join('\n');
        }
    };

    if (bitPatternArea) {
        bitPatternArea.addEventListener('input', updateHex);
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
                updateHex();
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
            if (hexPatternArea) hexPatternArea.value = '';
            if (decPatternArea) decPatternArea.value = '';
            if (basicCommandsArea) basicCommandsArea.value = '';
        });
    }
});
