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
      <journal-article ref="article" v-bind:id="id" v-on:load="load" v-on:scroll="scroll" v-on:search="search"></journal-article>
    </template>
    <template v-slot:footer>
      <activity-article-footer
        v-bind:id="id"
        v-bind:creator-no="targetMemberInfo.creatorNo"
        v-bind:likes="articleSummaryInfo.likeCount"
        v-bind:comments="articleSummaryInfo.commentCount"
        v-bind:scrapes="articleSummaryInfo.scrapCount"
        v-bind:liked="memberArticleSummaryInfo.liked"
        v-bind:commented="memberArticleSummaryInfo.commented"
        v-bind:scraped="memberArticleSummaryInfo.scraped"
        v-on:update="$refs.article.load()"
        shareable
        board-code="JOURNAL"
      ></activity-article-footer>
    </template>
  </activity>
</template>

<script>
import UIkit from 'uikit'
import ActivityArticleFooter from '../ActivityArticleFooter'
import JournalArticle from '../JournalArticle'
export default {
  name: 'JournalArticleActivity',
  components: {
    ActivityArticleFooter,
    JournalArticle
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    resolve: Function
  },
  data () {
    return {
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      targetMemberInfo: {},
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
      this.$router.push(`/search?keyword=${category}&tab=4`)
      // this.$router.push(`/search?keyword=${category}&tab=3`)
    },
    link () {
      this.$copyText(`${location.origin}/share?boardCode=2000&articleNo=${this.id}`)
      this.$swal.alert('복사되었습니다.')
      UIkit.dropdown(this.$refs.dropdown).hide(0)
    },
    scroll ($event) {
      this.scrollTop = $event.target.scrollTop
    },
    load (article) {
      this.articleSummaryInfo = article.articleSummaryInfo
      this.memberArticleSummaryInfo = article.memberArticleSummaryInfo
      this.targetMemberInfo = article.targetMemberInfo
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
