<template>
  <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve" back black rounded>
    <template v-slot:header>캠핑지 등록</template>
    <template v-slot:operations>
      <button v-on:click="confirm" class="uk-button uk-button-link leisure-diary-write-next">등록</button>
    </template>
    <template>
      <div class="campsite-register-form">
        <div class="form-field">
          <label for="campsite-name">캠핑지명</label>
          <div class="form-input">
            <input v-model="name" id="campsite-name" type="text" placeholder="캠핑장 입력"/>
          </div>
        </div>
        <div class="form-field">
          <label for="campsite-address">주소</label>
          <div class="form-input">
            <button v-on:click="openDaumPostcode" type="button">주소검색</button>
          </div>
        </div>
        <div ref="daumPostcode" style="display:none;border:1px solid;width:100%;height:300px;margin:5px 0;position:relative;">
          <img src="https://t1.daumcdn.net/postcode/resource/images/close.png" style="cursor:pointer;position:absolute;right:0;top:0;z-index:1" v-on:click="closeDaumPostcode" alt="닫기 버튼">
        </div>
        <div class="form-field">
          <label></label>
          <div class="form-input">
            <input v-model="address" id="campsite-address" type="text" placeholder="주소 입력"/>
          </div>
        </div>
        <div class="form-field">
          <label></label>
          <div class="form-input">
            <input v-model="addressDetail" type="text" placeholder="상세주소 입력"/>
          </div>
        </div>
        <div class="form-field">
          <label for="campsite-tel">전화번호</label>
          <div class="form-input">
            <input v-model="contact1" id="campsite-tel" type="tel" placeholder="전화번호 입력"/>
          </div>
        </div>
        <div class="form-field">
          <div class="form-input">
            <textarea-autosize v-model="introduction" v-on:input="checkIntroduction" placeholder="캠핑지 소개글(0/100)" rows="1"></textarea-autosize>
          </div>
        </div>
        <div class="form-field" style="margin-top: 50px;">
          <label style="flex-grow: 1;">상세정보</label>
        </div>
        <div class="form-extra">
          <div v-for="group in infra" v-bind:key="group.group.group" class="form-extra-group">
            <div class="form-extra-group-title">{{group.group.desc}}</div>
            <div class="form-extra-group-contents">
              <button v-for="item in group.items" v-bind:key="item.campsiteItem" v-on:click="setDetail(group.group, item.campsiteItem)" v-bind:class="{active: items.indexOf(item.campsiteItem) > -1}" type="button">
                <img v-bind:src="'/img/campsite/' + item.frontMapKey + '.svg'"/>
                <div>{{item.desc}}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </activity>
</template>

