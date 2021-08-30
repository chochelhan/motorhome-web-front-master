<template>
  <div class="faq">
    <div class="faq-category">
      <button
        v-for="category in categories" v-bind:key="category.id"
        v-bind:class="{'active': active === category.id}"
        v-on:click="search(category.id)"
        type="button"
        class="uk-inline-block uk-text-center"
      >{{category.name}}</button>
    </div>
    <ul class="faq-articles" uk-accordion>
      <li v-for="article in articles" v-bind:key="article.articleNo">
          <a class="uk-accordion-title" href="#">{{article.question}}</a>
          <div class="uk-accordion-content">{{article.answer}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Faq',
  data () {
    return {
      active: null,
      categories: [
        {
          id: null,
          name: '전체'
        },
        {
          id: 'MEMBER',
          name: '회원정보'
        },
        {
          id: 'DIARY',
          name: '다이어리 작성'
        },
        {
          id: 'SHARE',
          name: '공유/저작권'
        },
        {
          id: 'LOCATION',
          name: '위치서비스'
        },
        {
          id: 'ETC',
          name: '기타'
        }
      ],
      articles: []
    }
  },
  methods: {
    setCategory (categoryId) {
      this.active = categoryId
    },
    search (category) {
      this.setCategory(category)
      this.$api.get(`/faq`, {
        params: {
          category: category
        }
      }).then(response => {
        this.articles = response.data
      })
    }
  },
  created () {
    this.search(null)
  }
}
</script>

<style lang="scss" scoped>
.faq {
  height: 100%;
  background-color: #f1f1f1;
  .faq-category {
    display: grid;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 30px;
    grid-template-columns: repeat(3, 1fr);
    &.active {
      font-weight: bold;
    }
    button {
      border: none;
      padding: 10px 10px;
      border-radius: 40px;
      background-color: #f0f0f0;
      color: #5d5d5d;
      font-size: 0.80rem;
      margin: 1px;
      &.active {
        background-color: #16adb9;
        color: #ffffff;
      }
    }
  }
  .faq-articles {
    padding: 0 20px;
    li {
      margin-top: 5px;
      border: solid #d9d9d9 1px;
      background-color: #ffffff;
      padding: 13px 17px;
      border-radius: 20px;
      .uk-accordion-title {
        font-size: 0.8rem;
        color: #818aa7 !important;
        font-weight: bold;
        &::before {
          background-image: url('../node_modules/uikit/src/images/icons/chevron-right.svg');
          margin-left: 0;
        }
      }
      &.uk-open {
        .uk-accordion-title {
          &::before {
            background-image: url('../node_modules/uikit/src/images/icons/chevron-down.svg');
          }
        }
      }
      .uk-accordion-content {
        font-size: 0.8rem;
        margin-top: 10px;
      }
    }
  }
}
</style>
