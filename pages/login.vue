<template>
  <div class="login">
    <div class="login-screen">
      <img src="../assets/img/logo.svg" width="50"/>
      <div class="login-slogan">PARADISE IS WHERE I AM</div>
    </div>
    <div class="login-form">
      <button v-on:click="signinWithKakao" type="button">
        <img src="../assets/img/join-button-plus.svg"/>
        카카오로 로그인
      </button>
      <button v-if="!$store.state.session.device || $store.state.session.device.os !== 'ANDROID'" v-on:click="signinWithApple" type="button">
         Apple로 로그인
      </button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  data () {
    return {
      isIphone: false,
      signinExpires: new Date('2035-12-31T23:59:59')
    }
  },
  methods: {
    signinWithKakao () {
      if (this.$store.state.session.device) {
        this.$command.execute('signin.kakao').then(data => {
          this.$api.get(`/auth/token`, {
            params: {
              code: data.accessToken,
              externalType: 'KAKAO'
            }
          }).then(response => {
            this.$cookie.set('external_type', 'KAKAO', {
              expires: this.signinExpires
            })
            this.$cookie.set('external_token', data.accessToken, {
              expires: this.signinExpires
            })
            if (response.data.isMember) {
              this.$session.signin(response.data.accessToken).then(response => {
                if (this.$route.query.return_url) {
                  location.href = this.$route.query.return_url
                } else {
                  location.href = '/'
                }
              })
            } else {
              this.$cookie.set('encrypt_external_id', response.data.encryptExternalId, {
                expires: this.signinExpires 
              })
              if (this.$route.query.return_url) {
                location.href = `/join?return_url=${this.$route.query.return_url}`
              } else {
                location.href = '/join'
              }
            }
          }).catch(error => {
            console.error(error)
            response.send(error.response.data)
          })
        })
      } else {
        location.href = '/signin/kakao'
      }
    },
    signinWithApple () {
      if (this.$store.state.session.device) {
        this.$command.execute('signin.apple').then(data => {
          this.$api.get(`/auth/token`, {
            params: {
              code: data.accessToken,
              externalType: 'APPLE',
              redirectUri: `${location.origin}/auth/apple`
            }
          }).then(response => {
            this.$cookie.set('external_type', 'APPLE', {
              expires: this.signinExpires
            })
            this.$cookie.set('external_token', data.accessToken, {
              expires: this.signinExpires
            })
            if (response.data.isMember) {
              this.$session.signin(response.data.accessToken).then(response => {
                if (this.$route.query.return_url) {
                  location.href = this.$route.query.return_url
                } else {
                  location.href = '/'
                }
              })
            } else {
              this.$cookie.set('encrypt_external_id', response.data.encryptExternalId, {
                expires: this.signinExpires
              })
              if (this.$route.query.return_url) {
                location.href = `/join?return_url=${this.$route.query.return_url}`
              } else {
                location.href = '/join'
              }
            }
          }).catch(error => {
            console.error(error)
            response.send(error.response.data)
          })
        })
      } else {
        location.href = '/signin/apple'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #16adb9;
  .login-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    background-image: url('../assets/img/loading-background.png');
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
    .login-slogan {
      margin-top: 30px;
      color: #ffffff;
    }
  }
  .login-form {
    padding: 25px 40px;
    display: flex;
    flex-direction: column;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      color: #ffffff;
      border: none;
      background-color: transparent;
      padding: 12px;
      margin-top: 15px;
      border-radius: 20px;
      word-break: keep-all;
      white-space: nowrap;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: -3px -3px 6px 0 rgba(255, 255, 255, 0.46);
        border-radius: 20px;
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
        border-radius: 20px;
      }
      &:first-child {
        margin-top: 0;
      }
      img {
        margin-right: 5px;
      }
    }
  }
}
</style>
