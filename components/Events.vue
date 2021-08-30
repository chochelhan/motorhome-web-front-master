<template>
  <div class="events">
    <div
      v-for="event in events"
      v-bind:key="event.articleNo"
      v-bind:class="['event-status-' + event.eventStatus.toLowerCase()]"
      v-bind:data-src="event.mainImageUrl + '?400by140'"
      v-on:click.prevent="showEvent(event)"
      uk-img class="event uk-background-cover"
    >
      <div style="padding: 30px 30px 20px;">
        <div class="event-tags">
          <span v-for="tag in event.tags" v-bind:key="tag" class="event-tag">{{tag}}</span>
        </div>
        <!-- <div class="event-title uk-text-ellipsis">{{event.title}}</div> -->
      </div>
      <div class="event-bookmark">
        <span v-if="event.memberArticleSummaryInfo.scraped" v-on:click="bookmark(event)" uk-icon="icon: app-bookmark-fill; ratio: 0.8;"></span>
        <span v-else v-on:click="bookmark(event)" uk-icon="icon: app-bookmark; ratio: 0.8;"></span>
      </div>
      <div class="uk-flex uk-flex-between event-info">
        <div>{{event.start.substr(0, 10).replace(/-/g, '.')}} ~ {{event.end.substr(0, 10).replace(/-/g, '.')}}</div>
        <div class="uk-flex">
          <div class="event-likes"><span uk-icon="icon: heart; ratio: 0.9;"></span>{{event.articleSummaryInfo.likeCount | numberFormat}}</div>
          <div class="event-comments" style="margin-left: 7px;"><span uk-icon="icon: app-comment;"></span>{{event.articleSummaryInfo.commentCount | numberFormat}}</div>
        </div>
      </div>
    </div>
    <div v-if="events.length < 1" class="empty">
      <strong>등록된 이벤트가 없어요</strong>
    </div>
  </div>
</template>

<script>
import EventArticleActivity from './activities/EventArticleActivity'
export default {
  name: 'Events',
  props: {
    keyword: String,
    activityType: String
  },
  data () {
    return {
      events: [],
      loading: false,
      noMore: false
    }
  },
  methods: {
    search (page = 1, clean = true) {
      this.$emit('update:loading', true)
      this.loading = true
      this.$api.get(`/events`, {
        params: {
          page: page,
          activityType: this.activityType,
          size: 10,
          keyword: this.keyword
        }
      }).then(response => {
        this.$emit('update:no-more', true)
        this.noMore = true
        if (clean) {
          this.events = []
        }
        if (response.data && response.data.length > 0) {
          this.page = page
          response.data.forEach(article => {
            this.events.push(article)
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
    },
    showEvent (event) {
      this.$activity.start(EventArticleActivity, {
        id: event.articleNo
      }).then(() => {
        this.$api.get(`/events/${event.articleNo}`, {
          params: {
            viewed: false
          }
        }).then(response => {
          let index = this.events.findIndex(_event => _event.articleNo === event.articleNo)
          this.events[index] = response.data
          this.$forceUpdate()
        })
      })
    },
    bookmark (article) {
      if (article.memberArticleSummaryInfo.scraped) {
        this.$api.delete(`/scraps`, {
          params: {
            articleNo: article.articleNo
          }
        }).then(() => {
          article.memberArticleSummaryInfo.scraped = false
          this.$forceUpdate()
        })
      } else {
        this.$api.post(`/scraps`, {
          articleNo: article.articleNo
        }).then(() => {
          article.memberArticleSummaryInfo.scraped = true
          this.$forceUpdate()
        })
      }
    }
  },
  created () {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.events {
  position: relative;
  color: $global-color;
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: $footer-height;
  }
  .event {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 127px;
    margin-top: $layout-margin;
    color: #ffffff;
    &.event-status-post {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        background-image: url(../assets/img/badge-event-end.svg);
        background-repeat: no-repeat;
        background-position: center;
      }
    }
    &:first-child {
      margin-top: 0;
    }
    .event-tags {
      font-size: 0.6rem;
      .event-tag {
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .event-title {
    }
    .event-bookmark {
      position: absolute;
      bottom: 40px;
      right: 30px;
    }
    .event-info {
      width: 100%;
      padding: 5px 30px;
      background-color: rgba(0, 0, 0, 0.21);
      font-size: 0.65rem;
      font-weight: bold;
    }
  }
}
</style>
