<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" rounded gradient back>
    <template v-slot:header>{{title}}</template>
    <template>
      <div class="activity-container">
        <div class="logo-image">
          <img src="../../assets/img/logo-primary.svg"/>
        </div>
        <div v-html="contents" class="contents"></div>
      </div>
    </template>
    <template v-if="confirmText" v-slot:footer>
      <div class="activity-footer">
        <button v-on:click="confirm" type="button" class="uk-button uk-button-primary">{{confirmText}}</button>
      </div>
    </template>
  </activity>
</template>

<script>
export default {
  name: 'ConfirmActivity',
  props: {
    title: String,
    contents: String,
    confirmText: String,
    resolve: Function
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      this.$refs.activity.finish(true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.activity-container {
  padding: 21px;
  .contents {
    padding: 13px 20px;
    background-color: #ffffff;
    font-size: 0.85rem;
  }
}
.activity-footer {
  width: 100%;
  height: 90px;
  padding: 24px;
  button {
    border: none;
    width: 100%;
    height: 100%;
    border-radius: 27px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.16);
  }
}
</style>

<style lang="scss">
.activity-container {
  .logo-image {
    text-align: center;
    margin: 20px 20px 40px;
  }
  .contents {
    span {
      word-break: break-all;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      td {
        border: solid #cccccc 1px;
      }
    }
  }
}
</style>
