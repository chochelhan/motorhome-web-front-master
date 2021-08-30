<template>
  <div class="partial-main">
    <div class="partial-main-banners">
      <div v-on:mousedown.stop v-on:touchstart.stop v-on:itemshown="bannerShown" uk-slideshow="ratio: 318:109; autoplay: true;" style="border-radius: 10px; overflow: hidden; mask-image: radial-gradient(white, black); position: relative;">
        <div style="position: absolute; z-index: 1; right: 0; font-size: 0.8rem; padding: 5px 15px;">{{billboardBannerIndex + 1}}/{{billboardBanners.length}}</div>
        <ul class="uk-slideshow-items">
          <li v-for="banner in billboardBanners" v-bind:key="banner.bannerNo" v-on:click="showBannerArticle(banner)">
              <img v-bind:src="banner.imageUrl + '?mainbanner'" uk-cover>
          </li>
        </ul>
      </div>
    </div>
    <div class="partial-main-container">
      <div class="greeting">
        <div
          v-if="$store.state.session && $store.state.session.user"
          class="greeting-title"
        >어서오세요. {{$store.state.session.user.nickname}}님</div>
        <div class="greeting-ment">{{welcomeMessage}}</div>
      </div>

      <div class="tags">
        <div v-for="(tab, index) in mainArticles" v-bind:key="index" v-on:click="mainArticleIndex = index" class="tag">#{{tab.category}}</div>
      </div>

      <app-section v-if="mainArticles[mainArticleIndex]" style="margin-top: 15px;">
        <grid v-bind:data="mainArticles[mainArticleIndex].articles" columns="2">
          <template v-slot:default="article">
            <grid-article
              v-bind:title="article.title"
              v-bind:cover="article.mainImageUrl"
              v-bind:profile="article.creatorInfo.profileImageUrl"
              v-bind:member-no="article.creatorInfo.creatorNo"
              v-on:click.native="$activity.article(article.boardCode, article.articleNo)"
              cover-size="200by200"
              column="2"
            ></grid-article>
          </template>
        </grid>
      </app-section>

      <app-section title="새로운 캠핑지를 소개합니다." style="margin-top: 15px;" class="campsite-news">
        <div v-for="campsite in campsites" v-bind:key="campsite.campsiteNo" v-on:click="$activity.article('CAMPSITE', campsite.campsiteNo)" class="campsite">
          <div class="campsite-category">{{campsite.itemLabel}}</div>
          <div class="campsite-description">{{campsite.title}}</div>
        </div>
      </app-section>

      <div v-if="ribbonBanner" v-on:click="$activity.article(ribbonBanner.landingType, ribbonBanner.articleNo)" class="ribbon-banner">
        <img v-bind:src="ribbonBanner.imageUrl"/>
      </div>

      <app-section title="리폼클럽" style="margin-top: 15px;">
        <grid v-bind:data="reformClubBanners" columns="3" style="margin-top: 5px;">
          <template v-slot:default="banner">
            <grid-article v-bind:title="banner.title" v-bind:cover="banner.imageUrl" v-on:click.native="$activity.article(banner.landingType, banner.articleNo)" column="3" cover-size="120by120"></grid-article>
          </template>
        </grid>
      </app-section>

      <app-section title="다이어리" style="margin-top: 25px;">
        <grid v-bind:data="leisureDiaryBanners" columns="2" style="margin-top: 5px;">
          <template v-slot:default="banner">
            <grid-article v-bind:title="banner.title" v-bind:cover="banner.imageUrl" v-on:click.native="$activity.article(banner.landingType, banner.articleNo)" column="2" cover-size="200by200"></grid-article>
          </template>
        </grid>
      </app-section>

      <app-section title="가이드북" style="margin-top: 15px;">
        <grid v-bind:data="guidebookBanners" columns="3" style="margin-top: 5px;">
          <template v-slot:default="banner">
            <grid-article v-bind:title="banner.title" v-bind:cover="banner.imageUrl" v-on:click.native="$activity.article(banner.landingType, banner.articleNo)" column="3" cover-size="120by120"></grid-article>
          </template>
        </grid>
      </app-section>

      <app-section title="전문가저널" style="margin-top: 25px;">
        <grid v-bind:data="journalBanners" columns="2" style="margin-top: 5px;">
          <template v-slot:default="banner">
            <grid-article v-bind:title="banner.title" v-bind:cover="banner.imageUrl" v-on:click.native="$activity.article(banner.landingType, banner.articleNo)" column="2" cover-size="200by200"></grid-article>
          </template>
        </grid>
      </app-section>

      <copyright style="margin: 20px -20px 0;"></copyright>
    </div>
  </div>
</template>

<script>
import AppSection from '../AppSection'
import Copyright from '../Copyright'
import Grid from '../Grid'
import GridArticle from '../GridArticle'
import PostingList from '../PostingList'
import LeisureDiaryArticleActivity from '../activities/LeisureDiaryArticleActivity'
import LeisureDiaryWriteActivity from '../activities/LeisureDiaryWriteActivity'
import MeetWriteActivity from '../activities/MeetWriteActivity'

