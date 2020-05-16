export const state = () => ({
  hooverInstructions: []
})
export const getters = {
  getRandomFour: (state) => {
    // eslint-disable-next-line no-var
    var arr = []
    const photoarr = []
    while (arr.length < 4) {
      // eslint-disable-next-line no-var
      var r = Math.floor(Math.random() * state.photographyContent.length)
      if (!arr.includes(r)) {
        arr.push(r)
        photoarr.push(state.photographyContent[r])
      }
    }
    return photoarr
  }
}
export const mutations = () => ({})
export const actions = () => ({})
