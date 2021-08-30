<template>
  <div class="partial-event" v-on:scroll="infiniteScroll">
    <events
      ref="articles"
      v-on:update:loading="loading = $event"
      v-on:update:no-more="noMore = $event"
    ></events>
  </div>
</template>

<script>
import Events from '../Events'
export default {
  name: 'PartialEvent',
  components: {
    Events
  },
  data () {
    return {
      loading: false,
      noMore: false
    }
  },
  methods: {
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
.partial-event {
  padding-bottom: $footer-height + 20px;
}
</style>
