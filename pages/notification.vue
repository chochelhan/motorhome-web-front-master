<template>
  <div class="uk-flex uk-flex-column notifications">
    <app-header rounded gradient class="app-header">
      <template>Inbox</template>
      <template v-slot:operations>
        <span v-on:click="showPushSetting" uk-icon="icon: cog; ratio: 1.2;"></span>
      </template>
    </app-header>
    <safearea-top></safearea-top>
    <div v-if="notifications.length < 1" class="uk-flex uk-flex-column uk-flex-1 uk-flex-center uk-flex-middle">
      <img src="../assets/img/notification-empty.svg">
      <div style="margin-top: 5px; font-size: 0.9rem;">알림 메시지가 없어요!</div>
    </div>
    <div v-else class="notification-list" v-on:scroll="infiniteScroll">
      <div v-for="notification in notifications" v-bind:key="notification.notificationNo" v-on:click="$activity.article(notification.boardCode, notification.articleNo)" class="uk-flex notification">
        <div>
          <profile-image v-bind:src="notification.creatorInfo.profileImageUrl" size="43px"></profile-image>
        </div>
        <div class="notification-info uk-flex uk-flex-1 uk-flex-column">
          <div class="uk-flex uk-flex-bottom">
            <div v-html="notification.title" class="notification-title"></div>
            <div class="uk-flex-1"></div>
            <div class="notification-date">{{notification.createdAt | formatDate}}</div>
          </div>
          <div v-if="notification.contents" class="notification-contents">{{notification.contents}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PushSettingActivity from '../components/activities/PushSettingActivity'
import AppHeader from '../components/AppHeader'
import ProfileImage from '../components/ProfileImage'
export default {
  name: 'Notification',
  components: {
    AppHeader,
    ProfileImage
  },
  data () {
    return {
      notifications: [],
      loading: false,
      noMore: false,
      page: 1
    }
  },
  methods: {
    showPushSetting () {
      this.$activity.start(PushSettingActivity)
    },
    search (page = 1, clean = true) {
      this.loading = true
      this.$api.get(`/notifications`, {
        params: {
          page: page,
          size: 20
        }
      }).then(response => {
        this.noMore = true
        if (clean) {
          this.notifications = []
        }
        if (response.data.length > 0) {
          this.page = page
          response.data.forEach(article => {
            this.notifications.push(article)
          })
          this.loading = false
          this.noMore = (response.data.length < 20)
        }
      })
    },
    loadMore () {
      if (this.noMore === false) {
        this.search(this.page + 1, false)
      }
    },
    infiniteScroll ($event) {
      let scrollRemain = $event.target.scrollHeight - ($event.target.offsetHeight + $event.target.scrollTop)
      if (scrollRemain < 100 && this.loading === false) {
        this.loadMore()
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
.notifications {
  flex-grow: 1;
  background-color: #eceff8;
  min-height: 0;
  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .notification-list {
    padding: $header-height + 20px 20px $footer-height + 20px;
    flex-grow: 1;
    overflow: auto;
    .notification {
      margin-top: 15px;
      &:first-child {
        margin-top: 0;
      }
      .notification-info {
        margin-left: 10px;
        max-width: calc(100% - 50px);
        color: #000000;
        font-size: 0.75rem;
        .notification-title {
          word-break: keep-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          strong {
            font-size: 0.9rem;
          }
        }
        .notification-contents {
          font-size: 0.85rem;
          color: #5d5d5d;
          word-break: keep-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .notification-date {
          color: #969696;
          word-break: keep-all;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
