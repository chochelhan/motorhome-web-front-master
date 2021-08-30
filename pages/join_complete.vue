<template>
  <div class="uk-flex uk-flex-column" style="height: 100vh;">
    <app-header>레저온 회원가입</app-header>
    <div class="uk-flex-1">
      <div>
        <p>환영합니다!</p>
        <p>함께 여행을 떠날 준비 되셨나요?</p>
        <p>지금 시작합니다</p>
      </div>
    </div>
    <div>
      <button v-on:click="goToService" type="button" class="uk-button uk-button-primary uk-width-1-1">서비스 시작하기</button>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader'

export default {
  layout: 'empty',
  components: {
    AppHeader
  },
  methods: {
    goToService () {
      location.href = '/'
    }
  }
}
</script>