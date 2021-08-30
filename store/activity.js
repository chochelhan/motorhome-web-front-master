export const state = () => ({
  list: []
})

export const mutations = {
  start (state, activity) {
    state.list.push(activity)
  },
  finish (state, activity) {
    let index = state.list.findIndex((_activity, _key) => {
      return _key === activity.$vnode.key
    })
    if (index > -1) {
      state.list.splice(index, 1)
    }
  },
  clear (state) {
    state.list.splice(0)
  },
  closeTopActivity (state) {
    state.list.pop()
  }
}
