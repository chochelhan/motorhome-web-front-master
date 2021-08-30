<template>
  <div v-bind:data-src="((thumbnail && src) ? (src + '?' + thumbnail) : src) || fallbackImage" v-bind:style="{width: size, height: size}" uk-img class="uk-background-cover uk-light profile-image"></div>
</template>

<script>
export default {
  name: 'ProfileImage',
  props: {
    src: {
      type: String
    },
    thumbnail: {
      type: String,
      default () {
        return '72x72'
      }
    },
    fallbackImage: {
      default () {
        return '/img/icon-profile.png'
      }
    },
    size: [Number, String]
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.profile-image {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: solid $global-border 1px;
}
</style>
