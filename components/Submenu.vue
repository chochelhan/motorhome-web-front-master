<template>
  <div class="submenu">
    <button v-for="(item, index) in value" v-bind:key="index" v-bind:class="{active: index === active}" v-on:click="$emit('update:active', index)" class="submenu-item" type="button" v-if="checkMenu(item)">
      <div class="submenu-slot">
        <slot v-bind="item" v-bind:active="index === active"></slot>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Submenu',
  props: {
    value: Array,
    active: Number
  },
  methods: {
    checkMenu(item) {
      if(checkIOS()) {
        if(item.name === '익멍' || item.name === 'FLEX' || item.title === '익멍' || item.title === 'FLEX' ) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.submenu {
  display: flex;
  height: $submenu-height;
  // justify-content: space-around;
  overflow-x: auto;
  .submenu-item {
    display: flex;
    flex-direction: column;
    border: none;
    background-color: transparent;
    color: #a3a9bc;
    font-size: 0.8rem;
    padding: 10px 5px 0;
    align-items: center;
    margin: auto;
    height: $submenu-height;
    &::after {
      content: '';
      display: block;
      width: 15px;
      height: 10px;
      margin: 5px auto 0;
      clip-path: polygon(100% 100%, 0 100%, 50% 0%);
    }
    &.active {
      &::after {
        background-color: #ffffff;
      }
    }
    * {
      word-break: keep-all;
    }
    .submenu-slot {
      flex-grow: 1;
    }
  }
}
</style>
