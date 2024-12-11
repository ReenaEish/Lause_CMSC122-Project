import { initializeGrid, renderGrid, moveTile, moveEmptyTile, isAdjacentToEmpty, checkWinCondition } from './tile.js';

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');

    let grid = [];
    const gridSize = 4; // 4x4 grid
    const emptyTile = { row: 3, col: 3 }; // Start with the empty tile in the bottom-right corner

    // Initialize the grid
    function initializeGrid() {
        // Generate a solvable randomized grid
        grid = generateSolvableGrid();

        // Render the grid
        renderGrid(grid, gridContainer);
    }

    // Generate a randomized, solvable grid
    function generateSolvableGrid() {
        const numbers = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
        numbers.push(null); // Add the empty tile
        let shuffled;

        // Shuffle the numbers and check for solvability
        do {
            shuffled = numbers.sort(() => Math.random() - 0.5);
        } while (!isSolvable(shuffled));

        // Create a 2D array (grid)
        return Array.from({ length: gridSize }, (_, row) =>
            shuffled.slice(row * gridSize, (row + 1) * gridSize)
        );
    }

    // Check if a grid configuration is solvable
    function isSolvable(array) {
        let inversions = 0;
        const flatArray = array.filter(num => num !== null);

        for (let i = 0; i < flatArray.length - 1; i++) {
            for (let j = i + 1; j < flatArray.length; j++) {
                if (flatArray[i] > flatArray[j]) inversions++;
            }
        }

        const emptyRowFromBottom = gridSize - Math.floor(array.indexOf(null) / gridSize);

        // Solvability rules for even-sized grids
        return (
            (inversions % 2 === 0 && emptyRowFromBottom % 2 !== 0) ||
            (inversions % 2 !== 0 && emptyRowFromBottom % 2 === 0)
        );
    }

    // Event listener for WASD keys
    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' || event.key === 'W') {
            moveEmptyTile('up', grid, emptyTile);
        } else if (event.key === 's' || event.key === 'S') {
            moveEmptyTile('down', grid, emptyTile);
        } else if (event.key === 'a' || event.key === 'A') {
            moveEmptyTile('left', grid, emptyTile);
        } else if (event.key === 'd' || event.key === 'D') {
            moveEmptyTile('right', grid, emptyTile);
        }
    });

    // Initialize the game
    initializeGrid();
});
