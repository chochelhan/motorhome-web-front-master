import axios from 'axios'
import jwt from 'jsonwebtoken'

const REFRESH_PERIOD = 86400

export default (context, inject) => {
  let interval = setInterval(() => {
    if (!context.store.state.session.device || !context.store.state.session.device.os) {
      context.$command.execute('settings.device').then(device => {
        context.$session.refreshToken(device)
        context.store.commit('session/setDevice', device)
        clearInterval(interval)
      }).catch(error => {
        console.error(error)
      })
    }
  }, 100)

  inject('session', {
    isSigned () {
      return context.$cookie.has('access_token')
    },
    getUserProfile () {
      let accessToken = context.$cookie.get('access_token')
      if (accessToken) {
        let decoded = jwt.decode(accessToken)
        return JSON.parse(decoded.target)
      } else {
        return null
      }
    },
    signin (accessToken) {
      let decoded = jwt.decode(accessToken)
      let member = JSON.parse(decoded.target)
      return context.$api.get(`/members/${member.memberNo}`, {
        headers: {
          Authorization: accessToken
        }
      }).then(response => {
        if (response.data) {
          context.store.commit('session/signin', response.data)
          context.$cookie.set('access_token', accessToken, {
            expires: new Date('2035-12-31T23:59:59')
          })
        } else {
          this.signout()
        }
      }).catch(error => {
        this.signout()
      })
    },
    signout () {
      return axios.get(`/auth/signout`).then(() => {
        location.reload()
      })
    },
    refreshToken (device) {
      let now = Math.round((new Date()).getTime() / 1000)
      let loginAt = context.$cookie.get('login_at')
      if (loginAt) {
        loginAt = parseInt(loginAt)
      } else {
        loginAt = now
        context.$cookie.set('login_at', now, {
          expires: new Date('2035-12-31T23:59:59')
        })
      }
      if (loginAt && (loginAt + REFRESH_PERIOD) < now) {
        context.$api.post(`/auth/token/refresh`, {
          deviceInfo: device
        }).then(response => {
          if (response.data) {
            this.signin(response.data.accessToken)
          } else {
            this.signout()
          }
        }).catch(error => {
          this.signout()
        })
      }
    }
  })

  let accessToken = context.$cookie.get('access_token')
  if (accessToken) {
    context.$session.signin(accessToken)
  }
}