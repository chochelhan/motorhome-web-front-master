import swal from 'sweetalert'

export default (context, inject) => {
  inject('swal', {
    alert (text) {
      return swal(text)
    },
    confirm (text, confirmText = '확인', cancelText = '취소') {
      return new Promise((resolve, reject) => {
        swal({
          text: text,
          closeOnClickOutside: false,
          buttons: {
            cancel: {
              text: cancelText,
              value: null,
              visible: true,
              closeModal: true
            },
            confirm: {
              text: confirmText,
              value: true,
              closeModal: true
            }
          }
        }).then(value => {
          if (value) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  })
}