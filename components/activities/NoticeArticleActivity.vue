<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" rounded gradient back home>
    <template v-slot:header>공지사항</template>
    <template>
      <notice-article v-bind:id="id"></notice-article>
    </template>
  </activity>
</template>

<script>
import NoticeArticle from '../NoticeArticle'
export default {
  name: 'NoticeArticleActivity',
  components: {
    NoticeArticle
  },
  props: {
    id: {
      required: true
    },
    resolve: Function
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>
