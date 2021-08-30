<template>
  <div class="guidebook">
    <div v-on:mousedown.stop v-on:touchstart.stop class="guidebook-gallery">
      <div class="guidebook-gallery-container">
        <div v-for="book in books" v-bind:key="book.articleNo" v-on:click="showArticle(book)" v-html="book.title" class="guidebook-gallery-book"></div>
      </div>
    </div>
    <div class="guidebook-header">
      <div class="guidebook-summary">{{count | numberFormat}}개 가이드북</div>
      <div>
        <span v-if="this.sort === 'RECENT_DESC'" v-on:click="toggleSort" class="guidebook-sort">최신순</span>
        <span v-if="this.sort === 'LIKE_DESC'" v-on:click="toggleSort" class="guidebook-sort">인기순</span>
        <tag-filter-button v-on:click.native="filterActivity" v-on:mousedown.stop v-on:touchstart.stop></tag-filter-button>
      </div>
    </div>
    <filters v-model="filters" v-on:input="search" style="margin: 5px 21px 0;"></filters>
    <guidebooks
      ref="articles"
      v-bind:sort="sort"
      v-on:update:loading="loading = $event"
      v-on:update:no-more="noMore = $event"
      v-bind:count.sync="count"
      class="guidebook-articles"
    ></guidebooks>
  </div>
</template>

<script>
import Filters from '../Filters'
import FilterActivity from '../activities/FilterActivity'
import Grid from '../Grid'
import GridArticle from '../GridArticle'
import Guidebooks from '../Guidebooks'
import GuidebookArticleActivity from '../activities/GuidebookArticleActivity'
import TagFilterButton from '../TagFilterButton'

export default {
  name: 'Guidebook',
  components: {
    Filters,
    Grid,
    GridArticle,
    Guidebooks,
    TagFilterButton
  },
  data () {
    return {
      books: [],
      filters: [],
      count: 0,
      loading: false,
      noMore: false,
      asc: true,
      sort: 'RECENT_DESC'
    }
  },
  methods: {
    showArticle (article) {
      this.$activity.start(GuidebookArticleActivity, {
        id: article.articleNo
      })
    },
    filterActivity () {
      this.$activity.start(FilterActivity, {
        filters: this.filters,
        boardCode: '3000'
      }).then(filters => {
        if (filters) {
          this.filters = filters
          this.search()
        }
      })
    },
    toggleSort () {
      this.sort = (this.sort === 'LIKE_DESC' ? 'RECENT_DESC' : 'LIKE_DESC')
    },
    loadMore () {
      this.$refs.articles.loadMore()
    },
    search () {
      this.$refs.articles.categories = this.filters
      this.$refs.articles.search()
    }
  },
  created () {
    this.$api.get(`/guidebooks`, {
      params: {
        page: 1,
        size: 10,
        notice: true,
        sort: "ADMIN_ORDER_ASC"
      }
    }).then(response => {
      this.books = response.data

    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.guidebook {
  .guidebook-gallery {
    position: relative;
    height: 200px;
    background-image: linear-gradient(to bottom, #ffffff 55%, #808080 240%);
    .guidebook-gallery-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      display: flex;
      padding: 25px 21px 0;
      overflow-x: auto;
      .guidebook-gallery-book {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 113px;
        height: 160px;
        padding: 0 15px 10px;
        word-break: break-all;
        flex-shrink: 0;
        background-image: url(../../assets/img/book@2x.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 47px;
      background-image: linear-gradient(to top, #ffffff -40%, #808080 183%);
    }
  }
  .guidebook-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 20px 21px 0;
    background-image: linear-gradient(to bottom, #f2f2f2 -267%, #a5a5a5 -131%, #ffffff 50%);
    .guidebook-summary {
      font-size: 0.7rem;
      color: #999999;
    }
    .btn-guidebook-filter {
      margin-left: 5px;
    }
    .guidebook-sort {
      display: inline-flex;
      align-items: center;
      font-size: 0.7rem;
      &::after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 10px;
        margin-left: 2px;
        clip-path: polygon(100% 100%, 0 100%, 50% 0%);
        background-color: #000000;
        transform: rotate(180deg);
      }
    }
  }
  .guidebook-articles {
    padding: 0 20px #{20px + $footer-height};
  }
}
</style>
