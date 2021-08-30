<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" rounded close style="background-color: #eceff8;">
    <template v-slot:header>카테고리 필터</template>
    <template v-slot:operations>
      <span
        v-on:click="$refs.activity.finish(false)"
        uk-icon="icon: close; ratio: 1.5;"
        class="uk-icon-link"
        style="margin-right: 5px;"
      ></span>
    </template>
    <template>
      <filter-selector v-bind:items="items" v-bind:value="filters" v-bind:board-code="boardCode" v-on:input="confirm($event)"></filter-selector>
    </template>
  </activity>
</template>

<script>
import FilterSelector from '../FilterSelector'
export default {
  name: 'FilterActivity',
  components: {
    FilterSelector
  },
  props: {
    resolve: Function,
    filters: Array,
    items: Array,
    boardCode: String
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    confirm (selected) {
      this.$refs.activity.finish(selected)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
