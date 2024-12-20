const gameState = {
    GAME_IDLE: '__game_idle__',
    GAME_STARTED: '__game_started__',
    GAME_OVER: '__game_over__',
    GAME_PAUSED: '__game_paused__'
};

const swap = (arr, from, to) => {
    arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
    return arr;
};

const isNeighbour = (to, from) => {
    let emptyColumn = Math.floor(to % 4);
    let emptyRow = Math.floor(to / 4);
    let clickedColumn = Math.floor(from % 4);
    let clickedRow = Math.floor(from / 4);

    const sameRow = emptyRow === clickedRow;
    const sameColumn = emptyColumn === clickedColumn;
    const columnDiff = emptyColumn - clickedColumn;
    const rowDiff = emptyRow - clickedRow;
    const diffColumn = Math.abs(columnDiff) === 1;
    const diffRow = Math.abs(rowDiff) === 1;
    const sameRowDiffColumn = sameRow && diffColumn;
    const sameColumnDiffRow = sameColumn && diffRow;
    if (sameRowDiffColumn || sameColumnDiffRow) {
        return true;
    } else {
        return false;
    }
};

const swapSpace = (arr, from, row, col, move) => {
    let yMove = move === 0 ? 1 : move === 2 ? -1 : 0;
    let xMove = move === 3 ? 1 : move === 1 ? -1 : 0;
    let newRow = row + yMove;
    let newCol = col + xMove;
    if (newRow <= -1 || newCol <= -1 || newRow >= 4 || newCol >= 4) {
        return [false, arr];
    }
    let to = newRow * 4 + newCol;
    return [true, swap(arr, from, to)];
};

const shuffle = array_elements => {
    let i = array_elements.length,
        randomNumIndex,
        randomNum;
    while (--i > 0) {
        randomNumIndex = Math.floor(Math.random() * (i + 1));
        randomNum = array_elements[randomNumIndex];
        array_elements[randomNumIndex] = array_elements[i];
        array_elements[i] = randomNum;
    }
    return array_elements;
};

const checkArray = arr => {
    let decision = true;
    arr.forEach((i, index) => {
        if (i !== index + 1 && i != 0) {
            decision = false;
        }
    });
    return decision;
};

const gridContainer = document.getElementById("grid-container");
let grid = [];
let state = gameState.GAME_IDLE; // Track the game state
let gridArray = Array.from({ length: 16 }, (_, index) => (index === 15 ? 0 : index + 1)); // Initial grid state
let initialGridState = [];  // This will store the initial state of the grid

// Separate shuffle logic to a new function
function shuffleGrid() {
    let i = gridArray.length,
        randomNumIndex,
        randomNum;
    while (--i > 0) {
        randomNumIndex = Math.floor(Math.random() * (i + 1));
        randomNum = gridArray[randomNumIndex];
        gridArray[randomNumIndex] = gridArray[i];
        gridArray[i] = randomNum;
    }
}

// Update the initialization to use the shuffle function
function initGrid() {
    // Reset the initial state each time a new game starts
    shuffleGrid(); // Shuffle the grid
    initialGridState = [...gridArray];  // Save the initial state

    grid = [];
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            row.push(gridArray[i * 4 + j]);
        }
        grid.push(row);
    }
    renderGrid();  // Render the grid
}

// Render the grid with current values
function renderGrid() {
    gridContainer.innerHTML = ''; // Clear the grid

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            const currentValue = grid[i][j];

            // Check if the current tile is in the correct position
            if (currentValue === 0) {
                tile.classList.add("empty");
            } else {
                tile.textContent = currentValue;

                // Apply 'correct-position' class if tile is in the correct position
                const expectedValue = i * 4 + j + 1;
                if (currentValue === expectedValue) {
                    tile.classList.add("correct-position");
                }

                tile.addEventListener("click", () => handleTileClick(i, j));
            }

            gridContainer.appendChild(tile);
            tile.style.gridColumnStart = j + 1;
            tile.style.gridRowStart = i + 1;
        }
    }
}

// Handle tile click to swap with the empty space
function handleTileClick(row, col) {
    if (state === gameState.GAME_PAUSED || state === gameState.GAME_OVER) return; // Do nothing if paused or over

    const emptyPos = findEmptyTilePosition();
    const clickedPos = row * 4 + col;

    if (isNeighbour(clickedPos, emptyPos)) {
        gridArray = swap(gridArray, clickedPos, emptyPos);
        grid = updateGridFromArray(gridArray);
        renderGrid();
        if (checkArray(gridArray)) {
            alert("Congratulations! You solved the puzzle.");
            state = gameState.GAME_OVER;
        }
    }
}

// Find position of the empty space (0)
function findEmptyTilePosition() {
    return gridArray.indexOf(0); // Empty space is represented by 0
}

// Update the grid from the flat array after tile swap
function updateGridFromArray(arr) {
    let updatedGrid = [];
    for (let i = 0; i < 4; i++) {
        updatedGrid.push(arr.slice(i * 4, i * 4 + 4));
    }
    return updatedGrid;
}

