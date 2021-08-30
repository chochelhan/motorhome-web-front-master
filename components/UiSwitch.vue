<template>
  <span
    v-bind:class="{'active': data, 'deactive': !data, ['switch-' + color]: true}"
    v-on:click.stop="toggle"
    class="switch"
  ></span>
</template>

<script>
export default {
  name: 'UiSwitch',
  props: {
    value: Boolean,
    color: {
      type: String,
      default () {
        return 'blue'
      }
    }
  },
  data () {
    return {
      data: this.value,
      lock: false
    }
  },
  methods: {
    toggle () {
      if (this.lock === false) {
        this.data = !this.data
        this.$emit('input', this.data)
        this.lock = true
        setTimeout(() => {
          this.lock = false
        }, 200)
      }
    }
  },
  watch: {
    value (newVal) {
      this.data = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.switch {
  position: relative;
  display: inline-block;
  overflow: visible;
  width: 80px;
  height: 33px;
  background-image: url('../assets/img/switch-off.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px 24px;
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 32px;
    height: 33px;
    top: 2px;
    left: 0;
    border-radius: 50%;
    background-image: url('../assets/img/switch-jog.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  &.switch-blue.active {
    background-image: url('../assets/img/switch-onblue.png');
  }
  &.switch-green.active {
    background-image: url('../assets/img/switch-ongreen.png');
  }
  &.switch-skyblue.active {
    background-image: url('../assets/img/switch-onskyblue.png');
  }
  &.active {
    &::after {
      animation-name: active-indicator;
      animation-duration: 0.1s;
      animation-fill-mode: forwards;
    }
  }
  &.deactive {
    &::after {
      animation-name: deactive-indicator;
      animation-duration: 0.1s;
      animation-fill-mode: forwards;
    }
  }
}
@media (-webkit-min-device-pixel-ratio: 2), (min--moz-device-pixel-ratio: 2), (min-resolution: 2dppx), (min-resolution: 192dpi) {
  .switch {
    background-image: url('../assets/img/switch-off@2x.png');
    &.switch-blue.active {
      background-image: url('../assets/img/switch-onblue@2x.png');
    }
    &.switch-green.active {
      background-image: url('../assets/img/switch-ongreen@2x.png');
    }
    &.switch-skyblue.active {
      background-image: url('../assets/img/switch-onskyblue@2x.png');
    }
  }
}
@media (-webkit-min-device-pixel-ratio: 3), (min--moz-device-pixel-ratio: 3), (min-resolution: 3dppx), (min-resolution: 192dpi) {
  .switch {
    background-image: url('../assets/img/switch-off@3x.png');
    &.switch-blue.active {
      background-image: url('../assets/img/switch-onblue@3x.png');
    }
    &.switch-green.active {
      background-image: url('../assets/img/switch-ongreen@3x.png');
    }
    &.switch-skyblue.active {
      background-image: url('../assets/img/switch-onskyblue@3x.png');
    }
  }
}
@keyframes active-indicator {
  from {
    left: 3px;
  }
  to {
    left: calc(100% - 32px);
  }
}
@keyframes deactive-indicator {
  from {
    left: calc(100% - 32px);
  }
  to {
    left: 3px;
  }
}
</style>
