<template>
  <div class="meet-writer">
    <div class="meet-writer-description">모임원 모집에 필요한 정보를 입력해주세요.</div>
    <div class="meet-attributes">
      <div class="meet-location">
        <kakao-map-snapshot ref="mapSnapshot" v-model="campsite" level="10" height="100px" editable></kakao-map-snapshot>
      </div>
      <div class="meet-properties">
        <div>
          <button v-on:click="setSchedule('번개')" v-bind:class="{'active': isSchedule('번개')}" type="button">
            <span v-if="isSchedule('번개')" uk-icon="icon: check; ratio: 0.8;"></span>
            <span v-else uk-icon="icon: plus; ratio: 0.8;"></span>
            <span>번개</span>
          </button>
        </div>
        <div>
          <button v-on:click="setSchedule('협의')" v-bind:class="{'active': isSchedule('협의')}" type="button">
            <span v-if="isSchedule('협의')" uk-icon="icon: check; ratio: 0.8;"></span>
            <span v-else uk-icon="icon: plus; ratio: 0.8;"></span>
            <span>협의</span>
          </button>
        </div>
        <div>
          <button v-on:click="setSchedule('날짜지정')" v-bind:class="{'active': isSchedule('날짜지정')}" type="button">
            <span v-if="isSchedule('날짜지정')" uk-icon="icon: check; ratio: 0.8;"></span>
            <span v-else uk-icon="icon: plus; ratio: 0.8;"></span>
            <span v-if="date">{{date}}</span>
            <span v-else>날짜지정</span>
            <input ref="date" v-model="date" type="date"/>
          </button>
        </div>
      </div>
    </div>
    <form class="meet-form">
      <div>
        <input v-model="title" type="text" placeholder="제목을 입력하세요" class="uk-input"/>
      </div>
      <div class="text-editor">
        <mobile-editor
          v-bind:value="contents"
          ref="editor"
          v-bind:primary-image.sync="primaryImage"
          placeholder="내용을 입력하세요"
          style="flex-grow: 1;"
        ></mobile-editor>
      </div>
    </form>
  </div>
</template>

<script>
import MobileEditor from './MobileEditor'
import KakaoMapSnapshot from './KakaoMapSnapshot'
export default {
  name: 'MeetWrite',
  components: {
    MobileEditor,
    KakaoMapSnapshot
  },
  props: {
    id: Number
  },
  data () {
    return {
      campsite: {
        location: {
          latitude: 33.450701,
          longitude: 126.570667
        }
      },
      schedule: null,
      date: null,
      title: null,
      contents: null,
      categories: [],
      primaryImage: null
    }
  },
  methods: {
    setSchedule (schedule) {
      this.schedule = schedule
      if (schedule !== 'DATE') {
        this.date = null
      }
    },
    isSchedule (schedule) {
      if (this.schedule === '날짜지정' && schedule === '날짜지정') {
        return this.date ? true : false
      } else {
        return this.schedule === schedule
      }
    },
    proceed () {
      let tester = document.createElement('div')
      tester.innerHTML = this.$refs.editor.getData()
      return this.$refs.editor.hasUploading() || this.campsite.campsiteNo || this.schedule || this.title || tester.innerText.trim().length > 0 || this.primaryImage
    },
    check () {
      return new Promise((resolve, reject) => {
        if (this.$refs.editor.hasUploading()) {
          throw new Error('업로드중인 파일이 있습니다.')
        }

        if (!this.campsite.campsiteNo) {
          throw new Error('장소를 지정해 주세요')
        }

        if (!this.schedule) {
          throw new Error('모임 일정을 선택해 주세요')
        }

        if (!this.title) {
          throw new Error('제목을 입력해 주세요')
        }

        let tester = document.createElement('div')
        tester.innerHTML = this.$refs.editor.getData()
        if (tester.innerText.trim().length < 1) {
          throw new Error('내용을 입력해 주세요')
        }

        if (!this.primaryImage) {
          throw new Error('대표 이미지를 지정해 주세요')
        }

        resolve()
      })
    },
    confirm () {
      return new Promise((resolve, reject) => {
        if (this.id) {
          this.$api.put(`/reform-clubs/${this.id}`, {
            campsiteNo: this.campsite.campsiteNo,
            contents: this.$refs.editor.getData(),
            information: this.schedule === '날짜지정' ? this.date : this.schedule,
            categories: this.categories,
            title: this.title,
            mainImageUrl: this.primaryImage
          }).then(response => {
            resolve(response.data)
          }).catch(reject)
        } else {
          this.$api.post(`/reform-clubs`, {
            campsiteNo: this.campsite.campsiteNo,
            contents: this.$refs.editor.getData(),
            information: this.schedule === '날짜지정' ? this.date : this.schedule,
            categories: this.categories,
            title: this.title,
            mainImageUrl: this.primaryImage
          }).then(response => {
            resolve(response.data)
          }).catch(reject)
        }
      })
      // this.$api.post(`/reform-clubs/`)
    }
  },
  created () {
    if (this.id) {
      this.$api.get(`/reform-clubs/${this.id}`).then(response => {
        this.title = response.data.title
        this.campsite = response.data.campsiteInfo
        this.contents = response.data.contents
        this.categories = response.data.categories
        if (['번개', '협의'].indexOf(response.data.information) > -1) {
          this.schedule = response.data.information
        } else {
          this.schedule = '날짜지정'
          this.date = response.data.information
        }
        // this.$refs.mapSnapshot.pin(this.campsite.location.latitude, this.campsite.location.longitude)
        this.$nextTick(() => {
          this.$refs.editor.updateValue()
          this.$nextTick(() => {
            this.$refs.editor.setPrimaryImageSrc(response.data.mainImageUrl)
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.meet-writer {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .meet-writer-description {
    text-align: center;
    font-size: 0.8rem;
  }
  .meet-attributes {
    margin-top: 10px;
    display: flex;
    .meet-location {
      position: relative;
      width: 50%;
      flex-grow: 1;
      border-radius: 15px;
      overflow: hidden;
      button {
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        width: 36px;
        height: 36px;
        background-image: url('../assets/img/plus-circle.svg');
        background-size: cover;
        background-repeat: no-repeat;
        background-color: transparent;
        z-index: 1;
      }
    }
    .meet-properties {
      width: 50%;
      margin-left: 10px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      button {
        position: relative;
        width: 100%;
        display: flex;
        border: none;
        padding: 6px 20px;
        font-size: 0.8rem;
        background-color: #d4daec;
        border-radius: 20px;
        overflow: hidden;
        &.active {
          background-color: #a6e7ed;
        }
        .uk-icon {
          margin-right: 5px;
        }
        input[type=date] {
          display: block;
          width: 100%;
          opacity: 0;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
      }
    }
  }
  .meet-form {
    margin-top: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .text-editor {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
  }
}
</style>