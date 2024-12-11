// Function to render the grid
export function renderGrid(grid, gridContainer) {
    gridContainer.innerHTML = ''; // Clear the grid container

    grid.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileButton = document.createElement('button');
            tileButton.className = 'tile';
            tileButton.textContent = tile || ''; // Empty slot has no text
            tileButton.dataset.row = rowIndex;
            tileButton.dataset.col = colIndex;

            // Apply "empty" class for the empty slot
            if (tile === null) {
                tileButton.classList.add('empty');
            } else {
                // Add click event for movable tiles
                tileButton.addEventListener('click', () => moveTile(rowIndex, colIndex, grid));
            }

            gridContainer.appendChild(tileButton);
        });
    });
}

// Function to move a tile if it's adjacent to the empty slot
export function moveTile(row, col, grid) {
    const emptyTile = { row: 3, col: 3 }; // Get the current empty tile position

    if (isAdjacentToEmpty(row, col, emptyTile)) {
        // Swap the clicked tile with the empty slot
        grid[emptyTile.row][emptyTile.col] = grid[row][col];
        grid[row][col] = null;

        // Update the empty tile position
        emptyTile.row = row;
        emptyTile.col = col;

        // Re-render the grid
        renderGrid(grid, document.getElementById('grid-container'));

        // Check for win condition
        if (checkWinCondition(grid)) {
            alert('Congratulations! You solved the puzzle!');
        }
    }
}

// Check if a tile is adjacent to the empty slot
export function isAdjacentToEmpty(row, col, emptyTile) {
    const rowDiff = Math.abs(row - emptyTile.row);
    const colDiff = Math.abs(col - emptyTile.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Move the empty tile based on key press (WASD)
export function moveEmptyTile(direction, grid, emptyTile) {
    let newRow = emptyTile.row;
    let newCol = emptyTile.col;

    // Determine the new position based on the key pressed
    if (direction === 'up') newRow--;
    if (direction === 'down') newRow++;
    if (direction === 'left') newCol--;
    if (direction === 'right') newCol++;

    // Ensure the new position is within bounds
    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
        // Swap the empty tile with the adjacent tile
        grid[emptyTile.row][emptyTile.col] = grid[newRow][newCol];
        grid[newRow][newCol] = null;

        // Update the empty tile position
        emptyTile.row = newRow;
        emptyTile.col = newCol;

        // Re-render the grid
        renderGrid(grid, document.getElementById('grid-container'));
    }
}

// Check if the grid is in the winning configuration
export function checkWinCondition(grid) {
    const flatGrid = grid.flat();
    for (let i = 0; i < flatGrid.length - 1; i++) {
        if (flatGrid[i] !== i + 1) return false;
    }
    return flatGrid[flatGrid.length - 1] === null;
}
