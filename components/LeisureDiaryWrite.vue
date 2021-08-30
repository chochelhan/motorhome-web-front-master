<template>
  <div class="leisure-diary-write">
    <h3>내가 언제 갔더라?</h3>
    <div class="leisure-diary-attribute">
      <div class="leisure-diary-location">
        <kakao-map-snapshot ref="mapSnapshot" v-model="campsite" level="10" height="100px" editable></kakao-map-snapshot>
        <div class="leisure-diary-attribute-label">장소</div>
      </div>
      <div class="leisure-diary-date-container">
        <div class="leisure-diary-date">{{date | formatDate('YYYY.MM.DD')}}</div>
        <div class="leisure-diary-date-edit">
          <input v-model="date" type="date"/>
        </div>
        <div class="leisure-diary-attribute-label">날짜</div>
      </div>
    </div>
    <form>
      <div class="leisure-diary-title">
        <input v-model="title" class="uk-input" type="text" placeholder="제목을 입력하세요">
      </div>
      <div class="leisure-diary-contents">
        <mobile-editor
          v-bind:value="contents"
          ref="editor"
          v-bind:primary-image.sync="primaryImage"
          placeholder="내용을 입력하세요"
        ></mobile-editor>
      </div>
    </form>
  </div>
</template>

<script>
import BottomSheet from './BottomSheet'
import TagEditor from './TagEditor'
import MobileEditor from './MobileEditor'
import ProfileImage from './ProfileImage'
import KakaoMapSnapshot from './KakaoMapSnapshot'
export default {
  name: 'LeisureDiaryWrite',
  components: {
    BottomSheet,
    TagEditor,
    MobileEditor,
    ProfileImage,
    KakaoMapSnapshot
  },
  props: {
    id: [Number, String]
  },
  data () {
    return {
      user: {},
      access: 'PUBLIC',
      date: this.$moment().format('YYYY-MM-DD'),
      campsite: {
        location: {
          latitude: 33.450701,
          longitude: 126.570667
        }
      },
      categories: [],
      title: null,
      contents: null,
      primaryImage: null
    }
  },
  methods: {
    proceed () {
      let tester = document.createElement('div')
      tester.innerHTML = this.$refs.editor.getData()
      return this.$refs.editor.hasUploading() || this.campsite.campsiteNo || this.title || tester.innerText.trim().length > 0 || this.primaryImage
    },
    check () {
      return new Promise((resolve, reject) => {
        if (this.$refs.editor.hasUploading()) {
          throw new Error('업로드중인 파일이 있습니다.')
        }

        if (!this.campsite.campsiteNo) {
          throw new Error('장소를 지정해 주세요')
        }

        if (!this.date) {
          throw new Error('날짜를 지정해 주세요')
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
          this.$api.put(`/leisure-diaries/${this.id}`, {
            contents: this.$refs.editor.getData(),
            campsiteNo: this.campsite.campsiteNo,
            categories: this.categories,
            isPublic: this.access === 'PUBLIC',
            title: this.title,
            mainImageUrl: this.primaryImage,
            tags: this.tags,
            stayDate: this.date
          }).then(response => {
            resolve(response.data)
          }).catch(reject)
        } else {
          this.$api.post(`/leisure-diaries`, {
            contents: this.$refs.editor.getData(),
            campsiteNo: this.campsite.campsiteNo,
            categories: this.categories,
            isPublic: this.access === 'PUBLIC',
            title: this.title,
            mainImageUrl: this.primaryImage,
            tags: this.tags,
            stayDate: this.date
          }).then(response => {
            resolve(response.data)
          }).catch(reject)
        }
      })
    }
  },
  created () {
    if (this.id) {
      this.$api.get(`/leisure-diaries/${this.id}`).then(response => {
        this.title = response.data.title
        this.campsite = response.data.campsiteInfo
        this.contents = response.data.contents
        this.categories = response.data.categories
        this.date = response.data.stayDate
        this.access = response.data.isPublic ? 'PUBLIC' : 'PRIVATE'
        this.$refs.mapSnapshot.pin(this.campsite.location.latitude, this.campsite.location.longitude)
        this.$nextTick(() => {
          this.$refs.editor.updateValue()
          this.$nextTick(() => {
            this.$refs.editor.setPrimaryImageSrc(response.data.mainImageUrl)
          })
        })
      })
    }
  },
  mounted () {
    let me = this.$session.getUserProfile()
    this.$api.getMember(me.memberNo).then(member => {
      this.user = member
      this.user.externalType = this.$cookie.get('external_type')
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.leisure-diary-write {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;
  h3 {
    font-weight: bold;
    font-size: 0.85rem;
    text-align: center;
    margin: 0;
  }
  .leisure-diary-attribute {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    .leisure-diary-location {
      width: calc(50% - 7px);
    }
    .leisure-diary-date-container {
      position: relative;
      width: calc(50% - 7px);
      .leisure-diary-date {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        font-size: 1.1rem;
        font-weight: bold;
        color: #ffce55;
        background-color: #0f2640;
        border-radius: 10px;
      }
      .leisure-diary-date-edit {
        display: flex;
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
        input {
          width: 41px;
          height: 41px;
          border: none;
          opacity: 0;
        }
      }
    }
    .leisure-diary-attribute-label {
      font-size: 0.8rem;
      font-weight: bold;
      text-align: center;
      margin-top: 5px;
    }
  }
  .leisure-diary-title {
    margin-top: 10px;
  }
  form {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .leisure-diary-contents {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      font-size: 0.85rem;
    }
  }
}
</style>
