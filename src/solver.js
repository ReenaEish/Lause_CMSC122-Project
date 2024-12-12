// Solver Logic for the NumSlider Puzzle Game

// A* Algorithm based solver
function solvePuzzle() {
    // Create a solver instance
    const solver = new PuzzleSolver(gridArray);
    const solution = solver.solve();

    if (solution.length > 0) {
        // Step through each move in the solution
        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < solution.length) {
                // Swap tiles based on the solution step
                const [from, to] = solution[stepIndex];
                gridArray = swap(gridArray, from, to);
                grid = updateGridFromArray(gridArray);
                renderGrid();
                stepIndex++;
            } else {
                // Stop the interval when the puzzle is solved
                clearInterval(interval);
                gridContainer.style.pointerEvents = 'auto'; // Re-enable grid interactions
                showPuzzleSolvedModal();
            }
        }, 500); // Step every 500ms
    }
}

// PuzzleSolver class that implements A* algorithm
class PuzzleSolver {
    constructor(initialState) {
        this.initialState = initialState;
        this.goalState = this.generateGoalState();
        this.emptyTile = 0;
        this.moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Right, Left, Down, Up
    }

    // Solve the puzzle
    solve() {
        const openList = [];
        const closedList = [];
        const startNode = new PuzzleNode(this.initialState, null, 0, this.getManhattanDistance(this.initialState));
        openList.push(startNode);

        while (openList.length > 0) {
            // Sort by f value (g + h)
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift();
            closedList.push(currentNode);

            // Check if we reached the goal state
            if (this.isGoalState(currentNode.state)) {
                return this.reconstructPath(currentNode);
            }

            // Generate neighbors (possible moves)
            const neighbors = this.generateNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (closedList.some(node => this.areStatesEqual(node.state, neighbor.state))) {
                    continue; // Ignore already visited states
                }

                const g = currentNode.g + 1;
                const h = this.getManhattanDistance(neighbor.state);
                const f = g + h;

                const openNode = openList.find(node => this.areStatesEqual(node.state, neighbor.state));
                if (!openNode || f < openNode.f) {
                    openList.push(new PuzzleNode(neighbor.state, currentNode, g, f));
                }
            }
        }
        return []; // Return an empty array if no solution found
    }

    // Generate the goal state (solved state)
    generateGoalState() {
        const goalState = Array.from({ length: 16 }, (_, i) => i);
        goalState[15] = 0; // Empty space is represented by 0
        return goalState;
    }

    // Manhattan distance heuristic
    getManhattanDistance(state) {
        let distance = 0;
        for (let i = 0; i < state.length; i++) {
            const tile = state[i];
            if (tile !== 0) {
                const targetIndex = this.goalState.indexOf(tile);
                const targetRow = Math.floor(targetIndex / 4);
                const targetCol = targetIndex % 4;
                const currentRow = Math.floor(i / 4);
                const currentCol = i % 4;
                distance += Math.abs(targetRow - currentRow) + Math.abs(targetCol - currentCol);
            }
        }
        return distance;
    }

    // Check if a state is the goal state
    isGoalState(state) {
        return this.areStatesEqual(state, this.goalState);
    }

    // Compare two states
    areStatesEqual(state1, state2) {
        return state1.every((value, index) => value === state2[index]);
    }

    // Generate possible moves (neighbors)
    generateNeighbors(node) {
        const neighbors = [];
        const emptyPos = node.state.indexOf(this.emptyTile);

        for (const [dx, dy] of this.moves) {
            const newEmptyPos = emptyPos + dx + dy * 4;

            if (newEmptyPos >= 0 && newEmptyPos < 16 && Math.abs(emptyPos % 4 - newEmptyPos % 4) <= 1) {
                const newState = [...node.state];
                newState[emptyPos] = newState[newEmptyPos];
                newState[newEmptyPos] = this.emptyTile;
                neighbors.push({ state: newState });
            }
        }

        return neighbors;
    }

    // Reconstruct the solution path (from start to goal)
    reconstructPath(node) {
        const path = [];
        while (node.parent) {
            const move = this.findMove(node.parent.state, node.state);
            path.unshift(move);
            node = node.parent;
        }
        return path;
    }

    // Find the move that transitions one state to another
    findMove(prevState, currentState) {
        const prevEmptyPos = prevState.indexOf(this.emptyTile);
        const currentEmptyPos = currentState.indexOf(this.emptyTile);
        return [prevEmptyPos, currentEmptyPos];
    }
}

// PuzzleNode class representing a node in the search tree
class PuzzleNode {
    constructor(state, parent, g, f) {
        this.state = state; // The state of the puzzle
        this.parent = parent; // Parent node
        this.g = g; // Cost from start to this node
        this.f = f; // Estimated total cost (g + h)
    }
}
