<template>
  <div></div>
</template>

<script>
import Qs from 'qs'
import striptags from 'striptags'
export default {
  name: 'Share',
  layout: 'public',
  head () {
    return {
      title: this.title,
      meta: [
        {
          property: 'og:title',
          content: this.title
        },
        {
          property: 'og:description',
          content: this.description
        },
        {
          property: 'og:image',
          content: this.image
        }
      ],
    }
  },
  async asyncData ({ app, query, req }) {
    try {
      let response = await app.$api.get(`https://api.pi-wi.com/articles/${query.articleNo}/summary`)
      return {
        title: response.data.title,
        description: striptags(response.data.contents),
        image: response.data.mainImageUrl || `https://${req.headers['x-forwarded-host']}/img/og-image.png`
      }
    } catch (error) {
      return {
        title: 'PIWI',
        description: 'Paradise is where I am 지금, 여기, 당신이 있는 곳 그곳이 바로 당신의 낙원이 되도록',
        image: `https://${req.headers['x-forwarded-host']}/img/og-image.png`
      }
    }
  },
  methods: {
    open () {
      let packageName = 'tv.theuniverse.piwi'
      let scheme = 'piwi'
      let host = 'piwi_main'
      let appstoreId = 'id365494029'
      let params = {
        path: this.$route.query.path,
        boardCode: this.$route.query.boardCode,
        articleNo: this.$route.query.articleNo
      }
      let query = Qs.stringify(params)
      let userAgent = navigator.userAgent.toLowerCase()
      let visiteTm = (new Date()).getTime()
      if (userAgent.match(/android/)) {
        // 앱이 있으면 앱 실행, 없으면 마켓 이동
        if (userAgent.match(/chrome/)) {
          location.href = `intent://${host}?${query}#Intent;scheme=${scheme};package=${packageName};end`
        } else {
          setTimeout(() => {
            if ((new Date()).getTime() - visitedAt < 2000) {
              location.href = `https://play.google.com/store/apps/details?id=${packageName}`
            }
          }, 500);
          var iframe = document.createElement('iframe')
          iframe.style.visivility = 'hidden'
          iframe.src = `${scheme}://${host}?${query}`
          document.body.appendChild(iframe)
          document.body.removeChild(iframe)
        }
      } else if (userAgent.match(/(iphone|ipad)/)) {
        //아이폰
        setTimeout(() => {
          if ((new Date()).getTime() - visiteTm < 3000) {
            // 앱스토어 이동
            // location.href = `https://itunes.apple.com/app/${appstoreId}`
          }
        }, 2500)
        setTimeout(() => {
          // 앱실행
          location.href = `${scheme}://${host}?${query}`
        }, 0)
      }
    }
  },
  mounted () {
    this.open()
  }
}
</script>