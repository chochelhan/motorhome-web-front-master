<template>
  <div class="screen-slider-fragment">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ScreenSliderFragment'
}
</script>

<style scoped>
.screen-slider-fragment {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
}
</style>
