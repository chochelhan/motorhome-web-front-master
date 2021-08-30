<template>
  <div class="scrape">
    <mypage-navigator></mypage-navigator>
    <div class="body">
      <submenu v-model="submenu" v-bind:active.sync="submenuActive">
        <template v-slot:default="{name, count, active}">
          <div v-bind:class="{'menu-active': active}">{{name}}</div>
          <div v-bind:class="{'menu-active': active}">{{count | numberFormat}}</div>
        </template>
      </submenu>
      <current-location-button
        v-if="submenuActive === 0"
        v-on:click.native="$refs.article.moveToCurrent()"
        style="bottom: 80px; right: 20px; z-index: 5;"
      ></current-location-button>
      <div v-on:scroll="infiniteScroll" class="articles">
        <kakao-map v-if="submenuActive === 0"
          ref="article"
          v-bind:level="13"
          v-bind:activity-type="activityType"
          draggable zoomable
          class="map"
        ></kakao-map>
        <leisure-diaries v-if="submenuActive === 1"
          ref="article"
          v-bind:activity-type="activityType"
        ></leisure-diaries>
        <meets v-if="submenuActive === 2"
          ref="article"
          v-bind:activity-type="activityType"
        ></meets>
        <journals v-if="submenuActive === 3"
          ref="article"
          v-bind:activity-type="activityType"
          style="padding: 20px 0 60px;"
        ></journals>
        <guidebooks v-if="submenuActive === 4"
          ref="article"
          v-bind:activity-type="activityType"
          style="padding: 20px 20px 80px;"
        ></guidebooks>
        <!-- FLEX복원 -->
        <!-- <flexies v-if="submenuActive === 5"
          ref="article"
          v-bind:activity-type="activityType"
          style="margin-top: 0;"
        ></flexies>
        <events v-if="submenuActive === 6"
          ref="article"
          v-bind:activity-type="activityType"
        ></events> -->
        <events v-if="submenuActive === 5"
          ref="article"
          v-bind:activity-type="activityType"
        ></events>
      </div>
    </div>
  </div>
</template>

<script>
import MypageNavigator from '../../components/partials/MypageNavigator'
import Submenu from '../../components/Submenu'
import KakaoMap from '../../components/KakaoMap'
import LeisureDiaries from '../../components/LeisureDiaries'
import Meets from '../../components/Meets'
import Journals from '../../components/Journals'
import Guidebooks from '../../components/Guidebooks'
import Flexies from '../../components/Flexies'
import Events from '../../components/Events'
import CurrentLocationButton from '../../components/CurrentLocationButton'
export default {
  name: 'Scrape',
  components: {
    MypageNavigator,
    Submenu,
    KakaoMap,
    LeisureDiaries,
    Meets,
    Journals,
    Guidebooks,
    Flexies,
    Events,
    CurrentLocationButton
  },
  props: {
    activityType: {
      type: String,
      default () {
        return 'MY_SCRAP'
      }
    }
  },
  data () {
    return {
      submenu: [
        {
          name: '파라다이스',
          count: 0
        },
        {
          name: '다이어리',
          count: 0
        },
        {
          name: '리폼클럽',
          count: 0
        },
        {
          name: '전문가저널',
          count: 0
        },
        {
          name: '가이드북',
          count: 0
        },
        // FLEX복원
        /*{
          name: 'FLEX',
          count: 0
        },*/
        {
          name: '이벤트',
          count: 0
        }
      ],
      submenuActive: 0,
      articles: []
    }
  },
  methods: {
    infiniteScroll ($event) {
      let scrollRemain = $event.target.scrollHeight - ($event.target.offsetHeight + $event.target.scrollTop)
      if (scrollRemain < 100) {
        if (this.$refs.article.loadMore && !this.$refs.article.loading) {
          this.$refs.article.loadMore()
        }
      }
    }
  },
  created () {
    this.$api.get(`/scraps/counts`).then(response => {
      response.data.forEach(count => {
        if (count.boardCode === '10000') {
          this.submenu[0].count = count.count
        }
        if (count.boardCode === '1000') {
          this.submenu[1].count = count.count
        }
        if (count.boardCode === '6000') {
          this.submenu[2].count = count.count
        }
        if (count.boardCode === '2000') {
          this.submenu[3].count = count.count
        }
        if (count.boardCode === '3000') {
          this.submenu[4].count = count.count
        }
        // FLEX복원
        // if (count.boardCode === '4000') {
        //   this.submenu[5].count = count.count
        // }
        // if (count.boardCode === '5000') {
        //   this.submenu[6].count = count.count
        // }
        if (count.boardCode === '5000') {
          this.submenu[5].count = count.count
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.scrape {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  .body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #0f2640;
    position: relative;
    .menu-active {
      color: #ffce55;
    }
    .articles {
      position: absolute;
      display: flex;
      flex-direction: column;
      top: $submenu-height;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ffffff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      mask-image: radial-gradient(white, black);
      overflow-y: auto;
      & > * {
        flex-grow: 1;
        padding: 25px 25px $footer-height + 20px;
      }
      & > .map {
        padding: 0;
      }
      & > .event {
        padding: 0 0 $footer-height 0;
      }
    }
  }
}
</style>
