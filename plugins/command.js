export default (context, inject) => {
  window.app = context.app

  inject('command', {
    executeTry: 0,
    resolvers: {},
    execute (name, data) {
      return new Promise((resolve, reject) => {
        try {
          if (window.commandPort) {
            let id = Object.keys(this.resolvers).length
            this.resolvers[id] = resolve
            window.commandPort.postMessage(JSON.stringify({
              id: id,
              name: name,
              data: data
            }))
          } else {
            if (this.executeTry < 5) {
              setTimeout(() => {
                this.executeTry++
                this.execute(name, data)
              }, 200)
            }
          }
        } catch (e) {
          if (reject) {
            reject(e)
          }
        }
      })
    },
    fire (id, data) {
      if (this.resolvers[id]) {
        this.resolvers[id](data)
        delete this.resolvers[id]
      }
    },
    alert (message) {
      this.execute('alert', {
        message: message
      })
    },
    setDevice (device) {
      context.store.commit('session/setDevice', device)
    },
    setFcmToken (token) {
      context.store.commit('session/setDevice', {
        token: token
      })
    },
    iosKeyboardShown (height) {
      context.store.commit('app/setIosKeyboardShow', true)
      context.store.commit('app/setIosKeyboardHeight', height)
    },
    iosKeyboardHide () {
      context.store.commit('app/setIosKeyboardShow', false)
      context.store.commit('app/setIosKeyboardHeight', null)
    },
    getActivityLength () {
      return context.store.state.activity.list.length
    },
    closeTopActivity () {
      let activities = context.app.activityManager.$refs.activity
      if (activities.length > 0) {
        activities[activities.length - 1].$refs.activity.finish()
      }
    }
  })
}
