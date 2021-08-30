<template>
  <div class="setting">
    <ul class="uk-nav-default uk-nav-parent-icon" uk-nav="multiple: true">
      <li>
        <a v-on:click.prevent="pushSetting" href="#" class="setting-menu">
          <div>푸시알림 설정</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
      <!-- 앱 출시 시 하단 주석 제거 -->
      <!-- <li v-if="$store.state.session.device">
        <a v-bind:href="storeLink" target="_blank" class="setting-menu">
          <div style="display: flex; align-items: center;">
            <div>앱 업데이트</div>
            <div style="margin-left: 15px; font-size: 0.7rem; font-weight: normal;">
              <span>현재 버전 : {{$store.state.session.device.version}}</span>
              <span v-if="$store.state.session.device.os === 'ANDROID'">최신 버전 0.0.20</span>
              <span v-if="$store.state.session.device.os === 'IOS'">최신 버전 0.0.13</span>
            </div>
          </div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li> -->
      <li>
        <a v-on:click.prevent="signout" class="setting-menu">
          <div>로그아웃</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
      <li>
        <a v-on:click.prevent="showMemberOut" href="#" class="setting-menu">
          <div>회원탈퇴</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
    </ul>
    <ul class="uk-nav-default uk-nav-parent-icon" uk-nav="multiple: true" style="margin-top: 10px; background-color: #eceff8;">
      <li>
        <a v-on:click.prevent="showAboutUs" href="#" class="setting-menu">
          <div><span style="color: #16adb9;">PIWI</span> 소개</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
      <li>
        <a v-on:click.prevent="showNotice" href="#" class="setting-menu">
          <div>공지사항</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
      <li>
        <a v-on:click.prevent="showFaq" href="#" class="setting-menu">
          <div>도움말(FAQ)</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
      <li>
        <a v-on:click.prevent="showServiceAgreement" href="#" class="setting-menu">
          <div>서비스 이용약관</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
      <li>
        <a v-on:click.prevent="showPrivacyAgreement" href="#" class="setting-menu">
          <div>개인정보 취급방침</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
      <li>
        <a v-on:click.prevent="showLocationAgreement" href="#" class="setting-menu">
          <div>위치서비스 이용약관</div>
          <div uk-icon="icon: chevron-right;"></div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import PushSettingActivity from './activities/PushSettingActivity'
import MemberOutActivity from './activities/MemberOutActivity'
import ConfirmActivity from './activities/ConfirmActivity'
import FaqActivity from './activities/FaqActivity'
import NoticeActivity from './activities/NoticeActivity'
export default {
  name: 'Setting',
  computed: {
    storeLink () {
      if (this.$store.state.session.device.os === 'ANDROID') {
        return 'market://details?id=tv.theuniverse.piwi'
      } else {
        // https://apps.apple.com/kr/app/왓챠-watcha/id1096493180
        return 'itms-apps://itunes.apple.com/kr/app/apple-store/id1096493180'
      }
    }
  },
  methods: {
    pushSetting () {
      this.$activity.start(PushSettingActivity)
    },
    signout () {
      this.$swal.confirm('로그아웃 하시겠습니까?').then(() => {
        this.$session.signout()
      })
    },
    showMemberOut () {
      this.$activity.start(MemberOutActivity)
    },
    showFaq () {
      this.$activity.start(FaqActivity)
    },
    showNotice () {
      this.$activity.start(NoticeActivity)
    },
    showAboutUs () {
      this.showTerm('INTRODUCTION')
    },
    showServiceAgreement () {
      this.showTerm('SERVICE')
    },
    showPrivacyAgreement () {
      this.showTerm('DATA_HANDLING')
    },
    showLocationAgreement () {
      this.showTerm('LOCATION')
    },
    showTerm (type) {
      this.$api.get(`/terms`, {
        params: {
          termsTypes: type
        }
      }).then(response => {
        this.$activity.start(ConfirmActivity, {
          title: response.data[0].title,
          contents: response.data[0].contents
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.setting {
  height: 100%;
  ul {
    font-weight: bold;
    &:first-child {
      padding: 20px 0 10px;
    }
    li {
      padding: 5px 20px;
      .setting-menu {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        height: 45px;
        padding: 0 $layout-margin;
      }
    }
  }
}
</style>
