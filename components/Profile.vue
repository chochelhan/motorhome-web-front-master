<template>
  <div class="uk-flex uk-flex-column profile">
    <div class="uk-flex uk-flex-bottom profile-cover">
      <profile-cover v-bind:src="profileBackgroundImageUrl" v-on:click.native="$activity.image(profileBackgroundImageUrl)" width="100%" height="300px"></profile-cover>
      <div class="profile-main">
        <div class="uk-flex uk-flex-between">
          <profile-image v-bind:src="profileImageUrl" v-on:click.native="$activity.image(profileImageUrl)" size="110px" thumbnail="120by120"></profile-image>
          <div class="uk-flex-1" style="margin-left: 10px;">
            <div class="profile-user-name">{{nickname}}</div>
            <div v-if="articleSummaryInfo" class="profile-activity">
              <div class="profile-experience">
                <div class="profile-activity-score">{{experiencePoint | numberFormat}}</div>
                <div class="profile-activity-title">경험치</div>
              </div>
              <div class="profile-attention">
                <div class="profile-activity-score">{{articleSummaryInfo.likeCount | numberFormat}}</div>
                <div class="profile-activity-title">관심받는중</div>
              </div>
              <div class="profile-conversation">
                <div class="profile-activity-score">{{articleSummaryInfo.commentCount | numberFormat}}</div>
                <div class="profile-activity-title">대화중</div>
              </div>
            </div>
          </div>
          <button v-if="isMine" v-on:click="editProfile" type="button" class="profile-edit">
            <span uk-icon="icon: pencil;"></span>
          </button>
        </div>
        <div class="profile-intro">{{introduction | introduction}}</div>
        <div v-if="externalProfile1 || externalProfile2" class="uk-flex uk-flex-right" style="margin-bottom: -30px;">
          <a v-for="(link, index) in [externalProfile1, externalProfile2].filter(link => link)" v-bind:key="index" v-bind:href="link.url" target="_blank" class="profile-link">
            <span v-if="link.externalProfileType === 'YOUTUBE'" class="profile-sns profile-sns-youtube"></span>
            <span v-if="link.externalProfileType === 'INSTAGRAM'" class="profile-sns profile-sns-instagram"></span>
            <span v-if="link.externalProfileType === 'FACEBOOK'" class="profile-sns profile-sns-facebook"></span>
            <span v-if="link.externalProfileType === 'KAKAO_STORY'" class="profile-sns profile-sns-kakaostory"></span>
            <span v-if="link.externalProfileType === 'TWITTER'" class="profile-sns profile-sns-twitter"></span>
          </a>
        </div>
      </div>
    </div>
    <div v-if="gallery.length > 0" class="profile-gallery">
      <div
        v-for="(img, index) in gallery" v-bind:key="index"
        v-bind:style="{'background-image': 'url(' + img + ')'}"
        v-on:click="$activity.image(img)"
        class="profile-gallery-cover"
      ></div>
    </div>
  </div>
</template>

