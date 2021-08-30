<template>
  <div class="fab">
    <button @click="write" type="button">
      <slot></slot>
    </button>
    <safearea-bottom></safearea-bottom>
  </div>
</template>

<script>
export default {
    name: 'Fab',
    methods:{
      write($event) {
         this.$emit('click', $event)
      }
    }

}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.fab {
  position: fixed;
  z-index: 1000;
  bottom: $footer-height + 15px;
  right: 15px;
  button {
    border: none;
    border-radius: 56px;
    background-color: #16adb9;
    color: #ffffff;
    width: 56px;
    height: 56px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
