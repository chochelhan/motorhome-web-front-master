<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" v-bind:return-data="count" flat back without-safearea-bottom>
    <template v-slot:header>댓글 {{count}}</template>
    <template>
      <comments ref="comments" v-bind:creator-no="creatorNo" v-bind:article-no="id" v-on:count="updateCount($event)"></comments>
    </template>
  </activity>
</template>

<script>
import Comments from '../Comments'
export default {
  name: 'CommentsActivity',
  components: {
    Comments
  },
  props: {
    id: Number,
    creatorNo: Number,
    syncCount: Function,
    resolve: Function
  },
  data () {
    return {
      count: 0
    }
  },
  methods: {
    updateCount (count) {
      this.count = count
      this.syncCount(count)
    },
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>