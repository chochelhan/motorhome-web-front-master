<template>
  <div class="guidebooks">
    <div v-if="articles.length > 0" class="guidebook-articles">
      <div v-for="article in articles" v-bind:key="article.articleNo" v-on:click="showArticle(article)" class="guidebook-article">
        <div v-bind:style="{'background-image': 'url(' + article.mainImageUrl + '?100by60)'}" class="guidebook-article-cover"></div>
        <div class="guidebook-article-main">
          <div class="guidebook-article-title">{{article.title}}</div>
          <div class="guidebook-article-extra">
            <div class="guidebook-article-views">조회수 {{article.articleSummaryInfo.viewCount | numberFormat}}</div>
            <div class="guidebook-article-bookmarks">북마크 {{article.articleSummaryInfo.scrapCount | numberFormat}}</div>
          </div>
        </div>
        <div class="guidebook-article-action">
          <span v-if="article.memberArticleSummaryInfo.scraped" v-on:click.stop="bookmark(article)" uk-icon="icon: app-bookmark-fill; ratio: 0.8;" class="guidebook-article-bookmark-active"></span>
          <span v-else v-on:click.stop="bookmark(article)" uk-icon="icon: app-bookmark; ratio: 0.8;" class="guidebook-article-bookmark"></span>
        </div>
      </div>
    </div>
    <div v-else class="guidebook-articles empty">
      <strong>등록된 가이드북이 없어요</strong>
    </div>
  </div>
</template>

<script>
import GuidebookArticleActivity from './activities/GuidebookArticleActivity'

export default {
  name: 'Guidebooks',
  props: {
    sort: String,
    count: Number,
    keyword: String,
    activityType: String
  },
  data () {
    return {
      page: 1,
      articles: [],
      categories: [],
      loading: false,
      noMore: false
    }
  },
  methods: {
    search (page = 1, clean = true) {
      this.$emit('update:loading', true)
      this.loading = true
      this.$api.get(`/guidebooks/count`).then(response => {
        this.$emit('update:count', response.data.count)
      })
      this.$api.get(`/guidebooks`, {
        params: {
          page: page,
          size: 10,
          activityType: this.activityType,
          categories: this.categories.join(','),
          sort: this.sort,
          keyword: this.keyword
        }
      }).then(response => {
        this.$emit('update:no-more', true)
        this.noMore = true
        if (clean) {
          this.articles = []
        }
        if (response.data && response.data.length > 0) {
          this.page = page
          response.data.forEach(article => {
            this.articles.push(article)
          })
          this.$emit('update:loading', false)
          this.$emit('update:no-more', false)
          this.loading = false
          this.noMore = false
        }
      })
    },
    showArticle (article) {
      this.$activity.start(GuidebookArticleActivity, {
        id: article.articleNo
      }).then(() => {
        this.updateArticle(article.articleNo)
      })
    },
    bookmark (article) {
      if (article.memberArticleSummaryInfo.scraped) {
        this.$api.delete(`/scraps`, {
          params: {
            articleNo: article.articleNo
          }
        }).then(() => {
          article.memberArticleSummaryInfo.scraped = false
          this.updateArticle(article.articleNo)
        })
      } else {
        this.$api.post(`/scraps`, {
          articleNo: article.articleNo
        }).then(() => {
          article.memberArticleSummaryInfo.scraped = true
          this.updateArticle(article.articleNo)
        })
      }
    },
    updateArticle (articleNo) {
      this.$api.get(`/guidebooks/${articleNo}`, {
        params: {
          viewed: false
        }
      }).then(response => {
        let index = this.articles.findIndex(_article => _article.articleNo === articleNo)
        this.articles.splice(index, 1, response.data)
      })
    },
    loadMore () {
      this.search(this.page + 1, false)
    }
  },
  created () {
    this.search()
  },
  watch: {
    sort (newVal, oldVal) {
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.guidebooks {
  display: flex;
  flex-direction: column;
  .guidebook-articles {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
    margin-top: 5px;
    .guidebook-article {
      display: flex;
      .guidebook-article-cover {
        width: 95px;
        height: 58px;
        flex-shrink: 0;
        border-radius: 5px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      .guidebook-article-main {
        flex-grow: 1;
        margin-left: 10px;
        .guidebook-article-title {
          font-size: 0.85rem;
          font-weight: bold;
        }
        .guidebook-article-extra {
          margin-top: 5px;
          font-size: 0.7rem;
          display: flex;
          .guidebook-article-bookmarks {
            margin-left: 10px;
          }
        }
      }
      .guidebook-article-action {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        .guidebook-article-bookmark-active {
          color: $global-primary-color;
        }
      }
    }
  }
  .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
    padding: 0;
    margin: 0;
  }
}
</style>
