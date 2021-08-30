<template>
  <div class="article-top-container">
    <div v-on:click="toTop" class="article-top">TOP</div>
    <safearea-bottom></safearea-bottom>
  </div>
</template>

<script>
export default {
  name: 'ActivityArticleTop',
  props: {
    target: {
      required: true
    }
  },
  methods: {
    toTop () {
      this.target.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.article-top-container {
  position: fixed;
  bottom: $footer-height + 10px;
  right: 20px;
  width: 44px;
  .article-top {
    width: 44px;
    height: 44px;
    background-image: linear-gradient(133deg, #77b2ff 9%, #74e2ea 87%);
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    color: #ffffff;
    text-align: center;
    font-weight: bold;
    font-size: 0.75rem;
    border-radius: 50%;
    padding-top: 18px;
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      position: absolute;
      top: 9px;
      left: calc(50% - 5px);
      transform: rotate(45deg);
      border-top: solid #ffffff 2px;
      border-left: solid #ffffff 2px;
    }
  }
}
</style>