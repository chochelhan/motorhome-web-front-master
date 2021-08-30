<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>

<script>
export default {
  name: 'TextEditor',
  data () {
    return {
      editor: null
    }
  },
  methods: {
    save () {
      return this.editor.save()
    }
  },
  mounted () {
    let EditorJS = require('@editorjs/editorjs')
    let ImageTool = require('@editorjs/image')
    this.editor = new EditorJS({
      holder: this.$refs.editor,
      placeholder: '내용을 입력하세요',
      tools: {
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: (file) => {
                return this.$api.uploadImage('ARTICLE', file).then(imageUrl => {
                  return {
                    success: 1,
                    file: {
                      url: imageUrl
                    }
                  }
                })
              }
            }
          }
        }
      }
    })
  }
}
</script>

<style lang="scss">
.ce-toolbar__content {
  width: 100% !important;
}
.image-tool__caption {
  display: none;
}
</style>
