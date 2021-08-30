<template>
  <div class="member-out">
    <div>
      <div class="member-out-header">그동안 PIWI와 함께 해주셔서<br/>진심으로 감사드립니다.</div>
      <div class="member-out-notice">회원 탈퇴 시, 즉시 PIWI 서비스 이용은 불가능하며 탈퇴 완료 시 회원님의 정보는 삭제되고 복구되지 않습니다.</div>
      <div class="member-out-notice">다만, 회원이실 때 작성하셨던 게시글 및 댓글은 삭제되지 않습니다. 삭제를 원하실 경우, 먼저 게시물을 삭제하신 후 탈퇴를 신청해주시기 바랍니다.</div>
    </div>
    <form class="member-out-form">
      <label for="member-out-label">탈퇴사유</label>
      <div class="uk-inline-block uk-form-controls uk-width-1-1">
        <textarea v-model="reason" placeholder="특별한 탈퇴 사유가 있다면 말씀해주세요. 더 나은 PIWI가 되도록 노력하겠습니다." rows="10"></textarea>
      </div>
      <button v-on:click="confirm" type="button" class="member-out-submit">탈퇴완료</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MemberOut',
  data () {
    return {
      reason: null
    }
  },
  methods: {
    confirm () {
      return this.$api.delete(`/members/${this.$store.state.session.user.memberNo}`, {
        withdrawalReason: this.reason
      }).then(response => {
        this.$swal.alert('탈퇴처리가 완료되었습니다. 그동안 이용 해 주셔서 감사합니다.').then(() => {
          this.$session.signout()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.member-out {
  padding: 20px;
  .member-out-header {
    font-size: 1rem;
    font-weight: bold;
    color: #16adb9;
  }
  .member-out-notice {
    font-size: 0.8rem;
    margin-top: 20px;
  }
  .member-out-form {
    background-color: #ffffff;
    border-radius: 20px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.16);
    .member-out-label {
      font-size: 1rem;
      color: #16adb9;
    }
    textarea {
      display: block;
      width: 100%;
      padding: 10px;
      outline: none;
      border: none;
      margin-top: 8px;
      background-color: #efefef;
      font-size: 0.8rem;
    }
    .member-out-submit {
      display: block;
      width: 100%;
      font-size: 1rem;
      border-radius: 27px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
      background-color: #16adb9;
      border: none;
      color: #ffffff;
      outline: none;
      padding: 10px;
      margin-top: 15px;
    }
  }
}
</style>
