<template>
  <div v-bind:class="{'search-result-exists': $route.query.keyword}" class="search">
    <div class="search-form">
      <safearea-top></safearea-top>
      <header class="search-header uk-flex uk-flex-middle">
        <div class="uk-width-1-1 uk-position-relative uk-flex">
          <span class="uk-form-icon" uk-icon="icon: search;"></span>
          <input ref="keyword" v-model="keyword" v-on:keyup.enter="search" type="search" class="uk-input" placeholder="오늘은 어디로 가볼까요?"/>
          <button v-if="$route.query.keyword" v-on:click="clear" uk-icon="icon: close;" style="margin-left: -5px; margin-right: 5px;"></button>
          <button v-else v-on:click="search" type="button" style="word-break: keep-all;">검색</button>
        </div>
      </header>
      <div v-if="$route.query.keyword" class="search-result">
        <submenu v-model="categories" v-bind:active.sync="categoryIndex" class="search-categories">
          <template v-slot:default="{title, count, active}">
            <div class="category-title" v-bind:class="{'category-active': active}">{{title}}</div>
            <div class="category-count" v-bind:class="{'category-active': active}">{{count | numberFormat}}</div>
          </template>
        </submenu>
        <current-location-button
          v-if="categoryIndex === 0 && isResultExists(categoryIndex)"
          v-on:click.native="$refs.article.moveToCurrent()"
          style="bottom: 80px; right: 20px; z-index: 5;"
        ></current-location-button>
        <div class="search-articles">
          <kakao-map v-if="categoryIndex === 0 && isResultExists(categoryIndex)" ref="article" v-bind:keyword="keyword" bound-init draggable zoomable class="campsites"></kakao-map>
          <leisure-diaries v-else-if="categoryIndex === 1 && isResultExists(categoryIndex)" ref="article" v-bind:keyword="keyword"></leisure-diaries>
          <meets v-else-if="categoryIndex === 2 && isResultExists(categoryIndex)" ref="article" v-bind:keyword="keyword"></meets>
           <!-- jjong2028 ==> 익멍복원--> <anonymouses v-else-if="categoryIndex === 3 && isResultExists(categoryIndex)" ref="article" v-bind:keyword="keyword"></anonymouses>
          <journals v-else-if="categoryIndex === 4 && isResultExists(categoryIndex)" ref="article" v-bind:keyword="keyword"></journals>
          <guidebooks v-else-if="categoryIndex === 5 && isResultExists(categoryIndex)" ref="article" v-bind:keyword="keyword"></guidebooks>
          <!-- FLEX 복원 <flexies v-else-if="categoryIndex === 5 && isResultExists(categoryIndex)" ref="article" v-bind:keyword="keyword"></flexies>-->
          <div v-else class="search-result-empty">
            <img src="../assets/img/search-empty.svg">
            <div style="font-size: 0.9rem;">앗! 검색결과가 없어요.</div>
          </div>
        </div>
      </div>
      <div v-else class="search-contents">
        <div class="search-part">
          <div class="search-part-title">추천 검색어</div>
          <div class="search-keywords">
            <button v-for="(keyword, index) in keywords" v-bind:key="index" v-on:click="searchTag(keyword)" type="button" class="search-keyword">#{{keyword}}</button>
          </div>
        </div>
        <div class="ribbon-banners">
          <!-- <div v-for="(banner, index) in ribbonBanners" v-bind:key="index"
            v-on:click="$activity.article(banner.landingType, banner.articleNo)"
            class="ribbon-banner"
          >
            <img v-bind:src="banner.imageUrl"/>
          </div> -->
          <nuxt-link v-for="(banner, index) in ribbonBanners" v-bind:key="index" v-bind:to="banner.link" class="search-part ribbon-banner">
            <div class="uk-flex-1">
              <div class="ribbon-contents">{{banner.contents}}</div>
              <div class="ribbon-title">{{banner.title}}</div>
            </div>
            <div class="uk-flex uk-flex-middle">
              <button uk-icon="icon: arrow-right;" type="button" class="uk-icon-button"></button>
            </div>
          </nuxt-link>

          <div class="ribbon-banners" style="margin-top: 0px;">
            <div class="ribbon-banner" v-for="(banner, index) in activityRibbonBanners" @click="banner.action">
              <div class="uk-flex-1">
                <div class="ribbon-contents">{{banner.contents}}</div>
                <div class="ribbon-title">{{banner.title}}</div>
              </div>
              <div class="uk-flex uk-flex-middle">
                <button uk-icon="icon: arrow-right;" type="button" class="uk-icon-button"></button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div v-if="!$route.query.keyword" class="notice-banners">
      <span v-on:click="$activity.article('NOTICE', 2640)" class="notice-banner">
        <span uk-icon="icon: warning; ratio: 1.5;"></span>
        <div class="notice-title">안전한 코로나19 대응 방안을 확인하세요!</div>
      </span>
      <span v-on:click="$activity.article('NOTICE', 2641)" class="notice-banner">
        <span uk-icon="icon: warning; ratio: 1.5;"></span>
        <div class="notice-title">거리두기 단계별 안전 여행 가이드</div>
      </span>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader'
