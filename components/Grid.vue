<template>
  <div v-bind:style="{'grid-template-columns': 'repeat(' + columns + ', 1fr)'}" class="grid">
    <div v-for="(item, index) in data" v-bind:key="index" class="grid-column">
      <slot v-bind="item"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    columns: {
      type: [Number, String],
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.grid {
  display: grid;
  gap: $layout-margin;
  .grid-column {
    word-break: break-all;
  }
}
</style>
