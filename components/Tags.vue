<template>
  <div class="tags">
    <tag v-for="tag in value" v-bind:key="tag" v-bind:text="text" v-bind:editable="editable" v-on:click.native="$emit('click', tag)" v-on:delete="deleteTag(tag)">#{{tag}}</tag>
  </div>
</template>

<script>
import Tag from './Tag'

export default {
  components: {
    Tag
  },
  props: {
    value: Array,
    editable: Boolean,
    text: Boolean
  },
  methods: {
    deleteTag (tag) {
      if (this.editable) {
        this.$swal.confirm(`${tag}를 삭제하시겠습니까?`).then(() => {
          this.$emit('input', this.value.filter(_tag => _tag !== tag))
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tags {
  margin: -2px;
  display: flex;
  flex-wrap: wrap;
  .tag {
    margin: 2px;
  }
}
</style>
