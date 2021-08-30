<template>
  <div>
    <main>
      <nuxt/>
      <copyright></copyright>
    </main>

    <activity-manager></activity-manager>

    <footer>
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
          uk-icon="icon: user; ratio: 1.5;"
          class="footer-menu-item uk-flex uk-flex-center uk-flex-middle uk-icon-link"
        ></nuxt-link>
      </div>
    </footer>
  </div>
</template>

<script>
import UIkit from 'uikit'
import ActivityManager from '../components/ActivityManager'
import Copyright from '../components/Copyright'

export default {
  name: 'DefaultLayout',
  components: {
    ActivityManager,
    Copyright
  },
  watch: {
    $route () {
      UIkit.offcanvas(this.$refs.menu).hide()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
main {
  height: calc(100vh - #{$footer-height});
  overflow-y: auto;
}
footer {
  position: fixed;
  bottom: 0;
  height: $footer-height;
  width: 100vw;
  background-color: #eceff8;
  box-shadow: 0 -2px 6px 0 #b3b7c4;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: 1000;
  display: flex;
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
        color: $global-primary-color !important;
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
</style>
