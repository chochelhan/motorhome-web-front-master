<template>
  <div class="posting-list">
    <div v-for="(item, index) in data" v-bind:key="index" class="posting-item">
      <div class="posting-thumbnails">
        <div v-for="(thumb, index) in item.thumbnails" v-bind:key="index" class="posting-thumbnail">
          <div
            v-bind:data-src="thumb" uk-img
            class="uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light"
          ></div>
        </div>
      </div>
      <div class="posting-title uk-text-ellipsis">{{item.title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostingList',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.posting-list {
  .posting-item {
    margin-top: 10px;
    padding: 10px;
    border: solid $global-border 1px;
    .posting-thumbnails {
      display: flex;
      justify-content: space-between;
      height: calc(33vw - 20px);
      .posting-thumbnail {
        width: calc(33vw - 20px);
        display: flex;
        .uk-background-cover {
          width: 100%;
        }
      }
    }
    .posting-title {
      margin-top: 7px;
    }
  }
}
</style>
