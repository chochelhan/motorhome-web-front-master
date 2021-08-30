<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" v-bind:progress="scrollTop > 150 ? 1 : (scrollTop / 150)" back home overwrap without-safearea>
    <template v-slot:operations>
      <span
        uk-icon="icon: more; ratio: 1;"
        class="activity-operations"
      ></span>
      <div ref="dropdown" uk-dropdown="mode: click;">
        <ul class="uk-nav uk-dropdown-nav">
          <li v-if="owner">
            <button v-on:click="edit" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left;">
              <span uk-icon="pencil"></span>
              글 수정
            </button>
          </li>
          <li v-if="owner">
            <button v-on:click="remove" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left;">
              <span uk-icon="close"></span>
              글 삭제
            </button>
          </li>
          <li>
            <button v-on:click="link" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left;">
              <span uk-icon="link"></span>
              링크복사
            </button>
          </li>
          <li>
            <button v-on:click="block" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left;" v-if="!owner">
              <span uk-icon="ban"></span>
              차단하기
            </button>
          </li>
          <li>
            <button v-on:click="report" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left;">
              <span uk-icon="warning"></span>
              신고하기
            </button>
          </li>
        </ul>
      </div>
    </template>
    <template>
      <div>
        <leisure-diary-article ref="article" v-on:load="load" v-on:scroll="scroll" v-on:search="search" v-bind:id="id" class="article"></leisure-diary-article>
      </div>
    </template>
    <template v-slot:footer>
      <activity-article-footer
        v-bind:id="id"
        v-bind:creator-no="creatorInfo.creatorNo"
        v-bind:likes="articleSummaryInfo.likeCount"
        v-bind:comments="articleSummaryInfo.commentCount"
        v-bind:scrapes="articleSummaryInfo.scrapCount"
        v-bind:liked="memberArticleSummaryInfo.liked"
        v-bind:commented="memberArticleSummaryInfo.commented"
        v-bind:scraped="memberArticleSummaryInfo.scraped"
        v-on:update="$refs.article.load()"
        shareable
        board-code="DIARY"
      ></activity-article-footer>
    </template>
  </activity>
</template>

<script>
import UIkit from 'uikit'
import ActivityArticleFooter from '../ActivityArticleFooter'
import LeisureDiaryWriteActivity from './LeisureDiaryWriteActivity'
import LeisureDiaryArticle from '../LeisureDiaryArticle'
import ReportActivity from './ReportActivity'

export default {
  name: 'LeisureDiaryArticleActivity',
  components: {
    ActivityArticleFooter,
    LeisureDiaryArticle
  },
  props: {
    id: {},
    resolve: Function
  },
  data () {
    return {
      scrollTop: 0,
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      creatorInfo: {},
      owner: false
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    link () {
      this.$copyText(`${location.origin}/share?boardCode=1000&articleNo=${this.id}`)
      this.$swal.alert('복사되었습니다.')
      UIkit.dropdown(this.$refs.dropdown).hide(0)
    },
    block() {
      this.$swal.confirm('이 회원의 모든 게시물을 숨길까요? 이 동작은 취소할 수 없습니다.').then(() => {
        this.$api.put(`/block/${this.creatorInfo.creatorNo}`).then(() => {
          this.$refs.activity.finish({
            delete: true
          })
        })
      })
    },
    report () {
      this.$activity.start(ReportActivity, {
        articleNo: this.id
      })
    },
    load (article) {
      this.articleSummaryInfo = article.articleSummaryInfo
      this.memberArticleSummaryInfo = article.memberArticleSummaryInfo
      this.creatorInfo = article.creatorInfo
      this.owner = article.owner
    },
    remove () {
      this.$swal.confirm('다이어리를 삭제하시겠습니까?').then(() => {
        this.$api.delete(`/leisure-diaries/${this.id}`).then(() => {
          this.$refs.activity.finish({
            delete: true
          })
        })
      })
    },
    search (category) {
      this.finish()
      this.$router.push(`/search?keyword=${category}&tab=1`)
    },
    edit () {
      this.$activity.start(LeisureDiaryWriteActivity, {
        id: this.id
      }).then(() => {
        this.$refs.article.load()
      })
    },
    scroll ($event) {
      this.scrollTop = $event.target.scrollTop
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.uk-dropdown-nav {
  button {
    padding: 5px 0;
  }
}
</style>
