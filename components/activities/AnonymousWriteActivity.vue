<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" v-bind:before-finish="beforeFinish" topaz back inverse-rounded prevent-swipe>
    <template v-slot:header>익명게시글{{id ? '수정' : '작성'}}</template>
    <template v-slot:operations>
      <button v-on:click="confirm" uk-icon="icon: app-write;" type="button"></button>
    </template>
    <template v-slot:default>
      <div class="anonymous-form">
        <div class="anonymous-title">
          <input v-model="title" type="text" class="uk-input" placeholder="제목을 입력하세요"/>
        </div>
        <div class="anonymous-contents">
          <mobile-editor
            ref="editor"
            v-bind:value="contents"
            v-bind:primary-image.sync="mainImageUrl"
            placeholder="내용을 입력하세요"
            style="flex-grow: 1;"
          ></mobile-editor>
        </div>
      </div>
    </template>
  </activity>
</template>

<script>
import MobileEditor from '../MobileEditor'
export default {
  name: 'AnonymousWriteArticle',
  components: {
    MobileEditor
  },
  props: {
    id: [Number, String],
    resolve: Function
  },
  data () {
    return {
      title: null,
      contents: null,
      mainImageUrl: null,
      success: false,
      beforeFinish: () => new Promise((resolve, reject) => {
        if (this.success) {
          resolve()
        } else {
          if (this.proceed()) {
            this.$swal.confirm('페이지를 이탈하시겠습니까?\n저장하지 않은 내용은 삭제됩니다.\n계속 진행하시겠습니까?').then(resolve).catch(reject)
          } else {
            resolve()
          }
        }
      })
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    proceed () {
      let tester = document.createElement('div')
      tester.innerHTML = this.$refs.editor.getData()
      return this.$refs.editor.hasUploading() || this.title || tester.innerText.trim().length > 0
    },
    confirm () {
      if (this.$refs.editor.hasUploading()) {
        throw new Error('업로드중인 파일이 있습니다.')
      }

      if (!this.title) {
        this.$swal.alert('제목을 입력하세요')
        return
      }

      let tester = document.createElement('div')
      tester.innerHTML = this.$refs.editor.getData()
      if (tester.innerText.trim().length < 1) {
        this.$swal.alert('내용을 입력하세요')
        return
      }

      this.success = true

      if (this.id > 0) {
        this.$api.put(`/blanks/${this.id}`, {
          title: this.title,
          contents: this.$refs.editor.getData(),
          mainImageUrl: this.mainImageUrl
        }).then(response => {
          this.$refs.activity.finish(response.data)
        })
      } else {
        this.$api.post(`/blanks`, {
          title: this.title,
          contents: this.$refs.editor.getData(),
          mainImageUrl: this.mainImageUrl
        }).then(response => {
          this.$refs.activity.finish(response.data)
        })
      }
    }
  },
  created () {
    if (this.id > 0) {
      this.$api.get(`/blanks/${this.id}`).then(response => {
        this.title = response.data.title
        this.contents = response.data.contents
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
@import '../../assets/scss/variables';
.anonymous-form {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .anonymous-contents {
    margin-top: 10px;
    font-size: 0.85rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
