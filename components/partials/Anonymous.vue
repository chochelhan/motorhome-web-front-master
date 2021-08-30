<template>
  <div id="anonymous">
    <div v-on:click="$activity.article('NOTICE', 2676)" class="anonymous-notice">
      <div>공지</div>
      <div style="margin: 0 10px;">|</div>
      <div>익명게시판 사용에 대한 규정 안내해 드립니다.</div>
    </div>
    <div class="button-list" style="margin-top: 20px;">
      <button
        v-bind:class="{active: activityType === null}"
        v-on:click="setActivityType(null)"
        type="button" style="width: 75px; height: 30px;"
      >전체</button>
      <button
        v-bind:class="{active: activityType === 'MY_WRITTEN'}"
        v-on:click="setActivityType('MY_WRITTEN')"
        type="button" style="width: 75px; height: 30px;"
      >내가만든</button>
      <button
        v-bind:class="{active: activityType === 'MY_COMMENTED'}"
        v-on:click="setActivityType('MY_COMMENTED')"
        type="button" style="width: 75px; height: 30px;"
      >댓글단</button>
    </div>
    <anonymouses
      ref="articles"
      v-on:update:loading="loading = $event"
      v-on:update:no-more="noMore = $event"
      v-bind:activity-type="activityType"
      style="margin-top: 20px;"
    ></anonymouses>
    <fab v-on:click="writeArticle" style="right: calc(100vw * 3 + 15px);">
      <span uk-icon="icon: app-write;"></span>
      <div style="font-size: 0.65rem; font-weight: bold;">글쓰기</div>
    </fab>
  </div>
</template>

<script>
import AnonymousWriteActivity from '../../components/activities/AnonymousWriteActivity'
import Anonymouses from '../../components/Anonymouses'
import Fab from '../../components/Fab'
export default {
  name: 'PartialAnonymous',
  components: {
    Fab,
    Anonymouses
  },
  data () {
    return {
      activityType: null,
      articles: [],
      loading: false,
      noMore: false
    }
  },
  methods: {
    writeArticle () {
      this.$activity.start(AnonymousWriteActivity).then(() => {
        this.$refs.articles.search()
      })
    },
    setActivityType (activityType) {
      this.activityType = activityType
      this.$nextTick(this.$refs.articles.search)
    },
    loadMore () {
      this.$refs.articles.loadMore()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
#anonymous {
  position: relative;
  min-height: 100%;
  padding: 20px 20px #{$footer-height + 20px};
  .anonymous-notice {
    background-color: #83a7c9;
    color: #ffffff;
    margin: -20px -20px 0;
    padding: 13px 20px;
    font-size: 0.8rem;
    display: flex;
  }
}
</style>