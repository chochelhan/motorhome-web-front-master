<template>
  <activity v-on:finish="finish" back without-safearea>
    <template v-slot:header>이미지보기</template>
    <template>
      <image-viewer v-bind:src="src"
        v-on:touchstart.native.stop v-on:touchmove.native.stop v-on:touchend.native.stop
        style="display: flex; flex-grow: 1;"
      ></image-viewer>
    </template>
  </activity>
</template>

<script>
import ImageViewer from '../ImageViewer'
export default {
  name: 'ImageViewerActivity',
  components: {
    ImageViewer
  },
  props: {
    src: {
      type: String,
      required: true
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>