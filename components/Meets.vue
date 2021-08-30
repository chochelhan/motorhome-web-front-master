<template>
  <div class="meets">
    <grid v-if="meets.length > 0" v-bind:data="meets" columns="3">
      <template v-slot:default="meet">
        <grid-article
          v-bind:title="meet.title"
          v-bind:cover="meet.mainImageUrl"
          v-bind:tags="meet.categories"
          v-bind:column="3"
          v-bind:class="{'meet-official': meet.official}"
          v-on:click.native="showArticle(meet)"
          cover-size="120by120"
        ></grid-article>
      </template>
    </grid>
    <div v-else class="empty">
      <strong v-if="categories.length > 0">검색결과가 없어요</strong>
      <strong v-else>등록된 리폼클럽이 아직 없어요</strong>
      <div style="margin-top: 18px;">
        <button v-on:click="writeArticle" type="button" class="uk-button uk-button-primary uk-radius" style="word-break: keep-all; white-space: nowrap;">
          <span uk-icon="icon: app-write; ratio: 0.8;"></span>
          신규 작성하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MeetWriteActivity from './activities/MeetWriteActivity'
import MeetArticleActivity from './activities/MeetArticleActivity'
import Grid from './Grid'
import GridArticle from './GridArticle'
export default {
  name: 'Meets',
  components: {
    Grid,
    GridArticle
  },
  props: {
    keyword: String,
    memberNo: Number,
    activityType: String
  },
  data () {
    return {
      page: 1,
      categories: [],
      meets: [],
      loading: false,
      noMore: false
    }
  },
  methods: {
    search (page = 1, clean = true) {
      this.$emit('update:loading', true)
      this.loading = true
      this.$api.get(`/reform-clubs`, {
        params: {
          page: page,
          categories: this.categories.join(','),
          activityType: this.activityType,
          keyword: this.keyword,
          memberNo: this.memberNo,
          size: 12
        }
      }).then(response => {
        this.$emit('update:no-more', true)
        this.noMore = true
        if (clean) {
          this.meets = []
        }
        if (response.data && response.data.length > 0) {
          this.page = page
          response.data.forEach(article => {
            article.categories = [article.information.substr(0, 10)].concat(article.categories)
            this.meets.push(article)
          })
          this.$emit('update:loading', false)
          this.$emit('update:no-more', false)
          this.loading = false
          this.noMore = false
        }
      })
    },
    writeArticle () {
      this.$activity.start(MeetWriteActivity, {
        title: '미트작성',
        topaz: true
      }).then(() => {
        this.search()
      })
    },
    showArticle (meet) {
      this.$activity.start(MeetArticleActivity, {
        id: meet.articleNo
      }).then(data => {
        if (data) {
          if (data.category) {
            this.categories = [data.category]
            this.search()
            this.$emit('search', data.category)
          }
          if (data.delete) {
            this.search()
          }
        } else {
          this.updateArticle(meet)
        }
      })
    },
    updateArticle (article) {
      this.$api.get(`/reform-clubs/${article.articleNo}`, {
        params: {
          viewed: false
        }
      }).then(response => {
        let index = this.meets.findIndex(_article => article.articleNo === _article.articleNo)
        response.data.categories = article.categories
        this.meets.splice(index, 1, response.data)
      })
    },
    loadMore () {
      this.search(this.page + 1, false)
    }
  },
  created () {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
.meets {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  .meet-official {
    &::before {
      content: '';
      display: block;
      width: 41px;
      height: 41px;
      top: -3px;
      left: -3px;
      background-image: url(../assets/img/official-ribbon.png);
      background-color: transparent;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      z-index: 1;
    }
  }
  .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
  }
}
</style>
