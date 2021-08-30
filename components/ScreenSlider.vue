<template>
  <div class="screen-slider">
    <div ref="container" class="screen-slider-container" v-bind:style="{width: 'calc(100% * ' + fragments.length + ')'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const anime = require('animejs').default

export default {
  name: 'ScreenSlider',
  props: {
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
    }
  },
  data () {
    return {
      fragments: [],
      dragging: false,
      startX: null,
      endX: null,
      clientX: null,
      clientY: null,
      direction: 0,
      translateX: 0,
      index: 0,
      speed: null,
      time: null,
      dragAllowed: false
    }
  },
  methods: {
    startDrag (e) {
      this.$emit('slide-start')
      this.clientX = e.touches ? e.touches[0].clientX : e.clientX
      this.clientY = e.touches ? e.touches[0].clientY : e.clientY
      this.startX = this.clientX
      this.time = new Date().getTime()
    },
    drag (e) {
      if (this.time) {
        let clientX = e.touches ? e.touches[0].clientX : e.clientX
        let clientY = e.touches ? e.touches[0].clientY : e.clientY
        this.endX = clientX
        if (this.dragAllowed || Math.abs(clientX - this.clientX) / Math.abs(clientY - this.clientY) > this.scrollSensitivity) {
          this.dragAllowed = true
          let time = new Date().getTime()
          this.speed = Math.abs(clientX - this.clientX) / (time - this.time)
          this.time = time
          let difference = clientX - this.clientX
          this.direction = difference > 0 ? -1 : 1
          this.translateX += difference / document.body.clientWidth
          if (this.translateX > 0) {
            this.translateX = 0
          }
          if (this.translateX < -this.fragments.length + 1) {
            this.translateX = -this.fragments.length + 1
          }
          this.$refs.container.style.transform = `translateX(${this.translateX * 100 / this.fragments.length}%)`
          this.clientX = clientX
          this.clientY = clientY
          this.scrollDisable()
          this.$emit('sliding', Math.abs(this.translateX) / (this.fragments.length - 1))
        } else {
          this.endDrag(e)
        }
      }
    },
    endDrag (e) {
      if (this.speed > this.momentumSlideSpeed && Math.abs(this.startX - this.endX) > this.minSwipeGap) {
        this.go(this.index + this.direction)
        this.$emit('slide-end', this.index + this.direction)
      } else {
        this.go(-Math.round(this.translateX))
        this.$emit('slide-end', -Math.round(this.translateX))
      }
      this.direction = 0
      this.clientX = null
      this.clientY = null
      this.startX = null
      this.endY = null
      this.time = null
      this.speed = null
      this.dragAllowed = false
    },
    scrollDisable () {
      this.fragments.forEach(fragment => {
        fragment.$el.style.overflow = 'hidden'
      })
    },
    scrollEnable () {
      this.fragments.forEach(fragment => {
        fragment.$el.style.overflow = 'auto'
      })
    },
    go (index, animate = true) {
      if (index < 0) {
        index = 0
      }
      if (index >= this.fragments.length) {
        index = this.fragments.length - 1
      }
      if (animate) {
        anime({
          targets: this.$refs.container,
          translateX: `${-index * 100 / this.fragments.length}%`,
          easing: 'easeOutExpo',
          duration: this.slideDuration,
          complete: (anim) => {
            this.translateX = -index
            this.index = index
            this.scrollEnable()
            this.$emit('slide-finish', this.index)
          }
        })
      } else {
        this.$refs.container.style.transform = `translateX(${-index * 100 / this.fragments.length}%)`
        this.translateX = -index
        this.index = index
        this.scrollEnable()
        this.$emit('slide-finish', this.index)
      }
    },
    next () {
      this.go(this.index + 1)
    },
    prev () {
      this.go(this.index - 1)
    },
    getComponent (index) {
      return this.fragments[index]
    }
  },
  mounted () {
    this.$children.forEach(component => {
      if (component.$vnode.componentOptions.tag === 'screen-slider-fragment') {
        this.fragments.push(component)
      }
    })
    this.$el.addEventListener('mousedown', this.startDrag)
    this.$el.addEventListener('mousemove', this.drag)
    this.$el.addEventListener('mouseup', this.endDrag)
    this.$el.addEventListener('touchstart', this.startDrag)
    this.$el.addEventListener('touchmove', this.drag)
    this.$el.addEventListener('touchend', this.endDrag)
  }
}
</script>

<style lang="scss" scoped>
.screen-slider {
  overflow-x: hidden;
  height: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.screen-slider-container {
  display: flex;
  height: 0;
  flex-wrap: nowrap;
  will-change: transform;
  animation: smooth;
  animation-duration: 600ms;
  flex-grow: 1;
}
</style>
