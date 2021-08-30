<template>
  <div class="profile-edit">
    <profile-cover v-bind:src="member.profileBackgroundImageUrl" width="100%" height="300px"></profile-cover>
    <button v-on:click="$refs.coverInput.click()" uk-icon="icon: cog;" class="profile-cover-edit"></button>
    <input ref="coverInput" v-on:change="loadCoverImage" type="file" accept="image/*" class="input-hidden-file"/>
    <div style="position: relative; z-index: 1; margin-top: 175px">
      <div class="uk-flex uk-flex-middle" style="padding-left: 15px;">
        <profile-image v-bind:src="member.profileImageUrl" v-on:click.native="$refs.imageInput.click()" size="109px" thumbnail="120by120" style="border-width: 2px;"></profile-image>
        <input ref="imageInput" v-on:change="loadProfileImage" type="file" accept="image/*" class="input-hidden-file"/>
      </div>
      <div class="uk-form-stacked">
        <div v-bind:class="{'nickname-valid': nicknameValid, 'nickname-invalid': !nicknameValid}" class="uk-inline-block uk-form-controls uk-width-1-1">
          <input
            v-model.trim="member.nickname"
            v-on:input="checkNickname"
            id="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
          >
          <label for="nickname" class="uk-flex uk-flex-between">
            <span v-if="nicknameCheckResult" class="nickname-check">{{nicknameCheckResult}}</span>
          </label>
        </div>
        <div class="profile-detail">
          <div>
            <textarea-autosize v-model="member.introduction" v-on:input="checkIntroduction" placeholder="내 소개글(0/100)" rows="1"></textarea-autosize>
          </div>
          <div v-if="member.externalProfile1" class="profile-sns-link">
            <select v-model="member.externalProfile1.externalProfileType" class="uk-select">
              <option value="YOUTUBE">유튜브</option>
              <option value="FACEBOOK">페이스북</option>
              <option value="INSTAGRAM">인스타그램</option>
              <option value="KAKAO_STORY">카카오스토리</option>
              <option value="TWITTER">트위터</option>
            </select>
            <input
              v-model="member.externalProfile1.url"
              id="link-1"
              type="text"
              placeholder="URL을 입력하세요"
            >
          </div>
          <div v-if="member.externalProfile2" class="profile-sns-link">
            <select v-model="member.externalProfile2.externalProfileType" class="uk-select">
              <option value="YOUTUBE">유튜브</option>
              <option value="FACEBOOK">페이스북</option>
              <option value="INSTAGRAM">인스타그램</option>
              <option value="KAKAO_STORY">카카오스토리</option>
              <option value="TWITTER">트위터</option>
            </select>
            <input
              v-model="member.externalProfile2.url"
              id="link-2"
              type="text"
              placeholder="URL을 입력하세요"
            >
          </div>
          <div class="profile-gallery">
            <div class="profile-gallery-title">
              <strong>사진</strong>
              <span>나를 대표하는 이미지들을 9개까지 보여줄 수 있어요.</span>
            </div>
            <div class="profile-gallery-pictures">
              <div
                v-for="(picture, index) in pictures" v-bind:key="index"
                v-bind:style="{'background-image': picture ? 'url(' + picture + ')' : null}"
                v-on:click="removeGalleryImage(index)"
                class="profile-gallery-picture"
              >
                <img v-if="picture" src="../assets/img/blank_1x1.png"/>
              </div>
            </div>
            <div class="profile-picture-input">
              <button v-on:click="addGalleryImage" type="button">
                <div class="profile-picture-input-container">
                  <span uk-icon="icon: upload;"></span>
                  <span>이미지 첨부</span>
                </div>
              </button>
              <input ref="pictureInput" v-on:change="loadGalleryImage" type="file" accept="image/*" multiple/>
              <safearea-bottom></safearea-bottom>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileCover from './ProfileCover'
