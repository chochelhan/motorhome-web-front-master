<template>
  <div class="container" v-on:click="proxyFocus">
    <div ref="container" class="uk-input uk-float tags">
      <tag v-for="tag in tags" v-bind:key="tag" v-on:delete="deleteTag(tag)" editable class="tag">{{tag}}</tag>
      <input
        ref="input"
        v-model="text"
        v-bind:id="id"
        v-on:focus="focus"
        v-on:blur="blur"
        v-on:keyup.space="inputTag"
        v-on:keyup.enter="inputTag"
        v-bind:placeholder="placeholder"
        type="text" class="uk-input fake-input"
      />
    </div>
  </div>
</template>

<script>
import Tags from './Tags'
import Tag from './Tag'
export default {
  name: 'TagEditor',
  components: {
    Tags,
    Tag
  },
  props: {
    id: {},
    placeholder: {},
    value: Array
  },
  data () {
    return {
      text: null,
      tags: []
    }
  },
  methods: {
    focus () {
      this.$refs.container.classList.add('active')
    },
    blur () {
      this.inputTag()
      this.$refs.container.classList.remove('active')
    },
    proxyFocus () {
      this.$refs.input.focus()
    },
    parseText () {
    },
    deleteTag (tag) {
      if (confirm(`${tag}를 삭제하시겠습니까?`)) {
        this.tags = this.tags.filter(_tag => _tag !== tag)
      }
    },
    inputTag () {
      if (this.text) {
        this.text.split(/\s/).forEach(word => {
          if (word.length > 0 && this.tags.indexOf(word) < 0) {
            this.tags.push(word)
          }
        })
        this.text = null
      }
      this.$emit('input', this.tags)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.uk-input.active {
  border-color: $global-primary-background;
}
.container {
  overflow: hidden;
  cursor: text;
}
.tags {
  height: auto;
  min-height: $form-height;
  padding: 4px $form-padding-horizontal - $content-margin / 2;
}
.tag {
  line-height: initial;
  float: left;
  margin: $content-margin / 2;
}
.fake-input {
  line-height: initial;
  width: auto;
  height: 24px;
  padding: 0;
  border: none !important;
  outline: none;
  float: left;
  margin: $content-margin / 2;
}
</style>
