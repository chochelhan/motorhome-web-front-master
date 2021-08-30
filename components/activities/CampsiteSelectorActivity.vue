<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" back black rounded without-safearea>
    <template v-slot:header>캠핑지 찾기</template>
    <template v-slot:operations>
      <button v-on:click="confirm" type="button" class="uk-button uk-button-text">확인</button>
    </template>
    <template>
      <safearea-top></safearea-top>
      <campsite-selector v-model="campsite" v-on:register="register" v-bind:site.sync="campsite" style="flex-grow: 1;"></campsite-selector>
    </template>
    <!-- <template v-slot:footer>
      <button v-on:click="confirm" type="button" class="uk-button uk-button-default" style="border: none; width: 100%; height: 100%;">촬영지 정보 본문에 첨부하기</button>
    </template> -->
  </activity>
</template>

<script>
import CampsiteSelector from '../CampsiteSelector'
export default {
  name: 'CampsiteSelectorActivity',
  components: {
    CampsiteSelector
  },
  props: {
    resolve: Function
  },
  data () {
    return {
      campsite: {}
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      if (!this.campsite || !this.campsite.campsiteNo) {
        this.$swal.alert('캠핑지를 선택해 주세요.')
        return
      }
      this.$refs.activity.finish(this.campsite)
    },
    register (campsiteNo) {
      this.$api.get(`/campsites/${campsiteNo}`, {
        params: {
          latitude: this.$store.state.app.location.latitude,
          longitude: this.$store.state.app.location.longitude
        }
      }).then(response => {
        this.$refs.activity.finish(response.data)
      })
    }
  }
}
</script>
