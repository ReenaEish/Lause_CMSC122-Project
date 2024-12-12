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
    // Shuffle the grid array at the beginning
    shuffleGrid(); // Call the new shuffle function
    grid = [];
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            row.push(gridArray[i * 4 + j]);
        }
        grid.push(row);
    }
    renderGrid();
}


// Render the grid with current values
function renderGrid() {
    gridContainer.innerHTML = ''; // Clear the grid

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            const currentValue = grid[i][j];

            if (currentValue === 0) {
                tile.classList.add("empty");
            } else {
                tile.textContent = currentValue;
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
            alert("Congratulations! You solved the puzzle.");
            state = gameState.GAME_OVER;
        }
    }
}

// Initialize the grid and add keyboard event listener
initGrid();
document.addEventListener("keydown", handleKeyPress);
