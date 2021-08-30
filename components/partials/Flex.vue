<template>
  <div class="partial-flex">
    <div v-on:scroll="infiniteScroll" class="partial-flex-container">
      <div class="partial-flex-title">
        <img src="../../assets/img/hot-issue-title.png"/>
      </div>
      <div class="partial-flex-header">
        <div class="partial-flex-summary">전체 {{count | numberFormat}}개</div>
        <tag-filter-button v-on:click.native="filterActivity" v-on:mousedown.stop v-on:touchstart.stop></tag-filter-button>
      </div>
      <filters v-model="filters" v-on:input="search" style="margin: 5px 21px 0;"></filters>
      <flexies
        ref="articles"
        v-on:update:loading="loading = $event"
        v-on:update:no-more="noMore = $event"
        v-bind:count.sync="count"
        class="uk-flex-1"
      ></flexies>
    </div>
    <safearea-bottom></safearea-bottom>
  </div>
</template>

<script>
import Filters from '../Filters'
import FilterActivity from '../activities/FilterActivity'
import Flexies from '../Flexies'
import TagFilterButton from '../TagFilterButton'
export default {
  name: 'Flex',
  components: {
    Filters,
    Flexies,
    TagFilterButton
  },
  data () {
    return {
      filters: [],
      loading: false,
      noMore: false,
      count: 0
    }
  },
  methods: {
    showArticle (article) {
      this.$activity.start(FaqArticleActivity, article)
    },
    filterActivity () {
      this.$activity.start(FilterActivity, {
        filters: this.filters,
        boardCode: '4000'
      }).then(filters => {
        if (filters) {
          this.filters = filters
          this.search()
        }
      })
    },
    loadMore () {
      this.$refs.articles.loadMore()
    },
    search () {
      this.$refs.articles.categories = this.filters
      this.$refs.articles.search()
    },
    infiniteScroll ($event) {
      let scrollRemain = $event.target.scrollHeight - ($event.target.offsetHeight + $event.target.scrollTop)
      if (scrollRemain < 100) {
        if (!this.loading) {
          this.loadMore()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.partial-flex {
  background-image: url('../../assets/img/flex-background.svg');
  background-color: #a6e7ed;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 8px 20px $footer-height + 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .partial-flex-container {
    min-height: calc(100% - #{$footer-height + 20px});
    border-radius: 36px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.18);
    padding-top: 20px;
    background-color: #ffffff;
    overflow-y: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .partial-flex-title {
      text-align: center;
    }
  }
  .partial-flex-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 0 20px 0;
    .partial-flex-summary {
      font-size: 0.7rem;
      color: #999999;
    }
    .btn-flex-filter {
      margin-left: 5px;
    }
    .partial-flex-sort {
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
      }
      &.desc {
        &::after {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
