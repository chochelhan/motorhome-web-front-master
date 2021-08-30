# motorhome-web-front

## IOS앱스토어에 앱 출시 시
 - `/components/Setting.vue` 파일 "앱 출시 시 하단 주석 제거"쪽 주석 제거 및 `storeLink` 메서드의 앱스토어 링크 변경
 - `/pages/share.vue`파일 `open` 메서드 내 `appstoreId` 앱스토어 아이디로 변경 및 "앱스토어 이동" 링크 주석 해제
 - 애플 심사로 인해 회원가입 시 성별을 보이지 않도록 해놓았는데, 이를 복구하기 위해 `/pages/join.vue` 파일의 "성별복원" 키워드 하단의 주석처리된 부분을 주석 해제

## 앱 업데이트 전
 - 애플측에서 익멍 게시판 관련하여 익명 커뮤니티를 서비스 할 경우, 게시물 신고 기능이 필요하고 연령제한을 높여야 하는 관계로 이와 관련된 조치가 되지 않았다면 익멍게시판을 숨긴채로 업데이트를 심사해야함

## 앱 업데이트 시
`/components/Setting.vue` 파일의 "최신 버전" 의 버전 코드 변경

## 익멍 재노출
익멍의 경우 애플쪽 심사문제로 임시로 제거했었는데, 이를 복원하려면 소스코드 내 "익멍복원"이라는 키워드로 검색 후 주석 내에 있는 코드를 대치하면 됨

## FLEX 재노출
FLEX메뉴는 PIWI측 요청으로 잠시 빼달라는 요청이 있어서 제거 했고, 복원방법은 "FLEX복원"이라는 키워드로 검색 후 주석 내에 있는 코드를 대치하면 됨

## 액티비티
안드로이드의 액티비티를 모방하여 구현한 컴포넌트로 `/componenets/Activity.vue`에 위치함  
구현채들은 `/components/activities`에 구현되어있다  
액티비티의 lifecycle은 `/components/ActivityManager.vue` 컴포넌트와 `/plugins/activity.js` 플러그인에서 담당


### 액티비티 생성
``` html
<!--
생성된 액티비티들은 store로 관리되는데, 액티비티 종료 시 store에 상태를 업데이트 하기 위해 activity의 finish이벤트를 받아
this.$activity.finish(this)를 호출해야한다
-->
<template>
 <activity v-on:finish="finish"></activity>
</template>
<script>
import Activity from './Activity'
export default {
 name: 'SomeActivity',
 components: {
  Activity
 },
 props: {
  prop1: Number
 },
 methods: {
  finish () {
   this.$activity.finish(this)
  }
 }
}
</script>
```

``` javascript
this.$activity.start({액티비티구현체}, {PROPS})
// EX) this.$activity.start(SomeActivity, {prop1: 1})
```
### Promise
액티비티 종료 시점에 콜백을 받기위해 Promise스타일로 데이터를 전달할 수 있다  
Promise스타일로 콜백을 받기 위해서는 액티비티 구현체의 props에 resolve를 선언하고, \<activity> 컴포넌트에 resolve를 넘겨주어야 한다

``` html
<template>
 <activity ref="activity" v-on:finish="finish" v-bind:resolve="resolve">
  <button v-on:click="confirm">Confirm</button>
 </activity>
</template>
<script>
import Activity from './Activity'
export default {
 name: 'SomeActivity',
 components: {
  Activity
 },
 props: {
  prop1: Number,
  resolve: Function
 },
 methods: {
  finish () {
   this.$activity.finish(this)
  },
  confirm () {
   let data = {a: 1, b: 2}
   this.$refs.activity.finish(data)
  }
 }
}
</script>
```

``` javascript
import SomeActivity from './activities/SomeActivity'
// ... 생략
this.$activity.start(SomeActivity, {prop1: 1}).then(data => {
  console.log(data)
  // output {a: 1, b: 2}
})
// 위 then 내에 선언한 함수부는 `/components/ActivityManager.vue` 컴포넌트와 `/plugins/activity.js` 플러그인에서
// 액티비티 구현채에 resolve props로 넘여줌
```

## UIKit
CSS 프레임워크는 UIKit을 사용하며, 아이콘 에셋 컴파일을 위해 UIKit을 fork함

### 아이콘 추가
1. `motorhome/uikit` 저장소를 받고
2. `custom` 디렉토리에 아이콘(svg포멧)을 넣은 후
3. yarn compile
4. git add .
5. git commit
6. git push
7. `motorhome/motorhome-web-font` 저장소에서 yarn upgrade

## Sentry
스크립트단 에러 모니터링을 위해 Sentry를 사용중  
계정은 구글계정으로 로그인 하면되고 motorhome.dev@gmail.com 계정을 사용
