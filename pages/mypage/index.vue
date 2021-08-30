<template>
  <div class="mypage">
    <mypage-navigator></mypage-navigator>
    <profile v-if="user.memberNo" v-bind:id="user.memberNo" class="mypage-profile main-contents"></profile>
  </div>
</template>

<script>
import MypageNavigator from '../../components/partials/MypageNavigator'
import Profile from '../../components/Profile'
export default {
  name: 'Mypage',
  components: {
    MypageNavigator,
    Profile
  },
  data () {
    return {
      user: {}
    }
  },
  mounted () {
    this.user = this.$session.getUserProfile()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.mypage {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  .mypage-profile {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
