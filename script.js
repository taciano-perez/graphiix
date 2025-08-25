document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');

    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => {
            cell.classList.toggle('active');
        });
        grid.appendChild(cell);
    }
});
