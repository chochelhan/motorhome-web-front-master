<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve">
    <template v-slot:header>링크 첨부</template>
    <template>
      <link-attach-selector v-model="url" v-bind:preview.sync="preview"></link-attach-selector>
    </template>
    <template v-slot:footer>
      <button v-on:click="confirm" type="button" class="uk-button uk-button-default" style="border: none; width: 100%; height: 100%;">링크정보 본문에 첨부하기</button>
    </template>
  </activity>
</template>

<script>
import LinkAttachSelector from '../LinkAttachSelector'
export default {
  components: {
    LinkAttachSelector
  },
  props: {
    resolve: Function
  },
  data () {
    return {
      url: null,
      preview: null
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm () {
      this.$refs.activity.finish(this.preview)
    }
  }
}
</script>
