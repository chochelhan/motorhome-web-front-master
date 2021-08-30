<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" v-bind:progress="scrollTop > 150 ? 1 : (scrollTop / 150)" overwrap without-safearea back>
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
      <meet-article ref="article" v-bind:id="id" v-on:load="load" v-on:search="search" v-on:scroll="scroll"></meet-article>
    </template>
    <template v-slot:footer>
      <activity-article-footer
        v-bind:id="id"
        v-bind:creator-no="creatorInfo.creatorNo"
        v-bind:comments="(memberArticleSummaryInfo.liked || owner) ? articleSummaryInfo.commentCount : undefined"
        v-bind:scrapes="articleSummaryInfo.scrapCount"
        v-bind:commented="memberArticleSummaryInfo.commented"
        v-bind:scraped="memberArticleSummaryInfo.scraped"
        v-on:update="$refs.article.load()"
        shareable
        board-code="CLUB"
      ></activity-article-footer>
    </template>
  </activity>
</template>

<script>
import UIkit from 'uikit'
import ActivityArticleFooter from '../ActivityArticleFooter'
import MeetArticle from '../MeetArticle'
import MeetWriteActivity from './MeetWriteActivity'
import ReportActivity from './ReportActivity'

export default {
  name: 'MeetArticleActivity',
  components: {
    ActivityArticleFooter,
    MeetArticle
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    resolve: Function,
    likes: {
      default () {
        return 1712
      }
    },
    comments: {
      default () {
        return 25
      }
    }
  },
  data () {
    return {
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      creatorInfo: {},
      owner: false,
      scrollTop: 0
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    load (article) {
      this.articleSummaryInfo = article.articleSummaryInfo
      this.memberArticleSummaryInfo = article.memberArticleSummaryInfo
      this.creatorInfo = article.creatorInfo
      this.owner = article.owner
    },
    edit () {
      this.$activity.start(MeetWriteActivity, {
        id: this.id
      }).then(() => {
        this.$refs.article.load()
      })
    },
    remove () {
      this.$swal.confirm('리폼클럽을 삭제하시겠습니까?').then(() => {
        this.$api.delete(`/reform-clubs/${this.id}`).then(() => {
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
    search (category) {
      this.finish()
      this.$router.push(`/search?keyword=${category}&tab=2`)
    },
    link () {
      this.$copyText(`${location.origin}/share?boardCode=6000&articleNo=${this.id}`)
      this.$swal.alert('복사되었습니다.')
      UIkit.dropdown(this.$refs.dropdown).hide(0)
    },
    report () {
      this.$activity.start(ReportActivity, {
        articleNo: this.id
      })
    },
    scroll ($event) {
      this.scrollTop = $event.target.scrollTop
    }
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
