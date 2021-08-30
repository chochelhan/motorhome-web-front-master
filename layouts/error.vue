<template>
  <div class="error">
    <div v-if="error.statusCode === 404">
      <div>
        <img src="../assets/img/404.svg">
      </div>
      <div style="font-weight: bold;">
        <div style="font-size: 1rem; color: #232323;">앗, 길을 잃어버렸어요</div>
        <div style="font-size: 0.85rem; color: #bfbfbf;">페이지가 없습니다. 뒤로 돌아가 볼까요?</div>
      </div>
      <div class="uk-flex uk-flex-center" style="margin-top: 10px; height: 65px;">
        <button v-on:click="back" type="button" class="uk-button uk-button-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle" style="padding: 0 10px; border-radius: 10px; line-height: initial;">
          <span uk-icon="icon: arrow-left; ratio: 1.5" style="margin-top: -5px;"></span>
          <div>이전페이지</div>
        </button>
        <nuxt-link to="/" class="uk-button uk-button-default uk-flex uk-flex-column uk-flex-center" style="margin-left: 10px; padding: 0 10px; border-radius: 10px; line-height: initial;">
          <span uk-icon="icon: home;"></span>
          <div style="margin-top: 5px;">홈으로 이동</div>
        </nuxt-link>
      </div>
    </div>
    <div v-else>
      <div>
        <img src="../assets/img/error.svg">
      </div>
      <div style="font-size: 0.9rem; font-weight: bold;">
        <div>일시적으로 불러오지 못했어요.</div>
        <div>잠시 후 다시 시도해주세요.</div>
      </div>
      <div class="uk-flex uk-flex-center" style="margin-top: 10px; height: 65px;">
        <button v-on:click="reload" type="button" class="uk-button uk-button-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle" style="padding: 0 20px; border-radius: 10px; line-height: initial;">
          <span uk-icon="icon: refresh; ratio: 1.2;" style="margin-top: -5px;"></span>
          <div style="margin-top: 5px;">재시도</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: ['error'],
  methods: {
    back () {
      history.back()
    },
    reload () {
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100vh;
  background-color: #eceff8;
}
</style>