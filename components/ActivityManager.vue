<template>
  <div>
    <div v-for="(activity, index) in $store.state.activity.list" v-bind:key="index">
      <activity
        ref="activity"
        v-if="activity.instant"
        v-bind:key="index"
      >
        <template v-slot:header>{{activity.title}}</template>
        <component v-bind:is="activity.is()" v-bind="activity.bind"></component>
      </activity>
      <component
        ref="activity"
        v-else-if="activity.is"
        v-bind:key="index"
        v-bind:resolve="activity.resolve()"
        v-bind:is="activity.is()"
        v-bind="activity.bind"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityManager',
  mounted () {
    window.app.activityManager = this
  }
}
</script>
