<template>
  <div ref="input" v-html="data" v-on:keyup="input" v-on:blur="highlight" class="comment-input" contenteditable></div>
</template>

<script>
import Mark from 'mark.js'
export default {
  name: 'CommentInput',
  props: {
    value: String
  },
  data () {
    return {
      data: this.value,
      marker: null
    }
  },
  methods: {
    clean () {
      this.data = null
      this.$emit('input', this.data)
      this.$refs.input.innerHTML = ''
    },
    input () {
      this.$emit('input', this.$refs.input.innerText)
    },
    highlight () {
      this.marker.markRegExp(/@[^\s]+/, {
        className: 'comment-mention',
        each (element) {
          element.contentEditable = false
        }
      })
      this.$refs.input.querySelectorAll('mark').forEach(mark => {
        let parentNode = mark.parentNode
        if (mark.nodeName.toUpperCase() === 'MARK' && parentNode.nodeName.toUpperCase() === 'MARK') {
          parentNode.parentNode.insertBefore(mark, parentNode)
          parentNode.parentNode.removeChild(parentNode)
        }
      })
    }
  },
  mounted () {
    this.marker = new Mark(this.$refs.input)
    this.highlight()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.comment-input {
  padding: 11px;
  background-color: #f1f1f1;
  outline: none;
  &:empty::after {
    content: '댓글을 남겨보세요'
  }
}
</style>
