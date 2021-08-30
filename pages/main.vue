<template>
  <div class="main">
    <tab-navigation
      ref="navigator"
      v-model="tab"
      v-bind:items="navItem"
      v-on:input="$refs.slider.go($event, false); themeControl($event)"
      class="main-navigator"
    ></tab-navigation>
    <screen-slider
      ref="slider"
      v-on:sliding="slideIndicator"
      v-on:slide-end="updateNavigator"
      v-on:slide-finish="updateNavigator"
      class="article-rounded slider"
      style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
    >
      <screen-slider-fragment
        v-for="(component, index) in flickerComponents"
        v-bind:key="index"
        v-bind:class="{'main-contents': $refs.slider && ($refs.slider.index === index), ['main-contents-' + index]: true}"
        v-on:scroll.native="infiniteScroll($event, index)"
        class="slider-fragment"
        style="overflow-y: auto; -webkit-overflow-scrolling: touch;"
      >
        <component v-bind:ref="'component' + index" v-bind:is="component"></component>
      </screen-slider-fragment>
    </screen-slider>
  </div>
</template>

<script>
import PartialMain from '../components/partials/Main'
import PartialLeisureDiary from '../components/partials/LeisureDiary'
import PartialMeet from '../components/partials/Meet'
import PartialAnonymous from '../components/partials/Anonymous'
import PartialJournal from '../components/partials/Journal'
import PartialGuidebook from '../components/partials/Guidebook'
import PartialFlex from '../components/partials/Flex'
import PartialEvents from '../components/partials/Event'
import GoTop from '../components/GoTop'
import TabNavigation from '../components/TabNavigation'
import ScreenSlider from '../components/ScreenSlider'
import ScreenSliderFragment from '../components/ScreenSliderFragment'

export default {
  name: 'Main',
  components: {
    TabNavigation,
    ScreenSlider,
    ScreenSliderFragment,
    GoTop
  },
  layout: 'nocopyright',
  data () {
    if(checkIOS()) {
      return {
        flickerComponents: [
          PartialMain,
          PartialLeisureDiary,
          PartialMeet,
          //PartialAnonymous, // jjong2028 ==> 익멍복원
          PartialJournal,
          PartialGuidebook,
          // PartialFlex, // FLEX복원
          PartialEvents
        ],
        tab: parseInt(this.$route.query.tab) || 0,
        navItem : ['인기', '다이어리', '리폼클럽',/*'익멍',*/ '전문가저널', '가이드북', /* FLEX복원 {title: 'FLEX', style: {color: '#ff006f', 'font-weight': 'bolder'}},*/ '이벤트']
      }
    } else {
      return {
        flickerComponents: [
          PartialMain,
          PartialLeisureDiary,
          PartialMeet,
          PartialAnonymous, // jjong2028 ==> 익멍복원
          PartialJournal,
          PartialGuidebook,
          // PartialFlex, // FLEX복원
          PartialEvents
        ],
        tab: parseInt(this.$route.query.tab) || 0,
        navItem : ['인기', '다이어리', '리폼클럽', '익멍', '전문가저널', '가이드북', /* FLEX복원 {title: 'FLEX', style: {color: '#ff006f', 'font-weight': 'bolder'}},*/ '이벤트']
      }
    }

  },
  methods: {
    isGoTopVisible () {
     if (this.tab == 1 && this.$refs.slider && this.$refs.slider.getComponent(1).mode === 'map') {
        return false
      } else {
        return true
      }
    },
    getCurrentTab () {
      if (this.$refs.slider) {
        return this.$refs.slider.getComponent(this.tab).$el
      }
    },
    updateNavigator (index) {
      this.tab = index
      this.$refs.navigator.navigate(index)
      this.themeControl(index)
    },
    slideIndicator (totalRate) {
      this.$refs.navigator.setIndicatorPosition(totalRate)
    },
    themeControl (index) {
      if (process.browser) {
        document.body.setAttribute('data-tab', index)
      }
    },
    infiniteScroll ($event, index) {
      let scrollRemain = $event.target.scrollHeight - ($event.target.offsetHeight + $event.target.scrollTop)
      if (scrollRemain < 100) {
        let component = this.$refs[`component${index}`][0]
        if (component.loadMore && !component.loading) {
          component.loadMore()
        }
      }
    }
  },
  created () {
    if (process.browser) {
      document.body.classList.add('index')
    }
  },
  mounted () {
    if (this.tab) {
      this.$refs.slider.go(this.tab)
      this.$refs.navigator.navigate(this.tab)
    } else {
      this.$refs.slider.go(0)
      this.$refs.navigator.navigate(0)
    }
  },
  destroyed () {
    if (process.browser) {
      document.body.classList.remove('index')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
.main {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.main-contents-6 {
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
body.index {
  background-color: #a6e7ed;
  &[data-tab='3'] {
    .slider-navigator {
      .slider-navigator-container {
        .slider-indicator-container {
          .slider-indicator {
            background-color: #83a7c9;
          }
        }
      }
    }
  }
  &[data-tab='6'] {
    .slider-navigator {
      .slider-navigator-container {
        .slider-indicator-container {
          .slider-indicator {
            background-color: transparent;
          }
        }
      }
    }
    .slider-button-container {
      button.active {
        .tab-title {
          color: unset !important;
        }
      }
    }
  }
}
</style>
