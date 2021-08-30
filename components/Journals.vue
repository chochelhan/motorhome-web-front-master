<template>
  <div class="journals">
    <div v-if="articles.length > 0" class="articles">
      <div
        v-for="article in articles"
        v-bind:key="article.articleNo"
        v-bind:data-src="article.mainImageUrl + '?380by200'"
        v-on:click="showArticle(article)"
        uk-img
        class="article uk-background-cover uk-flex uk-flex-bottom"
      >
        <div class="uk-flex uk-flex-between uk-flex-1 article-info">
          <div v-html="article.title.replace(/\n/g, '<br/>')"></div>
          <div>
            <span v-if="article.isScraped" v-on:click.stop="scrape(article)" uk-icon="icon: app-bookmark-fill;" class="bookmark-active"></span>
            <span v-else v-on:click.stop="scrape(article)" uk-icon="icon: app-bookmark;"></span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="articles empty">
      <strong>등록된 전문가저널이 없어요</strong>
    </div>
  </div>
</template>

<script>
import JournalArticleActivity from './activities/JournalArticleActivity'
export default {
  name: 'Journals',
  props: {
    keyword: String,
    activityType: String
  },
  data () {
    return {
      articles: [],
      categories: [],
      loading: false,
      noMore: false
    }
  },
  methods: {
    search (page = 1, clean = true) {
      this.loading = true
      this.$emit('update:loading', true)
      this.$api.get(`/journals`, {
        params: {
          page: page,
          activityType: this.activityType,
          categories: this.categories.join(','),
          size: 10,
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
      this.$activity.start(JournalArticleActivity, {
        id: article.articleNo
      }).then(() => {
        this.$api.get(`/journals/${article.articleNo}`, {
          params: {
            viewed: false
          }
        }).then(response => {
          let index = this.articles.findIndex(_article => _article.articleNo === article.articleNo)
          this.articles[index] = response.data
          this.$forceUpdate()
        })
      })
    },
    scrape (article) {
      if (article.isScraped) {
        this.$api.delete(`/scraps`, {
          params: {
            articleNo: article.articleNo
          }
        }).then(response => {
          article.isScraped = false
        })
      } else {
        this.$api.post(`/scraps`, {
          articleNo: article.articleNo
        }).then(response => {
          article.isScraped = true
        })
      }
    },
    loadMore () {
      this.search(this.page + 1, false)
    }
  },
  created () {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.journals {
  display: flex;
  flex-direction: column;
  .articles {
    .article {
      margin-top: 1px;
      height: 200px;
      color: #ffffff;
      .article-info {
        padding: 15px 20px;
        background-color: rgba(0, 0, 0, 0.21);
        .bookmark-active {
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
  }
}
</style>