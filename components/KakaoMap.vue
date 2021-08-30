<template>
  <div class="uk-flex uk-position-relative kakao-map" v-on:mousedown.stop v-on:touchstart.stop>
    <div class="map-header">
      <safearea-top></safearea-top>
      <button v-if="needReload" v-on:click="search" type="button" class="map-reload">영역 재검색</button>
    </div>
    <div v-bind:class="{active: loading}" class="loader"></div>
    <div ref="map" class="uk-flex-1"></div>
    <!-- <div class="level-control uk-flex uk-flex-column">
      <button v-on:click="zoomIn" type="button" class="uk-flex-1">
        <span uk-icon="icon: plus;"></span>
      </button>
      <button v-on:click="zoomOut" type="button" class="uk-flex-1">
        <span uk-icon="icon: minus;"></span>
      </button>
    </div> -->
    <!-- <div v-bind:style="{bottom: currentButtonBottom ? currentButtonBottom : 'unset'}" class="current-position-control">
      <button v-on:click="moveToCurrent">
        <span uk-icon="icon: location;"></span>
      </button>
    </div> -->
    <div v-if="campsite" ref="campsite" v-on:click="closeCampsite" class="map-place">
      <div class="map-place-container">
        <div v-on:click.stop class="map-place-header">
          <div v-on:click="showCampsite(campsite)" class="map-place-title">{{campsite.name}}</div>
          <div class="map-place-address">{{campsite.address}} {{campsite.addressDetail}}</div>
          <div class="map-place-distance">{{campsite.distance | formatDistance}}</div>
          <button v-on:click="closeCampsite" class="map-place-close" type="button">
            <span uk-icon="icon: close; ratio: 0.8;"></span>
          </button>
        </div>
        <div v-on:click.stop class="map-place-body">
          <div class="map-place-infra">
            <div class="map-place-infra-title">주요 부대시설</div>
            <div class="map-place-infra-items">
              <div v-for="(infra, index) in campsite.infras" v-bind:key="index" class="map-place-infra-item">
                <div class="map-place-infra-icon">
                  <img v-bind:src="'/img/campsite/' + infra.item.frontMapKey + '.svg'"/>
                </div>
                <div class="map-place-infra-text">{{infra.group.desc}}<br/>{{infra.item.desc}}</div>
              </div>
            </div>
          </div>
          <div class="map-place-actions">
            <div class="map-place-action">
              <div v-on:click="navigate" class="map-place-action-icon">
                <img src="../assets/img/navigate-circle.svg"/>
              </div>
              <div class="map-place-action-text">길찾기</div>
            </div>
            <a v-if="campsite.contact1" v-bind:href="'tel:' + campsite.contact1" class="map-place-action">
              <div class="map-place-action-icon">
                <img src="../assets/img/tel-circle.svg"/>
              </div>
              <div class="map-place-action-text">전화</div>
            </a>
            <div v-on:click="scrape" class="map-place-action">
              <div class="map-place-action-icon">
                <img v-if="campsite.memberArticleSummaryInfo.scraped" src="../assets/img/bookmark-circle-fill.svg"/>
                <img v-else src="../assets/img/bookmark-circle.svg"/>
              </div>
              <div class="map-place-action-text">스크랩</div>
            </div>
          </div>
          <div v-if="articles.length > 0" class="map-place-articles">
            <div class="map-place-article-title">#{{campsite.name}}에 대한 다른 글</div>
            <grid v-bind:data="articles" columns="2" style="margin-top: 5px;">
              <template v-slot:default="article">
                <grid-article
                  v-on:click.native="$activity.article('DIARY', article.articleNo)"
                  v-bind:title="article.title"
                  v-bind:cover="article.mainImageUrl"
                  v-bind:profile="article.creatorInfo.profileImageUrl"
                  v-bind:member-no="article.creatorInfo.creatorNo"
                  v-bind:tags="article.categories"
                  column="2"
                ></grid-article>
              </template>
            </grid>
          </div>
          <safearea-bottom></safearea-bottom>
        </div>
      </div>
      <activity-article-footer
        v-if="campsite"
        v-bind:id="campsite.campsiteNo"
        v-bind:likes="campsite.articleSummaryInfo.likeCount"
        v-bind:scrapes="campsite.articleSummaryInfo.scrapCount"
        v-bind:comments="campsite.articleSummaryInfo.commentCount"
        v-bind:liked="campsite.memberArticleSummaryInfo.liked"
        v-bind:scraped="campsite.memberArticleSummaryInfo.scraped"
        v-bind:commented="campsite.memberArticleSummaryInfo.commented"
        v-on:update="showPlace({id: campsite.campsiteNo})"
        shareable
        board-code="CAMPSITE"
        class="map-place-footer"
      ></activity-article-footer>
    </div>
  </div>
