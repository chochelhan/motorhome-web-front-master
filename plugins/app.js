import Vue from 'vue'
import jwt from 'jsonwebtoken'

export default (context, inject) => {
  let location = {
    complete: false
  }
  location.getCurerntPosition = () => {
    return new Promise((resolve, reject) => {
      if (process.browser) {
        setTimeout(() => {
          if (!location.complete) {
            reject(null)
          }
        }, 5000)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            location.complete = true
            if (position.length) {
              resolve(position[0])
            } else {
              resolve(position)
            }
          }, error => {
            location.complete = true
            reject(error)
          }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
          })
        } else {
          location.complete = true
          reject(null)
        }
      } else {
        location.complete = true
        resolve(null)
      }
    })
  }

  inject('file', {
    resizeImage (file) {
      return new Promise((resolve, reject) => {
        let image = new Image()
        let reader = new FileReader()
        reader.addEventListener('load', event => {
          image.src = event.target.result
        })
        console.log(`file.size -> ${file.size}`)
        if (file.size < (1024 * 1024 * 10)) {
          return resolve(file)
        }
        image.addEventListener('load', event => {
          let canvas = document.createElement('canvas'), maxSize = 2400, width = event.target.width, height = event.target.height
          console.log(`width, height -> ${width}, ${height}`)
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(event.target, 0, 0, width, height)
          canvas.toBlob(blob => {
            let resizedImage = new File([blob], file.name, {
              type: file.type
            }, file.type)
            if (resizedImage.size > this.maxUploadFileSize) {
              reject(Error('이미지는 10mb까지만 업로드 가능합니다.'))
            } else {
              resolve(resizedImage)
            }
          })
        })
        reader.readAsDataURL(file)
      })
    }
  })

  inject('location', location)

  // inject('token', {})
  if (process.browser) {
    if (context.$cookie.get('access_token')) {
      let token = jwt.decode(context.$cookie.get('access_token'))
      inject('token', JSON.parse(token.target))
    }
  } else {
    if (context.req.cookies.access_token) {
      let token = jwt.decode(context.req.cookies.access_token)
      inject('token', JSON.parse(token.target))
    }
  }
}
