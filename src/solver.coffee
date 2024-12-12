# Solver Logic for the NumSlider Puzzle Game (CoffeeScript version)

class PuzzleSolver
  constructor: (initialState) ->
    @initialState = initialState
    @goalState = @generateGoalState()
    @emptyTile = 0
    @moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]  # Right, Left, Down, Up

  # Solve the puzzle using A* algorithm
  solve: ->
    openList = []
    closedList = []
    startNode = new PuzzleNode(@initialState, null, 0, @getManhattanDistance(@initialState))
    openList.push(startNode)

    while openList.length > 0
      openList.sort (a, b) -> a.f - b.f
      currentNode = openList.shift()
      closedList.push(currentNode)

      # Check if goal state is reached
      if @isGoalState(currentNode.state)
        return @reconstructPath(currentNode)

      # Generate neighbors (possible moves)
      neighbors = @generateNeighbors(currentNode)
      for neighbor in neighbors
        if closedList.some (node) => @areStatesEqual(node.state, neighbor.state)
          continue

        g = currentNode.g + 1
        h = @getManhattanDistance(neighbor.state)
        f = g + h

        openNode = openList.find (node) => @areStatesEqual(node.state, neighbor.state)
        if not openNode or f < openNode.f
          openList.push new PuzzleNode(neighbor.state, currentNode, g, f)

    return []  # No solution found

  # Generate the goal state (solved state)
  generateGoalState: ->
    goalState = (i for i in [0..15])
    goalState[15] = 0  # Empty space represented by 0
    return goalState

  # Manhattan distance heuristic
  getManhattanDistance: (state) ->
    distance = 0
    for i, tile in state
      if tile != 0
        targetIndex = @goalState.indexOf(tile)
        targetRow = Math.floor(targetIndex / 4)
        targetCol = targetIndex % 4
        currentRow = Math.floor(i / 4)
        currentCol = i % 4
        distance += Math.abs(targetRow - currentRow) + Math.abs(targetCol - currentCol)
    return distance

  # Check if a state is the goal state
  isGoalState: (state) ->
    @areStatesEqual(state, @goalState)

  # Compare two states
  areStatesEqual: (state1, state2) ->
    state1.every (value, index) -> value == state2[index]

  # Generate possible moves (neighbors)
  generateNeighbors: (node) ->
    neighbors = []
    emptyPos = node.state.indexOf(@emptyTile)

    for [dx, dy] in @moves
      newEmptyPos = emptyPos + dx + dy * 4

      if newEmptyPos >= 0 and newEmptyPos < 16 and Math.abs(emptyPos % 4 - newEmptyPos % 4) <= 1
        newState = [...node.state]
        newState[emptyPos] = newState[newEmptyPos]
        newState[newEmptyPos] = @emptyTile
        neighbors.push(state: newState)

    return neighbors

  # Reconstruct the solution path (from start to goal)
  reconstructPath: (node) ->
    path = []
    while node.parent
      move = @findMove(node.parent.state, node.state)
      path.unshift(move)
      node = node.parent
    return path

  # Find the move that transitions one state to another
  findMove: (prevState, currentState) ->
    prevEmptyPos = prevState.indexOf(@emptyTile)
    currentEmptyPos = currentState.indexOf(@emptyTile)
    return [prevEmptyPos, currentEmptyPos]

# PuzzleNode class representing a node in the search tree
class PuzzleNode
  constructor: (state, parent, g, f) ->
    @state = state  # The state of the puzzle
    @parent = parent  # Parent node
    @g = g  # Cost from start to this node
    @f = f  # Estimated total cost (g + h)
