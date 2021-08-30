<template>
  <div>
    <events v-if="!empty" v-on:empty="checkEmpty">Event</events>
    <div v-else class="uk-flex uk-flex-1 uk-flex-column uk-flex-center uk-flex-middle uk-text-center">
      <div>참여한 이벤트가 없습니다.</div>
      <div v-if="isMine">
        <button type="button" class="uk-button uk-button-default">이벤트 바로가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import Events from './Events'
export default {
  name: 'ProfileEvents',
  components: {
    Events
  },
  props: {
    isMine: Boolean
  },
  data () {
    return {
      empty: null
    }
  },
  methods: {
    checkEmpty (empty) {
      this.empty = empty
      this.$emit('empty', this.empty)
    }
  },
  created () {
  }
}
</script>
