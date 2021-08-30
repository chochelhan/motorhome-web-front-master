<template>
  <iframe
    v-bind:src="'https://www.youtube.com/embed/' + value"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</template>

<script>
export default {
  name: 'YoutubeVideo',
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
iframe {
  width: 100%;
  height: 315px;
}
</style>