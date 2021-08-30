<template>
  <div class="mypage-record">
    <mypage-navigator></mypage-navigator>
    <div v-if="$store.state.session && $store.state.session.user" class="mypage-record-body">
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
      <div v-on:scroll="infiniteScroll" v-bind:class="{empty: empty}" class="mypage-record-articles">
        <kakao-map v-if="submenuActive === 0"
          ref="article"
          v-bind:member-no="$store.state.session.user.memberNo"
          v-bind:level="13"
          v-bind:activity-type="activityType"
          draggable zoomable
          class="map"
        ></kakao-map>
        <leisure-diaries v-if="submenuActive === 1"
          ref="article"
          v-bind:member-no="$store.state.session.user.memberNo"
          v-bind:activity-type="activityType"
          v-on:update:loading="countDiaries"
          sort="STAY_DATE_DESC"
        ></leisure-diaries>
        <meets v-if="submenuActive === 2"
          ref="article"
          v-bind:member-no="$store.state.session.user.memberNo"
          v-bind:activity-type="activityType"
          v-on:update:loading="countMeets"
        ></meets>
        <anonymouses v-if="submenuActive === 3"
          ref="article"
          v-bind:member-no="$store.state.session.user.memberNo"
          v-bind:activity-type="activityType"
          v-on:update:loading="countAnonymouses"
        ></anonymouses>
      </div>
    </div>
  </div>
</template>

<script>
import Anonymouses from '../../components/Anonymouses'
import Meets from '../../components/Meets'
import LeisureDiaries from '../../components/LeisureDiaries'
import MypageNavigator from '../../components/partials/MypageNavigator'
import KakaoMap from '../../components/KakaoMap'
import Submenu from '../../components/Submenu'
import CurrentLocationButton from '../../components/CurrentLocationButton'
export default {
  name: 'Record',
  components: {
    Anonymouses,
    Meets,
    LeisureDiaries,
    MypageNavigator,
    KakaoMap,
    Submenu,
    CurrentLocationButton
  },
  props: {
    activityType: {
      type: String,
      default () {
        return 'MY_WRITTEN'
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
        // jjong2028 ==> 익멍복원
        {
          name: '익멍',
          count: 0
        }
      ],
      submenuActive: 0
    }
  },
  computed: {
    empty () {
      return this.submenu[this.submenuActive] && this.submenu[this.submenuActive].count < 1
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
    },
    countDiaries () {
      this.$api.get(`/leisure-diaries/count`, {
        params: {
          activityType: this.activityType
        }
      }).then(response => {
        this.submenu[1].count = response.data.count
      })
    },
    countMeets () {
      this.$api.get(`/reform-clubs/count`, {
        params: {
          activityType: this.activityType
        }
      }).then(response => {
        this.submenu[2].count = response.data.count
      })
    },
    countAnonymouses () {
      this.$api.get(`/blanks/count`, {
        params: {
          activityType: this.activityType
        }
      }).then(response => {
        this.submenu[3].count = response.data.count
      })
    }
  },
  created () {
    if (process.browser) {
      this.$location.getCurerntPosition().then(position => {
        this.$api.get(`/campsites/count`, {
          params: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            activityType: this.activityType
          }
        }).then(response => {
          this.submenu[0].count = response.data.count
        })
      })
    }
    this.countDiaries()
    this.countMeets()
    this.countAnonymouses() // jjong2028 ==> 익멍복원
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.mypage-record {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  .mypage-record-body {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #0f2640;
    padding-bottom: 20px;
    .menu-active {
      color: #ffce55;
    }
    .mypage-record-articles {
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
      &.empty > .diaries {
        background-image: url('../../assets/img/record-diary-line.svg');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center bottom #{$footer-height + 10px};
      }
      &.empty > .meets {
        background-image: url('../../assets/img/record-meet-line.svg');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center bottom #{$footer-height + 10px};
      }
      &.empty > .blanks {
        background-image: url('../../assets/img/record-anonymous-line.svg');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center bottom #{$footer-height + 10px};
      }
    }
  }
}
</style>
