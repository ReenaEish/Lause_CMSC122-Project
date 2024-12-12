// Function to initialize a new shuffled puzzle grid
export function initializeNewGrid(container) {
    // Clear any existing grid content
    container.innerHTML = '';

    // Create a 4x4 grid of shuffled numbers
    const gridSize = 4;
    const numbers = [...Array(gridSize * gridSize).keys()].slice(1); // Numbers 1 to 15
    numbers.push(null); // Represent the empty space with null
    shuffleNewArray(numbers); // Shuffle the numbers

    numbers.forEach((num) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (num !== null) {
            tile.textContent = num; // Add the number to the tile
        } else {
            tile.classList.add('empty'); // Mark the empty tile
        }
        container.appendChild(tile);
    });
}

// Function to shuffle an array (Fisher-Yates Algorithm)
function shuffleNewArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
