<template>
  <div class="campsite">
    <div class="campsite-header">
      <div class="campsite-title">{{name}}</div>
      <div class="campsite-address">{{address}} {{addressDetail}}</div>
      <div class="campsite-distance">{{distance | formatDistance}}</div>
      <div class="campsite-writer">최초등록자 {{createdAt | formatDate('YYYY.MM.DD')}}  by {{creatorInfo.creatorName}}님 </div>
    </div>
    <div class="campsite-body">
      <div class="campsite-update">최신업데이트 {{updatedAt | formatDate('YYYY.MM.DD')}}</div>
      <div class="campsite-contents">{{contents}}</div>
      <ul class="campsite-facilities">
        <li class="campsite-facility">
          <div class="campsite-facility-title">주요 부대 시설</div>
          <div class="campsite-facility-contents">
            <div v-for="(infra, index) in infras" v-bind:key="index" class="campsite-infra">
              <div class="campsite-infra-icon">
                <img v-bind:src="'/img/campsite/' + infra.item.frontMapKey + '.svg'"/>
              </div>
              <div class="campsite-infra-text">{{infra.group.desc}}<br/>{{infra.item.desc}}</div>
            </div>
          </div>
        </li>
        <li class="campsite-facility">
          <div class="campsite-facility-title">전체 시설</div>
          <div class="campsite-facility-contents">
            <div v-for="(facility, index) in facilities" v-bind:key="index" class="campsite-infra">
              <div class="campsite-infra-icon">
                <img v-bind:src="'/img/campsite/' + facility.item.frontMapKey + '.svg'"/>
              </div>
              <div class="campsite-infra-text">{{facility.group.desc}}<br/>{{facility.item.desc}}</div>
            </div>
          </div>
        </li>
        <li class="campsite-facility">
          <div class="campsite-facility-title">캠핑장 연락</div>
          <div class="campsite-facility-contents">
            <div class="map-place-action">
              <div v-on:click="navigate" class="map-place-action-icon">
                <img src="../assets/img/navigate-circle.svg"/>
              </div>
              <div class="map-place-action-text">길찾기</div>
            </div>
            <a v-if="contact1" v-bind:href="'tel:' + contact1" class="map-place-action">
              <div class="map-place-action-icon">
                <img src="../assets/img/tel-circle.svg"/>
              </div>
              <div class="map-place-action-text">전화</div>
            </a>
            <div v-on:click="scrape" class="map-place-action">
              <div class="map-place-action-icon">
                <img v-if="memberArticleSummaryInfo.scraped" src="../assets/img/bookmark-circle-fill.svg"/>
                <img v-else src="../assets/img/bookmark-circle.svg"/>
              </div>
              <div class="map-place-action-text">스크랩</div>
            </div>
          </div>
        </li>
      </ul>
      <div class="campsite-articles-title">#{{name}}에 대한 다른 글 </div>
      <leisure-diaries v-bind:campsite-no="id" class="campsite-articles"></leisure-diaries>
    </div>
  </div>
</template>

