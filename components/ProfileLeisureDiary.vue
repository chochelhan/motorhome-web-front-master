<template>
  <div class="uk-flex mypage-diary">
    <grid v-if="diaries.length > 0" v-bind:data="diaries" columns="2">
      <template v-slot:default="diary">
        <grid-article v-bind:title="diary.title" v-bind:cover="diary.cover"></grid-article>
      </template>
    </grid>
    <div v-else class="uk-flex uk-flex-1 uk-flex-column uk-flex-center uk-flex-middle uk-text-center">
      <div>작성한 레저 다이어리가 없습니다.</div>
      <div v-if="isMine">
        <div>
          <button v-on:click="writeDiary" type="button" class="uk-button uk-button-default">
            <span uk-icon="icon: pencil;"></span> 신규 작성하기
          </button>
        </div>
        <div>
          <button type="button" class="uk-button uk-button-default">레저 다이어리를 소개합니다</button>
        </div>
      </div>
    </div>
    <fab v-on:click="writeDiary">작성</fab>
  </div>
</template>

<script>
import Fab from './Fab'
import Grid from './Grid'
import GridArticle from './GridArticle'
import LeisureDiaryWriteActivity from './activities/LeisureDiaryWriteActivity'

export default {
  name: 'ProfileLeisureDiary',
  components: {
    Fab,
    Grid,
    GridArticle
  },
  props: {
    isMine: Boolean
  },
  data () {
    return {
      diaries: []
    }
  },
  methods: {
    writeDiary () {
      this.$activity.start(LeisureDiaryWriteActivity, {}).then(result => {
        if (result) {
          this.search()
        }
      })
    },
    search () {
      let me = this.$session.getUserProfile();
      this.$api.get(`/leisure-diaries`, {
        params: {
          page: 1,
          size: 10,
          memberNo: me.memberNo
        }
      }).then(response => {
        this.diaries.splice(0)
        response.data.forEach(diary => {
          let badges = []
          if (diary.isPublic) {
            badges.push('비공개')
          }
          this.diaries.push({
            title: diary.title,
            cover: diary.mainImageUrl,
            link: null,
            badges: badges
          })
        })
        this.$emit('empty', this.diaries.length < 1)
      }).catch(error => {
        this.$emit('empty', true)
      })
    }
  },
  created () {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

</style>
