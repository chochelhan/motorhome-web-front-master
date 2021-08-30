<template>
  <activity gradient rounded prevent-drag>
    <template v-slot:header>{{title}}</template>
    <template>
      <div class="activity-container">
        <div class="logo-image">
          <img src="../assets/img/logo-primary.svg"/>
        </div>
        <div v-html="contents" class="contents"></div>
      </div>
    </template>
  </activity>
</template>

<script>
export default {
  name: 'Support',
  layout: 'public',
  data () {
    return {
      title: null,
      contents: null
    }
  },
  created () {
    this.$api.get(`/terms`, {
      params: {
        termsTypes: 'INTRODUCTION'
      }
    }).then(response => {
      this.title = response.data[0].title
      this.contents = response.data[0].contents
    })
  }
}
</script>

<style lang="scss" scoped>
.activity-container {
  padding: 21px;
  .logo-image {
    text-align: center;
    margin: 20px 20px 40px;
  }
  .contents {
    padding: 13px 20px;
    background-color: #ffffff;
    font-size: 0.85rem;
  }
}
</style>