<script>
import LeisureDiaries from './LeisureDiaries'
export default {
  name: 'Campsite',
  components: {
    LeisureDiaries
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    position: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      name: null,
      address: null,
      addressDetail: null,
      contact1: null,
      distance: null,
      contents: null,
      creatorInfo: {},
      createdAt: null,
      updatedAt: null,
      articleSummaryInfo: {},
      memberArticleSummaryInfo: {},
      location: {},
      infras: [],
      facilities: [],
      articles: []
    }
  },
  methods: {
    navigate () {
      this.$command.execute('navigate', {
        title: this.name,
        latitude: this.location.latitude,
        longitude: this.location.longitude
      })
    },
    scrape () {
      if (this.memberArticleSummaryInfo.scraped) {
        this.$api.delete('/scraps', {
          params: {
            articleNo: this.id
          }
        }).then(() => {
          this.load()
        })
      } else {
        this.$api.post('/scraps', {
          articleNo: this.id
        }).then(() => {
          this.load()
        })
      }
    },
    load (viewed = false) {
      this.$api.get(`/campsites/${this.id}`, {
        params: {
          latitude: this.position.latitude || 37.5193326803551,
          longitude: this.position.longitude || 126.97957074631303,
          viewed: viewed
        }
      }).then(response => {
        this.name = response.data.name
        this.address = response.data.address
        this.addressDetail = response.data.addressDetail
        this.distance = response.data.distance
        this.contents = response.data.contents
        this.contact1 = response.data.contact1
        this.createdAt = response.data.createdAt
        this.updatedAt = response.data.updatedAt
        this.creatorInfo = response.data.creatorInfo
        this.articleSummaryInfo = response.data.articleSummaryInfo
        this.memberArticleSummaryInfo = response.data.memberArticleSummaryInfo
        this.location = response.data.location

        let items = response.data.details.map(detail => detail.items).reduce((acc, items) => acc.concat(items), [])
        let infraList = ['CAMP_ENTRY', 'CARAVAN_ENTRY', 'NORMAL_ENTRY', 'BOILED', 'RESTROOM_YES', 'SINK', 'CITY_WATER', 'WATER_PLAY_YES', 'MART_YES', 'RESTAURANT_YES']
        let infraItems = items.filter(item => infraList.indexOf(item) > -1)
        this.infras = []
        this.facilities = []
        this.$api.get(`/campsites/info`).then(_response => {
          _response.data.forEach(group => {
            group.items.filter(item => infraItems.indexOf(item.campsiteItem) > -1).forEach(item => {
              this.infras.push({
                group: group.group,
                item: item
              })
            })
            group.items.filter(item => items.indexOf(item.campsiteItem) > -1).forEach(item => {
              this.facilities.push({
                group: group.group,
                item: item
              })
            })
          })
        })

        this.$api.get(`/leisure-diaries`, {
          params: {
            campsiteNo: this.id,
            page: 1,
            size: 10
          }
        }).then(response => {
          this.articles = response.data
        })

        this.$emit('load', response.data)
      })
    }
  },
  created () {
    this.load(true)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

$descripton-height: 150px;

.campsite {
  background-color: #0f2640;
  .campsite-header {
    color: #c7c7c7;
    padding: 20px 20px 10px;
    .campsite-title {
      color: #ffce55;
      font-weight: bold;
    }
    .campsite-address {
      margin-top: 6px;
      font-size: 0.75rem;
    }
    .campsite-distance {
      margin-top: 6px;
      font-size: 0.85rem;
      font-weight: bold;
      color: #44e9f6;
    }
    .campsite-writer {
      margin-top: 30px;
      font-size: 0.7rem;
    }
  }
  .campsite-body {
    padding: 20px 20px #{20px + $footer-height};
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: #ffffff;
    .campsite-update {
      font-size: 0.7rem;
      color: #0f2640;
    }
    .campsite-contents {
      margin-top: 5px;
      font-size: 0.8rem;
      color: #2d2d2d;
    }
    .campsite-facilities {
      list-style: none;
      padding: 0;
      font-size: 0.75rem;
      padding: 0 0 0 10px;
      border-left: dashed #b4b4b4 1px;
      .campsite-facility {
        .campsite-facility-title {
          display: flex;
          align-items: center;
          font-weight: bold;
          &::before {
            content: '';
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 8px;
            border: solid #b4b4b4 1px;
            margin-right: 8px;
            margin-left: -14px;
            background-color: #ffffff;
          }
        }
        .campsite-facility-contents {
          display: flex;
          flex-wrap: wrap;
          margin-top: 5px;
          margin-left: -10px;
          &:empty::after {
            content: '없음';
            display: block;
            margin-left: 10px;
            margin-bottom: 10px;
          }
          .campsite-infra {
            text-align: center;
            margin: 5px 10px;
            .campsite-infra-text {
              margin-top: 3px;
              font-size: 0.6rem;
            }
          }
          .map-place-action {
            text-align: center;
            margin: 5px 10px;
            .map-place-action-text {
              margin-top: 3px;
              font-size: 0.6rem;
              color: #1c63f3;
            }
          }
        }
      }
    }
  }
  .campsite-articles-title {
    font-size: 0.8rem;
  }
  .campsite-articles {
    margin-top: 3px;
  }
}
</style>
