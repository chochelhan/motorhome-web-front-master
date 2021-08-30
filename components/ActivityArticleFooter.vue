<template>
  <div v-on:click.stop.prevent class="uk-width-1-1 article-footer uk-top-radius">
    <div class="article-footer-container">
      <div v-if="likes !== undefined" v-on:click="like" v-bind:class="{active: liked}" class="article-footer-action likes">{{likes | numberFormat}}</div>
      <div v-if="upvotes !== undefined" v-on:click="upvote" v-bind:class="{active: liked}" class="article-footer-action upvote">{{upvotes | numberFormat}}</div>
      <div v-if="downvotes !== undefined" v-on:click="downvote" v-bind:class="{active: disliked}" class="article-footer-action downvote">{{downvotes | numberFormat}}</div>
      <div v-if="scrapes !== undefined" v-on:click="scrape" v-bind:class="{active: scraped}" class="article-footer-action scrapes">{{scrapes | numberFormat}}</div>
      <div v-if="comments !== undefined" v-on:click="showComments" v-bind:class="{active: commented}" class="article-footer-action comments">{{comments | numberFormat}}</div>
      <div v-if="shareable" v-on:click="share" class="article-footer-action share"></div>
    </div>
    <safearea-bottom></safearea-bottom>
  </div>
</template>

<script>
import Qs from 'qs'
import CommentsActivity from './activities/CommentsActivity'
export default {
  name: 'ActivityArticleFooter',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    boardCode: String,
    likes: [Number, String],
    upvotes: [Number, String],
    downvotes: [Number, String],
    scrapes: [Number, String],
    comments: [Number, String],
    shareable: Boolean,
    liked: Boolean,
    disliked: Boolean,
    commented: Boolean,
    scraped: Boolean,
    creatorNo: Number
  },
  methods: {
    showComments () {
      this.$activity.start(CommentsActivity, {
        id: this.id,
        creatorNo: this.creatorNo,
        syncCount: count => {
          this.$emit('update')
        }
      }).then(data => {
        this.$emit('update')
      })
    },
    like () {
      this.$api.put(`/like/${this.id}`, {
        like: !this.liked
      }).then(response => {
        this.$emit('update')
      })
    },
    scrape () {
      if (this.scraped) {
        this.$api.delete(`/scraps`, {
          params: {
            articleNo: this.id
          }
        }).then(response => {
          this.$emit('update')
        })
      } else {
        this.$api.post(`/scraps`, {
          articleNo: this.id
        }).then(response => {
          this.$emit('update')
        })
      }
    },
    upvote () {
      if (this.disliked) {
        this.$api.put(`/dislike/${this.id}`, {
          dislike: this.liked
        }).then(response => {
          this.$emit('update')
        })
      }
      this.$api.put(`/like/${this.id}`, {
        like: !this.liked
      }).then(response => {
        this.$emit('update')
      })
    },
    downvote () {
      if (this.liked) {
        this.$api.put(`/like/${this.id}`, {
          like: this.disliked
        }).then(response => {
          this.$emit('update')
        })
      }
      this.$api.put(`/dislike/${this.id}`, {
        dislike: !this.disliked
      }).then(response => {
        this.$emit('update')
      })
    },
    share () {
      this.$command.execute('share', {
        text: `${location.origin}/share?${Qs.stringify({
          articleNo: this.id,
          boardCode: this.boardCode
        })}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.article-footer {
  width: 100vw;
  background-color: #eceff8;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
  z-index: 1000;
  padding: 0 15px;
  font-size: 0.8rem;
  .article-footer-container {
    display: flex;
    height: $footer-height;
    justify-content: center;
    align-items: center;
    .article-footer-action {
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 53px;
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 57px 57px;
      color: #8a92a5;
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
    .likes {
      background-image: url('../assets/img/like-off@2x.png');
      &.active {
        background-image: url('../assets/img/like-on@2x.png');
      }
    }
    .upvote {
      background-image: url('../assets/img/upvote-off@2x.png');
      &.active {
        background-image: url('../assets/img/upvote-on@2x.png');
      }
    }
    .downvote {
      background-image: url('../assets/img/downvote-off@2x.png');
      &.active {
        background-image: url('../assets/img/downvote-on@2x.png');
      }
    }
    .scrapes {
      background-image: url('../assets/img/bookmark-off@2x.png');
      &.active {
        background-image: url('../assets/img/bookmark-on@2x.png');
      }
    }
    .comments {
      background-image: url('../assets/img/comment-off@2x.png');
      &.active {
        background-image: url('../assets/img/comment-on@2x.png');
      }
    }
    .share {
      background-image: url('../assets/img/share-off@2x.png');
    }
  }
}
</style>
