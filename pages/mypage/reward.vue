<template>
  <div class="mypage-reward">
    <mypage-navigator></mypage-navigator>
    <div class="body">
      <div class="point-container">
        <div class="point">
          <div class="point-label">POINT</div>
          <div class="point-value">{{point | numberFormat}}</div>
        </div>
      </div>
      <div class="point-progress-container">
        <div class="point-progress-label-container">
          <div v-bind:style="{left: (progress) + '%'}" class="point-progress-label">{{progress}}%</div>
        </div>
        <div class="point-progress-bar">
          <div v-bind:style="{width: (progress) + '%'}" class="point-progress"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MypageNavigator from '../../components/partials/MypageNavigator'
export default {
  name: 'Reward',
  components: {
    MypageNavigator
  },
  data () {
    return {
      point: 0,
      progress: 0
    }
  },
  created () {
    this.$api.get(`/members/${this.$token.memberNo}`).then(resposne => {
      this.point = resposne.data.experiencePoint
      this.progress = Math.round(((this.point / 100000) * 100) * 100) / 100
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
$progress-radius: 20px;
.mypage-reward {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  .body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding-bottom: $footer-height;
    background-image: linear-gradient(to top, #75e8d5, #9cafe5);
    .point-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100vw - 100px);
      height: calc(100vw - 100px);
      max-width: 262px;
      max-height: 262px;
      border-radius: 50%;
      background-image: linear-gradient(to bottom, #e6f1ff, #7cf1de);
      .point {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #eceff8;
        box-shadow: 0 3px 20px 0 rgba(0, 0, 0, 0.16);
        border-radius: 50%;
        width: calc(100% - 60px);
        height: calc(100% - 60px);
        .point-label {
          font-size: 0.9rem;
        }
        .point-value {
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }
    .point-progress-container {
      margin-top: 60px;
      width: calc(100% - 20px);
      display: flex;
      flex-direction: column;
      align-items: center;
      .point-progress-label-container {
        width: calc(100% - 40px);
        max-width: 318px;
        position: relative;
        .point-progress-label {
          position: absolute;
          font-size: 0.9rem;
          color: #96b9e3;
          background-color: #ffffff;
          padding: 1px;
          width: 50px;
          border-radius: 3px;
          left: 0;
          bottom: 0;
          box-shadow: 2px 2px 3px 0 #c3cadf;
          text-align: center;
          margin-left: -25px;
          margin-bottom: 7px;
          &::after {
            content: '';
            position: absolute;
            clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
            background-color: #ffffff;
            width: 6px;
            height: 7px;
            bottom: -7px;
            left: calc(50% - 3px);
            box-shadow: 2px 2px 3px 0 #c3cadf;
          }
        }
      }
      .point-progress-bar {
        position: relative;
        background-color: #ffffff;
        height: 13px;
        width: 100%;
        max-width: 318px;
        border-radius: $progress-radius;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          box-shadow: -3px -3px 6px 0 rgba(255, 255, 255, 0.56);
          border-radius: $progress-radius;
        }
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          box-shadow: 3px 3px 6px 0 rgba(173, 181, 203, 0.56);
          border-radius: $progress-radius;
        }
        .point-progress {
          height: 100%;
          background-image: linear-gradient(to right, #75e8d5, #9cafe5);
          border-radius: $progress-radius;
        }
      }
    }
  }
}
</style>