<script>
import ProfileCover from './ProfileCover'
import ProfileImage from './ProfileImage'
import ProfileEditActivity from '../components/activities/ProfileEditActivity'
export default {
  components: {
    ProfileCover,
    ProfileImage
  },
  props: {
    id: {
      type: [String, Number]
    }
  },
  data () {
    return {
      profileBackgroundImageUrl: null,
      profileImageUrl: null,
      nickname: null,
      articleSummaryInfo: {},
      experiencePoint: 0,
      externalProfile1: null,
      externalProfile2: null,
      introduction: null,
      gallery: []
    }
  },
  computed: {
    isMine () {
      return this.$session.getUserProfile().memberNo == this.id
    }
  },
  methods: {
    navigate (tab) {
      this.tab = tab
    },
    editProfile () {
      this.$activity.start(ProfileEditActivity, {
        id: this.id
      }).then(member => {
        if (member) {
          this.$store.commit('session/signin', member)
          this.search()
        }
      })
    },
    search () {
      this.$api.getMember(this.id).then(member => {
        if (member) {
          this.profileBackgroundImageUrl = member.profileBackgroundImageUrl
          this.profileImageUrl = member.profileImageUrl
          this.nickname = member.nickname
          this.articleSummaryInfo = member.articleSummaryInfo
          this.experiencePoint = member.experiencePoint
          this.introduction = member.introduction
          this.externalProfile1 = member.externalProfile1
          this.externalProfile2 = member.externalProfile2
          this.gallery = member.pictures
        } else {
          this.nickname = '탈퇴한 회원'
          this.$emit('error', true)
        }
      }).catch(error => {
        this.$swal.alert(error.message)
        this.$emit('error', true)
      })
    }
  },
  filters: {
    introduction (value) {
      if (value) {
        let line = value.split('\n')
        if (line.length > 4) {
          return line.filter((v, i) => i < 4).join('\n') + ' ...'
        } else {
          return value
        }
      }
    }
  },
  created () {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.profile {
  position: relative;
  padding-bottom: $footer-height;
  background-color: #eceff8;
  .profile-cover {
    height: 300px;
    background-size: cover;
    z-index: 1;
    flex-shrink: 0;
    $mask-height: 50px;
  }
  .profile-main {
    z-index: 1;
    margin: 0 20px;
    padding: 15px;
    width: 100%;
    border-radius: 10px;
    box-shadow: -5px -5px 8px 0 rgba(255, 255, 255, 0.55);
    background-color: #ffffff;
    .profile-image {
      margin-top: -45px;
      border: solid $global-border 1px;
      border-radius: 50%;
      border: solid #ffffff 2px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    }
    .profile-edit {
      display: inline-block;
      width: 35px;
      height: 35px;
      margin-top: -20px;
      margin-right: -25px;
      border-radius: 35px;
      background-color: #eceff8;
      box-shadow: 1px 2px 3px 0 #818aa7;
      border: none;
      font-size: 0;
    }
    .profile-user-name {
      font-weight: bold;
    }
    .profile-activity {
      display: flex;
      text-align: center;
      font-weight: bold;
      .profile-experience {
        .profile-activity-score {
          color: #81c683;
        }
      }
      .profile-attention {
        .profile-activity-score {
          color: #ff919a;
        }
        margin-left: 10px;
      }
      .profile-conversation {
        .profile-activity-score {
          color: #4dd0e2;
        }
        margin-left: 10px;
      }
      .profile-activity-score {
        font-size: 0.9rem;
      }
      .profile-activity-title {
        font-size: 0.7rem;
        color: #848484;
      }
    }
    .profile-user-account {
      margin-top: $layout-margin;
    }
    .profile-likes {
      font-size: 0.9rem;
    }
    .profile-comments {
      font-size: 0.9rem;
      margin-left: 15px;
    }
    .profile-intro {
      white-space: pre-wrap;
      font-size: 0.8rem;
      margin-top: $layout-margin;
    }
    .profile-link {
      margin-left: 5px;
      border-radius: 35px;
      &:first-child {
        margin-left: 0;
      }
      .profile-sns {
        display: block;
        width: 35px;
        height: 35px;
        background-size: cover;
        &.profile-sns-youtube {
          background-image: url('../assets/img/youtube@2x.png');
        }
        &.profile-sns-instagram {
          background-image: url('../assets/img/instagram@2x.png');
        }
        &.profile-sns-twitter {
          background-image: url('../assets/img/twitter@2x.png');
        }
        &.profile-sns-facebook {
          background-image: url('../assets/img/facebook@2x.png');
        }
        &.profile-sns-kakaostory {
          background-image: url('../assets/img/kakaostory@2x.png');
        }
      }
    }
  }
  .profile-gallery {
    $grid-margin: 20px;
    $grid-gab: 2px;
    $grid-cols: 3;
    display: grid;
    grid-template-columns: repeat($grid-cols, 1fr);
    margin: 10px $grid-margin;
    grid-gap: $grid-gab;
    .profile-gallery-cover {
      background-size: cover;
      height: calc(#{round(100 / $grid-cols)}vw - #{$grid-margin * 2 + $grid-gab * 2} / #{$grid-cols});
    }
  }
}
</style>
