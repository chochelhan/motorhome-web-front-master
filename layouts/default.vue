<template>
  <div v-bind:class="deviceClass" style="height: 100vh;">
    <main>
      <nuxt/>
      <safearea-bottom></safearea-bottom>
    </main>

    <greeting v-if="greeting" v-on:close="greeting = false"></greeting>

    <activity-manager></activity-manager>

    <footer class="uk-top-radius">
      <div class="footer-menu-container">
        <nuxt-link
          to="/main"
          uk-icon="icon: app-home; ratio: 1.5;"
          class="footer-menu-item uk-flex uk-flex-center uk-flex-middle uk-icon-link"
        ></nuxt-link>
      </div>
      <div class="footer-menu-container">
        <nuxt-link
          to="/search"
          uk-icon="icon: search; ratio: 1.5;"
          class="footer-menu-item uk-flex uk-flex-center uk-flex-middle uk-icon-link"
        ></nuxt-link>
      </div>
      <div class="footer-menu-container">
        <nuxt-link
          to="/location"
          uk-icon="icon: location; ratio: 1.5;"
          class="footer-menu-item uk-flex uk-flex-center uk-flex-middle uk-icon-link"
        ></nuxt-link>
      </div>
      <div class="footer-menu-container">
        <nuxt-link
          to="/notification"
          uk-icon="icon: bell; ratio: 1.5;"
          class="footer-menu-item uk-flex uk-flex-center uk-flex-middle uk-icon-link"
        ></nuxt-link>
      </div>
      <div class="footer-menu-container">
        <nuxt-link
          to="/mypage"
          class="footer-menu-item uk-flex uk-flex-center uk-flex-middle uk-icon-link"
        >
          <profile-image v-bind:src="$store.state.session.user && $store.state.session.user.profileImageUrl" size="38px" thumbnail="72by72"></profile-image>
        </nuxt-link>
      </div>
    </footer>
    <div v-bind:class="{active: $store.state.app.loading}" class="loader"></div>
  </div>
</template>

<script>
import UIkit from 'uikit'
import ActivityManager from '../components/ActivityManager'
import Copyright from '../components/Copyright'
import GoTop from '../components/GoTop'
import ProfileImage from '../components/ProfileImage'
import Greeting from '../components/Greeting'

export default {
  name: 'DefaultLayout',
  components: {
    ActivityManager,
    Copyright,
    GoTop,
    ProfileImage ,
    Greeting
  },
  data () {
    return {
      greeting: false,
      deviceClass: []
    }
  },
  watch: {
    $route () {
     UIkit.offcanvas(this.$refs.menu).hide()
    }
  },
  mounted () {
    if (process.browser) {
      if (location.search) {
        let query = this.$route.query
        if (query.boardCode && query.articleNo) {
          this.$activity.article(query.boardCode, query.articleNo)
        }
        if (query.landingType) {
          if (query.landingType !== 'HOME' && query.articleNo) {
            this.$activity.article(query.landingType, query.articleNo)
          }
        }
        if (query.pushNo) {
          this.$api.put(`/notifications/push-click`, {
            pushNo: parseInt(query.pushNo)
          })
        }
        // 푸시클릭 API중복호출 방지
        if (process.browser) {
          if (location.search) {
            history.replaceState(null, document.title, location.pathname + location.search)
          } else {
            history.replaceState(null, document.title, location.pathname)
          }
        }
      }
      if (this.$userAgent.device.model === 'iPhone') {
        this.deviceClass.push('device-iphone-' + this.$userAgent.device.version.toLowerCase())
      }

      if (this.$device) {
        if (this.$device.os === 'IOS') {
          this.deviceClass.push('device-iphone')
        }
        if (this.$device.os === 'ANDROID') {
          this.deviceClass.push('device-android')
        }
      }
      if (location.hash === '#greeting') {
        this.greeting = true
        location.hash = ''
      }
    }
  },
  created () {
    if (process.browser) {
      this.$location.getCurerntPosition().then(position => {
        this.$store.commit('app/setLocation', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
@import '../assets/scss/extension.scss';
main {
  display: flex;
  flex-direction: column;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  #go-top {
    position: fixed;
    bottom: calc(#{$footer-height} + 10px);
    right: 10px;
    border: solid $global-border 1px;
    border-radius: 3px;
    background-color: #ffffff;
    width: 45px;
    height: 45px;
    text-align: center;
    cursor: pointer;
    &:after {
      content: 'TOP';
      font-size: 0.7rem;
      display: block;
      margin-top: -3px;
      margin-bottom: 3px;
    }
  }
}
footer {
  position: fixed;
  bottom: 0;
  height: $footer-height;
  width: 100vw;
  background-color: #eceff8;
  box-shadow: 0 -2px 6px 0 #b3b7c4;
  z-index: 1000;
  display: flex;
  padding: 0 15px;
  * {
    user-select: none;
  }
  .footer-menu-container {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

    .footer-menu-item {
      position: relative;
      width: calc(100% - 20px);
      height: $footer-height;
      &.nuxt-link-active {
        @extend .neumorphism;
        color: #1c63f3 !important;
        &::before {
          top: unset;
          left: unset;
          right: unset;
          bottom: unset;
          width: 50px;
          height: 50px;
        }
        &::after {
          top: unset;
          left: unset;
          right: unset;
          bottom: unset;
          width: 50px;
          height: 50px;
        }
      }
      .profile-image {
        display: block;
      }
      // &.nuxt-link-active:before {
      //   content: '';
      //   display: block;
      //   position: absolute;
      //   top: 0;
      //   width: 100%;
      //   border-top: solid #000000 3px;
      // }
    }
  }
}
body.hide-footer footer {
  display: none;
}
.device-iphone {
  footer {
    height: $footer-height + $iphone-6-safe-bottom;
    padding-bottom: $iphone-6-safe-bottom;
  }
}
.device-iphone.device-iphone-x-xs {
  footer {
    height: $footer-height + $iphone-x-xs-safe-bottom;
    padding-bottom: $iphone-x-xs-safe-bottom;
  }
}
.device-iphone.device-iphone-xmax-xr {
  footer {
    height: $footer-height + $iphone-xmax-xr-safe-bottom;
    padding-bottom: $iphone-xmax-xr-safe-bottom;
  }
}
.device-iphone.device-iphone-12 {
  footer {
    height: $footer-height + $iphone-12-safe-bottom;
    padding-bottom: $iphone-12-safe-bottom;
  }
}
.loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2147483647;
  background-color: rgba(0, 0, 0, 0.21);
  display: none;
  &.active {
    display: block;
  }
}
</style>
