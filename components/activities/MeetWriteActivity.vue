<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" v-bind:before-finish="beforeFinish" topaz back inverse-rounded without-safearea prevent-swipe>
    <template v-slot:header>{{title}}</template>
    <template v-slot:operations>
      <strong v-on:click="next">다음</strong>
    </template>
    <template>
      <meet-write ref="writer" v-bind:id="id"></meet-write>
    </template>
  </activity>
</template>

<script>
import MeetWrite from '../MeetWrite'
import MeetWriteStep2Activity from './MeetWriteStep2Activity'
export default {
  name: 'MeetWriteActivity',
  components: {
    MeetWrite
  },
  props: {
    id: [Number, String],
    title: String,
    resolve: Function
  },
  data () {
    return {
      success: false,
      beforeFinish: () => new Promise((resolve, reject) => {
        if (this.success) {
          resolve()
        } else {
          if (this.$refs.writer.proceed()) {
            this.$swal.confirm('페이지를 이탈하시겠습니까?\n저장하지 않은 내용은 삭제됩니다.\n계속 진행하시겠습니까?').then(resolve).catch(reject)
          } else {
            resolve()
          }
        }
      })
    }
  },
  methods: {
    next () {
      this.$refs.writer.check().then(() => {
        this.$activity.start(MeetWriteStep2Activity, {
          value: {
            categories: this.$refs.writer.categories
          },
        }).then(extra => {
          if (extra) {
            this.success = true
            this.$refs.writer.categories = extra.categories
            this.$refs.writer.confirm().then(data => {
              this.$refs.activity.finish(data.articleNo)
            })
          }
        })
      }).catch(error => {
        this.$swal.alert(error.message)
      })
    },
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
</style>