<script>
export default {
  name: 'CampsiteRegisterActivity',
  props: {
    latitude: Number,
    longitude: Number,
    resolve: Function
  },
  data () {
    return {
      name: null,
      address: null,
      addressDetail: null,
      location: {
        latitude: this.latitude,
        longitude: this.longitude
      },
      contact1: null,
      details: [],
      introduction: null,
      infra: []
    }
  },
  computed: {
    items () {
      return this.details.reduce((items, group) => items.concat(group.items), [])
    }
  },
  methods: {
    finish () {
      this.$activity.finish(this)
    },
    checkIntroduction () {
      if (this.introduction && this.introduction.length > 100) {
        this.$swal.alert('100자 까지 입력가능합니다.')
        this.introduction = this.introduction.substr(0, 100)
      }
    },
    check () {
      return new Promise((resolve, reject) => {
        try {
          if (!this.name) {
            throw Error('캠핑지명을 입력해주세요')
          } else if (!this.address || !this.addressDetail) {
            throw Error('주소를 입력해주세요')
          } else {
            resolve()
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    confirm () {
      this.check().then(() => {
        this.$api.post(`/campsites`, {
          title: this.name,
          address: this.address,
          addressDetail: this.addressDetail,
          contact1: this.contact1,
          details: this.details
        }).then(response => {
          this.$refs.activity.finish({
            id: response.data.campsiteNo,
            location: this.location
          })
        })
      }).catch(error => {
        this.$swal.alert(error.message)
      })
    },
    setDetail (group, itemName) {
      let _group = this.details.find(_group => _group.name === group.group)
      if (_group) {
        if (_group.items.indexOf(itemName) > -1) {
          _group.items = _group.items.filter(_item => _item !== itemName)
        } else {
          // 단수선택
          let multipleSelect = ['RECOMMENDATION', 'VIEW', 'ENTRY', 'ENVIRONMENT']
          if (multipleSelect.indexOf(group.group) > -1) {
            _group.items.push(itemName)
          } else {
            _group.items = [itemName]
          }
        }
      } else {
        this.details.push({
          name: group.group,
          items: [itemName]
        })
      }
      console.log(this.details)
    },
    isDetailChecked (groupName, itemName) {
      let group = this.details.find(group => group.name === groupName)
      if (group) {
        return group.items.findIndex(item => item.name === itemName)
      } else {
        return -1
      }
    },
    openDaumPostcode () {
      let container = this.$refs.daumPostcode
      new daum.Postcode({
        oncomplete: (data) => {
          this.address = data.address
          container.style.display = 'none'
          this.$axios.get(`/address2coord`, {
            params: {
              query: data.address
            }
          }).then(response => {
            this.location.latitude = response.data.x
            this.location.longitude = response.data.y
          })
        }
      }).embed(container)
      container.style.display = 'block'
      container.style.width = '100%'
      container.style.height = '500px'
      let layer = container.querySelector('[id^=__daum__layer_]')
      layer.style.width = '100%'
      layer.style.height = '498px'
    },
    closeDaumPostcode () {
      this.$refs.daumPostcode.style.display = 'none'
    }
  },
  mounted () {
    this.$api.get(`/campsites/info`).then(response => {
      this.infra = response.data
    })
    this.$axios.get(`/coord2address`, {
      params: {
        x: this.longitude,
        y: this.latitude
      }
    }).then(response => {
      this.address = response.data.documents[0].address.address_name
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.campsite-register-form {
  height: 100%;
  padding: 20px;
  .form-field {
    margin-top: 10px;
    display: flex;
    align-items: center;
    &:first-child {
      margin-top: 0;
    }
    label {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 0.9rem;
      width: 70px;
      min-height: 28px;
      flex-shrink: 0;
      border-bottom: solid #dee8ff 1px;
      &:empty {
        border-bottom: none;
      }
    }
    label + .form-input {
    }
    .form-input {
      min-height: 28px;
      flex-grow: 1;
      border-bottom: solid #dee8ff 1px;
      input[type=text], input[type=tel], textarea {
        display: block;
        font-size: 0.9rem;
        border: none;
        background-color: transparent;
        outline: none;
        width: 100%;
        height: 100%;
        padding: 5px 0;
      }
    }
    button {
      border: none;
      outline: none;
      background-image: linear-gradient(95deg, #9ec4e9 1%, #1bc7d4 98%);
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
      border-radius: 14px;
      color: #ffffff;
      padding: 5px 12px;
      font-weight: bold;
      font-size: 0.75rem;
    }
  }
  .form-extra {
    padding-bottom: 20px;
    .form-extra-group {
      margin-top: 10px;
      .form-extra-group-title {
        font-size: 0.8rem;
        font-weight: bold;
      }
      .form-extra-group-contents {
        display: flex;
        align-items: center;
        margin-top: 5px;
        button {
          display: inline-block;
          width: 74px;
          height: 74px;
          border: none;
          outline: none;
          padding: 0;
          background-image: url('../../assets/img/camp-icon-bg-up@2x.png');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          background-color: transparent;
          font-size: 0.6rem;
          margin: -8px;
          padding-left: 2px;
          &.active {
            background-image: url('../../assets/img/camp-icon-bg-down@2x.png');
          }
          div {
            margin-top: 3px;
          }
        }
      }
    }
  }
}
</style>
