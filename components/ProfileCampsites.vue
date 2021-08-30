<template>
  <div>
    <kakao-map v-if="campsites.length > 0" zoomable draggable v-on:click-marker="showPlace" class="uk-flex-1 map">Campsite</kakao-map>
    <div v-else class="uk-flex uk-flex-1 uk-flex-column uk-flex-center uk-flex-middle uk-text-center" style="min-height: 300px;">
      <div>촬영지가 등록 된<br/>레저 다이어리가 없습니다.</div>
      <div v-if="isMine">
        <div>
          <button type="button" class="uk-button uk-button-default"><span uk-icon="icon: pencil;"></span> 신규 작성하기</button>
        </div>
        <div>
          <button type="button" class="uk-button uk-button-default">촬영지를 소개합니다</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KakaoMap from './KakaoMap'
import CampsiteActivity from './activities/CampsiteActivity'

export default {
  name: 'ProfileCampsites',
  components: {
    KakaoMap
  },
  props: {
    isMine: Boolean
  },
  data () {
    return {
      campsites: [
        {}
      ]
    }
  },
  methods: {
    showPlace (place) {
      this.$activity.start(CampsiteActivity, place)
    }
  },
  created () {
    return this.$emit('empty', this.campsites.length < 1)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.map {
  height: 100%;
}
</style>
