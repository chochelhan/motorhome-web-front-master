<template>
  <div class="blanks">
    <div v-if="articles.length > 0" class="anonymous-articles">
      <div v-for="article in articles" v-bind:key="article.id" v-on:click="showArticle(article)" class="article">
        <div class="article-title">{{article.title}}</div>
        <div class="article-info uk-flex">
          <div class="article-user">{{article.nickname}}</div>
          <div class="article-views uk-flex-1" style="margin-left: 10px;">조회수 {{article.articleSummaryInfo.viewCount | numberFormat}}</div>
          <div class="article-good">
            <span uk-icon="icon: good;"></span>{{article.articleSummaryInfo.likeCount | numberFormat}}
          </div>
          <div class="article-bad" style="margin-left: 5px;">
            <span uk-icon="icon: bad;"></span>{{article.articleSummaryInfo.dislikeCount | numberFormat}}
          </div>
          <div class="article-comments" style="margin-left: 5px;">
            <span uk-icon="icon: app-comment;"></span>{{article.articleSummaryInfo.commentCount | numberFormat}}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="anonymous-articles empty">
      <strong>등록된 익멍이 없어요</strong>
      <div style="margin-top: 18px;">
        <button v-on:click="writeArticle" type="button" class="uk-button uk-button-primary uk-radius" style="word-break: keep-all; white-space: nowrap;">
          <span uk-icon="icon: app-write; ratio: 0.8;"></span>
          신규 작성하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AnonymousArticleActivity from './activities/AnonymousArticleActivity'
import AnonymousWriteActivity from './activities/AnonymousWriteActivity'
export default {
  name: 'Blanks',
  props: {
    keyword: String,
    memberNo: Number,
    activityType: String
  },
  data () {
    return {
      page: 1,
      articles: [],
      loading: false,
      noMore: false
    }
  },
  methods: {
    search (page = 1, clean = true) {
      this.$emit('update:loading', true)
      this.loading = true
      this.$api.get(`/blanks`, {
        params: {
          page: page,
          size: 15,
          activityType: this.activityType,
          keyword: this.keyword,
          memberNo: this.memberNo
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
      this.$activity.start(AnonymousArticleActivity, {
        id: article.articleNo
      }).then(data => {
        if (data && data.delete) {
          this.search()
        } else {
          this.updateArticle(article)
        }
      })
    },
    writeArticle () {
      this.$activity.start(AnonymousWriteActivity, {
      }).then(() => {
        this.search()
      })
    },
    updateArticle (article) {
      this.$api.get(`/blanks/${article.articleNo}`, {
        params: {
          viewed: false
        }
      }).then(response => {
        let index = this.articles.findIndex(_article => article.articleNo === _article.articleNo)
        this.articles.splice(index, 1, response.data)
      })
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
.blanks {
  display: flex;
  overflow-y: scroll;
  .anonymous-articles {
    flex-grow: 1;
    .article {
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
      .article-title {
        font-size: 0.8rem;
        font-weight: bold;
      }
      .article-info {
        font-size: 0.75rem;
        color: #bcbcbc;
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

