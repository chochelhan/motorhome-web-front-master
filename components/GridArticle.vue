<template>
  <div class="article">
    <div v-bind:style="{'background-image': 'url(' + coverUrl + '), url(' + cover + '?5x5)', 'height': 'calc(100vw / ' + column + ' - 40px)'}" class="article-cover"></div>
    <profile-image v-if="profile" v-bind:src="profile" v-on:click.native.stop="showProfile(memberNo)" size="36px" class="article-profile"></profile-image>
    <div v-if="title" class="article-title">{{title}}</div>
    <div v-if="tags.length > 0" class="article-tags">
      <div v-for="tag in tags" v-bind:key="tag" class="club-tag">#{{tag}}</div>
    </div>
    <div v-if="date" class="article-date">{{date | formatDate}}</div>
  </div>
</template>

<script>
import ProfileActivity from './activities/ProfileActivity'
import ProfileImage from './ProfileImage'
export default {
  name: 'GridArticle',
  components: {
    ProfileImage
  },
  props: {
    column: {
      type: [Number, String],
      default () {
        return 1
      }
    },
    title: String,
    cover: String,
    coverSize: {
      type: String,
      default () {
        return null
      }
    },
    profile: String,
    memberNo: [Number, String],
    date: String,
    tags: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    coverUrl () {
      if (!!this.coverSize) {
        return `${this.cover}?${this.coverSize}`
      } else {
        return `${this.cover}`
      }
    }
  },
  methods: {
    showProfile (id) {

      this.$activity.start(ProfileActivity, {
        id: id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.article {
  position: relative;
  .article-cover {
    background-size: cover;
    background-position: center;
    border-radius: 10px;
  }
  .article-profile {
    border: solid #eceff8 1px;
    margin-top: -32px;
    margin-left: -4px;
  }
  .article-title {
    position: relative;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1rem;
    max-height: 2rem;
    overflow: hidden;
    margin-top: 3px;
    font-size: 0.7rem;
    font-weight: bold;
  }
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    font-size: 0.6rem;
    color: #16adb9;
    margin: 0 -3px;
    .club-tag {
      margin: 0 3px;
    }
  }
  .article-date {
    display: flex;
    flex-wrap: wrap;
    font-size: 0.6rem;
    color: #16adb9;
  }
}
</style>
