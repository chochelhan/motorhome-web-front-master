<template>
  <div class="safearea-top"></div>
</template>

<script>
export default {
  name: 'SafeareaTop'
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
.safearea-top {
  flex-shrink: 0;
  user-select: none;
}
.device-iphone {
  .safearea-top {
    height: $iphone-6-safe-top;
  }
  &.device-iphone-x-xs {
    .safearea-top {
      height: $iphone-x-xs-safe-top;
    }
  }
  &.device-iphone-xmax-xr {
    .safearea-top {
      height: $iphone-xmax-xr-safe-top;
    }
  }
  &.device-iphone-12 {
    .safearea-top {
      height: $footer-height + $iphone-12-safe-top;
    }
  }
}
</style>