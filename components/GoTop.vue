<template>
  <button v-on:click="goTop" class="go-top" type="button">
    <span uk-icon="icon: chevron-up; ratio: 1;"></span>
  </button>
</template>

<script>
import UIkit from 'uikit'

export default {
  props: {
    target: {}
  },
  methods: {
    goTop () {
      let target
      if ((typeof this.target) === 'string') {
        target = document.querySelector(this.target)
      } else if ((typeof this.target) === 'function') {
        target = this.target()
      } else if (this.target) {
        target = this.target
      } else if (target = document.querySelector('.main-contents')) {
      } else {
        target = window
      }
      
      if (target) {
        target.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.go-top {
  position: fixed;
  z-index: 1000;
  bottom: calc(#{$footer-height} + 10px);
  right: 10px;
  border: solid $global-border 1px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.8);
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
</style>
