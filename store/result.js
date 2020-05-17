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
    hooverInstructions: [],
    dimensions: [],
    dirtPatchSet: new Set(),
    currentHooverPos: [],
    hooverPositions: [],
    drivingInstructions: [],
    cleanedPatchSet: new Set(),
    visualize: false
  }
}

export const state = getDefaultState()
export const getters = {
}
export const mutations = {
  /*
  Purpose: Mutation to modify result state variables from an array of instructions. These instructions were parsed from a text file on the web app.
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
  setVisualizeBoolean (state, visBool) {
    state.visualize = visBool === 'true'
  },
  runInstructions (state) {
    for (let i = 0; i < state.drivingInstructions.length; i++) {
      const newCoords = updateCoords(state.drivingInstructions[i], state.currentHooverPos)
      if (withinBounds(newCoords, state.dimensions)) {
        state.currentHooverPos = newCoords
        state.hooverPositions.push(newCoords)
        if (state.dirtPatchSet.has(newCoords.toString())) {
          state.cleanedPatchSet.add(newCoords.toString())
          state.dirtPatchSet.delete(newCoords.toString())
        }
      }
    }
  },
  resetResultState (state) {
    Object.assign(state, getDefaultState())
  }
}
export const actions = {
  setInstructions (context, instructions) {
    context.commit('setInstructions', instructions)
  },
  runInstructions (context) {
    context.commit('runInstructions')
  },
  setVisualizeBoolean (context, visBool) {
    context.commit('setVisualizationBoolean', visBool)
  },
  resetResultState ({ commit }) {
    commit('resetResultState')
  }
}
