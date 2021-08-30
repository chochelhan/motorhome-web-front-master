<template>
  <div v-bind:class="deviceClass" style="height: 100vh;">
    <nuxt/>
    <activity-manager></activity-manager>
  </div>
</template>

<script>
import ActivityManager from '../components/ActivityManager'
export default {
  name: 'PublicLayout',
  components: {
    ActivityManager
  },
  data () {
    return {
      deviceClass: []
    }
  },
  created () {
  },
  mounted () {
    if (process.browser) {
      if (this.$userAgent.device.model === 'iPhone') {
        this.deviceClass.push('device-iphone')
        this.deviceClass.push('device-iphone-' + this.$userAgent.device.version.toLowerCase())
      } else {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
</style>
