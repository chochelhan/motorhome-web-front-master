<template>
  <div class="section">
    <div v-if="title" class="section-title">
      <h2>{{title}}</h2>
      <h3 v-if="subtitle">{{subtitle}}</h3>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSection',
  props: {
    title: String,
    subtitle: String
  }
}
</script>

<style lang="scss" scoped>
.section-title {
  display: flex;

  h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
  }
  h3 {
    margin: 0 0 0 7px;
    font-size: 1rem;
    color: grey;
  }
}
</style>