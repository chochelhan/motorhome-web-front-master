<template>
  <div class="article">
    <div class="article-header">
      <div class="article-category">{{article.category}} &gt;</div>
      <h2>{{article.title}}</h2>
      <div class="article-info">
        <div class="article-created-at">작성일시 {{article.created_at | formatDate}}</div>
        <div class="article-view-count">조회수 {{article.view_count | numberFormat}}</div>
      </div>
      <tags v-model="article.tags" class="article-tags"></tags>
    </div>
    <div class="article-body" v-html="article.contents"></div>
  </div>
</template>

<script>
import Tags from './Tags'

export default {
  name: 'FaqArticle',
  components: {
    Tags
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      article: {
        id: 1,
        category: '캠핑의 정석',
        title: '백패킹 부터 글램핑 까지? 대표적 캠핑의 종류',
        contents: `
          <div>코로나로 인해 사람과 접촉하지 않고 즐길 수 있는 언택트 차 박캠핑이 유행입니다. 보다 감성있게 차박 캠핑을 즐길 수 있 는 국내 차박 장소를 추천 해 드리고자 합니다.</div>
          <div><img src="https://getuikit.com/docs/images/light.jpg"></div>
          <div>우리 가족이 방문한 곳은 한강공원의 난지 캠핑장! 주차시설도 편리하지만 서울 근교에서 쉽게 접근할 수 있어서 좋았습니다. 주차장은 총 3개가 있는데 그중 맨 앞에 있는 출입구가 강변북로에서 접근할 수 있습니다.</div>
        `,
        created_at: '2020-09-18 00:00:00',
        view_count: 2042,
        tags: ['#언택트차박', '#차박장소', '#차박장소추천', '#캠핑카']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.article {
  .article-header {
    padding: $layout-margin;
    .article-category {
      font-size: 0.9rem;
    }
    h2 {
      font-size: 1rem;
      font-weight: bold;
      margin: 0;
    }
    .article-info {
      margin-top: $content-margin;
      font-size: 0.75rem;
      display: flex;
      .article-view-count {
        margin-left: $layout-margin;
      }
    }
    .article-tags {
      margin-top: $content-margin;
    }
  }
  .article-body {
    padding: $layout-margin;
    font-size: 0.8rem;
  }
}
</style>