import TabNavigation from '../components/TabNavigation'
import ScreenSlider from '../components/ScreenSlider';
import ScreenSliderFragment from '../components/ScreenSliderFragment';
import Submenu from '../components/Submenu'
import KakaoMap from '../components/KakaoMap'
import LeisureDiaries from '../components/LeisureDiaries'
import Meets from '../components/Meets'
import Anonymouses from '../components/Anonymouses'
import Journals from '../components/Journals'
import Guidebooks from '../components/Guidebooks'
import Flexies from '../components/Flexies'
import CurrentLocationButton from '../components/CurrentLocationButton'
import MeetWriteActivity from "../components/activities/MeetWriteActivity";
import LeisureDiaryWriteActivity from '../components/activities/LeisureDiaryWriteActivity'

export default {
  name: 'Search',
  components: {
    AppHeader,
    KakaoMap,
    LeisureDiaries,
    Meets,
    Anonymouses,
    Journals,
    Guidebooks,
    Flexies,
    TabNavigation,
    ScreenSlider,
    ScreenSliderFragment,
    Submenu,
    CurrentLocationButton
  },
  data () {
    return {
      keywords: [],
      keyword: this.$route.query.keyword,
      categoryIndex: 0,
      categories: [
        {
          title: '파라다이스',
          count: 0
        },
        {
          title: '다이어리',
          count: 0
        },
        {
          title: '리폼클럽',
          count: 0
        },
        // jjong2028 ==> 익멍복원
        {
          title: '익멍',
          count: 0
        },
        {
          title: '전문가저널',
          count: 0
        },
        {
          title: '가이드북',
          count: 0
        },
        // FLEX복원
        // {
        //   title: 'FLEX',
        //   count: 0
        // }
      ],
      ribbonBanners: [
        {
          title: '내 주변 갈만 한 곳 찾아보기',
          contents: '파라다이스는 멀리있지 않아요.',
          link: '/location'
        },
        /*{
          title: '리폼클럽 모임 만들기',
          contents: '혼자 떠나도 외롭지 않아요.',
          link: '/main?tab=2#meet-write'
        },
        {
          title: '다이어리 작성하기',
          contents: '여행의 추억, 잊어버리기 전에',
          link: '/main?tab=1#diary-write'
        },*/
        {
          title: 'PIWI 가이드북 바로가기',
          contents: '이럴 땐 어떡해야 하나 난감할 땐',
          link: '/main?tab=5' // jjong2028 ==> 익멍복원
          // link: '/main?tab=4'
        }
      ],
      activityRibbonBanners: [
        {
          title: '리폼클럽 모임 만들기',
          contents: '혼자 떠나도 외롭지 않아요.',
          action: this.writeMeetArticle
        },
        {
          title: '다이어리 작성하기',
          contents: '여행의 추억, 잊어버리기 전에',
          action: this.writeDiaryArticle
        }
      ]
    }
  },
  methods: {
    searchTag (tag) {
      this.keyword = tag
      this.search()
    },
    writeMeetArticle () {
      this.$activity.start(MeetWriteActivity, {
        title: '리폼클럽 작성'
      })
    },

    writeDiaryArticle() {
      this.$activity.start(LeisureDiaryWriteActivity)
    },
    search () {
      if (!this.keyword) {
        this.$swal.alert('검색어를 입력해 주세요.')
        return
      }
      this.$api.get(`/search/count`, {
        params: {
          keyword: this.keyword
        }
      }).then(response => {
        this.categories.forEach(category => category.count = 0)
        response.data.forEach(count => {
          if (count.boardCode === '10000') {
            this.categories[0].count = count.count
          }
          if (count.boardCode === '1000') {
            this.categories[1].count = count.count
          }
          if (count.boardCode === '6000') {
            this.categories[2].count = count.count
          }
          // jjong2028 ==> 익멍복원
          if (count.boardCode === '7000') {
            this.categories[3].count = count.count
          }
          if (count.boardCode === '2000') {
            // jjong2028 ==> 익멍복원
            this.categories[4].count = count.count
            // this.categories[3].count = count.count
          }
          if (count.boardCode === '3000') {
            // jjong2028 ==> 익멍복원
            this.categories[5].count = count.count
            // this.categories[4].count = count.count
          }
          // FLEX복원
          // if (count.boardCode === '4000') {
          //   // jjong2028 ==> 익멍복원
          //   this.categories[6].count = count.count
          //   // this.categories[5].count = count.count
          // }
        })
        this.$refs.keyword.blur()
      })
      this.$nextTick(() => {
        if (this.$refs.article) {
          this.$refs.article.search()
        }
      })
      this.$router.push({
        query: {
          keyword: this.keyword
        }
      })
    },
    countSearch() {
      this.$api.get(`/search/count`, {
        params: {
          keyword: this.keyword
        }
      }).then(response => {
        this.categories.forEach(category => category.count = 0)
        response.data.forEach(count => {
          if (count.boardCode === '10000') {
            this.categories[0].count = count.count
          }
          if (count.boardCode === '1000') {
            this.categories[1].count = count.count
          }
          if (count.boardCode === '6000') {
            this.categories[2].count = count.count
          }
          // jjong2028 ==> 익멍복원
          if (count.boardCode === '7000') {
            this.categories[3].count = count.count
          }
          if (count.boardCode === '2000') {
            // jjong2028 ==> 익멍복원
            this.categories[4].count = count.count
            // this.categories[3].count = count.count
          }
          if (count.boardCode === '3000') {
            // jjong2028 ==> 익멍복원
            this.categories[5].count = count.count
            // this.categories[4].count = count.count
          }
          // FLEX복원
          // if (count.boardCode === '4000') {
          //   // jjong2028 ==> 익멍복원
          //   this.categories[6].count = count.count
          //   // this.categories[5].count = count.count
          // }
        })
        this.$refs.keyword.blur()
      })
    },
    clear () {
      this.keyword = null
      this.$router.push({query: {}})
    },
    isResultExists (categoryIndex) {
      return this.categories.find((category, index) => index === categoryIndex).count > 0
    },
    updateNavigator (index) {
      this.$refs.navigator.navigate(index)
    },
    slideIndicator (totalRate) {
      this.$refs.navigator.setIndicatorPosition(totalRate)
    }
  },
  computed: {
    categoryCount () {
      return this.categories.find((category, index) => index === this.categoryIndex).count > 0
    },
    searchResultExists () {
      return this.categories.filter(category => category.count > 0).length > 0
    }
  },
  watchQuery (newQuery, oldQuery) {
    if (newQuery.keyword && newQuery.keyword !== this.keyword) {
      this.searchTag(newQuery.keyword)
    }
  },
  mounted () {
    if (this.$route.query.tab) {
      this.categoryIndex = parseInt(this.$route.query.tab)
    }
    this.keyword = this.$route.query.keyword
    if (this.keyword) {
      this.search()
    }
  },
  created () {
    this.$api.get(`/banners/messages`, {
      params: {
        bannerMessageCode: 'RECOMMENDATION_MESSAGE'
      }
    }).then(response => {
      this.keywords = response.data.messages
    })
    // this.$api.get(`/banners`, {
    //   params: {
    //     bannerCode: 'SEARCH_LINE_BANNER'
    //   }
    // }).then(response => {
    //   this.ribbonBanners = response.data
    // })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
@import '../assets/scss/extension';

.search {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #83a7c9;
  padding-bottom: $footer-height;
  &::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 10px;
    background-color: #eceff8;
    z-index: 0;
  }
  & > * {
    position: relative;
    z-index: 1;
  }
  &.search-result-exists {
    padding-bottom: 0;
    .search-form {
      padding-right: 0;
    }
  }
  .search-form {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    padding-right: 15px;
    background-color: #eceff8;
    border-bottom-left-radius: 25px;
    .search-header {
      @extend .neumorphism;
      margin: 15px 15px 0;
      padding-left: 5px;
      padding-right: 15px;
      &::before, &::after {
        border-radius: 20px;
      }
      input {
        background-color: transparent;
        font-size: 0.85rem;
        border: none;
      }
      button {
        border: none;
        background-color: transparent;
        font-size: 0.85rem;
        color: #83a7c9;
      }
    }
    .search-categories {
      margin: 0 15px;
      flex-shrink: 0;
    }
    .search-result {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: auto;
      flex-grow: 1;
      .category-title {
        word-break: keep-all;
        font-size: 0.75rem;
        font-weight: bold;
        color: #2d2d2d;
      }
      .category-count {
        font-size: 0.75rem;
      }
      .category-active {
        color: #16adb9;
      }
      .search-result-tab {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        max-height: auto;
      }
      .search-articles {
        position: absolute;
        top: $submenu-height;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 15px 15px $footer-height + 20px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        background-color: #ffffff;
        overflow-y: auto;
        & > * {
          flex-grow: 1;
        }
        .campsites {
          margin: -15px -15px -40px;
        }
      }
    }
  }
  .search-contents {
    padding: 15px 0 15px 15px;
  }
  .search-part {
    margin-top: $layout-margin;
    display: block;
    &:first-child {
      margin-top: 0;
    }
    .search-part-title {
      font-size: 13px;
      text-align: center;
      font-weight: bold;
    }
  }
  .search-keywords {
    margin-top: $layout-margin;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .search-keyword {
      border-radius: 15px;
      font-size: 12px;
      padding: 5px 10px;
      background-color: #d9d9d9;
      margin: 3px;
      border: none;
    }
  }
  .ribbon-banners {
    margin-top: 20px;
    .ribbon-banner {
      margin-top: 10px;
      display: flex;
      border-radius: 5px;
      overflow: hidden;
      background-color: #ffffff;
      box-shadow: 0 0 10px 0 rgba(44, 44, 44, 0.2);
      padding: 10px 15px;
      .ribbon-contents {
        font-size: 0.7rem;
        color: #888888;
      }
      .ribbon-title {
        font-size: 0.8rem;
        font-weight: bold;
      }
      .uk-icon-button {
        width: 30px;
        height: 30px;
        background-color: #16adb9;
        box-shadow: 0 0 5px 0 rgba(44, 44, 44, 0.23);
        color: #ffffff;
      }
    }
  }
  .notice-banners {
    position: relative;
    margin-right: 10px;
    padding: 20px 10px 20px 20px;
    border-top-left-radius: 20px;
    background-color: #83a7c9;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 25px;
      height: 25px;
      background-color: #eceff8;
      z-index: 0;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 25px;
      height: 25px;
      border-top-right-radius: 25px;
      background-color: #83a7c9;
      z-index: 0;
    }
    .notice-banner {
      z-index: 1;
      position: relative;
      display: flex;
      align-items: center;
      margin-top: 10px;
      color: #ffffff !important;
      .notice-title {
        margin-left: $content-margin;
        font-size: 13px;
      }
    }
  }
  .search-result-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
  }
  &.search-result-exists {
    .search-form {
      margin-left: 0;
      border-bottom-left-radius: 0;
      flex-grow: 1;
    }
    .notice-banners {
      display: none;
    }
  }
}
.slider {
  height: calc(100vh - #{$activity-header-height + $footer-height + $header-height});
}
</style>
