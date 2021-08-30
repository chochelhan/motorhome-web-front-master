<template>
  <div v-bind:class="{'tag-text': text, 'tag-button': !text}" v-on:click="$emit('delete')" class="tag">
    <slot></slot>
    <span v-if="editable" uk-icon="close"></span>
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    editable: Boolean,
    text: Boolean
  }
}
</script>

<style lang="scss" scoped>
.tag {
  white-space: nowrap;
  word-break: keep-all;
  &.tag-text {
    padding: 0;
    background-color: transparent;
    color: #16adb9;
    font-size: 12px;
  }
  &.tag-button {
    font-size: 13px;
    padding: 2px 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
  }
}
</style>