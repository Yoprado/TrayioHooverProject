/*
Purpose: Helper function to convert string coordinates into an array of two integer values.
Input: str parameter which is a single string of two integer values with a space between values.
Output: coords array which is a pair of two integer values
Assumptions: There is only one space between integer values and there are no leading or trailing spaces in str.
*/
function convertStringToCoordinates (str) {
  const coords = str.split(' ').map(str => parseInt(str))
  return coords
}
/*
Purpose: Helper function to update coordinates based on given cardinal direction.
Input: cardinal string that gives either N, W, E, or S. coord array that contains x and y direction
Output: new coord array after movement of cardinal direction.
Assumptions: Function does not check if the hoover skids in place. This is done in the withinBound helper function.
*/
function updateCoords (cardinal, coord) {
  const moves = {
    N: coord => [coord[0], coord[1] + 1],
    W: coord => [coord[0] - 1, coord[1]],
    E: coord => [coord[0] + 1, coord[1]],
    S: coord => [coord[0], coord[1] - 1]
  }
  if (typeof moves[cardinal] !== 'function') {
    throw new TypeError('Invalid Move.')
  }
  return moves[cardinal](coord)
}
/*
Purpose: Helper function to check if coordinates are within bounds of the dimensions of the room
Input: coord array that contains x and y direction of hoover movement. dim array that contains the x and y coordinates of the max size of the room
Output: boolean that will be true if coordinates are within the bounds of the dim coordinates.
Assumptions: None.
*/
function withinBounds (coord, dim) {
  let boundBool = true
  if (coord[0] < 0 || coord[1] < 0) {
    boundBool = false
  }
  if (coord[0] >= dim[0] || coord[1] >= dim[1]) {
    boundBool = false
  }
  return boundBool
}
const getDefaultState = () => {
  return {
    // Holds text file instructions in an array
    hooverInstructions: [],
    // Holds the dimensions of the room
    dimensions: [],
    // Holds a set of dirt patches within the room. Need to be converted to strings since arrays are objects and can't be compared.
    dirtPatchSet: new Set(),
    // Holds the current Hoover x and y coordinates
    currentHooverPos: [],
    // Holds an array of all x and y coordinates of Hoover positions that it has made
    hooverPositions: [],
    // Holds array of cardinal direction strings that list driving instructions of the Hoover
    drivingInstructions: [],
    // Holds a set of cleaned dirt patches within the room. Need to be converted to strings since arrays are objects and can't be compared.
    cleanedPatchSet: new Set(),
    // Holds boolean of if page started from index page. This is so we don't go directly to results page without loading data.
    fileLoadedFromMain: false
  }
}

export const state = getDefaultState()
export const getters = {
}
export const mutations = {
  /*
  Purpose: Mutation function to modify result state variables from an array of instructions. These instructions were parsed from a text file on the web app.
  Input: instructions array which is parsed instructions from the text file from the web app.
  Output: None. This modifies state variables from the instructions array.
  Assumptions: As instructions note, room dimensions, starting hoover position, and driving instructions are required. Dirt patch coordinates are optional.
  */
  setInstructions (state, instructions) {
    if (instructions.length === 0) {
      throw new Error('No Instructions Present')
    } else if (instructions.length === 3) {
      state.hooverInstructions = instructions
      state.dimensions = convertStringToCoordinates(instructions[0])
      state.hooverPositions.push(convertStringToCoordinates(instructions[1]))
      state.currentHooverPos = convertStringToCoordinates(instructions[1])
      state.drivingInstructions = instructions[2].split('')
    } else {
      state.hooverInstructions = instructions
      state.dimensions = convertStringToCoordinates(instructions[0])
      state.currentHooverPos = convertStringToCoordinates(instructions[1])
      state.hooverPositions.push(convertStringToCoordinates(instructions[1]))
      for (let i = 2; i < instructions.length - 1; i++) {
        state.dirtPatchSet.add(convertStringToCoordinates(instructions[i]).toString())
      }
      state.drivingInstructions = instructions[instructions.length - 1].split('')
    }
  },
  /*
  Purpose: Mutation function to run hoover through room by the driving instructions given by the text file.
  Input: None beyond current state. State holds current values of roomba placement, dirt placement, driving instructions, etc.
  Output: None. This modifies state variables from the drivingInstructions array.
  Assumptions: If drivingInstructions were to place hoover out of bounds, it skids in place until another direction is noted to keep it in bounds.
  */
  runInstructions (state) {
    for (let i = 0; i < state.drivingInstructions.length; i++) {
      const newCoords = updateCoords(state.drivingInstructions[i], state.currentHooverPos)
      if (withinBounds(newCoords, state.dimensions)) {
        state.currentHooverPos = newCoords
        state.hooverPositions.push(newCoords)
        if (state.dirtPatchSet.size !== 0) {
          if (state.dirtPatchSet.has(newCoords.toString())) {
            state.cleanedPatchSet.add(newCoords.toString())
            state.dirtPatchSet.delete(newCoords.toString())
          }
        }
      } else {
        state.hooverPositions.push(state.currentHooverPos)
      }
    }
  },
  /*
  Purpose: Mutation function to reset state if we go back to the main page. This is so multiple files don't get loaded on top of on another.
  Input: None beyond current state. State holds current values of roomba placement, dirt placement, driving instructions, etc.
  Output: None. This resets state to original values.
  Assumptions: None.
  */
  resetResultState (state) {
    Object.assign(state, getDefaultState())
  },
  /*
  Purpose: Mutation function modify booelean noting that we have uploaded a file from index page before proceeding to results page.
  Input: None beyond current state. State holds current values of roomba placement, dirt placement, driving instructions, etc.
  Output: None. This boolean change helps redirect to main page from results page if there is no data loade
  Assumptions: None.
  */
  changeFileLoaded (state) {
    state.fileLoadedFromMain = true
  }
}
export const actions = {
  setInstructions (context, instructions) {
    context.commit('setInstructions', instructions)
  },
  runInstructions (context) {
    context.commit('runInstructions')
  },
  resetResultState ({ commit }) {
    commit('resetResultState')
  },
  changeFileLoaded ({ commit }) {
    commit('changeFileLoaded')
  }
}
