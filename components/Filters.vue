<template>
  <div class="filters">
    <div v-for="filter in value" v-bind:key="filter" v-on:click="unselectFilter(filter)" class="filter">#{{filter}}</div>
  </div>
</template>

<script>
export default {
  name: 'Filters',
  props: {
    value: Array
  },
  methods: {
    unselectFilter (filter) {
      this.$swal.confirm(`${filter}를 선택 해제하시겠습니까?`).then(() => {
        this.$emit('input', this.value.filter(_filter => _filter !== filter))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  font-size: 0.7rem;
  margin: -2px;
  .filter {
    display: flex;
    align-items: center;
    background-color: #cdd2df;
    border-radius: 20px;
    padding: 2px 5px 2px 8px;
    margin: 2px;
    &::after {
      content: 'X';
      display: inline-block;
      width: 13px;
      height: 13px;
      font-size: 9px;
      text-align: center;
      background-color: #ffffff;
      border-radius: 20px;
      margin-left: 5px;
    }
  }
}
</style>