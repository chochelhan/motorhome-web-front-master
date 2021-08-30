<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" rounded gradient back home>
    <template v-slot:header>푸시알림 설정</template>
    <template>
      <push-setting></push-setting>
    </template>
  </activity>
</template>

<script>
import PushSetting from '../PushSetting'
export default {
  name: 'PushSettingActivity',
  components: {
    PushSetting
  },
  props: {
    resolve: Function
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>
