<template>
  <div v-bind:class="{'active': active}" class="bottom-sheet-container">
    <div ref="backdrop" v-on:click.stop="close" class="bottom-sheet-backdrop" style="opacity: 0;"></div>
    <div ref="sheet" class="bottom-sheet" v-bind:style="{height: height, transform: 'translateY(' + height + ')'}">
      <div v-if="title" class="uk-flex uk-flex-between bottom-sheet-title">
        <span>{{title}}</span>
        <button v-on:click="close" type="button" class="uk-button uk-button-primary uk-button-small">확인</button>
      </div>
      <div class="bottom-sheet-contents">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
const anime = require('animejs').default
export default {
  props: {
    title: String,
    height: {
      type: String,
      default () {
        return '50vh'
      }
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    open () {
      return new Promise((resolve, reject) => {
        this.active = true
        anime({
          targets: this.$refs.backdrop,
          opacity: 1,
          easing: 'easeOutExpo',
          duration: 200
        })
        anime({
          targets: this.$refs.sheet,
          translateY: '0',
          easing: 'easeOutExpo',
          duration: 300,
          complete: (anim) => {
            this.$emit('open')
            if (resolve) {
              resolve()
            }
          }
        })
      })
    },
    close () {
      return new Promise((resolve, reject) => {
        anime({
          targets: this.$refs.backdrop,
          opacity: 0,
          easing: 'easeOutExpo',
          duration: 200
        })
        anime({
          targets: this.$refs.sheet,
          translateY: `50vh`,
          easing: 'easeOutExpo',
          duration: 300,
          complete: (anim) => {
            this.$emit('close')
            this.active = false
            if (resolve) {
              resolve()
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.bottom-sheet-container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  &.active {
    display: block;
  }
  .bottom-sheet-backdrop {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.1);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .bottom-sheet {
    position: fixed;
    background-color: #ffffff;
    width: 100vw;
    bottom: 0;
    padding: $layout-margin;
    font-size: 0.9rem;
    .bottom-sheet-title {
      font-weight: bold;
    }
    .bottom-sheet-contents {
      margin-top: $content-margin;
    }
  }
}
</style>
