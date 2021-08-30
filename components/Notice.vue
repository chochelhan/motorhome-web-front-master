<template>
  <div class="notice">
    <ul class="uk-nav-default uk-nav-parent-icon articles" uk-nav="multiple: true">
      <li v-for="article in articles" v-bind:key="article.articleNo">
        <a v-on:click.prevent="showArticle(article)" href="#" class="article">
          <div class="article-main">
            <div class="article-title">{{article.title}}</div>
            <div class="article-date">{{article.createdAt | formatDate}}</div>
          </div>
          <div class="article-icon">
            <span uk-icon="icon: chevron-right; ratio: 1.2;"></span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import NoticeArticleActivity from './activities/NoticeArticleActivity'
export default {
  name: 'Notice',
  data () {
    return {
      page: 1,
      articles: []
    }
  },
  methods: {
    showArticle (article) {
      this.$activity.start(NoticeArticleActivity, {
        id: article.articleNo
      })
    }
  },
  created () {
    this.$api.get(`/notices`, {
      params: {
        page: this.page,
        size: 10
      }
    }).then(response => {
      this.articles = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.notice {
  .articles {
    margin-top: 10px;
    padding: 0 20px 0 30px;
    list-style: none;
    .article {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      margin-top: 10px;
      .article-main {
        flex-grow: 1;
        width: calc(100% - 24px);
        .article-title {
          word-break: keep-all;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.85rem;
          font-weight: bold;
        }
        .article-date {
          font-size: 0.75rem;
          color: #959595;
        }
      }
      .article-icon {
        width: 24px;
        align-self: flex-start;
      }
    }
  }
}
</style>
