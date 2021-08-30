<template>
  <div class="articles">
    <a
      v-for="(article, index) in data"
      v-bind:key="index"
      v-bind:data-src="article.cover"
      v-on:click.prevent="$emit('route', article)"
      uk-img
      class="uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light article"
    >
      <div class="cover">
        <div class="title uk-text-ellipsis">{{article.title}}</div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'CoverGallery',
  props: {
    data: Array
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.article {
  margin-top: $layout-margin;
  height: 150px;
  display: flex;
  flex-flow: column;
  border: solid $global-border 1px;
  &:first-child {
    margin-top: 0;
  }
  .cover {
    width: 100%;
    background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 100%);
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    padding: $layout-margin;
    .title {
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
