<template>
  <div v-on:scroll="$emit('scroll', $event)" class="article">
    <div class="article-body" v-html="contents"></div>
  </div>
</template>

<script>
import Tags from './Tags'

export default {
  name: 'EventArticle',
  components: {
    Tags
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      contents: null,
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {}
    }
  },
  methods: {
    load (viewed = false) {
      this.$api.get(`/events/${this.id}`, {
        params: {
          viewed: viewed
        }
      }).then(response => {
        this.contents = response.data.contents
        this.articleSummaryInfo = response.data.articleSummaryInfo
        this.memberArticleSummaryInfo = response.data.memberArticleSummaryInfo
        this.$emit('load', {
          articleSummaryInfo: this.articleSummaryInfo,
          memberArticleSummaryInfo: this.memberArticleSummaryInfo
        })
      })
    }
  },
  created () {
    this.load(true)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.article {
  .article-header {
    padding: $layout-margin;
    h2 {
      font-size: 1rem;
      font-weight: bold;
      margin: 0;
    }
    .article-info {
      margin-top: $content-margin;
      font-size: 0.75rem;
      display: flex;
      .article-view-count {
        margin-left: $layout-margin;
      }
    }
    .article-tags {
      margin-top: $content-margin;
    }
  }
  .article-body {
    padding: 0;
    font-size: 0.8rem;
  }
}
</style>
