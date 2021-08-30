<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" topaz rounded back background="#eceff8">
    <template v-slot:header>신고하기</template>
    <template v-slot:operations>
      <button v-on:click="confirm" class="uk-button uk-button-link diary-write-confirm">신고</button>
    </template>
    <template v-slot:default>
      <div class="diary-write-body">
        <div class="diary-write-field">
          <div class="diary-write-field-label">어떤 사유로 신고를 하려고 하시는지?</div>
          <div class="diary-write-field-contents" style="margin-top: 15px;">
            <div
              v-for="reason in reasons" v-bind:key="reason.code"
              v-bind:class="{active: reasonType === reason.code}"
              v-on:click="reasonType = reason.code"
              class="diary-write-field-access"
            >
              <label>{{reason.description}}</label>
            </div>
          </div>
        </div>
      </div>
    </template>
  </activity>
</template>

<script>
export default {
  name: 'ReportActivity',
  props: {
    resolve: Function,
    articleNo: Number,
    boardCode: String
  },
  data () {
    return {
      reasons: [
        {
          code: 'SUBJECT',
          description: '주제와 맞지 않음'
        },
        {
          code: 'INFORMATION',
          description: '정보가 부정확함'
        },
        {
          code: 'ADVERTISEMENT',
          description: '지나친 광고성 게시물'
        },
        {
          code: 'DUPLICATED',
          description: '도배 및 중복 게시물'
        },
        {
          code: 'COPYRIGHT',
          description: '저작권 침해가 우려됨'
        },
        {
          code: 'ABUSE',
          description: '욕설/비방이 심함'
        },
        {
          code: 'OBSCENE',
          description: '외설적인 게시물'
        },
        {
          code: 'PERSONAL_INFORMATION',
          description: '개인정보 노출'
        },
        {
          code: 'ETC',
          description: '기타'
        }
      ],
      reasonType: null
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      if (this.reasonType) {
        this.$api.post(`/reports`, {
          reportType: this.reasonType,
          articleNo: this.articleNo
        }).then(() => {
          this.$swal.alert('게시물의 신고처리가 완료되었습니다')
          this.$refs.activity.finish({
            reason: this.reason
          })
        }).catch(error => {
          this.$swal.alert(error.message)
        })
      } else {
        this.$swal.alert('사유를 선택해 주세요')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.diary-write-confirm {
  font-weight: bold;
  text-decoration: none;
}
.diary-write-body {
  padding: 20px;
  .diary-write-field {
    margin-top: 20px;
    &:first-child {
      margin-top: 0;
    }
    .diary-write-field-label {
      color: #2e98b0;
      font-size: 0.9rem;
      font-weight: bold;
    }
    .diary-write-field-access {
      padding-top: 7px;
      padding-left: 47px;
      padding-bottom: 10px;
      background-image: url('../../assets/img/plus-circle-grey.png');
      background-repeat: no-repeat;
      background-size: 46px 46px;
      background-position: left top;
      &.active {
        background-image: url('../../assets/img/check-circle.png');
      }
      label {
        font-size: 0.9rem;
        font-weight: bold;
      }
      .diary-write-field-access-description {
        font-size: 0.75rem;
      }
    }
  }
}
.activity-content {
  background-color: transparent !important;
}
</style>
