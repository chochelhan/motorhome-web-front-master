<template>
  <a v-if="preview" v-bind:href="preview.url" v-on:click="preventIfDiabled" target="_blank" class="uk-display-block link-preview">
    <div v-if="isYoutube">
      <youtube-video v-model="youtubeVideoId"></youtube-video>
    </div>
    <div v-else class="uk-flex uk-flex-middle">
      <div v-if="preview.images && preview.images.length > 0" v-bind:data-src="preview.images[0]" uk-img class="uk-background-cover uk-light link-preview-cover"></div>
      <div class="uk-flex uk-flex-column uk-flex-1 link-preview-info">
        <div v-if="preview.title" class="link-preview-title">{{preview.title}}</div>
        <div class="link-preview-address">{{preview.url}}</div>
      </div>
    </div>
    <div v-if="disabled" class="disable-mask"></div>
  </a>
</template>

<script>
import YoutubeVideo from './YoutubeVideo'

export default {
  name: 'LinkPreview',
  components: {
    YoutubeVideo
  },
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: Boolean
  },
  data () {
    return {
      preview: null,
      isYoutube: false,
      youtubeVideoId: null
    }
  },
  methods: {
    preventIfDiabled (event) {
      if (this.disabled) {
        event.preventDefault()
      }
    }
  },
  mounted () {
    let url = this.value
    if (this.value.indexOf('https://blog.naver.com') === 0) {
      let matches = /https:\/\/blog\.naver\.com\/([^\/]+)\/(\d+)/.exec(this.value)
      url = `https://blog.naver.com/PostView.nhn?blogId=${matches[1]}&logNo=${matches[2]}`
    }
    this.$axios.get(`/link-preview`, {
      params: {
        link: url
      }
    }).then(response => {
      this.preview = response.data
      if (this.preview.url.match(/^https:\/\/(?:www\.)?youtube\.com/)) {
        this.youtubeVideoId = this.preview.query.v
        if (this.youtubeVideoId) {
          this.isYoutube = true
        }
      }
      this.$emit('update:preview', this.preview)
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.link-preview {
  position: relative;
  line-height: 1.5;
  margin-top: $content-margin;
  border: solid $global-border 1px;
  padding: $layout-margin;
  font-size: 0.9rem;
  &:first-child {
    margin-top: 0;
  }
  .link-preview-header {
    font-weight: bold;
    padding-bottom: $content-margin;
  }
  .link-preview-cover {
    width: 50px;
    height: 50px;
    border: solid $global-border 1px;
  }
  .link-preview-info {
    padding-left: $content-margin;
    .link-preview-title {
      word-break: break-all;
    }
    .link-preview-address {
      word-break: break-all;
    }
  }
  .disable-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