import ProfileImage from './ProfileImage'
export default {
  name: 'ProfileEdit',
  components: {
    ProfileCover,
    ProfileImage
  },
  props: {
    id: [String, Number],
    nicknameCheckInterval: {
      type: Number,
      default () {
        return 500
      }
    }
  },
  data () {
    return {
      nicknameChecker: null,
      nicknameValid: null,
      nicknameExists: null,
      nicknameCheckResult: null,
      nicknameOrigin: null,
      member: {},
      pictures: [...Array(9).keys()].map(() => null)
    }
  },
  methods: {
    loadProfileImage () {
      if (this.$refs.imageInput.files) {
        let files = this.$refs.imageInput.files
        for (let index = 0; index < files.length; index++) {
          this.$file.resizeImage(files[index]).then(resizedImage => {
            this.$api.uploadImage('PROFILE', resizedImage).then(imageUrl => {
              this.member.profileImageUrl = imageUrl
            })
          })
        }
      }
    },
    loadCoverImage () {
      if (this.$refs.coverInput.files) {
        let files = this.$refs.coverInput.files
        for (let index = 0; index < files.length; index++) {
          this.$file.resizeImage(files[index]).then(resizedImage => {
            this.$api.uploadImage('PROFILE', resizedImage).then(imageUrl => {
              this.member.profileBackgroundImageUrl = imageUrl
            })
          })
        }
      }
    },
    addGalleryImage () {
      if (this.pictures.filter(picture => picture).length > 8) {
        this.$swal.alert('사진은 9개 까지만 등록할 수 있습니다.')
      } else {
        this.$refs.pictureInput.click()
      }
    },
    loadGalleryImage () {
      if (this.$refs.pictureInput.files) {
        let files = this.$refs.pictureInput.files
        let maxFileCount = this.pictures.filter(picture => !picture).length
        if (files.length > maxFileCount) {
          this.$swal.alert(`${maxFileCount}개 까지만 등록 가능합니다`)
          return
        }
        for (let index = 0; index < files.length; index++) {
          this.$file.resizeImage(files[index]).then(resizedImage => {
            this.$api.uploadImage('PICTURE', resizedImage).then(imageUrl => {
              let index = this.pictures.findIndex(picture => !picture)
              this.pictures[index] = imageUrl
              this.$forceUpdate()
            })
          }).catch(error => {
            this.$swal.alert(error.message)
          })
        }
      }
    },
    removeGalleryImage (index) {
      if (this.pictures[index]) {
        this.$swal.confirm('이미지를 삭제하시겠습니까?').then(() => {
          this.pictures.splice(index, 1)
          this.pictures.push(null)
        })
      }
    },
    checkNickname () {
      this.member.nickname = this.member.nickname.replace(/\s+/g, '')
      if (this.nicknameChecker) {
        clearTimeout(this.nicknameChecker)
      }

      if (!this.member.nickname) {
        this.nicknameExists = null
        this.nicknameValid = null
        this.nicknameCheckResult = null
        return
      }

      if (this.member.nickname.length < 4) {
        this.nicknameValid = false
        this.nicknameCheckResult = '닉네임을 4자 이상 입력 해 주세요'
      } else if (this.member.nickname.length > 20) {
        this.nicknameValid = false
        this.nicknameCheckResult = '닉네임을 20자 이하로 입력 해 주세요'
      } else if (this.member.nickname === this.nicknameOrigin) {
        this.nicknameValid = null
        this.nicknameCheckResult = null
      } else {
        this.nicknameValid = null
        this.nicknameCheckResult = '확인중입니다'
        this.nicknameChecker = setTimeout(() => {
          this.nicknameChecker = null
          this.$api.nicknameExistence(this.member.nickname).then(exist => {
            if (exist) {
              this.nicknameValid = false
              this.nicknameCheckResult = '사용중인 닉네임입니다'
            } else {
              this.nicknameValid = true
              this.nicknameCheckResult = '사용가능'
            }
          }).catch(error => {
            this.nicknameValid = null
          })
        }, this.nicknameCheckInterval)
      }
    },
    confirm () {
      return new Promise((resolve, reject) => {
        if (this.nicknameValid === false) {
          reject(Error(this.nicknameCheckResult))
        } else {
          return this.$api.updateMember(Object.assign(this.member, {
            pictures: this.pictures
          })).then(member => {
            resolve(member)
          })
        }
      })
    },
    checkIntroduction () {
      if (this.member.introduction && this.member.introduction.length > 100) {
        this.$swal.alert('100자 까지 입력가능합니다.')
        this.member.introduction = this.member.introduction.substr(0, 100)
      }
    }
  },
  created () {
    this.$api.getMember(this.id).then(member => {
      if (!member.externalProfile1) {
        member.externalProfile1 = {
          externalProfileType: 'YOUTUBE',
          url: null
        }
      }
      if (!member.externalProfile2) {
        member.externalProfile2 = {
          externalProfileType: 'YOUTUBE',
          url: null
        }
      }
      member.pictures.forEach((picture, index) => {
        this.pictures[index] = picture
      })
      this.member = member
      this.nicknameOrigin = this.member.nickname
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
$layout-padding: 20px;
$gallery-columns: 3;
$gallery-gap: 4px;
$gallery-upload-button-height: 40px;
.profile-edit {
  position: relative;
  input, select, textarea {
    background-color: transparent;
    border: none;
    outline: none;
  }
  textarea {
    width: 100%;
    line-height: 1.1rem;
    border-bottom: solid #dee8ff 1px;
    padding: 5px 0;
  }
  label[for=nickname] {
    padding: 3px $layout-padding 0;
    font-size: 0.75rem;
  }
  .profile-cover-edit {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .nickname-valid {
    .nickname-check {
      color: #409aff;
    }
  }
  .profile-detail {
    margin-top: 10px;
    padding: 0 #{$layout-padding} #{$layout-padding + $gallery-upload-button-height};
    .profile-sns-link {
      display: flex;
      border-bottom: solid #dee8ff 1px;
      select {
        width: 100px;
        font-size: 0.85rem;
        font-weight: bold;
        padding-left: 0;
      }
      input {
        width: 100%;
      }
    }
    .profile-gallery {
      margin-top: 20px;
      .profile-gallery-title {
        color: #b4b4b4;
        font-size: 0.7rem;
        strong {
          margin-right: 3px;
          font-size: 0.8rem;
          color: #414141;
        }
      }
      .profile-gallery-pictures {
        margin-top: 5px;
        display: grid;
        grid-template-columns: repeat(#{$gallery-columns}, 1fr);
        gap: $gallery-gap;
        .profile-gallery-picture {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vw / #{$gallery-columns} - #{$layout-padding + $gallery-gap * 2});
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          &:empty
          {
            border: dashed #b4b4b4 1px;
            &::before {
              content: '등록된\a이미지가\a아직 없어요!';
              white-space: pre;
              font-size: 0.75rem;
              text-align: center;
            }
          }
        }
      }
      .profile-picture-input {
        position: fixed;
        flex-direction: column;
        display: flex;
        justify-content: center;
        bottom: 0;
        left: $layout-padding;
        right: $layout-padding;
        button {
          flex-grow: 1;
          font-size: 0.9rem;
          font-weight: bold;
          border: none;
          background-color: #16adb9;
          color: #ffffff;
          border-radius: 25px;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
          margin: 0;
          .profile-picture-input-container {
            display: flex;
            flex-grow: 1;
            justify-content: center;
            align-items: center;
            min-height: $gallery-upload-button-height;
            width: 100%;
          }
        }
        input {
          display: none;
        }
      }
    }
  }
}
#nickname {
  display: block;
  width: 100%;
  padding: 0 $layout-padding;
  line-height: 2.3rem;
  font-size: 1rem;
  font-weight: bold;
  color: #16adb9;
  outline: none;
  border-bottom: solid #dee8ff 1px;
}
</style>
