// Shuffle Tiles
export function shuffleTiles(arr) {
    do {
        arr.sort(() => Math.random() - 0.5); // Randomize the array
    } while (!isSolvable(arr));
    return arr;
}

// Check if the Puzzle is Solvable
export function isSolvable(arr) {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] !== null && arr[j] !== null && arr[i] > arr[j]) {
                inversions++;
            }
        }
    }
    return inversions % 2 === 0;
}
