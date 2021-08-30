const fs = require('fs')
const Qs = require('qs')

require('dotenv').config()

process.env.TZ = 'Asia/Seoul'

const proxyConfig = () => {
  if(process.env.NODE_ENV !== 'production') {
    return {
      '/test/': {target: 'http://localhost:8651', pathRewrite: {'^/test/': ''}},
    };
  } else { return; }
};

export default {
  dev: process.env.NODE_ENV !== 'production',
  modules: [
    '@nuxtjs/axios'
  ],
  proxy: proxyConfig(),
  axios: {
    proxy: process.env.NODE_ENV !== 'production'? true : false,
    baseURL: (process.env.NODE_ENV !== 'production') ? `http://localhost:60001` : `https://${process.env.APP_HOST}`
  },
  router: {
    middleware: ['auth']
  },
  plugins: [
    '~plugins/sentry',
    '~plugins/uikit',
    '~plugins/moment',
    '~plugins/filter',
    {
      src: '~plugins/cookie',
      mode: 'client'
    },
    {
      src: '~plugins/swal',
      mode: 'client'
    },
    '~plugins/app',
    '~plugins/api',
    {
      src: '~plugins/command',
      mode: 'client'
    },
    {
      src: '~plugins/session',
      mode: 'client'
    },
    {
      src: '~plugins/ua-parser',
      mode: 'client'
    },
    {
      src: '~plugins/clipboard',
      mode: 'client'
    },
    {
      src: '~plugins/activity'
    },
    '~plugins/safearea',
    {
      src: '~plugins/pinch-zoom',
      mode: 'client'
    },
    // {
    //   src: '~plugins/inobounce',
    //   mode: 'client'
    // },
    {
      src: '~plugins/textarea-autosize',
      mode: 'client'
    }
  ],
  css: [
    '~assets/scss/app.scss'
  ],
  head: {
    script: [
      {
        src: 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      },
      {
        src: 'https://developers.kakao.com/sdk/js/kakao.js',
      },
      {
        src: `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_SDK_JS_KEY}&libraries=clusterer,services`
      },
      {
        src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
      }
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto&display=swap'
      }
    ]
  },
  server: {
    port: 60001, // default: 3000
    host: '0.0.0.0', // default: localhost,
    // https: {
    //   key: fs.readFileSync('./privkey.pem'),
    //   cert: fs.readFileSync('./fullchain.pem')
    // }
  },
  serverMiddleware: [
    '~services/app.js'
  ]
}
