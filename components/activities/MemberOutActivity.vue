<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" back home gradient rounded>
    <template v-slot:header>회원탈퇴</template>
    <template>
      <member-out ref="form"></member-out>
    </template>
  </activity>
</template>

<script>
import MemberOut from '../MemberOut'
export default {
  name: 'MemberOutActivity',
  components: {
    MemberOut
  },
  props: {
    resolve: Function
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      this.$refs.form.confirm().then(response => {
        this.$refs.activity.finish(true)
      })
    }
  }
}
</script>
