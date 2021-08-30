<template>
  <activity v-on:finish="finish" back>
    <template v-slot:header>사용자 프로필</template>
    <template>
      <profile v-bind:id="id"></profile>
    </template>
  </activity>
</template>

<script>
import Profile from '../Profile'
export default {
  name: 'ProfileActivity',
  components: {
    Profile
  },
  props: {
    id: [Number, String],
    withoutSafearea: Boolean
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>