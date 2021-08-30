<template>
  <div
    ref="activity"
    v-bind:class="{'activity-flat': flat, 'activity-rounded': rounded, 'activity-gradient': gradient, 'activity-black': black, 'activity-dark': dark, 'activity-overwrap': overwrap, 'activity-inverse-rounded': inverseRounded, 'activity-topaz': topaz}"
    v-bind:style="{'z-index': level, 'transform': 'translateX(100vw)', 'box-shadow': shadow}"
    class="activity"
  >
    <app-header
      v-on:finish="finish"
      v-bind:flat="flat"
      v-bind:rounded="rounded"
      v-bind:gradient="gradient"
      v-bind:black="black"
      v-bind:dark="dark"
      v-bind:topaz="topaz"
      v-bind:back="back"
      v-bind:home="home"
      v-bind:style="{'background-color': 'rgba(255, 255, 255, ' + progress + ')', 'box-shadow': '0 0 7px 3px rgba(0, 0, 0, ' + (progress / 5) + ')'}"
      class="activity-header"
    >
      <template v-slot:navigations>
        <slot name="navigations"></slot>
      </template>
      <template>
        <slot name="header"></slot>
      </template>
      <template v-slot:operations>
        <slot name="operations"></slot>
      </template>
    </app-header>
    <slot name="extra"></slot>
    <div ref="content" v-bind:style="{'background': background}" class="activity-content">
      <safearea-top v-if="!withoutSafearea"></safearea-top>
      <slot></slot>
      <safearea-bottom v-if="!withoutSafearea && !withoutSafeareaBottom"></safearea-bottom>
    </div>
    <div v-if="$slots.footer" class="activity-footer">
      <slot name="footer"></slot>
      <safearea-bottom v-if="!withoutSafearea"></safearea-bottom>
    </div>
  </div>
</template>

<script>
const anime = require('animejs').default
import AppHeader from './AppHeader'

