<template>
  <div v-on:scroll="$emit('scroll', $event)" v-bind:style="{'background-image': 'url(' + mainImageUrl + '?articlecover), url(' + mainImageUrl + '?5x5)'}" class="article">
    <div style="min-height: 250px;"></div>
    <div class="article-container">
      <!-- <profile-image v-bind:src="creatorInfo.profileImageUrl" size="45px" class="article-writer-profile"></profile-image> -->
      <div class="article-writer">by PIWI Official</div>
      <div class="article-title">{{title}}</div>
      <div class="article-extra">
        <div class="article-date">{{createdAt | formatDate}}</div>
        <div class="article-views">조회수 {{articleSummaryInfo.viewCount | numberFormat}}</div>
      </div>
      <tags v-model="categories" v-on:click="$emit('search', $event)" text class="article-tags"></tags>
      <div ref="contents" v-html="contents" class="article-contents"></div>
      <safearea-bottom></safearea-bottom>
    </div>
    <activity-article-top v-bind:target="$el"></activity-article-top>
  </div>
</template>

<script>
import ActivityArticleTop from './ActivityArticleTop'
import ProfileImage from './ProfileImage'
import Tags from './Tags'
export default {
  name: 'GuidebookArticle',
  components: {
    ActivityArticleTop,
    ProfileImage,
    Tags
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      title: null,
      mainImageUrl: null,
      createdAt: null,
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      categories: [],
      contents: null
    }
  },
  methods: {
    load (viewed = false) {
      this.$api.get(`/guidebooks/${this.id}`, {
        params: {
          viewed: viewed
        }
      }).then(response => {
        this.title = response.data.title
        this.createdAt = response.data.createdAt
        this.articleSummaryInfo = response.data.articleSummaryInfo
        this.memberArticleSummaryInfo = response.data.memberArticleSummaryInfo
        this.mainImageUrl = response.data.mainImageUrl
        this.categories = response.data.categories
        let contents = document.createElement('div')
        contents.innerHTML = response.data.contents
        contents.querySelectorAll('img').forEach(element => {
          element.setAttribute('src-origin', element.src)
          element.src = element.src + '?article'
        })
        this.contents = contents.innerHTML
        this.$emit('load', {
          articleSummaryInfo: this.articleSummaryInfo,
          memberArticleSummaryInfo: this.memberArticleSummaryInfo
        })
        this.$nextTick(() => {
          this.$refs.contents.querySelectorAll('img').forEach(element => {
            element.addEventListener('click', event => {
              this.$activity.image(event.target.getAttribute('src-origin'))
            })
          })
        })
      })
    }
  },
  created () {
    this.load(true)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.article {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-size: auto 500px;
  background-position: top center;
  background-repeat: no-repeat;
  overflow-y: scroll;
  .article-container {
    position: sticky;
    top: $header-height;
    background-color: #ffffff;
    padding: 11px 20px #{20px + $footer-height};
    flex-grow: 1;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
    .article-writer-profile {
      position: absolute;
      top: -20px;
      right: 34px;
    }
    .article-writer {
      font-size: 0.75rem;
      color: #3d3d3d;
    }
    .article-title {
      margin-top: 5px;
      font-weight: bold;
      font-size: 1rem;
    }
    .article-extra {
      margin-top: 5px;
      display: flex;
      font-size: 0.75rem;
      color: #3d3d3d;
      .article-views {
        margin-left: 20px;
      }
    }
    .article-tags {
      color: #16adb9;
      margin-top: 6px;
      display: flex;
      font-size: 0.8rem;
      .article-tag {
        margin-left: 3px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .article-contents {
      margin-top: 10px;
      font-size: 0.85rem;
    }
    .article-footer {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      .article-interest {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;
        background-image: linear-gradient(to right, #16adb9 43%, #4c7fc1);
        box-shadow: 3px 3px 2px 0 rgba(0, 0, 0, 0.16);
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
      }
    }
  }
}
</style>
