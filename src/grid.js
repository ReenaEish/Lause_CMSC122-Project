const gameState = {
    GAME_IDLE: '__game_idle__',
    GAME_STARTED: '__game_started__',
    GAME_OVER: '__game_over__',
    AUTO_SOLVING: "auto-solving"
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
function showPuzzleSolvedModal() {
    const solvedModal = document.getElementById("puzzle-solved-modal");
    solvedModal.classList.add("active");

    // Add event listener to the "Back to Menu" button
    const backToMenuButton = document.getElementById("puzzle-solved-btn");
    backToMenuButton.addEventListener("click", () => {
        // Navigate back to the menu or perform another action
        window.location.href = "menu.html"; // Example action
    });
}

// Replace alert with modal logic in handleTileClick
function handleTileClick(row, col) {
    if (state === gameState.GAME_OVER) return;
    if (state === gameState.AUTO_SOLVING) return;

    const emptyPos = findEmptyTilePosition();
    const clickedPos = row * 4 + col;

    if (isNeighbour(clickedPos, emptyPos)) {
        gridArray = swap(gridArray, clickedPos, emptyPos);
        grid = updateGridFromArray(gridArray);
        renderGrid();

        // Check if the puzzle is solved only after rendering the grid
        if (checkArray(gridArray)) {
            state = gameState.GAME_OVER; // Update game state to 'over'
        }
    }
}

// Refactored modal function for solving puzzle
function showPuzzleSolvedModal() {
    const solvedModal = document.getElementById("solved-popup-modal");
    solvedModal.classList.remove("hidden"); // Make the modal visible

    // Add event listener to the "Back to Menu" button
    const backToMenuButton = document.getElementById("solved-popup-ok-btn");
    backToMenuButton.addEventListener("click", () => {
        // Navigate back to the main menu or perform another action
        window.location.href = "menu.html"; // Example action to navigate to the menu
    });
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
    if (state === gameState.GAME_OVER) return; // Prevent moves if paused or over

    const emptyPos = findEmptyTilePosition();
    let newPos;

    switch (event.key) {
        case "ArrowLeft":
        case "a":
            newPos = emptyPos + 1; // adjacent tile from the left goes right
            break;
        case "ArrowRight":
        case "d":
            newPos = emptyPos - 1; // adjacent tile from the right goes left
            break;
        case "ArrowUp":
        case "w":
            newPos = emptyPos + 4; // adjacent tile from above goes down
            break;
        case "ArrowDown":
        case "s":
            newPos = emptyPos - 4; // adjacent tile from below goes up
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
            showPuzzleSolvedModal(); // Show modal after ensuring rendering is complete
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

// give up button - Auto Solver
document.getElementById('give-up-btn').addEventListener('click', () => {
    startAutoSolve();  // Call startAutoSolve when the button is clicked
});


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

// Function to handle hint logic using IDA* algorithm
function showHint() {
    if (state === gameState.GAME_PAUSED || state === gameState.GAME_OVER) return; // Do nothing if paused or over

    // Run the IDA* algorithm to get the next best move
    const bestMove = runIDAstar();

    if (bestMove !== null) {
        highlightTile(bestMove);  // Highlight the tile
        blinkTile(bestMove);  // Make it blink for 3 seconds
    }
}

// Function to run IDA* algorithm and return the next best move
function runIDAstar() {
    const startState = gridArray.slice(); // Copy the current grid state
    const solution = IDAstarSolver(startState); // Assuming you have an IDA* solver function implemented

    if (solution && solution.length > 0) {
        // Return the first move in the solution (the tile to hint)
        return solution[0].move; // Adjust this based on how your solution is structured
    }
    return null;  // Return null if no valid hint is found
}

// IDA* solver function (simplified, you should implement the actual logic)
function IDAstarSolver(startState) {
    // This is a simplified placeholder function
    // You should implement the IDA* algorithm here to solve the puzzle

    const goalState = getGoalState(); // Define the solved puzzle state
    let threshold = calculateInitialThreshold(startState, goalState); // Initialize the threshold for IDA*

    while (threshold !== Infinity) {
        const result = depthLimitedSearch(startState, goalState, 0, threshold);
        if (result.status === 'FOUND') {
            return result.solution; // Return the solution path
        } else if (result.status === 'CUT_OFF') {
            threshold = result.newThreshold; // Update threshold
        }
    }
    return null;  // No solution found
}

// Function to calculate the initial threshold (based on Manhattan distance or similar)
function calculateInitialThreshold(startState, goalState) {
    // Implement the logic to calculate the heuristic for the starting state
    return heuristic(startState, goalState);
}

// Placeholder for depth-limited search function (used in IDA*)
function depthLimitedSearch(state, goalState, depth, threshold) {
    // Implement the logic for depth-limited search with pruning based on threshold
    // Return an object with the status and solution path (if found)
    return { status: 'CUT_OFF', newThreshold: threshold + 1 };  // Simplified placeholder
}

// Function to get the solved puzzle state (goal state)
function getGoalState() {
    return Array.from({ length: 16 }, (_, index) => (index + 1) % 16);  // Example goal state: [1, 2, 3, ..., 0]
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

