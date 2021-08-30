<template>
  <div>
    <div>
      <div class="uk-width-1-1 uk-position-relative uk-flex">
        <span class="uk-form-icon" uk-icon="icon: search;"></span>
        <input v-model="keyword" v-on:keyup.enter="search" type="search" class="uk-input" placeholder="URL을 입력하세요"/>
        <button v-on:click="search" type="button" class="uk-button uk-button-default" style="word-break: keep-all;">검색</button>
      </div>
    </div>
    <div class="link-body">
      <div>첨부 미리보기</div>
      <link-preview v-if="searched" v-model="keyword" v-bind:preview.sync="preview"></link-preview>
    </div>
  </div>
</template>

<script>
import LinkPreview from './LinkPreview'
export default {
  name: 'LinkAttachSelector',
  components: {
    LinkPreview
  },
  props: {
    value: String
  },
  data () {
    return {
      keyword: null,
      preview: null,
      searched: false
    }
  },
  methods: {
    search () {
      this.searched = true
    }
  },
  watch: {
    preview (newVal) {
      this.$emit('input', newVal.url)
      this.$emit('update:preview', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.link-body {
  padding: $layout-margin;
}
.link-preview {
  padding: $layout-margin;
  border: solid $global-border 1px;
  .link-preview-image {
    width: 50px;
    height: 50px;
  }
}
</style>
