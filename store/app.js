export const state = () => ({
  iosKeyboardShow: false,
  iosKeyboardHeight: null,
  location: {
    latitude: null,
    longitude: null
  },
  loading: false
})

export const mutations = {
  setIosKeyboardShow (state, show) {
    state.iosKeyboardShow = show
  },
  setIosKeyboardHeight (state, height) {
    state.iosKeyboardHeight = height
  },
  setLocation (state, position) {
    state.location.latitude = position.latitude
    state.location.longitude = position.longitude
  },
  activeLoading (state) {
    state.loading = true
  },
  deactiveLoading (state) {
    state.loading = false
  }
}
