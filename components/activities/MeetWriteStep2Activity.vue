<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve"  back topaz rounded>
    <template v-slot:header>리폼클럽 작성</template>
    <template v-slot:operations>
      <strong v-on:click="confirm">게시</strong>
    </template>
    <template v-slot:default>
      <div class="diary-write-body">
        <div class="diary-write-field">
          <div class="diary-write-field-label">해시태그를 골라주세요.</div>
          <category-groups v-model="selected" board-code="6000"></category-groups>
        </div>
      </div>
    </template>
  </activity>
</template>

<script>
import CategoryGroups from '../CategoryGroups'
export default {
  name: 'MeetWriteStep2Activity',
  components: {
    CategoryGroups
  },
  props: {
    resolve: Function,
    value: {
      type: Object,
      default () {
        return {
          categories: []
        }
      }
    }
  },
  data () {
    return {
      selected: []
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      this.$refs.activity.finish({
        categories: this.selected
      })
    }
  },
  created () {
    this.selected = this.value.categories
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
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
    .diary-write-field-contents {
      .diary-write-field-tags {
        margin-top: 15px;
        display: grid;
        grid-template-columns: 80px 1fr;
        label {
          margin-top: 3px;
          font-size: 0.9rem;
          font-weight: bold;
        }
        .diary-write-field-tag-values {
          padding-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          button {
            color: #5b5b5b;
            background-color: #d4daec;
            border: none;
            padding: 5px 0;
            width: 68px;
            font-size: 0.75rem;
            border-radius: 20px;
            margin: 3px;
            &.active {
              background-color: #a6e7ed;
            }
          }
        }
      }
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
</style>
