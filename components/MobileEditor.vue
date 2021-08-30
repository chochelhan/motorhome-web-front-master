<template>
  <div
    v-on:click.stop ref="container"
    v-bind:class="['device-' + $userAgent.device.model.toLowerCase(), 'version-' + $userAgent.device.version.toLowerCase(), focused ? 'focus' : 'blur']"
    class="uk-flex uk-flex-column uk-flex-1 editor-container"
  >
    <div
      ref="editor"
      v-html="data"
      v-on:keypress="update"
      v-on:keyup="update"
      v-on:keyup.enter="wrapText(); detectLink();"
      v-on:focus="focus(); detectLink();"
      v-on:blur="blur(); detectLink();"
      v-on:click="click"
      contenteditable="contenteditable"
      class="uk-flex-1 editor"
    ></div>
    <safearea-bottom></safearea-bottom>
    <div v-if="!data && !innerText" v-on:click="$refs.editor.focus()" ref="placeholder" class="placeholder">{{placeholder}}</div>
    <div ref="toolbar" v-on:click.stop class="toolbar">
      <div v-if="focusedElement && focusedElement.classList.contains('is-image')" class="toolbar-container">
        <div class="toolbar-buttons">
          <button v-if="focusedElement === primaryImage" v-on:click="unsetPrimaryImage(focusedElement)" type="button" class="uk-button uk-button-link">
            <span class="uk-flex uk-flex-center uk-flex-middle" style="margin-left: 3px;">
              <span uk-icon="icon: app-check-circle"></span>
              <span style="margin-left: 5px;">대표이미지로 지정</span>
            </span>
          </button>
          <button v-else v-on:click="setPrimaryImage(focusedElement)" type="button" class="uk-button uk-button-link">
            <span class="uk-flex uk-flex-center uk-flex-middle" style="margin-left: 3px;">
              <span uk-icon="icon: app-empty-circle"></span>
              <span style="margin-left: 5px;">대표이미지로 지정</span>
            </span>
          </button>
          <button v-on:click="removeFocusedElement" type="button" class="uk-button uk-button-link">
            <span uk-icon="icon: trash;"></span>
            <span style="margin-left: 3px;">삭제</span>
          </button>
        </div>
      </div>
      <div v-else-if="focusedElement && focusedElement.classList.contains('is-link-preview')" class="toolbar-container">
        <div class="toolbar-buttons">
          <div></div>
          <button v-on:click="removeFocusedElement" type="button" class="uk-button uk-button-link">
            <span uk-icon="icon: link;"></span>
            <span style="margin-left: 3px;">삭제</span>
          </button>
        </div>
      </div>
      <div v-else class="toolbar-container">
        <div class="toolbar-buttons" style="justify-content: center;">
          <button v-on:click="attachImage" type="button" class="uk-button uk-button-link">
            <span uk-icon="icon: app-attach;"></span>
            <span style="margin-left: 3px;">이미지 첨부</span>
            <input ref="imageInput" v-on:change="loadImage" type="file" accept="image/*" multiple class="input-hidden-file"/>
          </button>
          <button v-if="false" v-on:click="attachLink" type="button" class="uk-button uk-button-link">
            <span uk-icon="icon: link;"></span>
            <span style="margin-left: 3px;">링크첨부</span>
          </button>
        </div>
      </div>
      <safearea-bottom></safearea-bottom>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import LinkPreview from './LinkPreview'

