<template>
  <div class="uk-flex uk-flex-column uk-flex-center uk-text-center" style="height: 100%; background-color: #eceff8; padding: 37px;">
    <div class="inspection-corn"></div>
    <div style="font-weight: bold;">
      <span uk-icon="icon: warning;"></span>
      <span>현재 서비스 점검 중 입니다.</span>
    </div>
    <div style="margin-top: 10px; font-size: 0.8rem; color: #bfbfbf;">
      보다 좋은 서비스를 제공 해 드리기 위해<br/>
      현재 서비스를 점검하고 있습니다.
    </div>
    <div style="margin-top: 27px; padding: 20px; font-size: 0.8rem; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16); color: #585858;">
      <div style="font-size: 0.9rem; font-weight: bold;">서비스 점검시간</div>
      <div>
        2020년 12월 30일 오전 0시<br/>
        ~ 2020년 12월 30일 오전 6시
      </div>
      <div style="margin-top: 10px; font-size: 0.9rem; font-weight: bold;">서비스 점검내용</div>
      <div>시스템 업그레이드</div>
    </div>
    <div style="margin-top: 20px; margin-bottom: 20px; font-weight: bold;">이용에 불편을 드려 대단히 죄송합니다.</div>
  </div>
</template>

<script>
export default {
  name: 'Inspection',
  layout: 'empty'
}
</script>

<style lang="scss" scoped>
.inspection-corn {
  background-image: url(../assets/img/corn.svg);
  background-repeat: no-repeat;
  background-position: center;
  height: 121px;
}
</style>
