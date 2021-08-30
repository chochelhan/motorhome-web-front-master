<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" back home dark inverse-rounded without-safearea>
    <template v-slot:operations>
      <span
        uk-icon="icon: more; ratio: 1;"
        class="activity-operations"
      ></span>
    </template>
    <template v-slot:extra>
      <div ref="dropdown" uk-dropdown="toggle: .activity-operations; mode: click;">
        <ul class="uk-nav uk-dropdown-nav">
          <li v-if="owner">
            <button v-on:click="edit" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left; color: #595959;">
              <span uk-icon="pencil"></span>
              글 수정
            </button>
          </li>
          <li v-if="owner">
            <button v-on:click="remove" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left; color: #595959;">
              <span uk-icon="close"></span>
              글 삭제
            </button>
          </li>
          <li>
            <button v-on:click="link" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left; color: #595959;">
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
    <template v-slot:default>
      <anonymous-article ref="article" v-bind:id="id" v-on:load="load"></anonymous-article>
    </template>
    <template v-slot:footer>
      <activity-article-footer
        v-bind:id="id"
        v-bind:creator-no="creatorInfo.creatorNo"
        v-bind:upvotes="articleSummaryInfo.likeCount"
        v-bind:downvotes="articleSummaryInfo.dislikeCount"
        v-bind:comments="articleSummaryInfo.commentCount"
        v-bind:liked="memberArticleSummaryInfo.liked"
        v-bind:disliked="memberArticleSummaryInfo.disliked"
        v-bind:commented="memberArticleSummaryInfo.commented"
        v-on:update="$refs.article.load()"
        board-code="BLANK"
      ></activity-article-footer>
    </template>
  </activity>
</template>

<script>
import UIkit from 'uikit'
import AnonymousArticle from '../AnonymousArticle'
import AnonymousWriteActivity from './AnonymousWriteActivity'
import ActivityArticleFooter from '../ActivityArticleFooter'
import ReportActivity from './ReportActivity'

export default {
  name: 'AnonymousArticleActivity',
  components: {
    AnonymousArticle,
    ActivityArticleFooter
  },
  props: {
    id: [Number, String],
    resolve: Function
  },
  data () {
    return {
      owner: false,
      creatorInfo: {},
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {}
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    load (article) {
      this.owner = article.owner
      this.creatorInfo = article.creatorInfo
      this.articleSummaryInfo = article.articleSummaryInfo
      this.memberArticleSummaryInfo = article.memberArticleSummaryInfo
    },
    edit () {
      this.$activity.start(AnonymousWriteActivity, {
        id: this.id
      }).then(() => {
        this.$refs.article.load()
      })
    },
    remove () {
      this.$swal.confirm('익멍을 삭제하시겠습니까?').then(() => {
        this.$api.delete(`/blanks/${this.id}`).then(() => {
          this.$refs.activity.finish({
            delete: true
          })
        })
      })
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
    link () {
      this.$copyText(`${location.origin}/share?boardCode=7000&articleNo=${this.id}`)
      this.$swal.alert('복사되었습니다.')
      UIkit.dropdown(this.$refs.dropdown).hide(0)
    },
    report () {
      this.$activity.start(ReportActivity, {
        articleNo: this.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
</style>
