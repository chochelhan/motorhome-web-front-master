import axios from 'axios'
import Qs from 'qs'

export default (context, inject) => {
    let accessToken
    if (process.server) {
        accessToken = context.req.cookies.access_token
    } else {
        accessToken = context.$cookie.get('access_token')
    }
    let headers = {}
    if (accessToken) {
        headers.Authorization = accessToken


    }
    //let url = '/test'
    let url = 'https://api.pi-wi.com'
    let api = axios.create({
        proxy: true,
        headers: headers,
        withCredentials: true,
        baseURL: url,
        paramsSerializer: function (params) {
            return Qs.stringify(params)
        }
    })
    api.token = accessToken
    api.interceptors.response.use(response => response, error => {
        if (error.response) {
            if (error.response.status === 401) {
                context.$session.signout()
            } else {
                console.log(error.response.data)
                context.$swal.alert(error.response.data.message)
            }
        }
        return error
    })

    api.getMember = memberNo => new Promise((resolve, reject) => {
        api.get(`/members/${memberNo}`).then(response => {
            resolve(response.data)
        }).catch(reject)
    })

    api.updateMember = member => new Promise((resolve, reject) => {
        if (member.profileImageUrl) {
        }
        if (member.externalProfile1 && !member.externalProfile1.url) {
            member.externalProfile1 = undefined
        }
        if (member.externalProfile2 && !member.externalProfile2.url) {
            member.externalProfile2 = undefined
        }
        return api.put(`/members/${member.memberNo}`, {
            nickname: member.nickname,
            profileImageUrl: member.profileImageUrl,
            introduction: member.introduction,
            externalProfile1: member.externalProfile1,
            externalProfile2: member.externalProfile2,
            profileBackgroundImageUrl: member.profileBackgroundImageUrl,
            pictures: member.pictures.filter(picture => picture)
        }).then(response => {
            resolve(member)
        }).catch(reject)
    })

    api.uploadImage = (type, file) => new Promise((resolve, reject) => {
        let form = new FormData()
        form.append('file', file)
        api.post(`/images`, form, {
            params: {
                imageType: type
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            resolve(response.data.imageUrl)
        }).catch(error => {
            if (error.response.status === 413) {
                context.$swal.alert('10메가 미만의 파일만 등록할 수 있습니다.')
            }
            reject(error)
        })
    })

    api.nicknameExistence = nickname => new Promise((resolve, reject) => {
        api.get(`/members/existence`, {
            params: {
                nickname: nickname
            }
        }).then(response => {
            if (resolve) {
                if (response.data) {
                    resolve(response.data.exist)
                } else {
                    resolve(null)
                }
            }
        }).catch(reject)
    })

    inject('api', api)
}
