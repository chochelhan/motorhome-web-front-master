<template>
  <div class="flicker-slide">
    <div class="flicker-slide-navigation">
      <slot name="navigator"></slot>
    </div>
    <div class="flicker-scrollbar-track">
      <div ref="indicator" class="flicker-indicator">
        <slot name="indicator"></slot>
      </div>
    </div>
    <div ref="slider" class="flicker-slide-contents">
      <component v-for="(component, index) in components" v-bind:key="index" v-bind:is="component" class="flicker-slide-content">{{index}}</component>
    </div>
  </div>
</template>

<script>
import UIkit from 'uikit'
export default {
  name: 'FlickerSlide',
  props: {
    components: {
      type: Array,
      required: true
    },
    tab: {
      type: [Number, String],
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      index: this.tab,
      establishedIndex: this.tab
    }
  },
  computed: {
    scrollStepDivider () {
      return window.innerWidth / this.components.length
    }
  },
  methods: {
    navigate (index, smooth = true) {
      this.index = index
      this.$refs.slider.scrollTo({
        left: window.innerWidth * this.index,
        behavior: smooth ? 'smooth' : undefined
      })
    }
  },
  mounted () {
    let flicking = false
    this.$refs.indicator.style.width = `calc(100vw / ${this.components.length})`
    this.$refs.slider.addEventListener('scroll', () => {
      if (flicking === false) {
        this.$emit('flicking-start', this.index)
        flicking = true
      }
      let left = this.$refs.slider.scrollLeft / this.components.length
      this.$refs.indicator.style.left = `${left}px`

      let position = left / this.scrollStepDivider
      if (Math.round(position) != this.establishedIndex) {
        this.establishedIndex = Math.round(position)
        this.$emit('flicking-establish', this.establishedIndex)
      }
      if (Number.isInteger(position)) {
        this.index = position
        this.establishedIndex = this.index
        this.$emit('flicking-end', this.index)
        flicking = false
      }
    })
    if (this.tab) {
      this.navigate(this.tab, false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.flicker-slide-contents::-webkit-scrollbar {
  background-color: transparent;
  display: none;
}
.flicker-slide-contents::-webkit-scrollbar-track {
  background-color: transparent;
}
.flicker-slide {
  display: flex;
  flex-direction: column;
  width: 100vw;

  .flicker-slide-contents {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    width: 100vw;
    .flicker-slide-content {
      box-sizing: border-box;
      flex: none;
      position: relative;
      width: 100vw;
      height: calc(100vh - #{$header-height + $footer-height});
      overflow-y: auto;
      scroll-snap-align: start;
      scroll-snap-stop: always;
    }
  }

  .flicker-scrollbar-track {
    width: 100vw;
    position: relative;
    margin-top: -1px;
    .flicker-indicator {
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .flicker-slide-navigation {
    display: flex;
    width: 100vw;
    & > * {
      flex: 1;
      text-align: center;
      color: #000000;
      text-decoration: none;
    }
  }
}
</style>
