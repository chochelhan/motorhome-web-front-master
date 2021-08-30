<template>
  <div class="anonymous">
    <div class="anonymous-writer">by {{nickname}}</div>
    <div class="anonymous-title">{{title}}</div>
    <div class="anonymous-extra">
      <div class="anonymous-date">{{createdAt | formatDate}}</div>
      <div class="anonymous-views">조회수 {{articleSummaryInfo.viewCount | numberFormat}}</div>
    </div>
    <div ref="contents" v-html="contents" class="anonymous-contents"></div>
    <safearea-bottom></safearea-bottom>
    <activity-article-top v-if="$el" v-bind:target="$el.parentNode"></activity-article-top>
  </div>
</template>

<script>
import ActivityArticleTop from './ActivityArticleTop'
export default {
  name: 'AnonymousArticle',
  components: {
    ActivityArticleTop
  },
  props: {
    id: [Number, String]
  },
  data () {
    return {
      nickname: null,
      title: null,
      contents: null,
      createdAt: null,
      owner: false,
      creatorInfo: {},
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {}
    }
  },
  methods: {
    load (viewed = false) {
      this.$api.get(`/blanks/${this.id}`, {
        params: {
          viewed: viewed
        }
      }).then(response => {
        this.nickname = response.data.nickname
        this.title = response.data.title
        let contents = document.createElement('div')
        contents.innerHTML = response.data.contents
        contents.querySelectorAll('img').forEach(element => {
          element.setAttribute('src-origin', element.src)
          element.src = element.src + '?article'
        })
        this.contents = contents.innerHTML
        this.createdAt = response.data.createdAt
        this.owner = response.data.owner
        this.creatorInfo = {
          creatorNo: response.data.creatorNo
        }
        this.articleSummaryInfo = response.data.articleSummaryInfo
        this.memberArticleSummaryInfo = response.data.memberArticleSummaryInfo
        this.$emit('load', {
          owner: this.owner,
          creatorInfo: this.creatorInfo,
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
.anonymous {
  flex-grow: 1;
  padding: 10px 20px $footer-height;
  background-color: #ffffff;
  .anonymous-writer {
    font-size: 0.7rem;
  }
  .anonymous-title {
    margin-top: 3px;
    font-size: 1rem;
    font-weight: bold;
  }
  .anonymous-extra {
    display: flex;
    margin-top: 7px;
    font-size: 0.7rem;
    .anonymous-views {
      margin-left: 15px;
    }
  }
  .anonymous-contents {
    margin-top: 15px;
    font-size: 0.8rem;
  }
}
</style>
