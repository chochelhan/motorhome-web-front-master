<template>
  <div v-bind:class="{diabled: $store.state.app.iosKeyboardShow}" class="safearea-bottom"></div>
</template>

<script>
export default {
  name: 'SafeareaBottom'
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
.safearea-bottom {
  user-select: none;
  flex-shrink: 0;
  &.diabled {
    display: none;
  }
}
.device-iphone {
  .safearea-bottom {
    height: $iphone-6-safe-bottom;
  }
  &.device-iphone-x-xs {
    .safearea-bottom {
      height: $iphone-x-xs-safe-bottom;
    }
  }
  &.device-iphone-xmax-xr {
    .safearea-bottom {
      height: $iphone-xmax-xr-safe-bottom;
    }
  }
  &.device-iphone-12 {
    .safearea-bottom {
      height: $footer-height + $iphone-12-safe-bottom;
    }
  }
}
</style>