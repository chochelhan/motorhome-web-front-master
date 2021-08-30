<template>
  <div v-bind:style="{'background-image': 'url(' + src + ')', 'width': width, 'height': height}" class="profile-cover"></div>
</template>

<script>
export default {
  name: 'ProfileCover',
  props: {
    src: {
      type: String,
      defatul () {
        return 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cGljdHVyZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'
      }
    },
    width: [Number, String],
    height: [Number, String]
  }
}
</script>

<style lang="scss" scoped>
.profile-cover {
  position: absolute;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  clip-path: polygon(0 0, 100% 0, 100% 60%, 0 90%);
  z-index: 0;
}
</style>
