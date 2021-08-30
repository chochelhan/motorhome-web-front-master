<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" topaz rounded back background="#eceff8">
    <template v-slot:header>다이어리 작성</template>
    <template v-slot:operations>
      <button v-on:click="confirm" class="uk-button uk-button-link diary-write-confirm">게시</button>
    </template>
    <template v-slot:default>
      <div class="diary-write-body">
        <div class="diary-write-field">
          <div class="diary-write-field-label">해시태그를 골라주세요.</div>
          <category-groups ref="category" v-model="selected" board-code="1000"></category-groups>
        </div>
        <div class="diary-write-field">
          <div class="diary-write-field-label">많은 사람들에게 소식을 알려주세요!</div>
          <div class="diary-write-field-contents" style="margin-top: 15px;">
            <div v-on:click="setAccess('PUBLIC')" v-bind:class="{active: access === 'PUBLIC'}" class="diary-write-field-access">
              <label>전체 공개</label>
              <div class="diary-write-field-access-description">작성한 레저 다이어리가 모든 사용자에게 공개되고 관심, 댓글 피드백을 받습니다.</div>
            </div>
            <div v-on:click="setAccess('PRIVATE')" v-bind:class="{active: access === 'PRIVATE'}" class="diary-write-field-access">
              <label>나만보기</label>
            </div>
          </div>
        </div>
      </div>
    </template>
  </activity>
</template>

<script>
import CategoryGroups from '../CategoryGroups'
export default {
  name: 'LeisureDiaryWriteStep2Activity',
  components: {
    CategoryGroups
  },
  props: {
    resolve: Function,
    categories: Array,
    visibility: String
  },
  data () {
    return {
      selected: [],
      access: null
    }
  },
  methods: {
    setAccess (access) {
      this.access = access
    },
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      return this.$refs.category.check().then(() => {
        this.$refs.activity.finish({
          categories: this.selected,
          access: this.access
        })
      }).catch(error => {
        this.$swal.alert(error.message)
      })
    }
  },
  created () {
    this.access = this.visibility
    this.selected = this.categories
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
