<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" back>
    <template v-slot:header>프로필 수정</template>
    <template v-slot:operations>
      <button v-on:click="confirm" type="button" class="btn-confirm">완료</button>
    </template>
    <template>
      <profile-edit ref="profile" v-bind:id="id"></profile-edit>
    </template>
  </activity>
</template>

<script>
import ProfileEdit from '../ProfileEdit'
export default {
  name: 'ProfileEditActivity',
  components: {
    ProfileEdit
  },
  props: {
    id: Number,
    resolve: Function
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      return this.$refs.profile.confirm().then(member => {
        this.$refs.activity.finish(member)
      }).catch(error => {
        this.$swal.alert(error.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-confirm {
  font-size: 1rem;
  border: none;
  background-color: transparent;
  font-weight: bold;
  color: #16adb9;
  padding: 0;
}
</style>
