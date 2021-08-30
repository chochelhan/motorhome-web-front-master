<template>
  <div class="push-setting">
    <ul class="uk-nav-default uk-nav-parent-icon push-list" uk-nav="multiple: true">
      <li>
        <div class="push-setting-menu">
          <div>캠핑 소식 알림</div>
          <ui-switch v-model="pushAdvertisement" v-on:click.native="update"></ui-switch>
        </div>
      </li>
      <li>
        <div class="push-setting-menu">
          <div>관심 받으면 알림</div>
          <ui-switch v-model="pushComment" v-on:click.native="update" color="skyblue"></ui-switch>
        </div>
      </li>
      <li>
        <a class="push-setting-menu">
          <div>댓글 받으면 알림</div>
          <ui-switch v-model="pushInterest" v-on:click.native="update" color="green"></ui-switch>
        </a>
      </li>
    </ul>
    <ul class="uk-nav-default uk-nav-parent-icon kakao-plus" uk-nav="multiple: true">
      <li>
        <a href="https://pf.kakao.com/_PVzYK" target="_blank" class="push-setting-menu">
          <div><strong>PIWI</strong> 카카오톡 플러스친구 추가하기</div>
          <div uk-icon="icon: chevron-right; ratio: 1.2;"></div>
        </a>
      </li>
      <li class="kakao-plus-description">
        당신만을 위한 파라다이스 이야기를 들려드릴게요.<br/>
        Paradise is where i am
      </li>
    </ul>
  </div>
</template>

<script>
import UiSwitch from './UiSwitch'
export default {
  name: 'PushSetting',
  components: {
    UiSwitch
  },
  data () {
    return {
      pushAdvertisement: this.$store.state.session.user.pushAdvertisement,
      pushInterest: this.$store.state.session.user.pushInterest,
      pushComment: this.$store.state.session.user.pushComment
    }
  },
  methods: {
    update () {
      this.$api.put(`/members/${this.$store.state.session.user.memberNo}/push`, {
        pushAdvertisement: this.pushAdvertisement,
        pushComment: this.pushComment,
        pushInterest: this.pushInterest
      })
    }
  },
  created () {
    this.$api.get(`/members/${this.$store.state.session.user.memberNo}`).then(response => {
      this.pushAdvertisement = response.data.pushAdvertisement
      this.pushComment = response.data.pushComment
      this.pushInterest = response.data.pushInterest
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.push-setting {
  .push-list {
    list-style: none;
    margin-top: 20px;
    padding: 0 50px;
    .push-setting-menu {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      padding: 20px 0;
    }
  }
  .kakao-plus {
    list-style: none;
    margin-top: 40px;
    padding: 0 50px;
    .push-setting-menu {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      padding: 20px 0;
      strong {
        color: $global-primary-color;
      }
    }
    .kakao-plus-description {
      color: #818aa7;
      font-size: 0.7rem;
    }
  }
}
</style>