export default {
  components: {
    AppSection,
    Copyright,
    Grid,
    GridArticle,
    PostingList
  },
  data () {
    return {
      welcomeMessage: null,
      billboardBannerIndex: 0,
      billboardBanners: [],
      mainArticleIndex: 0,
      mainArticles: [],
      reformClubBanners: [],
      leisureDiaryBanners: [],
      guidebookBanners: [],
      journalBanners: [],
      campsites: [],
      ribbonBanner: null,
      postingList: [
        {
          thumbnails: ['https://getuikit.com/docs/images/light.jpg', 'https://getuikit.com/docs/images/light.jpg', 'https://getuikit.com/docs/images/light.jpg'],
          title: '석양보며 갯벌서 조개잡는 재미까지...인천, 언택트 여행'
        }
      ]
    }
  },
  methods: {
    bannerShown (event) {
      event.target.parentNode.childNodes.forEach((element, index) => {
        if (element === event.target) {
          this.billboardBannerIndex = index
        }
      })
    },
    showDiary (diary) {
      this.$activity.start(LeisureDiaryArticleActivity, {
        id: diary.articleNo
      })
    },
    showBannerArticle (banner) {
      this.$activity.article(banner.landingType, banner.articleNo)
    }
  },
  created () {
    this.$api.get(`/home`).then(response => {
      this.mainArticles = response.data.articleDataList
      this.campsites = response.data.campsiteList
    })

    this.$api.get(`/banners`, {
      params: {
        bannerCode: 'HOME_BILLBOARD'
      }
    }).then(response => {
      this.billboardBanners = response.data
    })

    this.$api.get(`/banners`, {
      params: {
        bannerCode: 'HOME_LINE_BANNER'
      }
    }).then(response => {
      this.ribbonBanner = response.data[response.data.length - 1]
    })

    this.$api.get(`/banners/messages`, {
      params: {
        bannerMessageCode: 'WELCOME_MESSAGE'
      }
    }).then(response => {
      this.welcomeMessage = response.data.messages.pop()
    })

    this.$api.get(`/banners`, {
      params: {
        bannerCode: 'REFORM_CLUB_BANNER'
      }
    }).then(response => {
      this.reformClubBanners = response.data
    })
    this.$api.get(`/banners`, {
      params: {
        bannerCode: 'LEISURE_DIARY_BANNER'
      }
    }).then(response => {
      this.leisureDiaryBanners = response.data
    })
    this.$api.get(`/banners`, {
      params: {
        bannerCode: 'GUIDEBOOK_BANNER'
      }
    }).then(response => {
      this.guidebookBanners = response.data
    })
    this.$api.get(`/banners`, {
      params: {
        bannerCode: 'JOURNAL_BANNER'
      }
    }).then(response => {
      this.journalBanners = response.data
    })

    if (location.hash === '#diary-write') {
      this.$activity.start(LeisureDiaryWriteActivity)
    }
    if (location.hash === '#meet-write') {
      this.$activity.start(MeetWriteActivity, {
        title: '리폼클럽 작성'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.partial-main {
  .partial-main-banners {
    box-sizing: content-box;
    padding: 20px 20px 0;
  }
  .partial-main-container {
    padding: 0 20px 20px;
    background-color: #ffffff;
  }
}
.greeting {
  position: sticky;
  top: 0;
  margin: 0 -20px;
  padding: 20px 20px 10px;
  background-color: #ffffffee;
  z-index: 1;
  .greeting-title {
    font-size: 1rem;
    font-weight: bold;
  }
  .greeting-ment {
    font-size: 0.8rem;
  }
}

.editor-recommend {
  .editor-recommend-item {
    display: flex;
    background-color: #ffffff;
    border-top: solid $global-border 1px;
    padding: 10px;

    &:last-child {
      border-bottom: solid $global-border 1px;
    }

    code {
      border-radius: 3px;
      border: solid $global-border 1px;
    }

    .editor-recommend-title {
      flex-grow: 1;
      margin-left: 7px;
    }
  }
}
.ribbon-banner {
  margin: 10px -20px 0;
}

.tags {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  .tag {
    font-size: 0.75rem;
    margin: 0 4px 0.5px 0;
    padding: 6px 14px;
    border-radius: 47px;
    word-break: keep-all;
    white-space: nowrap;
    &:nth-child(1) {
      color: #ffffff;
      background-color: #16adb9;
    }
    &:nth-child(2) {
      color: #faa61a;
      background-color: #2d2d2d;
    }
    &:nth-child(3) {
      color: #9cbaff;
      background-color: #2d2d2d;
    }
    &:nth-child(4) {
      color: #81d8cf;
      background-color: #2d2d2d;
    }
  }
}
.campsite-news {
  .campsite {
    display: flex;
    align-items: center;
    margin-top: 7px;
    padding: 5px;
    border-radius: 18px;
    font-size: 0.8rem;
    color: #000000;
    background-color: #f1f1f1;
    .campsite-category {
      margin-left: 3px;
      word-break: keep-all;
      white-space: nowrap;
      font-weight: bold;
    }
    .campsite-description {
      margin-left: 10px;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &::before {
      content: '#';
      display: block;
      flex-shrink: 0;
      background-color: #ffffff;
      color: #a8a8a8;
      width: 25px;
      height: 25px;
      border-radius: 25px;
      line-height: 25px;
      text-align: center;
      font-size: 1rem;
      font-weight: bold;
    }
    &:nth-child(1) {
      &::before {
        color: #7cd2c5;
      }
      background-color: #7cd2c5;
    }
    &:nth-child(2) {
      &::before {
        color: #76d9ea;
      }
      background-color: #76d9ea;
    }
  }
}
</style>
