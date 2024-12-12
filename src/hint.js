// Global variables
let hintEnabled = false;
let hintTile = null;

// Function to handle hint request
function showHint() {
    if (hintEnabled || isPuzzleCompleted()) {
        return; // Prevent hint if already enabled or puzzle is completed
    }

    hintEnabled = true;
    let emptyTile = getEmptyTile(); // Get the empty tile position (you'll need to adjust this)
    hintTile = findHintTile(emptyTile); // Find the tile that can move into the empty space

    if (hintTile) {
        // Recolor the hinted tile to #F4EA64
        hintTile.style.backgroundColor = "#F4EA64";
        blinkHintTile(hintTile); // Start the blinking effect
    }
}

// Function to make the tile blink for 3 seconds
function blinkHintTile(tile) {
    let blinkCount = 0;
    let blinkInterval = setInterval(() => {
        if (blinkCount >= 6) {
            clearInterval(blinkInterval);
            tile.style.backgroundColor = ""; // Reset tile color once blinking ends
        } else {
            // Toggle tile background color for blinking effect
            tile.style.backgroundColor = tile.style.backgroundColor === "#F4EA64" ? "" : "#F4EA64";
            blinkCount++;
        }
    }, 500); // Blink every 500ms

    tile.addEventListener('click', function() {
        // Stop the blinking immediately if the tile is clicked
        clearInterval(blinkInterval);
        tile.style.backgroundColor = ""; // Reset the color
    });

    // Set a timeout for 3 seconds to stop blinking even if not clicked
    setTimeout(() => {
        clearInterval(blinkInterval);
        if (tile) tile.style.backgroundColor = ""; // Reset color if not clicked
    }, 3000);
}

// Function to find the tile that can move into the empty space
function findHintTile(emptyTile) {
    // Implement logic to find the tile that can move into the empty space
    for (let i = 0; i < tiles.length; i++) {
        if (canMove(tiles[i], emptyTile)) {
            return tiles[i];
        }
    }
    return null;
}

// Function to check if a tile can move into the empty space
function canMove(tile, emptyTile) {
    // Add logic to check if a tile can be moved to the empty space (e.g., adjacent tiles)
    return true; // Placeholder for actual logic
}

// Function to get the empty tile (you should replace this with your grid logic)
function getEmptyTile() {
    // Replace this with your actual method to find the empty tile in the grid
    return { x: 0, y: 0 }; // Placeholder
}

// Expose the showHint function for use in main.js
export { showHint };
