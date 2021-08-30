<template>
  <div v-on:scroll="$emit('scroll', $event)" v-bind:style="{'background-image': 'url(' + mainImageUrl + '?articlecover), url(' + mainImageUrl + '?5x5)'}" class="article">
    <div style="min-height: 250px;"></div>
    <div class="article-container">
      <profile-image v-if="!official" v-on:click.native="showProfile" v-bind:src="creatorInfo.profileImageUrl" size="45px" class="article-writer-profile"></profile-image>
      <div v-if="official" class="article-writer">by PIWI Official</div>
      <div v-else class="article-writer">by {{creatorInfo.creatorName}}</div>
      <div class="article-title">{{title}}</div>
      <div class="article-extra">
        <div class="article-date">{{createdAt | formatDate}}</div>
        <div class="article-views">조회수 {{articleSummaryInfo.viewCount | numberFormat}}</div>
      </div>
      <tags v-model="categories" v-on:click="$emit('search', $event)" text class="article-tags"></tags>
      <div v-if="campsiteInfo" v-on:click="$activity.article('CAMPSITE', campsiteInfo.campsiteNo)" class="article-campsite">
        <div class="campsite-title">캠핑지 정보</div>
        <div class="campsite-name">{{campsiteInfo.name}}</div>
        <div class="campsite-address">{{campsiteInfo.address}}</div>
      </div>
      <div>
        <div ref="contents" v-html="contents" class="article-contents"></div>
        <div class="relation-meet-wrap">
        <div class="relation-meet-title">연관 게시물</div>
          <div class="meets" style="margin-bottom: 40px;">
            <grid v-if="meets.length > 0" v-bind:data="meets" columns="2">
              <template v-slot:default="meet">
                <grid-article
                        v-bind:title="meet.title"
                        v-bind:cover="meet.mainImageUrl"
                        v-bind:tags="meet.categories"
                        v-bind:column="3"
                        v-bind:class="{'meet-official': meet.official}"
                        v-on:click.native="showArticle(meet)"
                        cover-size="120by120"
                ></grid-article>
              </template>
            </grid>
            <div v-else class="empty">
              <strong style="font-size: 0.8rem">관련 리폼클럽이 아직 없어요</strong>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!owner" class="article-footer"  style="position: fixed; bottom: 80px;">
        <button v-if="memberArticleSummaryInfo.liked" v-on:click="like" type="button" class="article-interest">
          <span class="uk-flex uk-flex-middle">
            <span uk-icon="icon: app-heart-fill;" style="color: #ee2e62;"></span>
            <span style="margin-left: 5px;">{{articleSummaryInfo.likeCount}}</span>
          </span>
          <span style="margin-left: 20px;">관심 표시된 모임</span>
        </button>
        <button v-else type="button" v-on:click="like" class="article-interest">
          <span class="uk-flex uk-flex-middle">
            <span uk-icon="icon: app-heart;"></span>
            <span style="margin-left: 5px;">{{articleSummaryInfo.likeCount}}</span>
          </span>
          <span style="margin-left: 20px;">이 모임에 관심 표시하기</span>
        </button>
      </div>
      <safearea-bottom></safearea-bottom>
    </div>
    <activity-article-top v-bind:target="$el"></activity-article-top>
  </div>
</template>

<script>
import ActivityArticleTop from './ActivityArticleTop'
import ProfileImage from './ProfileImage'
import ProfileActivity from './activities/ProfileActivity'
import Tags from './Tags'
import GridArticle from "./GridArticle";
import Grid from "./Grid";

export default {
  name: 'MeetArticle',
  components: {
    ActivityArticleTop,
    ProfileImage,
    Tags,
    Grid,
    GridArticle
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      title: null,
      contents: null,
      mainImageUrl: null,
      createdAt: null,
      creatorInfo: {},
      campsiteInfo: {},
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      categories: [],
      owner: false,
      official: false,
      meets: []
    }
  },
  methods: {
    showProfile () {
      this.$activity.start(ProfileActivity, {
        id: this.creatorInfo.creatorNo
      })
    },
    load (viewed = false) {
      let _this = this
      this.$api.get(`/reform-clubs/${this.id}`, {
        params: {
          viewed: viewed
        }
      }).then(response => {
        let area = response.data.campsiteInfo.address.split(' ')[0]
        let contents = document.createElement('div')
        contents.innerHTML = response.data.contents
        contents.querySelectorAll('img').forEach(element => {
          element.setAttribute('src-origin', element.src)
          element.src = element.src + '?article'
        })
        this.title = response.data.title
        this.contents = contents.innerHTML
        this.mainImageUrl = response.data.mainImageUrl
        this.creatorInfo = response.data.creatorInfo
        this.campsiteInfo = response.data.campsiteInfo
        this.articleSummaryInfo = response.data.articleSummaryInfo
        this.memberArticleSummaryInfo = response.data.memberArticleSummaryInfo
        this.categories = [area, response.data.information.substr(0, 10)].concat(response.data.categories)
        this.createdAt = response.data.createdAt
        this.owner = response.data.owner
        this.official = response.data.official
        this.$emit('load', {
          articleSummaryInfo: this.articleSummaryInfo,
          memberArticleSummaryInfo: this.memberArticleSummaryInfo,
          creatorInfo: this.creatorInfo,
          owner: this.owner
        })
        this.$nextTick(() => {
          this.$refs.contents.querySelectorAll('img').forEach(element => {
            element.addEventListener('click', event => {
              this.$activity.image(event.target.getAttribute('src-origin'))
            })
          })
        })
        this.$api.get(`/reform-clubs`, {
          params: {
            page:1,
            size:10,
            notIncludeArticleNo: _this.id,
            campsiteNo: response.data.campsiteInfo.campsiteNo,
          }
        }).then(articles => {
          console.dir(articles.data)
          _this.meets = articles.data
        })
      })
    },
    like () {
      this.$api.put(`/like/${this.id}`, {
        like: !this.memberArticleSummaryInfo.liked
      }).then(response => {
        this.$api.get(`/reform-clubs/${this.id}`).then(response => {
          this.articleSummaryInfo = response.data.articleSummaryInfo
          this.memberArticleSummaryInfo = response.data.memberArticleSummaryInfo
          this.$emit('load', response.data)
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
    background-color: #eceff8;
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

.relation-meet-wrap {
  margin-top: 20px;
  margin-bottom: 10px;
  .relation-meet-title {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 10px;
  }
}
</style>
