<template>
  <div v-bind:class="{searching: searching}" class="campsite-selector">
    <div class="search-form">
      <header class="search-header uk-flex uk-flex-middle">
        <div class="uk-width-1-1 uk-position-relative uk-flex">
          <span class="uk-form-icon" uk-icon="icon: search;"></span>
          <input v-model="keyword" v-on:keyup.enter="search" v-on:focus="searching = true" type="search" class="uk-input" placeholder="장소를 검색하세요"/>
          <button v-if="$route.query.keyword" v-on:click="clear" uk-icon="icon: close;" style="margin-left: -5px; margin-right: 5px;"></button>
          <button v-else v-on:click="search" type="button" style="word-break: keep-all;">검색</button>
        </div>
      </header>
      <div v-if="campsites.length > 0" class="sites">
        <!-- <div>50km 범위 촬영지 {{campsites.length}}건</div> -->
        <div v-for="campsite in campsites" v-bind:key="campsite.campsiteNo" v-on:click="selectCampsite(campsite)" class="site">
            <div class="site-name">{{campsite.name}}</div>
        </div>
      </div>
      <div v-else class="sites">
        <div style="margin-top: 10px; font-size: 0.9rem; text-align: center;">검색결과가 없습니다</div>
      </div>
    </div>
    <current-location-button
      v-on:click.native="$refs.map.moveToCurrent()"
      style="bottom: 20px; right: 20px; z-index: 5;"
    ></current-location-button>
    <kakao-map ref="map"
      v-on:select-marker="selectMarker"
      v-on:click.native="searching = false"
      v-on:click-select-marker="registerCampsite"
      zoomable draggable selectable style="flex-grow: 1; padding-top: 60px;"
    ></kakao-map>
  </div>
</template>

<script>
import CampsiteRegisterActivity from './activities/CampsiteRegisterActivity'
import CurrentLocationButton from './CurrentLocationButton'
import KakaoMap from './KakaoMap'
export default {
  name: 'CampsiteSelector',
  components: {
    KakaoMap,
    CurrentLocationButton
  },
  props: {
    value: {}
  },
  data () {
    return {
      searching: false,
      keyword: null,
      checked: null,
      campsites: [],
      latitude: 37.5193326803551,
      longitude: 126.97957074631303
    }
  },
  methods: {
    search () {
      if (!this.keyword) {
        this.$swal.alert('검색어를 입력해 주세요')
        return
      }
      if (this.latitude && this.longitude) {
        this.$api.get(`/campsites`, {
          params: {
            page: 1,
            size: 10,
            name: this.keyword,
            latitude: this.latitude,
            longitude: this.longitude
          }
        }).then(response => {
          this.campsites = response.data
        })
      } else {
        this.$swal.alert('잠시후 다시 시도해 주세요')
      }
    },
    registerCampsite (position) {
      this.$activity.start(CampsiteRegisterActivity, {
        latitude: position.latitude,
        longitude: position.longitude
      }).then(data => {
        if (data) {
          this.$emit('input', data.id)
          this.$emit('register', data.id)
          this.latitude = data.location.latitude
          this.longitude = data.location.longitude
        }
      })
    },
    selectMarker (marker) {
      console.log(marker)
      this.$emit('input', marker.campsite)
    },
    selectCampsite (campsite) {
      this.searching = false
      this.keyword = campsite.name
      this.$refs.map.zoom(3)
      this.$refs.map.move(campsite.location.latitude, campsite.location.longitude)
      this.$refs.map.search().then(markers => {
        markers.forEach(marker => {
          if (marker.campsite.campsiteNo === campsite.campsiteNo) {
            this.$refs.map.selectMarker(marker)
          }
        })
      })
    }
  },
  watch: {
    checked (newVal) {
      this.$emit('input', newVal)
      this.$emit('update:site', this.campsites.filter(campsite => campsite.campsiteNo === newVal)[0])
    }
  },
  mounted () {
    navigator.geolocation.getCurrentPosition(position => {
      if (position && position.coords) {
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
@import '../assets/scss/extension';

.campsite-selector {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  button {
    user-select: none;
  }
  &.searching {
    .sites {
      display: block;
      * {
        user-select: none;
      }
    }
  }
  .search-form {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background-color: #eceff8;
    padding: 20px 20px 10px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 5px 5px -2px rgba(0, 0, 0, 0.16);
    .search-header {
      @extend .neumorphism;
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
  }
  .sites {
    display: none;
    padding: $layout-margin;
    .site {
      padding: 5px 10px;
      border-top: solid #dddddd 1px;
      .site-name {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
