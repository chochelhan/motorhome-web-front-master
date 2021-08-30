<template>
  <div class="notice">
    <div class="article-header">
      <div class="article-title">{{title}}</div>
      <div class="article-info">
        <div class="article-date">{{createdAt | formatDate}}</div>
        <div class="article-views">조회 {{articleSummaryInfo.viewCount | numberFormat}}</div>
      </div>
    </div>
    <div v-html="contents" class="article-contents"></div>
  </div>
</template>

<script>
export default {
  name: 'NoticeArticle',
  props: {
    id: {
      required: true
    }
  },
  data () {
    return {
      title: null,
      createdAt: null,
      articleSummaryInfo: {},
      contents: null
    }
  },
  created () {
    this.$api.get(`/notices/${this.id}`, {
      params: {
        viewed: true
      }
    }).then(response => {
      this.title = response.data.title
      this.createdAt = response.data.createdAt
      this.articleSummaryInfo = response.data.articleSummaryInfo
      this.contents = response.data.contents
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.notice {
  .article-header {
    padding: 13px 20px 0;
    .article-title {
      font-size: 0.9rem;
      font-weight: bold;
    }
    .article-info {
      display: flex;
      font-size: 0.75rem;
      color: #5d5d5d;
      .article-views {
        margin-left: 20px;
      }
    }
  }
  .article-contents {
    padding: 20px;
    margin: 10px;
    border-radius: 20px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    color: #585858;
    font-size: 0.9rem;
  }
}
</style>
