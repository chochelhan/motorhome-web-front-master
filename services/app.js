import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import Qs from 'qs'
import axios from 'axios'
import { getLinkPreview } from 'link-preview-js'
import jwt from 'jsonwebtoken'

var md5 = require('md5')
const fs = require('fs')
const express = require('express')
const app = express()
const signinExpires = new Date('2035-12-31T23:59:59')

app.use(cookieParser())
app.use(bodyParser.json())

console.log(process.env)
function getHost()
{
  //return 'localhost:60001'
    return process.env.APP_HOST

}

function protocol(request)
{

  let protocol = `${request.protocol}:`
  if (request.headers.referer) {
    let url = new URL(request.headers.referer)
    protocol = url.protocol
  }
  return protocol
}

app.get(`/signin`, (request, response) => {
  response.cookie('access_token', request.query.access_token)
  response.redirect('/')
})

app.get(`/signin/kakao`, (request, response) => {
  response.redirect(`https://kauth.kakao.com/oauth/authorize?${Qs.stringify({
    response_type: 'code',
    client_id: process.env.KAKAO_SDK_API_KEY,
    redirect_uri: `${protocol(request)}//${getHost()}/auth/kakao`
  })}`)
})

app.get(`/signin/apple`, (request, response) => {
  response.redirect(`https://appleid.apple.com/auth/authorize?${Qs.stringify({
    response_type: 'code',
    client_id: process.env.APPLE_AUTH_CLIENT_ID,
    redirect_uri: `${protocol(request)}//${getHost()}/auth/apple`
  })}`)
})

app.get(`/auth/kakao`, (request, response) => {
  let time = Math.round((new Date()).getTime() / 1000)
  if (request.query.error === 'access_denied') {
    response.send(`카카오 인증이 취소되었습니다.`)
  } else {
    axios.post(`https://kauth.kakao.com/oauth/token`, Qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_SDK_API_KEY,
      redirect_uri: `${protocol(request)}//${getHost()}/auth/kakao`,
      code: request.query.code
    })).then(_response => {

      /*
      console.log(`https://${process.env.API_HOST}/auth/token`, {
        code: _response.data.access_token,
        externalType: 'KAKAO',
        redirectUri: `${protocol(request)}//${getHost()}/auth/kakao`
      })

       */
      //let url = `http://localhost:8651/auth/token`
      let url = `https://${process.env.API_HOST}/auth/token`


      axios.get(url, {
        params: {
          code: _response.data.access_token,
          externalType: 'KAKAO',
          redirectUri: `${protocol(request)}//${getHost()}/auth/kakao`
        }
      }).then(__response => {
        response.cookie('external_token', _response.data.access_token, {
          expires: signinExpires
        })
        if (__response.data.isMember) {
          response.cookie('access_token', __response.data.accessToken, {
            expires: signinExpires
          })
          response.cookie('login_at', time)
          response.redirect('/')
        } else {
          response.cookie('external_type', 'KAKAO', {
            expires: signinExpires
          })
          response.cookie('encrypt_external_id', __response.data.encryptExternalId)
          response.redirect('/join')
        }
      }).catch(error => {
        console.log('----------start ------------')
        console.error(error)
        console.log('----------------------')

        return;

        if (process.server) {
          console.error(error)
        } else {
          this.$swal.alert('로그인에 실패했습니다.')
        }
        console.error(error)
        response.send(error.response.data)
      })
    }).catch(error => {
      console.error(error)
      response.send(error)
    })
  }
})

