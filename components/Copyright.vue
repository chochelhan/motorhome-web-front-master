<template>
  <div class="copyright">
    <div class="customer">
      <span v-on:click="showAboutUs">PIWI 소개</span>
      <span @click="showQuestion">문의하기</span>
      <!--<a href="mailto:info@piwi.kr">문의하기</a>-->
      <span v-on:click="faq">도움말(FAQ)</span>
    </div>
    <div class="company">©PIWI</div>
  </div>
</template>

<script>
import FaqActivity from './activities/FaqActivity'
import ConfirmActivity from './activities/ConfirmActivity'
export default {
  name: 'Copyright',
  methods: {
    faq () {
      this.$activity.start(FaqActivity)
    },
    showAboutUs () {
      this.$api.get(`/terms`, {
        params: {
          termsTypes: 'INTRODUCTION'
        }
      }).then(response => {
        this.$activity.start(ConfirmActivity, {
          title: response.data[0].title,
          contents: response.data[0].contents
        })
      })
    },
    showQuestion() {
      this.$activity.start(ConfirmActivity, {
        title:'문의하기',
        contents: '<p style="margin-bottom: 0;">' +
                '<span>이메일 : info@piwi.kr</span>' +
                '</p>'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.copyright {
  padding: 12px 12px #{$footer-height - 20px + 12px} 12px;
  background-color: #f1f1f1;
  font-size: 0.75rem;
  text-align: center;
  .customer {
    display: flex;
    justify-content: center;
    margin-top: 5px;
    a, span {
      display: block;
      margin-left: 20px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .company {
    margin-top: 5px;
  }
}
</style>
