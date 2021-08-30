<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" v-bind:before-finish="beforeFinish" topaz back inverse-rounded without-safearea prevent-swipe>
    <template v-slot:header>다이어리 작성</template>
    <template v-slot:operations>
      <button v-on:click="next" class="uk-button uk-button-link leisure-diary-write-next">다음</button>
    </template>
    <template>
      <leisure-diary-write ref="form" v-bind:id="id"></leisure-diary-write>
    </template>
  </activity>
</template>

<script>
import LeisureDiaryWrite from '../LeisureDiaryWrite'
import LeisureDiaryWriteStep2Activity from './LeisureDiaryWriteStep2Activity'
export default {
  name: 'LeisureDiaryWriteActivity',
  components: {
    LeisureDiaryWrite
  },
  props: {
    resolve: Function,
    id: {
      type: Number
    }
  },
  data () {
    return {
      success: false,
      beforeFinish: () => new Promise((resolve, reject) => {
        if (this.success) {
          resolve()
        } else {
          if (this.$refs.form.proceed()) {
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
      this.$refs.form.check().then(() => {
        this.$activity.start(LeisureDiaryWriteStep2Activity, {
          categories: this.$refs.form.categories,
          visibility: this.$refs.form.access
        }).then(extra => {
          if (extra) {
            this.success = true
            this.$refs.form.categories = extra.categories
            this.$refs.form.access = extra.access
            this.$refs.form.confirm().then(data => {
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
.leisure-diary-write-next {
  font-weight: bold;
  text-decoration: none;
}
</style>