// Move tile using keyboard input
function handleKeyPress(event) {
    if (state === gameState.GAME_PAUSED || state === gameState.GAME_OVER) return; // Prevent moves if paused or over

    const emptyPos = findEmptyTilePosition();
    let newPos;

    switch (event.key) {
        case "ArrowLeft":
        case "a":
            newPos = emptyPos + 1;
            break;
        case "ArrowRight":
        case "d":
            newPos = emptyPos - 1;
            break;
        case "ArrowUp":
        case "w":
            newPos = emptyPos + 4;
            break;
        case "ArrowDown":
        case "s":
            newPos = emptyPos - 4;
            break;
        default:
            return; // Exit if the key is not valid
    }

    // Ensure new position is within bounds
    if (newPos >= 0 && newPos < 16 && isNeighbour(emptyPos, newPos)) {
        gridArray = swap(gridArray, emptyPos, newPos);
        grid = updateGridFromArray(gridArray);
        renderGrid();
        if (checkArray(gridArray)) {
            state = gameState.GAME_OVER;
            alert("Congratulations! You solved the puzzle.");
        }
    }
}

// Initialize the grid and add keyboard event listener
initGrid();
document.addEventListener("keydown", handleKeyPress);

// Function to restart the game by resetting the grid to its initial state
function restartGame() {
    gridArray = [...initialGridState];  // Reset to the initial grid state
    grid = updateGridFromArray(gridArray);  // Update grid from the array
    renderGrid();  // Re-render the grid
    state = gameState.GAME_STARTED;  // Set the game state to 'GAME_STARTED'
}

// Add event listener for the restart button
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Handling the 'New Game' Popup
function confirmNewGame() {
    if (state === gameState.GAME_STARTED) {
        const confirmPopup = document.createElement('div');
        confirmPopup.classList.add('popup');
        confirmPopup.innerHTML = `
            <h3>Start a new game?</h3>
            <button id="yes">Yes</button>
            <button id="no">No</button>
        `;
        document.body.appendChild(confirmPopup);

        document.getElementById('yes').addEventListener('click', () => {
            initGrid();  // Initialize a new shuffled grid
            confirmPopup.remove();
            state = gameState.GAME_STARTED;
        });

        document.getElementById('no').addEventListener('click', () => {
            confirmPopup.remove();
        });
    }
}

// Handling the 'Back to Menu' Button
function backToMenu() {
    if (state === gameState.GAME_STARTED) {
        const confirmPopup = document.createElement('div');
        confirmPopup.classList.add('popup');
        confirmPopup.innerHTML = `
            <h3>Back to Menu?</h3>
            <button id="yes">Yes</button>
            <button id="no">No</button>
        `;
        document.body.appendChild(confirmPopup);

        document.getElementById('yes').addEventListener('click', () => {
            state = gameState.GAME_IDLE;
            confirmPopup.remove();
            // Additional actions for back to menu can be added here
        });

        document.getElementById('no').addEventListener('click', () => {
            confirmPopup.remove();
        });
    }
}

// Function to handle hint logic
function showHint() {
    if (state === gameState.GAME_PAUSED || state === gameState.GAME_OVER) return; // Do nothing if paused or over

    const emptyPos = findEmptyTilePosition();
    const adjacentTiles = getAdjacentTiles(emptyPos);
    let hintTile = null;

    // Find the first tile that is adjacent and not in the correct position
    for (let i = 0; i < adjacentTiles.length; i++) {
        const tilePos = adjacentTiles[i];
        const tileValue = gridArray[tilePos];
        const expectedValue = tilePos + 1;

        // Skip tiles already in the correct position
        if (tileValue !== expectedValue && tileValue !== 0) {
            hintTile = tilePos;
            break;
        }
    }

    if (hintTile !== null) {
        highlightTile(hintTile);  // Highlight the tile
        blinkTile(hintTile);  // Make it blink for 3 seconds
    }
}

// Get the adjacent tiles of the empty tile
function getAdjacentTiles(emptyPos) {
    const row = Math.floor(emptyPos / 4);
    const col = emptyPos % 4;
    const adjacentTiles = [];

    // Check the four directions (up, down, left, right)
    if (row > 0) adjacentTiles.push(emptyPos - 4); // Up
    if (row < 3) adjacentTiles.push(emptyPos + 4); // Down
    if (col > 0) adjacentTiles.push(emptyPos - 1); // Left
    if (col < 3) adjacentTiles.push(emptyPos + 1); // Right

    return adjacentTiles;
}

// Function to highlight the hinted tile
function highlightTile(tilePos) {
    const row = Math.floor(tilePos / 4);
    const col = tilePos % 4;
    const tile = gridContainer.children[row * 4 + col];

    tile.classList.add('hint'); // Add a CSS class for highlighting
}

// Function to make the hinted tile blink
function blinkTile(tilePos) {
    const row = Math.floor(tilePos / 4);
    const col = tilePos % 4;
    const tile = gridContainer.children[row * 4 + col];

    // Save the original background color
    const originalColor = tile.style.backgroundColor;
    
    // Start the blinking effect
    tile.style.backgroundColor = '#F4EA64';

    const stopBlinking = () => {
        tile.style.backgroundColor = originalColor;
        tile.classList.remove('hint');
        clearTimeout(blinkTimeout);
    };

    const blinkTimeout = setTimeout(stopBlinking, 3000); // Stop blinking after 3 seconds

    tile.addEventListener('click', stopBlinking, { once: true }); // Stop blinking if the tile is clicked
}

// Add a button to trigger the hint
document.getElementById('hint-btn').addEventListener('click', showHint);