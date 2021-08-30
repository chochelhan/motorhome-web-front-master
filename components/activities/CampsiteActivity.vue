<template>
  <activity ref="activity" v-on:finish="finish" back home without-safearea>
    <template v-slot:header>이 캠핑지의 자세한 정보에요!</template>
    <template>
      <safearea-top></safearea-top>
      <campsite ref="article" v-on:load="load" v-bind:id="id" v-bind:position="position"></campsite>
      <safearea-bottom></safearea-bottom>
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
        board-code="CAMPSITE"
      ></activity-article-footer>
    </template>
  </activity>
</template>

<script>
import ActivityArticleFooter from '../ActivityArticleFooter'
import Campsite from '../Campsite'
export default {
  name: 'CampsiteActivity',
  components: {
    ActivityArticleFooter,
    Campsite
  },
  props: {
    id: [Number, String],
    position: {
      type: Object,
      default () {
        return this.$store.state.app.location
      }
    },
    update: Function
  },
  data () {
    return {
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {}
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    load (article) {
      if (this.update) {
        this.update(article)
      }
      this.articleSummaryInfo = article.articleSummaryInfo
      this.memberArticleSummaryInfo = article.memberArticleSummaryInfo
    }
  }
}
</script>
