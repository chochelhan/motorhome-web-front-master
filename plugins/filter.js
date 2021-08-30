import Vue from 'vue'

export default (context) => {
  Vue.filter('numberFormat', value => {
    let intVal = parseInt(value)
    if (isNaN(intVal)) {
      return 0
    } else {
      return new Intl.NumberFormat().format(intVal)
    }
  })
  Vue.filter('formatDate', (value, format) => {
    let date = context.$moment(value)
    if (format) {
      return date.format(format)
    } else {
      if (date.diff() / 1000 < -86400) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return date.fromNow()
      }
    }
  })
  Vue.filter('formatDistance', value => {
    return `${Math.round(value * 10) / 10}km`
  })
}