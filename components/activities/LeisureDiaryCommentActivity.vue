<template>
  <activity v-on:finish="finish">
    <template v-slot:header>댓글보기(총 {{comments.length}}개)</template>
    <template>
      <leisure-diary-comments v-model="comments" v-bind:id="id"></leisure-diary-comments>
    </template>
  </activity>
</template>

<script>
import LeisureDiaryComments from '../LeisureDiaryComments'
export default {
  name: 'LeisureDiaryCommentActivity',
  components: {
    LeisureDiaryComments
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      comments: []
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>