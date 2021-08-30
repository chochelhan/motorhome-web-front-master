<template>
  <div class="kakao-map-snapshot">
    <div ref="map" v-bind:style="{height: height}"></div>
    <div v-if="editable" v-on:click="selectCampsite" class="kakao-map-snapshot-edit"></div>
  </div>
</template>

<script>
import CampsiteSelectorActivity from './activities/CampsiteSelectorActivity'
export default {
  name: 'KakaoMapSnapshot',
  props: {
    value: {
      type: Object,
      required: true,
      default () {
        return {
          location: {}
        }
      }
    },
    level: [Number, String],
    height: String,
    editable: Boolean
  },
  data () {
    return {
      marker: null
    }
  },
  methods: {
    selectCampsite () {
      this.$activity.start(CampsiteSelectorActivity).then(data => {
        if (data) {
          this.marker.setMap(null)
          this.marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(data.location.latitude, data.location.longitude),
            clickable: false,
            image: new kakao.maps.MarkerImage('/img/pin.svg', new kakao.maps.Size(50, 53), {
              offset: new kakao.maps.Point(25, 26)
            })
          })
          this.marker.setMap(this.map)
          this.map.setCenter(new kakao.maps.LatLng(data.location.latitude, data.location.longitude))
          this.$emit('input', data)
        }
      })
    },
    move (latitude, longitude) {
      this.map.setCenter(new kakao.maps.LatLng(latitude, longitude))
    },
    pin (latitude, longitude) {
      this.move(latitude, longitude)
      if (this.marker) {
        this.marker.setMap(null)
      }
      this.marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latitude, longitude),
        clickable: false,
        image: new kakao.maps.MarkerImage('/img/pin.svg', new kakao.maps.Size(50, 53), {
          offset: new kakao.maps.Point(25, 26)
        })
      })
      this.marker.setMap(this.map)
    }
  },
  mounted () {
    this.map = new kakao.maps.Map(this.$refs.map, { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(this.value.location.latitude, this.value.location.longitude), //지도의 중심좌표.
      level: this.level //지도의 레벨(확대, 축소 정도)
    }) //지도 생성 및 객체 리턴
    this.marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(this.value.location.latitude, this.value.location.longitude),
      clickable: false,
      image: new kakao.maps.MarkerImage('/img/pin.svg', new kakao.maps.Size(50, 53), {
        offset: new kakao.maps.Point(25, 26)
      })
    })
    this.marker.setMap(this.map)
    // this.map.setDraggable(false)
    // this.map.setZoomable(false)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.kakao-map-snapshot {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  .kakao-map-snapshot-edit {
    position: absolute;
    top: 0;
    right: 0;
    width: 41px;
    height: 41px;
    background-image: url('../assets/img/plus-circle.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;
  }
}
</style>