app.get(`/auth/apple`, (request, response) => {
  let time = Math.round((new Date()).getTime() / 1000)
  let token = jwt.sign({
    iss: process.env.APPLE_TEAM_ID,
    iat: time,
    exp: time + 86400 * 180,
    aud: 'https://appleid.apple.com',
    sub: process.env.APPLE_AUTH_CLIENT_ID
  }, fs.readFileSync('./key/AuthKey_38LR5M72QU.p8'), {
    algorithm: 'ES256',
    header: {
      kid: process.env.APPLE_AUTH_KEY_ID
    }
  })

  axios.post(`https://appleid.apple.com/auth/token`, Qs.stringify({
    client_id: process.env.APPLE_AUTH_CLIENT_ID,
    client_secret: token,
    code: request.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `${protocol(request)}//${getHost()}/auth/apple`
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(_response => {
    axios.get(`https://${process.env.API_HOST}/auth/token`, {
        params: {
          code: _response.data.id_token,
          externalType: 'APPLE',
          redirectUri: `${protocol(request)}//${getHost()}/auth/apple`
        }
      }).then(__response => {
        response.cookie('external_token', _response.data.id_token, {
          expires: signinExpires
        })
        if (__response.data.isMember) {
          response.cookie('access_token', __response.data.accessToken, {
            expires: signinExpires
          })
          response.cookie('login_at', time, {
            expires: signinExpires
          })
          response.redirect('/')
        } else {
          response.cookie('external_type', 'APPLE', {
            expires: signinExpires
          })
          response.cookie('encrypt_external_id', __response.data.encryptExternalId, {
            expires: signinExpires
          })
          response.redirect('/join')
        }
      }).catch(error => {
        console.error(error)
        response.send(error.response.data)
      })
  }).catch(error => {
    console.error(error)
    response.send(error)
  })
})

app.post(`/auth/signin`, (request, response) => {
  let time = Math.round((new Date()).getTime() / 1000)
  response.cookie('access_token', request.body.access_token)
  response.cookie('login_at', time, {
    expires: signinExpires
  })
  response.clearCookie('encrypt_external_id')
  response.clearCookie('external_token')
  response.send(true)
})

app.get(`/auth/signout`, (request, response) => {
  response.clearCookie('encrypt_external_id')
  response.clearCookie('external_token')
  response.clearCookie('external_type')
  response.clearCookie('access_token')
  response.clearCookie('login_at')
  response.send(true)
})

app.get(`/link-preview`, async (request, response) => {
  getLinkPreview(request.query.link).then(data => {
    let split = data.url.split('?')
    if (split.length > 1) {
      data.query = Qs.parse(split[1])
    } else {
      data.query = {}
    }
    if (data.images.length > 0) {
      let image = data.images[0]
      axios.get(image, {
        responseType: 'arraybuffer'
      }).then(_response => {
        let ext = 'jpg'
        if (_response.headers['content-type'] === 'image/png') {
          ext = 'png'
        }
        axios.put(`https://api-image.cloud.toast.com/image/v2.0/appkeys/3Gw71hWzHGZ2VdMG/images?path=/linkpreview/${md5(image)}.${ext}&overwrite=true`, _response.data, {
          headers: {
            Authorization: 'c38FosRy',
            'Content-Type': 'application/octet-stream'
          }
        }).then(__response => {
          data.images[0] = __response.data.file.url.replace(/^http:\/\//, 'https://') + '?72by72'
          response.send(data)
        }).catch(error => {
          console.error(error)
          response.send(data)
        })
      })
    } else {
      response.send(data)
    }
  })
})


app.get(`/coord2address`, (request, response) => {
  let kakao = axios.create({
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_SDK_API_KEY}`
    },
    baseURL: 'https://dapi.kakao.com',
    paramsSerializer: function (params) {
      return Qs.stringify(params)
    }
  })
  kakao.get(`/v2/local/geo/coord2address.json`, {
    params: {
      x: request.query.x,
      y: request.query.y
    }
  }).then(_response => {
    response.send(_response.data)
  }).catch(error => {
    console.error(error)
    response.send(null)
  })
})

app.get(`/address2coord`, (request, response) => {
  let kakao = axios.create({
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_SDK_API_KEY}`
    },
    baseURL: 'https://dapi.kakao.com',
    paramsSerializer: function (params) {
      return Qs.stringify(params)
    }
  })
  kakao.get(`/v2/local/search/address.json`, {
    params: {
      query: request.query.query
    }
  }).then(_response => {
    if (_response.data.documents.length > 0) {
      let document = _response.data.documents[0]
      response.send({
        x: parseFloat(document.address.x),
        y: parseFloat(document.address.y)
      })
    } else {
      response.send(null)
    }
  }).catch(error => {
    console.error(error)
    response.send(null)
  })
})

export default {
    path: '/',
    handler: app
}
