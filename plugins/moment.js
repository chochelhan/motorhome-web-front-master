import moment from 'moment'

export default (context, inject) => {
  moment.locale('ko')
  inject('moment', moment)
}