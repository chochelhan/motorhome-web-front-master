let parser = require('ua-parser-js')

export default (context, inject) => {
  if (process.browser) {
    let userAgent =  parser(navigator.userAgent)
    userAgent.device.version = ''

    if (userAgent.device.model === 'iPhone') {
      let iHeight = window.screen.height
      let iWidth = window.screen.width
      
      if (iWidth === 414 && iHeight === 896) {
        userAgent.device.version = 'Xmax-Xr'
      }
      else if (iWidth === 390 && iHeight === 844) {
        userAgent.device.version = '12'
      }
      else if (iWidth === 428 && iHeight === 926) {
        // 12max
        userAgent.device.version = '12'
      }
      else if (iWidth === 375 && iHeight === 812) {
        userAgent.device.version = 'X-Xs'
      }
      else if (iWidth === 320 && iHeight === 480) {
        userAgent.device.version = '4'
      }
      else if (iWidth === 375 && iHeight === 667) {
        userAgent.device.version = '6'
      }
      else if (iWidth === 414 && iHeight === 736) {
        userAgent.device.version = '6plus'
      }
      else if (iWidth === 320 && iHeight === 568) {
        userAgent.device.version = '5'
      }
      else if (iHeight <= 480) {
        userAgent.device.version = '2-3'
      }
    } else {
      if (!userAgent.device.model) {
        userAgent.device.model = ''
      }
    }
    inject('userAgent', userAgent)

    let matches = userAgent.ua.match(/!!(.+)!!/)
    if (matches && matches.length > 0) {
      let device = matches[1].split(':')
      inject('device', {
        os: device[0] === 'I' ? 'IOS' : 'ANDROID',
        packageName: device[1],
        version: device[2],
        build: device[3]
      })
    } else {
      inject('device', null)
    }
  }
}