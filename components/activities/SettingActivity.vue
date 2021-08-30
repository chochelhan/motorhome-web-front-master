<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" rounded gradient back home>
    <template v-slot:header>설정</template>
    <template>
      <setting></setting>
    </template>
  </activity>
</template>

<script>
import Setting from '../Setting'
export default {
  name: 'SettingActivity',
  components: {
    Setting
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
