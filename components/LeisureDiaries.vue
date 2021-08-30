<template>
  <div class="diaries">
    <grid v-if="articles.length > 0" v-bind:data="articles" columns="2">
      <template v-slot:default="diary">
        <grid-article
          v-bind:title="diary.title"
          v-bind:member-no="diary.creatorInfo.creatorNo"
          v-bind:cover="diary.mainImageUrl"
          v-bind:tags="diary.categories"
          v-bind:profile="diary.creatorInfo.profileImageUrl || '/img/icon-profile.png'"
          v-bind:date="diary.createdAt"
          v-bind:column="2"
          v-on:click.native="showArticle(diary)"
          cover-size="200by200"
        ></grid-article>
      </template>
    </grid>
    <div v-else class="empty">
      <strong>등록된 다이어리가 아직 없어요</strong>
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
import Grid from './Grid'
import GridArticle from './GridArticle'
import LeisureDiaryWriteActivity from './activities/LeisureDiaryWriteActivity'
import LeisureDiaryArticleActivity from './activities/LeisureDiaryArticleActivity'
export default {
  name: 'LeisureDiaries',
  components: {
    Grid,
    GridArticle
  },
  props: {
    memberNo: Number,
    keyword: String,
    activityType: String,
    sort: String,
    campsiteNo: Number
  },
  data () {
    return {
      articles: [],
      filters: [],
      page: 1,
      loading: false,
      noMore: false,
      count: 0
    }
  },
  methods: {
    writeArticle () {
      this.$activity.start(LeisureDiaryWriteActivity, {}).then((article) => {
        this.search()
      })
    },
    showArticle (article) {
      this.$activity.start(LeisureDiaryArticleActivity, {
        id: article.articleNo
      }).then(data => {
        if (data) {
          if (data.category) {
            this.filters = [data.category]
            this.search()
            this.$emit('search', data.category)
          }
          if (data.delete) {
            this.search()
          }
        } else {
          this.updateArticle(article)
        }
      })
    },
    updateArticle (article) {
      this.$api.get(`/leisure-diaries/${article.articleNo}`, {
        params: {
          viewed: false
        }
      }).then(response => {
        let index = this.articles.findIndex(_article => article.articleNo === _article.articleNo)
        this.articles.splice(index, 1, response.data)
      })
    },
    search (page = 1, clean = true) {
      this.$emit('update:loading', true)
      this.loading = true
      this.$api.get(`/leisure-diaries/count`, {
        params: {
          categories: this.filters.join(','),
          campsiteNo: this.campsiteNo
        }
      }).then(response => {
        this.count = response.data.count
        this.$emit('update:count', this.count)
      })
      this.$api.get(`/leisure-diaries`, {
        params: {
          page: page,
          size: 10,
          keyword: this.keyword,
          activityType: this.activityType,
          categories: this.filters.join(','),
          sort: this.sort,
          campsiteNo: this.campsiteNo
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
.diaries {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
  }
}
</style>
