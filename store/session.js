export const state = () => ({
  auth: false,
  user: null,
  device: null
})

export const mutations = {
  signin (state, user) {
    state.user = user
  },
  setDevice (state, device) {
    state.device = Object.assign({}, state.device, device)
  }
}
