<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" rounded gradient back home>
    <template v-slot:header>공지사항</template>
    <template>
      <notice></notice>
    </template>
  </activity>
</template>

<script>
import Notice from '../Notice'
export default {
  name: 'NoticeActivity',
  components: {
    Notice
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
