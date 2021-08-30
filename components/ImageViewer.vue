<template>
  <pinch-zoom>
    <img :src="src"/>
  </pinch-zoom>
</template>

<script>
export default {
  name: 'ImageViewer',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
