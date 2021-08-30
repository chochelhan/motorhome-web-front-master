<template>
    <div class="leisure-diary">
        <div class="uk-flex uk-flex-between uk-flex-middle">
            <div style="font-size: 0.8rem; color: #323232;">전체 {{ count | numberFormat }}</div>
            <div>
                <tag-filter-button v-on:click.native="filterActivity" v-on:mousedown.stop
                                   v-on:touchstart.stop></tag-filter-button>
            </div>
        </div>
        <filters v-model="filters" v-on:input="search(1)" style="margin-top: 5px;"></filters>
        <leisure-diaries
            ref="articles"
            v-bind:count.sync="count"
            v-on:search="filters = [$event]"
            v-on:update:loading="loading = $event"
            v-on:update:no-more="noMore = $event"
            style="margin-top: 10px;"
        ></leisure-diaries>
        <!-- <grid v-bind:data="items" columns="2" style="margin-top: 15px;">
          <template v-slot:default="item">
            <grid-article
              v-bind:title="item.title"
              v-bind:cover="item.mainImageUrl"
              v-bind:profile="item.creatorInfo.profileImageUrl"
              v-on:click.native="showArticle(item)"
              column="2"
            ></grid-article>
          </template>
        </grid> -->
        <!-- jjong2028 ==> 익멍복원 -->
        <fab @click="writeDiary" :style="pageStyle">
            <!--FLEX복원--> <!--<fab v-on:click="writeDiary" style="right: calc(100vw * 6 + 15px);">-->
            <!--<fab v-on:click="writeDiary" style="right: calc(100vw * 4 + 15px);">-->
            <span uk-icon="icon: app-write;"></span>
            <div style="font-size: 0.65rem; font-weight: bold;">글쓰기</div>
        </fab>
    </div>
</template>

<script>
import Fab from '../Fab'
import FeedList from '../FeedList'
import Filters from '../Filters'
import FilterActivity from '../activities/FilterActivity'
import LeisureDiaries from '../LeisureDiaries'
import Grid from '../Grid'
import GridArticle from '../GridArticle'
import LeisureDiaryArticleActivity from '../activities/LeisureDiaryArticleActivity'
import CampsiteActivity from '../activities/CampsiteActivity'
import LeisureDiaryWriteActivity from '../activities/LeisureDiaryWriteActivity'
import TagFilterButton from '../TagFilterButton'

export default {
    components: {
        LeisureDiaries,
        Fab,
        FeedList,
        Filters,
        Grid,
        GridArticle,
        TagFilterButton
    },
    props: {
        isList: Boolean
    },
    data() {
        return {
            count: 0,
            loading: false,
            noMore: false,
            items: [],
            filters: [],
            pageStyle: {},
        }
    },
    created() {
        if(checkIOS()) {
            this.pageStyle = {'right': 'calc(100vw * 4 + 15px)'};
        } else {
            this.pageStyle = {'right': 'calc(100vw * 5 + 15px)'};
        }
    },
    methods: {
        showArticle(article) {
            this.$activity.start(LeisureDiaryArticleActivity, {
                id: article.articleNo
            })
        },
        showPlace(place) {
            this.$activity.start(CampsiteActivity, place)
        },
        writeDiary() {

            this.$activity.start(LeisureDiaryWriteActivity, {}).then(result => {
                if (result) {
                    console.log(result)
                    this.search()
                }
            })
        },
        filterActivity() {
            this.$activity.start(FilterActivity, {
                filters: this.filters,
                boardCode: '1000'
            }).then(filters => {
                if (filters) {
                    this.filters = filters
                    this.search()
                }
            })
        },
        search() {
            this.$refs.articles.filters = this.filters
            this.$refs.articles.search()
        },
        loadMore() {
            this.$refs.articles.loadMore()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.leisure-diary {
    position: relative;
    min-height: 100%;
    padding: 20px 20px #{$footer-height + 20px};
}

.leisure-diary-list {
    list-style: none;
    padding: 15px 0 0;
    margin-bottom: 0;
}

.leisure-diary-item {
    display: flex;
    box-sizing: border-box;
    border: solid $global-border 1px;
    margin-top: 10px;
}

.leisure-diary-item:first-child {
    margin-top: 0;
}

.thumbnail {
    box-sizing: border-box;
    border-right: solid $global-border 1px;
    width: 120px;
    height: 120px;
}
</style>
