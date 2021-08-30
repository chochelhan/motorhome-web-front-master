<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" rounded gradient back home>
    <template v-slot:header>도움말 FAQ</template>
    <template>
      <faq></faq>
    </template>
  </activity>
</template>

<script>
import Faq from '../Faq'
export default {
  name: 'FaqActivity',
  components: {
    Faq
  },
  props: {
    resolve: Function
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    }
  }
}
</script>
