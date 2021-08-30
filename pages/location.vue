<template>
  <div class="uk-flex uk-flex-column uk-flex-1" style="position: relative;">
    <div class="uk-flex uk-flex-column uk-flex-1">
      <current-location-button v-on:click.native="$refs.map.moveToCurrent()" style="bottom: 120px; right: 20px; z-index: 5;"></current-location-button>
      <kakao-map ref="map" zoomable draggable current-button-bottom="120px" class="uk-flex-1 map"></kakao-map>
    </div>
    <div v-if="showNearCampsites > 0" class="map-near-campsites">
      <div class="map-near-campsites-container">
        <strong>내 주변 5km</strong>
        <span>반경에</span>
        <strong>{{showNearCampsites | numberFormat}}개</strong>
        <span>군데가 있어요!</span>
        <span v-on:click.stop="showNearCampsites = 0" class="map-near-close">&times;</span>
      </div>
      <safearea-bottom></safearea-bottom>
    </div>
    <!-- <button v-on:click="$refs.map.current()" type="button" class="go-current">
      <span uk-icon="icon: location; ratio: 0.9;"></span>
    </button> -->
    
  </div>
</template>

<script>
import KakaoMap from '../components/KakaoMap'
import CurrentLocationButton from '../components/CurrentLocationButton'
export default {
  name: 'Location',
  components: {
    CurrentLocationButton,
    KakaoMap
  },
  data () {
    return {
      showNearCampsites: 0
    }
  },
  mounted () {
    this.$location.getCurerntPosition().then(position => {
      console.log(position)
      this.$api.get(`/campsites/count`, {
        params: {
          distance: 5,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      }).then(response => {
        this.showNearCampsites = response.data.count
      })
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
* {
  user-select: none;
}
.map {
  // padding-bottom: $footer-height;
}
.go-current {
  position: absolute;
  z-index: 1000;
  bottom: 10px + $footer-height;
  right: 10px;
  border: solid $global-border 1px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  width: 45px;
  height: 45px;
  text-align: center;
  cursor: pointer;
}
.map-near-campsites {
  position: fixed;
  bottom: 10px + $footer-height;
  left: calc(50% - 150px);
  z-index: 1;
  .map-near-campsites-container {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    width: 300px;
    padding: 10px 35px 10px 25px;
    border-radius: 5px;
    font-size: 0.7rem;
    background-color: #0f2640;
    color: #a3a9bc;
    position: relative;
    strong {
      color: #ffffff;
      font-size: 0.85rem;
    }
    .map-near-close {
      position: absolute;
      right: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      font-size: 1rem;
      background-color: #ffffff;
      color: #0f2640;
    }
    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 18px;
      height: 12px;
      clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
      background-color: #0f2640;
      bottom: -10px;
    }
  }
}
</style>
