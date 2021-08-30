import Vue from 'vue'
import Activity from '../components/Activity'
import AnonymousArticleActivity from '../components/activities/AnonymousArticleActivity'
import CampsiteActivity from '../components/activities/CampsiteActivity'
import JournalArticleActivity from '../components/activities/JournalArticleActivity'
import GuidebookArticleActivity from '../components/activities/GuidebookArticleActivity'
import FlexArticleActivity from '../components/activities/FlexArticleActivity'
import EventArticleActivity from '../components/activities/EventArticleActivity'
import LeisureDiaryArticleActivity from '../components/activities/LeisureDiaryArticleActivity'
import MeetArticleActivity from '../components/activities/MeetArticleActivity'
import NoticeArticleActivity from '../components/activities/NoticeArticleActivity'
import FaqActivity from '../components/activities/FaqActivity'
import ImageViewerActivity from '../components/activities/ImageViewerActivity'

Vue.component('activity', Activity)

export default (context, inject) => {
  inject('activity', {
    instant (activity, title, bind = {}) {
      context.store.commit('activity/start', {
        instant: true,
        is () {
          return activity
        },
        title: title,
        bind: bind
      })
    },
    start (activity, bind = {}) {
      return new Promise ((resolve, reject) => {
        document.body.style.overflow = 'hidden'
        context.store.commit('activity/start', {
          is () {
            return activity
          },
          resolve () {
            return resolve
          },
          bind: bind
        })
      })
    },
    finish (activity, parameters) {
      context.store.commit('activity/finish', activity)
      if (context.store.state.activity.list.length < 1) {
        document.body.style.overflow = null
      }
    },
    clear () {
      return new Promise((resolve, reject) => {
        context.store.commit('activity/clear')
        resolve()
      })
    },
    article (boardCode, articleNo) {
      articleNo = parseInt(articleNo)
      if (boardCode === 'DIARY' || boardCode === '1000') {
        return this.start(LeisureDiaryArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'CAMPSITE' || boardCode === '10000') {
        if (!context.store.state.app.location) {
          this.$swal.alert('잠시후 다시 시도해 주세요')
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
        return this.start(CampsiteActivity, {
          id: articleNo,
          latitude: context.store.state.app.location.latitude,
          longitude: context.store.state.app.location.longitude
        })
      }
      if (boardCode === 'BLANK' || boardCode === '7000') {
        return this.start(AnonymousArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'CLUB' || boardCode === '6000') {
        return this.start(MeetArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'JOURNAL' || boardCode === '2000') {
        return this.start(JournalArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'GUIDEBOOK' || boardCode === '3000') {
        return this.start(GuidebookArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'FLEX' || boardCode === '4000') {
        return this.start(FlexArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'EVENT' || boardCode === '5000') {
        return this.start(EventArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'NOTICE' || boardCode === '8000') {
        return this.start(NoticeArticleActivity, {
          id: articleNo
        })
      }
      if (boardCode === 'FAQ' || boardCode === '9000') {
        return this.start(FaqActivity, {
          id: articleNo
        })
      }
    },
    image (src) {
      return this.start(ImageViewerActivity, {
        src: src
      })
    }
  })
}