import { shuffleTiles, isSolvable } from './utils.js';

const gridContainer = document.getElementById('grid-container');
let tiles = [];
let emptyIndex;

// Initialize the Grid
export function initializeGrid() {
    tiles = shuffleTiles([...Array(15).keys(), null]); // Create shuffled tiles
    emptyIndex = tiles.indexOf(null);
    renderGrid();
}

// Render the Puzzle Grid
function renderGrid() {
    gridContainer.innerHTML = ''; // Clear previous grid

    tiles.forEach((tile, index) => {
        const tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');
        if (tile === null) {
            tileDiv.classList.add('empty');
        } else {
            tileDiv.textContent = tile + 1;
            tileDiv.addEventListener('click', () => moveTile(index));
        }
        gridContainer.appendChild(tileDiv);
    });
}

// Move a Tile
function moveTile(index) {
    const validMoves = [emptyIndex - 4, emptyIndex + 4, emptyIndex - 1, emptyIndex + 1];
    if (validMoves.includes(index)) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        emptyIndex = index;
        renderGrid();
        checkWinCondition();
    }
}

// Check Winning Condition
function checkWinCondition() {
    if (tiles.slice(0, -1).every((tile, i) => tile === i)) {
        document.getElementById('status-message').classList.remove('hidden');
    }
}
