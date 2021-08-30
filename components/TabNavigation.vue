<template>
  <div ref="navigator" class="slider-navigator">
    <safearea-top></safearea-top>
    <div ref="navigatorContainer" class="slider-navigator-container">
      <div ref="tabContainer" class="slider-button-container">
        <button
          v-for="(item, index) in items"
          v-bind:key="index"
          v-bind:class="{'active': value == index}"
          v-on:click="navigate(index); $emit('input', index)"
          type="button"
          v-if="checkMenu(item)"
        >
          <div v-if="item.title" class="tab-title" v-bind="item">{{item.title}}</div>
          <div v-else class="tab-title">{{item}}</div>
          <div v-if="item.description" class="tab-description">{{item.description}}</div>
        </button>
      </div>
      <div v-if="showIndicator" class="slider-indicator-container">
        <div ref="indicator" class="slider-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script>
const anime = require('animejs').default

export default {
  props: {
    value: Number,
    items: {
      type: Array,
      required: true
    },
    showIndicator: Boolean
  },
  methods: {
    checkMenu(item) {
      let title = item
      if(item.title) {
        title = item.title
      }
        return true
        /*
      if(checkIOS()) {

          if(title === '익멍' || title === 'FLEX') {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
      */
    },
    getIndicatorLeft () {
      let button = this.$refs.tabContainer.querySelector(`button:nth-child(${this.tab + 1})`)
      if (this.showIndicator && button) {
        return button.offsetLeft + (button.clientWidth / 2) - (this.$refs.indicator.clientWidth / 2)
      } else {
        return null
      }
    },
    getIndicatorPrevLeft () {
      let button = this.$refs.tabContainer.querySelector(`button:nth-child(${this.tab})`)
      if (this.showIndicator && button) {
        return button.offsetLeft + (button.clientWidth / 2) - (this.$refs.indicator.clientWidth / 2)
      } else {
        return null
      }
    },
    getIndicatorNextLeft () {
      let button = this.$refs.tabContainer.querySelector(`button:nth-child(${this.tab + 2})`)
      if (this.showIndicator && button) {
        return button.offsetLeft + (button.clientWidth / 2) - (this.$refs.indicator.clientWidth / 2)
      } else {
        return null
      }
    },
    navigate (index) {
      this.tab = index
      let button = this.$refs.tabContainer.querySelector(`button:nth-child(${index + 1})`)

      if (button) {
        if (this.showIndicator) {
          anime({
            targets: this.$refs.indicator,
            left: button.offsetLeft + (button.clientWidth / 2) - (this.$refs.indicator.clientWidth / 2),
            duration: 200,
            easing: 'easeOutExpo'
          })
        }
        
        if ((button.offsetLeft + button.clientWidth) > (this.$refs.navigator.scrollLeft + this.$refs.navigator.clientWidth)) {
          this.$refs.navigator.scrollBy({
            left: (button.offsetLeft + button.clientWidth) - (this.$refs.navigator.scrollLeft + this.$refs.navigator.clientWidth),
            behavior: 'smooth'
          })
        }

        if (button.offsetLeft < this.$refs.navigator.scrollLeft) {
          this.$refs.navigator.scrollTo({
            left: button.offsetLeft,
            behavior: 'smooth'
          })
        }

        this.$emit('navigated', this.tab)
      }
    },
    setIndicatorPosition (totalRate) {
      if (this.showIndicator) {
        let screenRate = (totalRate * (this.items.length - 1)) - this.tab
        let goingLeft = (screenRate > 0) ? this.getIndicatorNextLeft() : this.getIndicatorPrevLeft()
        let currentLeft = this.getIndicatorLeft()
        let container = this.$el.querySelector('.slider-button-container')
        if (screenRate < 0) {
          this.$refs.indicator.style.left = `${currentLeft - ((goingLeft - currentLeft) * screenRate)}px`
        } else {
          this.$refs.indicator.style.left = `${currentLeft + ((goingLeft - currentLeft) * screenRate)}px`
        }
      }
    }
  },
  mounted () {
    this.navigate(0)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
.slider-navigator {
  overflow-x: auto;
  flex-shrink: 0;
  .slider-navigator-container {
    display: flex;
    flex-direction: column;
    width: fit-content;
    overflow-y: hidden;
    .slider-button-container {
      width: fit-content;
      height: $header-height;
      display: flex;
      flex-wrap: nowrap;
      button {
        position: relative;
        border: none;
        background-color: transparent;
        font-weight: bold;
        font-size: 13px;
        padding: 0 20px;
        word-break: keep-all;
        white-space: nowrap;
        color: #585858;
        &.active {
          color: rgba(255, 255, 255, 0.8);
        }
        .tab-description {
          color: gray;
          font-size: 0.9rem;
        }
      }
    }
    .slider-indicator-container {
      position: relative;
      .slider-indicator {
        width: 20px;
        height: 20px;
        transform: rotate(60deg) skewX(30deg);
        background-color: #ffffff;
        position: absolute;
        bottom: -17px;
      }
    }
  }
}
</style>