export default {
  name: 'Activity',
  components: {
    AppHeader
  },
  props: {
    level: {
      type: Number,
      default () {
        return 1001
      }
    },
    slideDuration: {
      type: Number,
      default () {
        return 200
      }
    },
    // 슬라이드 허용할 스와이핑 최소 이동거리(픽셀)
    minSwipeGap: {
      type: Number,
      default () {
        return 50
      }
    },
    // 슬라이드 허용할 스와이핑 속도(낮을수록 속도가 높음)
    momentumSlideSpeed: {
      type: Number,
      default () {
        return 0.01
      }
    },
    // 슬라이드 허용할 스와이프 가로:세로 비율
    scrollSensitivity: {
      type: Number,
      default () {
        return 1
      }
    },
    back: Boolean,
    home: Boolean,
    resolve: Function,
    rounded: Boolean,
    inverseRounded: Boolean,
    gradient: Boolean,
    dark: Boolean,
    black: Boolean,
    flat: Boolean,
    topaz: Boolean,
    overwrap: Boolean,
    withoutSafearea: Boolean,
    withoutSafeareaBottom: Boolean,
    progress: Number,
    background: String,
    returnData: [Array, String, Number, Object, Boolean, Function],
    preventDrag: Boolean,
    preventSwipe: Boolean,
    beforeFinish: Function
  },
  data () {
    return {
      shadow: null,
      dragging: false,
      startX: null,
      endX: null,
      clientX: null,
      clientY: null,
      direction: 0,
      translateX: 0,
      speed: null,
      time: null,
      dragAllowed: false,
      component: null,
      footer: null,
      positionRatio: 0
    }
  },
  methods: {
    finish (data) {
      let completion = (resolve, reject) => anime({
        targets: this.$refs.activity,
        translateX: `110vw`,
        easing: 'easeOutExpo',
        duration: 300,
        update: anim => {
          this.updateShadow(1 - (anim.progress / 100))
        },
        complete: (anim) => {
          this.$emit('finish')
          if (resolve) {
            resolve()
          }
          if (this.resolve) {
            if (this.returnData) {
              this.resolve(this.returnData)
            } else {
              this.resolve(data)
            }
          }
        }
      })
      if (this.beforeFinish) {
        return new Promise((resolve, reject) => {
          this.beforeFinish().then(() => {
            completion(resolve, reject)
          }).catch(() => {})
        })
      } else {
        return new Promise(completion)
      }
    },
    startDrag (e) {
      this.$emit('slide-start')
      this.clientX = e.touches ? e.touches[0].clientX : e.clientX
      this.clientY = e.touches ? e.touches[0].clientY : e.clientY
      this.startX = this.clientX
      this.time = new Date().getTime()
    },
    drag (e) {
      if (this.preventSwipe) {
        return
      }
      if (this.time) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX
        let clientY = e.touches ? e.touches[0].clientY : e.clientY
        this.endX = clientX
        if (this.dragAllowed || Math.abs(clientX - this.clientX) / Math.abs(clientY - this.clientY) > this.scrollSensitivity) {
          if (!this.dragAllowed) {
            this.$refs.content.style.overflow = 'hidden'
            this.$refs.content.querySelectorAll('scroll-content').forEach(element => {
              element.style.overflow = 'hidden'
            })
          }
          this.dragAllowed = true
          let time = new Date().getTime()
          this.speed = Math.abs(clientX - this.clientX) / (time - this.time)
          this.time = time
          let difference = clientX - this.clientX
          this.direction = difference > 0 ? -1 : 1
          this.translateX += difference
          if (this.translateX < 0) {
            this.translateX = 0
          }
          if (window.screen.width > this.translateX) {
            this.positionRatio = (window.screen.width - this.translateX) / window.screen.width
          } else {
            this.positionRatio = 1
          }
          this.$refs.activity.style.transform = `translateX(${this.translateX}px)`
          this.updateShadow(this.positionRatio)
          this.clientX = clientX
          this.clientY = clientY
        } else {
          this.endDrag(e)
        }
      }
    },
    endDrag (e) {
      if (this.speed > this.momentumSlideSpeed && this.direction === -1 && Math.abs(this.startX - this.endX) > this.minSwipeGap) {
        this.finish()
      } else if (this.translateX / document.body.clientWidth > 0.55) {
        this.finish()
      } else {
        anime({
          targets: this.$refs.activity,
          translateX: `0`,
          easing: 'easeOutExpo',
          duration: 200
        })
      }
      this.direction = 0
      this.clientX = null
      this.clientY = null
      this.startX = null
      this.endY = null
      this.translateX = 0
      this.time = null
      this.speed = null
      this.dragAllowed = false
      this.$refs.content.style.overflow = null
      this.$refs.content.querySelectorAll('scroll-content').forEach(element => {
        element.style.overflow = null
      })
    },
    updateShadow (ratio) {
      // this.$refs.activity.style.boxShadow = `-2px 5px 19px 5px rgba(0, 0, 0, ${ratio / 5})`
    }
  },
  mounted () {
    if (this.preventDrag) {
      this.$refs.activity.style.transform = 'translateX(0)'
    } else {
      setTimeout(() => {
        this.shadow = '-2px 5px 19px 5px rgba(0, 0, 0, 0.2)'
        anime({
          targets: this.$refs.activity,
          translateX: `0`,
          easing: 'easeOutExpo',
          duration: 300,
          update: anim => {
            this.updateShadow(1 - (anim.progress / 100))
          },
          complete: anim => {
            this.$refs.activity.addEventListener('touchstart', this.startDrag)
            this.$refs.activity.addEventListener('touchmove', this.drag)
            this.$refs.activity.addEventListener('touchend', this.endDrag)
          }
        })
      }, 150)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
.activity {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #eceff8;
  display: flex;
  flex-direction: column;
  will-change: transform;
  &.activity-flat, &.activity-gradient {
    background-color: #f1f1f1;
  }
  &.activity-dark, &.activity.black {
    background-color: #83a7c9;
  }
  .activity-header {
    position: fixed;
    top: 0;
    z-index: 2;
  }
  .activity-content {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: auto;
    flex-grow: 1;
    padding-top: $activity-header-height;
    -webkit-overflow-scrolling: touch;
  }
  .activity-footer {
    position: fixed;
    z-index: 3;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    width: 100vw;
  }
}
.activity {
  &.activity-topaz {
    background-color: #16adb9;
    .activity-content {
      background-color: #ffffff;
    }
  }
  &.activity-inverse-rounded {
    .activity-header {
      position: relative;
    }
    .activity-content {
      padding-top: 0;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      box-shadow: 0 -1px 9px 0 rgba(0, 0, 0, 0.16);
      z-index: 2;
    }
  }
  &.activity-overwrap {
    .activity-header {
      background-color: transparent;
    }
    .activity-content {
      padding-top: 0;
    }
  }
}
</style>
