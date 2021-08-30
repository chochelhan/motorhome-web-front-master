import Cookies from 'js-cookie'

export default (context, inject) => {
  inject('cookie', Cookies)
}