export default {
  name: 'MobileEditor',
  props: {
    placeholder: {},
    value: {},
    interectionTime: {
      type: Number,
      default () {
        100
      }
    },
    maxUploadFileSize: {
      type: Number,
      default () {
        return 1024 * 1024 * 10
      }
    }
  },
  data () {
    return {
      data: this.value,
      focused: false,
      focusedElement: null,
      innerText: null,
      dialogLinkAddress: null,
      caretElement: null,
      primaryImage: null,
      primaryImageIndicator: null
    }
  },
  methods: {
    focus ($event) {
      this.clearCaretElement()
      this.placeToolbar()
      setTimeout(() => {
        let caretElement = this.getCaretElement()
        if (caretElement) {
          setTimeout(() => {
            caretElement.scrollIntoView()
          }, 500)
        }
      }, this.interectionTime)
    },
    blur () {
      this.saveCaretElement()
      this.update()
    },
    blurElement () {
      if (this.focusedElement) {
        this.focusedElement.classList.remove('element-focused')
        this.focusedElement = null
      }
    },
    click () {
      this.blurElement()
      this.placeToolbar()
    },
    placeToolbar () {
      // setTimeout(() => {
      //   let element = this.getCaretElement()
      //   this.$refs.toolbar.style.top = `${element.offsetTop + element.offsetHeight}px`
      // }, this.interectionTime)
    },
    update () {
      this.innerText = this.$refs.editor.innerText
      let div = document.createElement('div')
      div.innerHTML = this.$refs.editor.innerHTML
      div.querySelectorAll('.primary-image-indicator').forEach(el => el.remove())
      this.placeToolbar()
    },
    wrapText () {
      setTimeout(() => {
        let childNodes = this.$refs.editor.childNodes
        for (let index = 0; index < childNodes.length; index++) {
          if (childNodes[index].nodeType === Node.TEXT_NODE) {
            let container = document.createElement('div')
            container.innerText = childNodes[index].textContent
            childNodes[index].replaceWith(container)
          }
        }
      }, this.interectionTime)
      let caretElement = this.getCaretElement()
      if (caretElement) {
        caretElement.scrollIntoView()
      }
    },
    getCaretPosition (element = this.$refs.editor) {
      element.focus()
      let _range = document.getSelection().getRangeAt(0)
      let range = _range.cloneRange()
      range.selectNodeContents(element)
      range.setEnd(_range.endContainer, _range.endOffset)
      return alert(range.toString().length)
    },
    getCaretElement () {
      let node = document.getSelection().focusNode
      if (this.$refs.editor.contains(node)) {
        if (node.nodeType === 3) {
          return node.parentElement
        } else {
          return node
        }
      }
    },
    setCaretPosition (index) {
      setTimeout(() => {
        let range = document.createRange()
        let selection = window.getSelection()
        range.setStart(this.$refs.editor.childNodes[index], 0)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }, 100)
    },
    setCaretPositionAfter (element) {
      setTimeout(() => {
        let range = document.createRange()
        let selection = window.getSelection()
        range.setStart(element, 0)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }, 100)
    },
    clearCaretElement() {
      this.caretElement = null
    },
    saveCaretElement () {
      let caretElement = this.getCaretElement()
      if (caretElement) {
        this.caretElement = caretElement
      }
    },
    createNewline () {
      let nextDiv = document.createElement('div')
      nextDiv.innerHTML = '<br>'
      return nextDiv
    },
    appendElement (element) {
      let nextDiv = this.createNewline()
      let lastElement = this.$refs.editor.childNodes[this.$refs.editor.childNodes.length - 1]
      if (lastElement && (!lastElement.innerText || lastElement.innerHTML === '<br>')) {
        lastElement.replaceWith(element)
      } else {
        this.$refs.editor.appendChild(element)
      }
      this.$refs.editor.appendChild(nextDiv)
      this.setCaretPositionAfter(nextDiv)
    },
    appendToCaret (element) {
      let caretElement = this.caretElement || this.getCaretElement()

      if (caretElement === this.$refs.editor) {
        this.appendElement(element)
      } else if (caretElement.nextSibling) {
        let nextDiv = this.createNewline()
        if (!caretElement.innerText || caretElement.innerHTML === '<br>') {
          caretElement.replaceWith(element)
        } else {
          this.$refs.editor.insertBefore(element, caretElement.nextSibling)
        }
        this.$refs.editor.insertBefore(nextDiv, element.nextSibling)
        this.setCaretPositionAfter(nextDiv)
      } else {
        this.appendElement(element)
      }
    },
    extractTextNodes (target) {
      let nodes = []
      target.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('is-link-preview')) {
            return
          }
          this.extractTextNodes(node).forEach(node => {
            nodes.push(node)
          })
        } else if (node.nodeType === Node.TEXT_NODE) {
          nodes.push(node)
        }
      })
      return nodes
    },
    attachLinkPreview (link, target) {
      console.log(link)
      let ComponentClass = Vue.extend(Object.assign({}, LinkPreview, {
        $axios: this.$axios
      }))
      let instance = new ComponentClass({
        propsData: {
          value: link,
          disabled: true
        }
      })
      instance.$mount()
      target.appendChild(instance.$el)
      target.contentEditable = false
      target.classList.add('is-link-preview')
      target.addEventListener('click', (e) => {
        e.stopPropagation()
        if (this.focusedElement) {
          this.focusedElement.classList.remove('element-focused')
        }
        this.focusedElement = target
        target.classList.add('element-focused')
      })

      let nextDiv = this.createNewline()
      this.$refs.editor.appendChild(nextDiv)
      this.setCaretPositionAfter(nextDiv)
    },
    detectLink () {
      let regex = /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*([^\s]+)*/
      this.extractTextNodes(this.$refs.editor).forEach(node => {
        let parent = node.parentNode
        if (parent.nodeName.toLowerCase() === 'a') {
          if (parent.classList.contains('is-link')) return
          else parent.replaceWith(node)
        }
        let matches = regex.exec(node.nodeValue)
        if (matches) {
          let fragment = document.createDocumentFragment()
          if (matches.index > 0) {
            fragment.appendChild(document.createTextNode(node.nodeValue.substr(0, matches.index)))
          }
          let url = node.nodeValue.substr(matches.index, matches[0].length)
          let anchor = document.createElement('a')
          anchor.href = url
          anchor.target = '_blank'
          anchor.classList.add('is-link')
          anchor.appendChild(document.createTextNode(url))
          fragment.appendChild(anchor)
          let preMatchLength = matches.index + matches[0].length
          if ((node.nodeValue.length - preMatchLength) > 0) {
            fragment.appendChild(document.createTextNode(node.nodeValue.substr(preMatchLength)))
          }
          let div = document.createElement('div')
          fragment.appendChild(div)
          node.replaceWith(fragment)
          this.attachLinkPreview(url, div)
        }
      })
    },
    attachImage () {
      this.$refs.imageInput.click()
    },
    setPrimaryImageSrc (imageSrc) {
      let image = this.$refs.editor.querySelector(`[src="${imageSrc}"]`)
      if (image) {
        this.setPrimaryImage(image)
      }
    },
    setPrimaryImage (image) {
      if (this.primaryImage) {
        this.primaryImage.classList.remove('is-primary-image')
      }
      this.primaryImage = image
      this.primaryImage.classList.add('is-primary-image')
      this.primaryImageIndicator.style.display = 'block'
      this.primaryImageIndicator.style.top = `10px`
      this.primaryImageIndicator.style.left = `10px`
      this.primaryImage.parentNode.style.position = 'relative'
      this.primaryImage.parentNode.appendChild(this.primaryImageIndicator)
      this.$emit('update:primary-image', image.src.replace('?article', ''))
    },
    unsetPrimaryImage () {
      this.$refs.editor.appendChild(this.primaryImageIndicator)
      this.primaryImageIndicator.style.display = 'none'
      this.primaryImage = null
      this.$emit('update:primary-image', null)
    },
    removeFocusedElement () {
      let element = this.focusedElement
      while (element.parentNode !== this.$refs.editor) {
        element = element.parentNode
      }
      this.$refs.editor.removeChild(element)
      if (this.primaryImage === this.focusedElement) {
        this.primaryImageIndicator.style.display = null
        this.primaryImage.classList.remove('is-primary-image')
        this.primaryImage = null
        this.$emit('update:primary-image', null)
      }
      this.focusedElement = null
    },
    debug (tag) {
      console.log(tag, this.caretElement, this.getCaretElement())
    },
    loadImage () {
      if (this.$refs.imageInput.files) {
        let length = this.$refs.imageInput.files.length
        let completeLength = 0
        if (length > 20) {
          this.$swal.alert('한번에 20장까지 등록 가능합니다.')
          return
        }
        for (let index = 0; index < length; index++) {
          let file = this.$refs.imageInput.files[index]
          let reader = new FileReader()
          let div = document.createElement('div')
          let img = document.createElement('img')
          let nextDiv = document.createElement('div')
          this.$file.resizeImage(file).then(resizedImage => {
            this.$api.uploadImage('ARTICLE', resizedImage).then(imageUrl => {
              img.src = imageUrl + '?article'
              img.addEventListener('load', event => {
                this.update()
                div.classList.remove('image-loading')
                if (!this.primaryImage && index === 0) {
                  this.setPrimaryImage(event.target)
                }
              })
            })
          }).catch(error => {
            this.$swal.alert(error.message)
            div.remove()
          })
          reader.addEventListener('load', event => {
            img.src = event.target.result
            div.classList.add('image-loading')
            div.appendChild(img)
            this.appendToCaret(div)
            this.bindImage(img)
            completeLength++
            if (completeLength >= length) {
              this.$refs.imageInput.value = ''
              if (div.nextSibling) {
                setTimeout(() => {
                  div.nextSibling.scrollIntoView()
                  this.$refs.editor.blur()
                }, 100)
              }
            }
          })
          reader.readAsDataURL(file)
        }
      }
    },
    bindImage (img) {
      img.classList.add('is-image')
      img.addEventListener('click', (e) => {
        e.stopPropagation()
        if (this.focusedElement) {
          this.focusedElement.classList.remove('element-focused')
        }
        this.focusedElement = img
        img.classList.add('element-focused')
        this.placeToolbar()
      })
    },
    addPrimaryImageIndicator () {
      this.primaryImageIndicator = document.createElement('div')
      this.primaryImageIndicator.innerText = '대표'
      this.primaryImageIndicator.style.display = 'none'
      this.primaryImageIndicator.contentEditable = false
      this.primaryImageIndicator.classList.add('primary-image-indicator')
      this.$refs.editor.appendChild(this.primaryImageIndicator)
    },
    setData (data) {
      let div = document.createElement('div')
      div.innerHTML = data
      this.data = div.innerHTML
      this.$nextTick(() => {
        this.$refs.editor.querySelectorAll('img').forEach(image => {
          image.classList.remove('is-image')
          image.classList.remove('element-focused')
          this.bindImage(image)
        })
        this.$refs.editor.querySelectorAll('.is-link-preview').forEach(element => {
          element.remove()
        })
        this.detectLink()
        this.addPrimaryImageIndicator()
      })
    },
    hasUploading () {
      return this.$refs.editor.querySelector('.image-loading') ? true : false
    },
    getData () {
      let div = document.createElement('div')
      div.innerHTML = this.$refs.editor.innerHTML
      div.querySelectorAll('.image-loading').forEach(image => image.remove())
      div.querySelectorAll('img').forEach(image => {
        image.classList.remove('is-image')
        image.classList.remove('element-focused')
        image.src = image.src.replace('?article', '')
      })
      div.querySelectorAll('.primary-image-indicator').forEach(indicator => {
        indicator.remove()
      })
      return div.innerHTML
    },
    updateValue () {
      this.setData(this.value)
    }
  },
  mounted () {
    window.addEventListener('scroll', () => {
      this.$refs.toolbar.style.top = `${window.scrollY}px`
    })
    this.$refs.editor.addEventListener('focus', e => {
      setTimeout(() => {
        this.focused = true
      }, this.interectionTime)
    })
    this.$refs.editor.addEventListener('blur', e => {
    })
    document.body.addEventListener('click', e => {
      this.focused = false
    })
    if (!this.value) {
      let div = document.createElement('div')
      div.appendChild(document.createElement('br'))
      this.$refs.editor.appendChild(div)
    }

    this.addPrimaryImageIndicator()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

$toolbar-height: 40px;

.editor-container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  &.focus {
    .editor {
      outline: none;
      margin-bottom: $toolbar-height + 10px;
    }
    .placeholder {
    }
    .toolbar {
      display: block;
    }
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    color: #ffffff;
    padding: 0 20px;
    display: none;
    font-size: 0.9rem;
    .toolbar-container {
      display: flex;
      height: $toolbar-height;
      background-color: #16adb9;
      border-radius: 20px;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
      width: 100%;
      margin-bottom: 10px;
      padding: 0 20px;
    }
    .toolbar-buttons {
      display: flex;
      flex-grow: 1;
      height: 100%;
      justify-content: space-between;
      button {
        color: #ffffff;
        &:first-child {
          margin-left: 0;
        }
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: $content-margin;
      }
    }
  }
  .editor {
    background-color: transparent;
    padding: 10px;
  }
}

.toolbar:focus {
  display: flex;
}

.placeholder {
  color: #999999;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  z-index: -1;
}
</style>

<style lang="scss">
@import '../assets/scss/variables';
@import '../assets/scss/extension';
.editor {
  .element-focused {
    border: solid $global-primary-background 2px;
  }
  .primary-image-indicator {
    display: none;
    position: absolute;
    z-index: 2;
    color: #ffffff;
    background-color: #16adb9;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.61);
    border-radius: 20px;
    padding: 3px 20px;
    font-size: 1rem;
    font-weight: bold;
  }
  .image-loading {
    @extend .loader;
    &::before {
      content: '업로드중';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      font-size: 0.8rem;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.8);
    }
  }
  .is-link-preview {
    margin: 10px 0;
  }
}
</style>
