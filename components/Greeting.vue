<template>
  <div v-on:click="$emit('close')" class="modal-greeting"></div>
</template>

<script>
export default {
  name: 'Greeting'
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
.modal-greeting {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1020;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  background-image: url('../assets/img/welcome.jpg');
  background-repeat: no-repeat;
  background-size: 80% auto;
  background-position: center;
  img {
    width: 80%;
  }
}
</style>
