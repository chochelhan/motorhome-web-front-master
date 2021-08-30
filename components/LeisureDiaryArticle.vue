<template>
  <div v-on:scroll="$emit('scroll', $event)" v-bind:style="{'background-image': 'url(' + mainImageUrl + '?articlecover), url(' + mainImageUrl + '?5x5)'}" class="article">
    <div style="min-height: 250px;"></div>
    <div class="article-container">
      <profile-image v-on:click.native="showProfile" v-bind:src="creatorInfo.profileImageUrl" size="45px" class="article-writer-profile"></profile-image>
      <div class="article-writer">by {{creatorInfo.creatorName}}</div>
      <div class="article-title">{{title}}</div>
      <div class="article-extra">
        <div class="article-date">{{createdAt | formatDate}}</div>
        <div class="article-views">조회수 {{articleSummaryInfo.viewCount | numberFormat}}</div>
      </div>
      <div class="article-tags">
        <div v-for="(category, index) in categories" v-bind:key="index" v-on:click="$emit('search', category)" class="article-tag">#{{category}}</div>
      </div>
      <div v-if="campsiteInfo && campsiteInfo.campsiteNo" v-on:click="showCampsite(campsiteInfo)" class="article-campsite">
        <div class="campsite-title">캠핑지 정보</div>
        <div class="campsite-name">{{campsiteInfo.name}}</div>
        <div class="campsite-address">{{campsiteInfo.address}}</div>
      </div>
      <div ref="contents" v-html="contents" class="article-contents"></div>

      <div class="relation-diaries-wrap">
        <!-- 여기에 연관 게시글 띄워 줘야 함 -->
        <div class="relation-diaries-title">연관 다이어리</div>
        <div class="diaries">
          <grid v-if="articles.length > 0" v-bind:data="articles" columns="2">
            <template v-slot:default="diary">
              <grid-article
                      v-bind:title="diary.title"
                      v-bind:member-no="diary.creatorInfo.creatorNo"
                      v-bind:cover="diary.mainImageUrl"
                      v-bind:tags="diary.categories"
                      v-bind:profile="diary.creatorInfo.profileImageUrl || '/img/icon-profile.png'"
                      v-bind:date="diary.createdAt"
                      v-bind:column="2"
                      v-on:click.native="showArticle(diary)"
                      cover-size="200by200"
              ></grid-article>
            </template>
          </grid>
          <div v-else class="empty">
            <strong style="font-size: 0.8rem">연관된 다이어리가 아직 없어요</strong>
          </div>
        </div>
      </div>
      <safearea-bottom></safearea-bottom>
    </div>
    <activity-article-top v-bind:target="$el"></activity-article-top>
  </div>
</template>

<script>
import Qs from 'qs'
import ActivityArticleTop from './ActivityArticleTop'
import Tags from './Tags'
import ProfileImage from './ProfileImage'
import CampsiteActivity from './activities/CampsiteActivity'
import ProfileActivity from './activities/ProfileActivity'
import LinkPreview from './LinkPreview'
import GridArticle from "./GridArticle";
import Grid from "./Grid";
import LeisureDiaryArticleActivity from "./activities/LeisureDiaryArticleActivity";

export default {
  name: 'LeisureDiaryArticle',
  components: {
    Grid,
    GridArticle,
    ActivityArticleTop,
    Tags,
    ProfileImage,
    LinkPreview
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
      mainImaegUrl: null,
      createdAt: null,
      creatorInfo: {},
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      categories: [],
      campsiteInfo: null,
      mainImageUrl: null,
      contents: null,
      linkPreview: null,
      owner: false,
      articles: []
    }
  },
  methods: {
    showProfile () {
      this.$activity.start(ProfileActivity, {
        id: this.creatorInfo.creatorNo
      })
    },
    showCampsite (campsite) {
      this.$activity.start(CampsiteActivity, {
        id: campsite.campsiteNo
      })
    },
    showArticle (article) {
      this.$activity.start(LeisureDiaryArticleActivity, {
        id: article.articleNo
      })
    },
    load (viewed = false) {
      let _this = this
      this.$api.get(`/leisure-diaries/${this.id}`, {
        params: {
          viewed: viewed
        }
      }).then(response => {
        this.title = response.data.title
        this.createdAt = response.data.createdAt
        this.creatorInfo = response.data.creatorInfo
        this.articleSummaryInfo = response.data.articleSummaryInfo
        this.memberArticleSummaryInfo = response.data.memberArticleSummaryInfo
        this.categories = response.data.categories.map(tag => tag)
        this.campsiteInfo = response.data.campsiteInfo
        let contents = document.createElement('div')
        contents.innerHTML = response.data.contents
        contents.querySelectorAll('img').forEach(element => {
          element.setAttribute('src-origin', element.src)
          element.src = element.src + '?article'
        })
        this.contents = contents.innerHTML
        this.mainImageUrl = response.data.mainImageUrl
        this.owner = response.data.owner
        this.$emit('load', {
          creatorInfo: this.creatorInfo,
          articleSummaryInfo: this.articleSummaryInfo,
          memberArticleSummaryInfo: this.memberArticleSummaryInfo,
          owner: this.owner
        })
        this.$nextTick(() => {
          this.$refs.contents.querySelectorAll('img').forEach(element => {
            element.addEventListener('click', event => {
              this.$activity.image(event.target.getAttribute('src-origin'))
            })
          })
        })

        this.$api.get(`/leisure-diaries`, {
          params: {
            campsiteNo: response.data.campsiteInfo.campsiteNo,
            page: 1,
            size: 10,
            notIncludeArticleNo: _this.id

          }
        }).then(articles => {
          _this.articles = articles.data
        })
      })
    }
  },
  created () {
    this.load(true)
  },
  mounted () {
    let response = this.$axios.get(`/link-preview?${Qs.stringify({link: 'https://www.youtube.com/watch?v=MejbOFk7H6c'})}`).then(response => {
      this.linkPreview = response.data
    })
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
    padding: 20px 11px #{20px + $footer-height};
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
      margin-top: 10px;
      display: flex;
      font-size: 0.8rem;
      .article-tag {
        margin-left: 3px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .article-campsite {
      position: relative;
      margin: 20px 20px;
      padding: 10px 15px;
      color: #ffffff;
      background-image: linear-gradient(to right, #16adb9 48%, #5576c2);
      border-radius: 10px;
      .campsite-title {
        font-size: 0.75rem;
      }
      .campsite-name {
        font-size: 1rem;
        font-weight: bold;
      }
      .campsite-address {
        color: #beeaee;
        font-size: 0.75rem;
      }
      &::after {
        content: '';
        position: absolute;
        top: calc(50% - 7px);
        right: 16px;
        display: block;
        width: 7px;
        height: 14px;
        background-image: url('../assets/img/chevron-right.svg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
    .article-contents {
      font-size: 0.85rem;
    }
  }
}

  .relation-diaries-wrap {
    margin-bottom: 10px;
    .relation-diaries-title {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 10px;
    }
  }
</style>
