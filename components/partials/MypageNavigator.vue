<template>
  <div class="navigator">
    <safearea-top></safearea-top>
    <div class="navigator-container">
      <nuxt-link to="/mypage">내프로필</nuxt-link>
      <nuxt-link to="/mypage/record">나의기록</nuxt-link>
      <nuxt-link to="/mypage/scrape">스크랩북</nuxt-link>
      <nuxt-link to="/mypage/reward">내경험치</nuxt-link>
      <div class="nuxt-link">
        <button v-on:click="setting" uk-icon="icon: cog;" type="button"></button>
      </div>
    </div>
  </div>
</template>

<script>
import SettingActivity from '../../components/activities/SettingActivity'
export default {
  name: 'MypageNavigator',
  methods: {
    setting () {
      this.$activity.start(SettingActivity)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.navigator {
  background-color: #eceff8;
  .navigator-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $header-height;
    padding: 0 10px;
    font-size: 0.8rem;
  }
  a, .nuxt-link {
    position: relative;
    display: flex;
    height: 100%;
    padding: 0 10px;
    align-items: center;
    color: #747474 !important;
  }
  .nuxt-link-exact-active {
    color: #16adb9 !important;
    &::after {
      content: '';
      position: absolute;
      display: block;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: solid #16adb9 3px;
    }
  }
}
</style>
