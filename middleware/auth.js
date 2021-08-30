let cookie = require('cookie')
let Qs = require('qs')

export default function ({req, res, redirect}) {
  // console.log(req.cookies.access_token)
  if (process.server) {
    if (req.path !== '/share' && req.path !== '/privacy' && req.path !== '/support') {
      let cookies = cookie.parse(req.headers.cookie || '')

      // 로그인 상태
      if (cookies.access_token) {
        // 비로그인 페이지 접근시
        if (req.path === '/login' || req.path === '/join') {
          return redirect('/main')
        }
      }
      // 비 로그인 상태
      else {
        let querystring = Qs.stringify(req.query)
        let returnUrl = req.path
        if (querystring) {
          returnUrl += '?' + querystring
        }
        // SNS로그인도 안되어있는 상태
        if (!cookies.external_type || !cookies.external_token || !cookies.encrypt_external_id) {
          if (req.path !== '/login') {
            if (returnUrl) {
              return redirect(`/login?${Qs.stringify({return_url: returnUrl})}`)
            } else {
              return redirect('/login')
            }
          }
        }
        // SNS 로그인은 되어있는 상태
        else {
          if (req.path !== '/join') {
            if (returnUrl) {
              return redirect(`/join?${Qs.stringify({return_url: returnUrl})}`)
            } else {
              return redirect('/join')
            }
          }
        }
      }
    }
  }
}