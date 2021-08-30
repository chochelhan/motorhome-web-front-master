<template>
  <button type="button" class="current-location-button">
    <span uk-icon="icon: location;"></span>
  </button>
</template>

<script>
export default {
  name: 'CurrentLocationButton'
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.current-location-button {
  position: absolute;
  display: block;
  width: 45px;
  height: 45px;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  box-shadow: 3px 3px 17px -8px #000000;
  color: $global-primary-color;
}
</style>
