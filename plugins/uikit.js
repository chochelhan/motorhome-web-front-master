import Vue from 'vue'

import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

UIkit.use(Icons)

export default (context, inject) => {
  inject('uikit', {
    confirm: (message, ok = '확인', cancel = '취소') => {
      return new Promise((resolve, reject) => {
        let modal = UIkit.modal.confirm(message, {
          labels: {
            ok: ok,
            cancel: cancel
          }
        })
        let dialog = modal.dialog
        modal.then(resolve).catch(reject)
        dialog.$el.style.display = null
        dialog.$el.classList.add('uk-flex')
        dialog.$el.classList.add('uk-modal-confirm')
        dialog.panel.classList.add('uk-margin-auto-vertical')
      })
    }
  })
}