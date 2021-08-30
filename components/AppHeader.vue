<template>
  <div v-bind:class="{'app-header-flat': flat, 'app-header-rounded': rounded, 'app-header-black': black, 'app-header-dark': dark, 'app-header-gradient': gradient, 'app-header-topaz': topaz}" class="app-header">
    <safearea-top></safearea-top>
    <div class="app-header-container">
      <div v-if="$slots.operations || $slots.navigations || back" class="app-header-navigations">
        <span
          v-if="back"
          v-on:click="$emit('finish')"
          uk-icon="icon: app-back;"
          class="uk-icon-link app-finish"
        ></span>
        <span
          v-if="home"
          v-on:click="goHome"
          uk-icon="icon: app-main;"
        ></span>
        <slot v-if="$slots.navigations" name="navigations"></slot>
      </div>
      <div class="uk-flex-1 uk-text-center app-header-title">
        <slot></slot>
      </div>
      <div v-if="$slots.operations || back" class="app-header-operations">
        <slot name="operations"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    back: Boolean,
    home: Boolean,
    rounded: Boolean,
    gradient: Boolean,
    black: Boolean,
    dark: Boolean,
    flat: Boolean,
    topaz: Boolean
  },
  methods: {
    goHome () {
      this.$activity.clear().then(() => {
        this.$router.push(`/main`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.app-header {
  background-color: #eceff8;
  .app-header-container {
    display: flex;
    align-items: center;
    width: 100vw;
    height: $header-height;
  }
  * {
    color: #747474;
  }
  &.app-header-flat {
    background-color: #a6e7ed;
    * {
      color: #ffffff;
    }
  }
  &.app-header-rounded {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #83a7c9;
    * {
      color: #ffffff;
    }
  }
  &.app-header-dark {
    background-color: #83a7c9;
    * {
      color: #ffffff;
    }
  }
  &.app-header-black {
    background-color: #0f2640;
    * {
      color: #ffffff;
    }
  }
  &.app-header-gradient {
    background-image: linear-gradient(45deg, rgba(116,234,213,1) 0%, rgba(158,173,229,1) 100%); 
    * {
      color: #ffffff;
    }
  }
  &.app-header-topaz {
    background-color: #16adb9;
    * {
      color: #ffffff;
    }
  }
  .app-header-title {
    font-weight: bold;
  }
  .app-header-navigations {
    position: absolute;
    left: 20px;
    & > * {
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .app-header-operations {
    position: absolute;
    right: 20px;
  }
}
</style>