</template>

<script>
import Grid from '../components/Grid'
import GridArticle from '../components/GridArticle'
import CampsiteActivity from '../components/activities/CampsiteActivity'
import ActivityArticleFooter from '../components/ActivityArticleFooter'
export default {
  name: 'KakaoMap',
  components: {
    ActivityArticleFooter,
    Grid,
    GridArticle
  },
  props: {
    lazyload: Boolean,
    zoomable: Boolean,
    draggable: Boolean,
    selectable: Boolean,
    controllable: Boolean,
    currentButtonBottom: String,
    level: {
      type: [Number, String],
      default () {
        return 3
      }
    },
    latitude: {
      type: Number,
      default () {
        return 37.5193326803551
      }
    },
    longitude: {
      type: Number,
      default () {
        return 126.97957074631303
      }
    },
    keyword: String,
    memberNo: Number,
    activityType: String,
    boundInit: Boolean
  },
  data () {
    return {
      map: null,
      clusterer: null,
      geocoder: null,
      overlays: [],
      campsite: null,
      articles: [],
      campsiteLoader: null,
      currentMarker: null,
      selected : null,
      selectedMarker: null,
      center: {
        latitude: null,
        longitude: null
      },
      disableIdleEvent: false,
      needReload: false,
      loading: false
    }
  },
  methods: {
    moveToCurrent () {
      this.$location.getCurerntPosition().then(position => {
        this.move(position.coords.latitude, position.coords.longitude)
      }).catch(error => {
      })
    },
    addMarker (latitude, longitude, title, options) {
      let marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latitude, longitude),
        clickable: true,
        title: title,
        image: new kakao.maps.MarkerImage((options.campsite.campsiteNo === this.selected) ? '/img/pin-active.svg' : '/img/pin.svg', new kakao.maps.Size(50, 53), {
          // offset: new kakao.maps.Point(25, 0)
        })
      })
      Object.assign(marker, options)
      this.clusterer.addMarker(marker)
      // marker.setMap(this.map)

      kakao.maps.event.addListener(marker, 'click', () => {
        this.selectMarker(marker)
      })
    },
    selectMarker (marker) {
      this.unselectMarker()
      marker.setImage(new kakao.maps.MarkerImage('/img/pin-active.svg', new kakao.maps.Size(50, 53), {
        // offset: new kakao.maps.Point(25, 0)
      }))
      this.selected = marker.campsite.campsiteNo
      this.selectedMarker = marker
      if (this.selectable) {
        this.addSelectMarker(marker.campsite)
      } else {
        this.showPlace({
          id: marker.campsite.campsiteNo
        })
      }
      this.$emit('select-marker', this.selectedMarker)
      this.$emit('click-marker', {
        id: marker.campsite.campsiteNo,
        position: {
          latitude: this.map.getCenter().getLat(),
          longitude: this.map.getCenter().getLng()
        }
      })
    },
    unselectMarker () {
      if (this.selectedMarker) {
        this.selectedMarker.setImage(new kakao.maps.MarkerImage('/img/pin.svg', new kakao.maps.Size(50, 53), {
          // offset: new kakao.maps.Point(25, 0)
        }))
        this.selected = null
        this.selectedMarker = null
      }
    },
    addSelectMarker (campsite) {
      let latitude = campsite.location.latitude
      let longitude = campsite.location.longitude
      let container = document.createElement('div')
      let places = document.createElement('div')
      let place = document.createElement('div')
      // let image = document.createElement('div')
      let description = document.createElement('div')
      let name = document.createElement('div')
      let address = document.createElement('div')
      this.clearOverlays()
      container.classList.add('kakao-map-select-marker')
      places.classList.add('kakao-map-places')
      place.classList.add('kakao-map-place')
      // image.classList.add('kakao-map-place-image')
      // image.style.backgroundImage = `url('${campsite.cover}')`
      description.classList.add('kakao-map-place-description')
      name.classList.add('kakao-map-place-name')
      address.classList.add('kakao-map-place-address')
      name.innerHTML = campsite.name
      address.innerHTML = campsite.address + (campsite.addressDetail ? ` ${campsite.addressDetail}` : '')
      description.appendChild(name)
      description.appendChild(address)
      // place.appendChild(image)
      place.appendChild(description)
      places.appendChild(place)
      container.appendChild(places)
      container.addEventListener('touchstart', e => {
        e.stopPropagation()
      })
      container.addEventListener('click', e => {
        this.$activity.article('CAMPSITE', campsite.campsiteNo)
      })
      let overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(latitude, longitude),
        content : container,
        xAnchor: 0.5,
        yAnchor: 1.7,
        zIndex: 3
      })
      overlay.setMap(this.map)
      this.overlays.push(overlay)
    },
    addRegisterMarker (latitude, longitude) {
      this.clearOverlays()
      let container = document.createElement('div')
      let label = document.createElement('label')
      container.classList.add('kakao-map-select-marker')
      label.innerText = '캠핑지 등록하기!'
      container.appendChild(label)
      container.addEventListener('click', e => {
        e.stopPropagation()
        this.$emit('click-select-marker', {
          latitude: latitude,
          longitude: longitude
        })
      })
      container.addEventListener('touchstart', e => {
        e.stopPropagation()
      })
      let overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(latitude, longitude),
        content : container,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: 3
      })
      overlay.setMap(this.map)
      this.overlays.push(overlay)
    },
    move (latitude, longitude) {
      this.center.latitude = latitude
      this.center.longitude = longitude
      this.map.setCenter(new kakao.maps.LatLng(latitude, longitude))
    },
    moveToPlace (marker) {
      this.clearOverlays()
      this.map.setLevel(3)
      this.map.setCenter(marker.getPosition())
    },
    zoom (level) {
      this.map.setLevel(level)
    },
    zoomIn () {
      this.map.setLevel(this.map.getLevel() - 1)
    },
    zoomOut () {
      this.map.setLevel(this.map.getLevel() + 1)
    },
    clearOverlays () {
      this.overlays.forEach(overlay => {
        overlay.setMap(null)
      })
    },
    drawClusterPlaces (cluster) {
      this.clearOverlays()
      let container = document.createElement('div')
      container.classList.add('kakao-map-overlay')
      container.addEventListener('click', e => {
        e.stopPropagation()
      })
      container.addEventListener('touchstart', e => {
        e.stopPropagation()
      })
      let titleBar = document.createElement('div')
      titleBar.classList.add('kakao-map-overlay-title-bar')
      let places = document.createElement('div')
      places.classList.add('kakao-map-places')
      cluster.getMarkers().forEach(marker => {
        let place = document.createElement('div')
        place.addEventListener('click', e => {
          this.moveToPlace(marker)
        })
        place.classList.add('kakao-map-place')
        // let imageContainer = document.createElement('div')
        // imageContainer.classList.add('kakao-map-place-image')
        // imageContainer.style.backgroundImage = `url('${marker.cover}')`
        let description = document.createElement('div')
        description.classList.add('kakao-map-place-description')
        let name = document.createElement('div')
        name.classList.add('kakao-map-place-name')
        name.innerHTML = marker.getTitle()
        let address = document.createElement('div')
        address.classList.add('kakao-map-place-address')
        address.innerHTML = marker.campsite.address + (marker.campsite.addressDetail ? ` ${marker.campsite.addressDetail}` : '')
        description.appendChild(name)
        description.appendChild(address)
        // place.appendChild(imageContainer)
        place.appendChild(description)
        places.appendChild(place)
      })
      container.appendChild(titleBar)
      container.appendChild(places)
      let overlay = new kakao.maps.CustomOverlay({
        position: cluster.getCenter(),
        content : container,
        xAnchor: 0.5,
        yAnchor: 0,
        zIndex: 3
      })
      overlay.setMap(this.map)
      this.overlays.push(overlay)
      this.move(cluster.getCenter().getLat(), cluster.getCenter().getLng())
    },
    constraintBounds () {
      let MAX_LONGITUDE = 135
      let MIN_LONGITUDE = 122
      let MAX_LATITUDE = 41
      let MIN_LATITUDE = 31.5
      let bounds = this.map.getBounds()
      if (bounds.getSouthWest().getLat() < MIN_LATITUDE) {
        this.move(this.map.getCenter().getLat() + (MIN_LATITUDE - bounds.getSouthWest().getLat()), this.map.getCenter().getLng())
      }
      // if (bounds.getNorthEast().getLat() > MAX_LATITUDE) {
      //   this.move(this.map.getCenter().getLat() - (bounds.getNorthEast().getLat() - MAX_LATITUDE), this.map.getCenter().getLng())
      // }
      // if (bounds.getNorthEast().getLng() > MAX_LONGITUDE) {
      //   this.move(this.map.getCenter().getLat(), this.map.getCenter().getLng() - (bounds.getNorthEast().getLng() - MAX_LONGITUDE))
      // }
      // if (bounds.getSouthWest().getLng() < MIN_LONGITUDE) {
      //   this.move(this.map.getCenter().getLat(), this.map.getCenter().getLng() + (MIN_LONGITUDE - bounds.getSouthWest().getLng()))
      // }
    },
    updateCenter () {
      let position = this.map.getCenter()
      this.center.latitude = position.getLat()
      this.center.longitude = position.getLng()
    },
    idle () {
      this.needReload = true
      if (!this.disableIdleEvent) {
        // this.search()
      }
    },
    search () {
      return new Promise((resolve, reject) => {
        this.loading = true
        if (!this.campsiteLoader) {
          this.campsiteLoader = setTimeout(() => {
            let bounds = this.map.getBounds()
            this.$api.get(`/campsite-maps`, {
              params: {
                name: this.keyword,
                centerLatitude: this.map.getCenter().getLat(),
                centerLongitude: this.map.getCenter().getLng(),
                northEastLatitude: bounds.getNorthEast().getLat(),
                northEastLongitude: bounds.getNorthEast().getLng(),
                southWestLatitude: bounds.getSouthWest().getLat(),
                southWestLongitude: bounds.getSouthWest().getLng(),
                memberNo: this.memberNo,
                activityType: this.activityType
              }
            }).then(response => {
              if (response.data) {
                let markers = this.clusterer.getMarkers()
                let existsCampsiteNos = markers.map(marker => marker.campsite.campsiteNo)
                let campsiteNos = []
                response.data.forEach(campsite => {
                  campsiteNos.push(campsite.campsiteNo)
                  if (existsCampsiteNos.indexOf(campsite.campsiteNo) < 0) {
                    this.addMarker(campsite.location.latitude, campsite.location.longitude, campsite.name, {
                      campsite: campsite,
                      cover: 'https://getuikit.com/docs/images/light.jpg'
                    })
                  }
                })
                markers.filter(marker => campsiteNos.indexOf(marker.campsite.campsiteNo) < 0).forEach(marker => {
                  this.clusterer.removeMarker(marker)
                })
                this.$emit('loaded', response.data)
                this.needReload = false
                this.loading = false
                resolve(this.clusterer.getMarkers())
              }
            }).catch(error => {
              this.loading = false
              reject(error)
            })
            this.campsiteLoader = null
          }, 100)
        }
      })
    },
    setCampsite (campsite) {
      this.campsite = campsite
        let items = this.campsite.details.map(detail => detail.items).reduce((acc, items) => acc.concat(items), [])
        let infraList = ['CAMP_ENTRY', 'CARAVAN_ENTRY', 'NORMAL_ENTRY', 'BOILED', 'RESTROOM_YES', 'SINK', 'CITY_WATER', 'WATER_PLAY_YES', 'MART_YES', 'RESTAURANT_YES']
        let infraItems = items.filter(item => infraList.indexOf(item) > -1)
        this.campsite.infras = []
        this.$api.get(`/campsites/info`).then(_response => {
          _response.data.forEach(group => {
            group.items.filter(item => infraItems.indexOf(item.campsiteItem) > -1).forEach(item => {
              this.campsite.infras.push({
                group: group.group,
                item: item
              })
            })
          })
          this.$forceUpdate()
        })
    },
    showCampsite (campsite) {
      this.$activity.start(CampsiteActivity, {
        id: campsite.campsiteNo,
        position: {
          latitude: this.$store.state.app.location.latitude || this.latitude,
          longitude: this.$store.state.app.location.longitude || this.longitude
        },
        update: campsite => {
          this.setCampsite(campsite)
        }
      }).then(() => {
      })
    },
    closeCampsite () {
      document.body.classList.remove('hide-footer')
      this.$refs.campsite.classList.add('anim-slide-down')
      this.unselectMarker()
      setTimeout(() => {
        this.campsite = null
        this.$refs.campsite.classList.remove('anim-slide-down')
      }, 200)
    },
    showPlace (place) {
      if (!this.$store.state.app.location) {
        this.$swal.alert('잠시후 다시 시도해 주세요')
        return
      }
      this.$api.get(`/campsites/${place.id}`, {
        params: {
          latitude: this.$store.state.app.location.latitude || this.latitude,
          longitude: this.$store.state.app.location.longitude || this.longitude
        }
      }).then(response => {
        document.body.classList.add('hide-footer')
        this.setCampsite(response.data)
      })
      this.$api.get(`/leisure-diaries`, {
        params: {
          campsiteNo: place.id,
          page: 1,
          size: 4
        }
      }).then(response => {
        this.articles = response.data
      })
    },
    navigate () {
      this.$command.execute('navigate', {
        title: this.campsite.name,
        latitude: this.campsite.location.latitude,
        longitude: this.campsite.location.longitude
      })
    },
    scrape () {
      if (this.campsite.memberArticleSummaryInfo.scraped) {
        this.$api.delete('/scraps', {
          params: {
            articleNo: this.campsite.campsiteNo
          }
        }).then(() => {
          this.showPlace({
            id: this.campsite.campsiteNo
          })
        })
      } else {
        this.$api.post('/scraps', {
          articleNo: this.campsite.campsiteNo
        }).then(() => {
          this.showPlace({
            id: this.campsite.campsiteNo
          })
        })
      }
    },
    boundSearch (latitude, longitude) {
      return new Promise((resolve, reject) => {
        if (this.keyword) {
          this.disableIdleEvent = true
          this.$api.get(`/campsites`, {
            params: {
              page: 1,
              size: 100,
              name: this.keyword,
              latitude: latitude,
              longitude: longitude
            }
          }).then(response => {
            let bounds = new kakao.maps.LatLngBounds()
            response.data.forEach(campsite => {
              bounds.extend(new kakao.maps.LatLng(campsite.location.latitude, campsite.location.longitude))
            })
            this.map.setBounds(bounds)
            this.disableIdleEvent = false
            resolve()
          }).catch(reject)
        } else {
          resolve()
        }
      })
    }
  },
  mounted () {
    this.map = new kakao.maps.Map(this.$refs.map, { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(this.latitude, this.longitude), //지도의 중심좌표.
      level: this.level //지도의 레벨(확대, 축소 정도)
    }) //지도 생성 및 객체 리턴

    this.map.setDraggable(this.draggable)
    this.map.setZoomable(this.zoomable)
    this.map.setMaxLevel(13)

    this.clusterer = new kakao.maps.MarkerClusterer({
      map: this.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
      averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
      minLevel: 9, // 클러스터 할 최소 지도 레벨 
      disableClickZoom: true, // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정
      // styles: [
      //   {
      //     width : '50px',
      //     height : '53px',
      //     background: 'url(/img/pin-active.svg) no-repeat',
      //     color: 'transparent',
      //     'font-size': 0
      //   }
      // ]
    })

    kakao.maps.event.addListener(this.clusterer, 'clusterclick', this.drawClusterPlaces)

    if (this.lazyload === false) {
      this.moveToCurrent()
    }
    if (this.controllable) {
      this.map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.LEFT)
    }

    kakao.maps.event.addListener(this.map, 'click', this.clearOverlays)
    kakao.maps.event.addListener(this.map, 'center_changed', this.constraintBounds)
    kakao.maps.event.addListener(this.map, 'zoom_changed', this.constraintBounds)
    kakao.maps.event.addListener(this.map, 'dragend', this.updateCenter)
    kakao.maps.event.addListener(this.map, 'idle', this.idle)
    
    if (this.selectable) {
      kakao.maps.event.addListener(this.map, 'rightclick', event => {        
        let latlng = event.latLng
        this.addRegisterMarker(latlng.getLat(), latlng.getLng())
      })
    }

    this.$location.getCurerntPosition().then(position => {
      this.currentMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
        clickable: false,
        image: new kakao.maps.MarkerImage('/img/current.svg', new kakao.maps.Size(30, 44), {
          offset: new kakao.maps.Point(15, 44)
        })
      })
      this.currentMarker.setMap(this.map)
      if (this.boundInit) {
        this.boundSearch(position.coords.latitude, position.coords.longitude).then(() => {
          this.search()
        })
      } else {
        this.search()
      }
    }).catch(error => {
      if (this.boundInit) {
        this.boundSearch(this.latitude, this.longitude).then(() => {
          this.search()
        })
      } else {
        this.search()
      }
    })

    setInterval(() => {
      this.$location.getCurerntPosition().then(position => {
        if (this.currentMarker) {
          this.currentMarker.setPosition(new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude))
        }
      }).catch(error => {
      })
    }, 2000)

    window.addEventListener('resize', () => {
      this.map.relayout()
      this.move(this.center.latitude, this.center.longitude)
    })
  },
  created () {
    this.loading = true
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';
.kakao-map {
  * {
    user-select: none;
  }
  .map-header {
    position: absolute;
    width: 120px;
    top: 20px;
    left: calc(50% - 60px);
    overflow: visible;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    .map-reload {
      display: block;
      height: 30px;
      border-radius: 15px;
      padding: 0 20px;
      background-color: $global-primary-color;
      color: #ffffff;
      font-weight: bold;
      border: none;
      font-size: 0.8rem;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
    }
  }
  .current-position-control {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1;
    button {
      display: block;
      width: 40px;
      height: 40px;
      border: solid #555555 1px;
      border-radius: 3px;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .loader {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    &.active {
      display: flex;
    }
  }
}
.level-control {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  width: 40px;
  height: 80px;
  border-radius: 3px;
  overflow: hidden;
  border: solid $global-border 1px;
  button {
    background-color: #ffffff;
    border: none;
    &:last-child {
      border-top: solid $global-border 1px;
    }
  }
}
</style>

<style lang="scss">
@use 'sass:math';
@import '../assets/scss/variables';
.campsite-selector {
  .kakao-map {
    .map-header {
      top: 90px;
      .safearea-top {
        display: none;
      }
    }
  }
}
.kakao-map-overlay {
  display: flex;
  flex-direction: column;
  background-color: #0f2640;
  margin-top: 32px;
  position: relative;
  max-height: 200px;
  width: calc(100vw - 40px);
  &:before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: #0f2640;
    position: absolute;
    left: calc(50% - 5px);
    top: -5px;
    transform: rotate(45deg);
  }
}
.kakao-map-places {
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
  background-color: #0f2640;
  padding: 10px;
  .kakao-map-place {
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    &:first-child {
      margin-top: 0;
    }
    .kakao-map-place-image {
      width: 58px;
      height: 37px;
      border-radius: 5px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .kakao-map-place-description {
      margin-left: 10px;
      .kakao-map-place-name {
        color: #ffce55;
        font-weight: bold;
        font-size: 0.85rem;
      }
      .kakao-map-place-address {
        color: #ffffff;
        font-size: 0.75rem;
        white-space: break-spaces;
        word-break: break-word;
      }
    }
  }
}
$select-maker-width: 20px;
$select-maker-height: 15px;
.kakao-map-select-marker {
  display: flex;
  flex-direction: column;
  width: calc(100vw - 40px);
  align-items: center;
  label {
    background-color: #0f2640;
    color: #ffffff;
    padding: 9px 13px;
    font-size: 0.9rem;
  }
  &::after {
    content: '';
    display: block;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    background-color: #0f2640;
    width: $select-maker-width;
    height: $select-maker-height;
    margin: auto;
  }
}

.map-place {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.2);
  animation-name: fade-in;
  animation-duration: 0.2s;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  &.anim-slide-down {
    animation-name: fade-out;
    .map-place-container {
      animation-name: slide-down;
    }
  }
  .map-place-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    animation-name: slide-up;
    animation-duration: 0.2s;
    animation-iteration-count: 1;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
    .map-place-header {
      position: relative;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      margin-top: calc(50vh - #{$footer-height});
      text-align: center;
      background-color: #0f2640;
      padding: 15px 15px 30px;
      box-shadow: 0 -3px 6px 0 rgba(0, 0, 0, 0.16);
      .map-place-title {
        font-size: 1rem;
        font-weight: bold;
        color: #ffce55;
      }
      .map-place-address {
        margin-top: 3px;
        font-size: 0.7rem;
        color: #ffffff;
      }
      .map-place-distance {
        margin-top: 5px;
        font-size: 0.7rem;
        color: #44e9f6;
      }
      .map-place-close {
        position: absolute;
        display: block;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        padding: 0;
        margin: 0;
        border: none;
        background-color: #a3a9bc;
        border-radius: 50%;
        color: #ffffff;
      }
    }
    .map-place-body {
      position: relative;
      flex-grow: 1;
      margin-top: -20px;
      padding: 15px 20px $footer-height + 15px;
      background-color: #ffffff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      .map-place-infra {
        text-align: center;
        .map-place-infra-title {
          font-size: 0.75rem;
          font-weight: bold;
        }
        .map-place-infra-items {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          &:empty::after {
            content: '없음';
            font-size: 0.8rem;
            padding: 10px;
          }
          .map-place-infra-item {
            margin: 10px;
            .map-place-infra-text {
              margin-top: 3px;
              font-size: 0.65rem;
              text-align: center;
            }
          }
        }
      }
      .map-place-actions {
        border-top: solid #efefef 1px;
        display: flex;
        justify-content: center;
        .map-place-action {
          margin: 10px;
          .map-place-action-text {
            margin-top: 3px;
            font-size: 0.65rem;
            color: #1c63f3;
            text-align: center;
          }
        }
      }
      .map-place-articles {
        border-top: solid #efefef 1px;
        padding-top: 10px;
        .map-place-article-title {
          font-size: 0.8rem;
          font-weight: bold;
        }
      }
    }
  }
  .map-place-footer {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
@keyframes slide-up {
  from {
    transform: translateY(100vh);
  }
  to {
    transform: translateY(0vh);
  }
}
@keyframes slide-down {
  from {
    transform: translateY(0vh);
  }
  to {
    transform: translateY(100vh);
  }
}
@keyframes fade-in {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
@keyframes fade-out {
  from {
    background-color: rgba(0, 0, 0, 0.2);
  }
  to {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
