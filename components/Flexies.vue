<template>
  <div class="flexies">
    <div v-if="flexies.length > 0" class="articles">
      <div v-for="flex in flexies" v-bind:key="flex.articleNo" v-on:click="showArticle(flex)" class="flex">
        <div class="flex-date">
          <div class="flex-year">{{flex.createdAt | formatDate('YYYY')}}</div>
          <div class="flex-month-date">{{flex.createdAt | formatDate('MMDD')}}</div>
        </div>
        <div v-bind:style="{'background-image': 'url(' + flex.mainImageUrl + '?300by120)'}" class="flex-cover"></div>
      </div>
    </div>
    <div v-else class="articles empty">
      <strong>등록된 FLEX가 없어요</strong>
    </div>
  </div>
</template>

<script>
import FlexArticleActivity from './activities/FlexArticleActivity'
export default {
  name: 'Flexies',
  props: {
    keyword: String,
    activityType: String
  },
  data () {
    return {
      page: 1,
      flexies: [],
      categories: [],
      loading: false,
      noMore: false
    }
  },
  methods: {
    getYear (date) {
      return this.$moment(date).format('YYYY')
    },
    getMonthDate (date) {
      return this.$moment(date).format('MMDD')
    },
    showArticle (article) {
      this.$activity.start(FlexArticleActivity, {
        id: article.articleNo
      })
    },
    search (page = 1, clean = true) {
      this.$emit('update:loading', true)
      this.loading = true
      this.$api.get(`/flexs/count`).then(response => {
        this.$emit('update:count', response.data.count)
      })
      this.$api.get(`/flexs`, {
        params: {
          page: page,
          categories: this.categories.join(',') || null,
          activityType: this.activityType,
          size: 10,
          sort: this.sort,
          keyword: this.keyword
        }
      }).then(response => {
        this.$emit('update:no-more', true)
        this.noMore = true
        if (clean) {
          this.flexies = []
        }
        if (response.data && response.data.length > 0) {
          this.page = page
          response.data.forEach(article => {
            this.flexies.push(article)
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
.flexies {
  display: flex;
  flex-direction: column;
  .articles {
    margin-top: 10px;
    padding: 0 25px 25px;
    .flex {
      .flex-date {
        display: flex;
        justify-content: center;
        font-weight: bold;
        font-style: italic;
        .flex-year {
          color: #165db9;
        }
        .flex-month-date {
          color: #ff1c4c;
        }
      }
      .flex-cover {
        height: 115px;
        background-size: cover;
        background-position: center;
        border-radius: 15px;
      }
    }
  }
  .empty {
    margin-top: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
  }
}
</style>
