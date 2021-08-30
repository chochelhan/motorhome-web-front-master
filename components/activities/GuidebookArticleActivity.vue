<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" v-bind:progress="scrollTop > 150 ? 1 : (scrollTop / 150)" back home overwrap without-safearea>
    <template v-slot:operations>
      <span
        uk-icon="icon: more; ratio: 1;"
        class="activity-operations"
      ></span>
      <div ref="dropdown" uk-dropdown="mode: click;">
        <ul class="uk-nav uk-dropdown-nav">
          <li>
            <button v-on:click="link" class="uk-button uk-button-link" style="display: block; width: 100%; padding: 5px 0; text-align: left;">
              <span uk-icon="link"></span>
              링크복사
            </button>
          </li>
        </ul>
      </div>
    </template>
    <template>
      <guidebook-article ref="article" v-bind:id="id" v-on:load="load" v-on:scroll="scroll" v-on:search="search"></guidebook-article>
    </template>
    <template v-slot:footer>
      <activity-article-footer
        v-bind:id="id"
        v-bind:likes="articleSummaryInfo.likeCount"
        v-bind:comments="articleSummaryInfo.commentCount"
        v-bind:scrapes="articleSummaryInfo.scrapCount"
        v-bind:liked="memberArticleSummaryInfo.liked"
        v-bind:commented="memberArticleSummaryInfo.commented"
        v-bind:scraped="memberArticleSummaryInfo.scraped"
        v-on:update="$refs.article.load()"
        shareable
        board-code="GUIDEBOOK"
      ></activity-article-footer>
    </template>
  </activity>
</template>

<script>
import UIkit from 'uikit'
import ActivityArticleFooter from '../ActivityArticleFooter'
import GuidebookArticle from '../GuidebookArticle'
export default {
  name: 'GuidebookArticleActivity',
  components: {
    ActivityArticleFooter,
    GuidebookArticle
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    likes: {
      default () {
        return 1712
      }
    },
    comments: {
      default () {
        return 25
      }
    },
    resolve: Function
  },
  data () {
    return {
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      scrollTop: 0
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    search (category) {
      this.finish()
      // jjong2028 ==> 익멍복원
      this.$router.push(`/search?keyword=${category}&tab=5`)
      // this.$router.push(`/search?keyword=${category}&tab=4`)
    },
    link () {
      this.$copyText(`${location.origin}/share?boardCode=3000&articleNo=${this.id}`)
      this.$swal.alert('복사되었습니다.')
      UIkit.dropdown(this.$refs.dropdown).hide(0)
    },
    scroll ($event) {
      this.scrollTop = $event.target.scrollTop
    },
    load (article) {
      this.articleSummaryInfo = article.articleSummaryInfo
      this.memberArticleSummaryInfo = article.memberArticleSummaryInfo
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.article-footer {
  font-size: 0.8rem;
  .comments {
    margin-left: $layout-margin;
  }
}
</style>
