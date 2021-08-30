<template>
    <div class="club">
        <div class="button-list">
            <button
                v-bind:class="{active: activityType === null}"
                v-on:click="setActivityType(null)"
                type="button" style="width: 75px; height: 30px;"
            >전체
            </button>
            <button
                v-bind:class="{active: activityType === 'MY_WRITTEN'}"
                v-on:click="setActivityType('MY_WRITTEN')"
                type="button" style="width: 75px; height: 30px;"
            >내가만든
            </button>
            <button
                v-bind:class="{active: activityType === 'MY_LIKED'}"
                v-on:click="setActivityType('MY_LIKED')"
                type="button" style="width: 75px; height: 30px;"
            >관심표시한
            </button>
        </div>
        <div
            v-on:touchstart.stop v-on:touchmove.stop v-on:touchend.stop
            uk-slideshow="min-height: 86; max-height: 86;"
            class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1"
            style="margin-top: 20px; border-radius: 7px; overflow: hidden; mask-image: radial-gradient(white, black);"
        >
            <ul class="uk-slideshow-items">
                <li v-for="(banner, index) in banners" v-bind:key="index">
                    <img v-bind:src="banner.imageUrl + '?mainbanner'"
                         v-on:click="$activity.article(banner.landingType, banner.articleNo)" alt="" uk-cover>
                </li>
            </ul>
        </div>
        <div class="meet-header">
            <div class="meet-tag-filter">
                <button
                    v-for="tag in filterTags"
                    v-bind:key="tag"
                    v-bind:class="{'uk-button-link': filterTag === tag, 'uk-button-text': filterTag !== tag}"
                    class="uk-button"
                    v-on:click="setFilterTag(tag)"
                    type="button"
                >#{{ tag }}
                </button>
            </div>
            <div>
                <tag-filter-button v-on:click.native="filterActivity" v-on:mousedown.stop
                                   v-on:touchstart.stop></tag-filter-button>
            </div>
        </div>
        <filters v-model="filters" v-on:input="search(1)" style="margin-bottom: 10px;"></filters>
        <meets
            ref="articles"
            v-on:search="filters = [$event]"
            v-on:update:loading="loading = $event"
            v-on:update:no-more="noMore = $event"
            v-bind:activity-type="activityType"
        ></meets>
        <div id="meet-filter" uk-offcanvas="flip: true; overlay: true; mode: slide; container: #__layout;"
             style="display: none; z-index: 6000;">
            <div class="uk-offcanvas-bar uk-flex uk-flex-column">
                <button class="uk-offcanvas-close" type="button" uk-close></button>
                <h3>카테고리선택</h3>
                <div class="uk-flex-1 uk-flex uk-flex-column">
                    <div class="uk-flex-1">
                        <button uk-toggle="cls: uk-button-primary" type="button"
                                class="uk-button uk-button-default uk-width-1-1">Category1
                        </button>
                        <button uk-toggle="cls: uk-button-primary" type="button"
                                class="uk-button uk-button-default uk-width-1-1">Category2
                        </button>
                        <button uk-toggle="cls: uk-button-primary" type="button"
                                class="uk-button uk-button-default uk-width-1-1">Category3
                        </button>
                        <button uk-toggle="cls: uk-button-primary" type="button"
                                class="uk-button uk-button-default uk-width-1-1">Category4
                        </button>
                    </div>
                    <div class="uk-text-center">
                        <button type="button" class="uk-button uk-button-primary">확인</button>
                        <button type="button" class="uk-button uk-button-default">취소</button>
                    </div>
                </div>
            </div>
        </div>

        <!--<fab v-on:click="writeArticle" style="right: calc(100vw * 3 + 15px);">-->
        <!--FLEX복원 <fab v-on:click="writeArticle" style="right: calc(100vw * 4 + 15px);">-->
        <!-- jjong2028 ==> 익멍복원-->
        <fab @click="writeArticle" :style="pageStyle">
            <span uk-icon="icon: app-write;"></span>
            <div style="font-size: 0.65rem; font-weight: bold;">글쓰기</div>
        </fab>
    </div>
</template>

<script>
import MeetWriteActivity from '../../components/activities/MeetWriteActivity'
import Meets from '../../components/Meets'
import Fab from '../../components/Fab'
import Filters from '../Filters'
import FilterActivity from '../activities/FilterActivity'
import Grid from '../Grid'
import MeetArticleActivity from '../../components/activities/MeetArticleActivity'
import TagFilterButton from '../../components/TagFilterButton'

export default {
    name: 'PartialMeet',
    components: {
        Meets,
        Fab,
        Filters,
        Grid,
        TagFilterButton
    },
    data() {
        return {
            banners: [],
            activityType: null,
            filterTag: null,
            filterTags: [],
            filters: [],
            loading: false,
            noMore: false,
            pageStyle: {},
        }
    },
    methods: {
        showArticle(article) {
            this.$activity.start(MeetArticleActivity, article)
        },
        filterActivity() {
            this.$activity.start(FilterActivity, {
                filters: this.filters,
                boardCode: '6000'
            }).then(filters => {
                if (filters) {
                    this.filters = filters
                    this.search()
                }
            })
        },
        writeArticle() {
            this.$activity.start(MeetWriteActivity, {
                title: '리폼클럽 작성',
                topaz: true
            }).then(articleNo => {
                if (articleNo > 0) {
                    this.search()
                }
            })
        },
        loadMore() {
            this.$refs.articles.loadMore()
        },
        setFilterTag(tag) {
            if (this.filterTag === tag) {
                this.filterTag = null
            } else {
                this.filterTag = tag
            }
            this.search()
        },
        setActivityType(activityType) {
            this.activityType = activityType
            this.$nextTick(this.search)
        },
        search() {
            this.$refs.articles.categories = [this.filterTag].concat(this.filters)
            this.$refs.articles.search()
        }
    },
    created() {
        if (checkIOS()) {
            this.pageStyle = {'right': 'calc(100vw * 3 + 15px)'};
        } else {
            this.pageStyle = {'right': 'calc(100vw * 4 + 15px)'};
        }
        this.$api.get(`/reform-clubs/categories`).then(response => {
            this.filterTags = response.data
        })
        this.$api.get(`/banners`, {
            params: {
                bannerCode: 'REFORM_CLUB_UPSIDE_BANNER'
            }
        }).then(response => {
            this.banners = response.data
        })
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.club {
    position: relative;
    min-height: 100%;
    padding: 20px 20px 20px + $footer-height;

    .meet-header {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        .meet-tag-filter {
            margin-bottom: 5px;

            button {
                margin-left: 5px;
                font-size: 0.8rem;

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
}
</style>
