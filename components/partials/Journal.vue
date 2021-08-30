<template>
  <div class="journal">
    <div class="journal-header uk-flex uk-flex-between">
      <div>전체 {{count | numberFormat}}</div>
      <div>
        <tag-filter-button v-on:click.native="filterActivity" v-on:mousedown.stop v-on:touchstart.stop></tag-filter-button>
      </div>
    </div>
    <filters v-model="filters" v-on:input="search" style="margin-top: 5px;"></filters>
    <journals
      ref="articles"
      v-on:update:loading="loading = $event"
      v-on:update:no-more="noMore = $event"
      class="articles"
    ></journals>
  </div>
</template>

<script>
import Filters from '../Filters'
import FilterActivity from '../activities/FilterActivity'
import TagFilterButton from '../TagFilterButton'
import Journals from '../Journals'
export default {
  name: 'Journal',
  components: {
    Journals,
    TagFilterButton,
    Filters
  },
  data () {
    return {
      count: 0,
      loading: false,
      noMore: false,
      filters: []
    }
  },
  methods: {
    filterActivity () {
      this.$activity.start(FilterActivity, {
        filters: this.filters,
        boardCode: '2000'
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
    }
  },
  created () {
    this.$api.get(`/journals/count`).then(response => {
      this.count = response.data.count
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.journal {
  padding: 20px 20px #{20px + $footer-height};
  .journal-header {
    margin: -20px -20px 0;
    padding: 13px 20px 0;
    font-size: 0.7rem;
  }
  .articles {
    margin: 13px -20px 0;
  }
}
</style>