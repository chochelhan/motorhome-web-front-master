<template>
  <div class="feed-list">
    <a v-for="(feed, index) in data" v-bind:key="index" v-bind:href="feed.link" v-on:click.prevent="$emit('route', feed)" class="feed">
      <div class="uk-flex uk-flex-between">
        <div v-on:click.stop.prevent="showProfile(feed.user_id)" class="uk-flex">
          <profile-image v-bind:src="feed.user_image"></profile-image>
          <div class="user-name">{{feed.user_name}}</div>
        </div>
        <div class="created-at">{{feed.created_at | formatDate}}</div>
      </div>
      <div class="cover">
        <div v-bind:data-src="feed.cover" uk-img class="uk-flex uk-flex-bottom uk-background-cover uk-light uk-width-1-1">
          <tags v-model="feed.tags" class="tags"></tags>
        </div>
      </div>
      <div class="title">{{feed.title}}</div>
      <div class="contents">{{feed.contents}}</div>
    </a>
  </div>
</template>

<script>
import ProfileActivity from './activities/ProfileActivity'
import ProfileImage from './ProfileImage'
import Tags from './Tags'

export default {
  name: 'FeedList',
  components: {
    Tags,
    ProfileImage
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    showProfile (userId) {
      this.$activity.start(ProfileActivity, {
        id: userId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.feed-list {
  padding: 10px;
  .feed {
    display: block;
    margin-top: 10px;
    padding: 10px;
    border: solid $global-border 1px;
    &:first-child {
      margin-top: 0;
    }
    .user-name {
      margin-left: 5px;
    }
    .cover {
      margin-top: 7px;
      display: flex;
      height: 150px;
      .tags {
        margin-left: 5px;
        margin-bottom: 10px;
      }
    }
    .title {
      margin-top: 7px;
      font-weight: bold;
    }
    .contents {
      margin-top: 7px;
    }
  }
}
</style>
