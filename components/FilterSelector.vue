<template>
  <div class="filter-body">
    <div class="filter-title">보고싶은 글을 골라보세요.</div>
    <div class="filter-groups">
      <div v-for="group in groups" v-bind:key="group.categoryNo" class="filter-group">
        <div class="filter-group-name">{{group.categoryGroupName}}</div>
        <div class="filter-group-items">
          <button
            v-for="(name, index) in group.categoryNames" v-bind:key="index"
            v-on:click="toggle(name, group)"
            v-bind:class="{active: selected.indexOf(name) > -1}"
            type="button"
          >#{{name}}</button>
        </div>
      </div>
    </div>
    <div class="filter-footer">
      <button v-on:click="confirm" type="button" class="filter-apply">필터 적용하기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSelector',
  props: {
    value: Array,
    boardCode: String
  },
  data () {
    return {
      groups: [],
      selected: []
    }
  },
  methods: {
    select (item, group) {
      if (!group.multipleSelectable) {
        this.selected = this.selected.filter(_item => group.categoryNames.indexOf(_item) < 0)
      }
      if (this.selected.indexOf(item) < 0) {
        this.selected.push(item)
      }
    },
    unselect (item, group) {
      this.selected = this.selected.filter(_item => _item !== item)
    },
    toggle (item, group) {
      if (this.selected.indexOf(item) > -1) {
        this.unselect(item, group)
      } else {
        this.select(item, group)
      }
    },
    confirm () {
      this.$emit('input', this.selected.filter((item, index, self) => self.indexOf(item) === index))
    }
  },
  created () {
    this.$api.get(`/categories`, {
      params: {
        boardCode: this.boardCode
      }
    }).then(response => {
      if (response.data.length) {
        this.groups = response.data
      } else {
        this.groups = [
          {
            categoryNames: ['초보', '중수', '고수'],
            categoryGroupName: '캠핑레벨',
            multipleSelectable: false,
            categoryNo: 1,
            required: true
          },
          {
            categoryNames: ['캠핑카', '카라반', '일반차량'],
            categoryGroupName: '차량',
            multipleSelectable: true,
            categoryNo: 2,
            required: false
          },
          {
            categoryNames: ['산', '바다', '강', '계곡', '도심', '평야'],
            categoryGroupName: '장소',
            multipleSelectable: true,
            categoryNo: 3,
            required: true
          }
        ]
      }
    })
    this.selected = [].concat(this.value)
  }
}
</script>

<style lang="scss" scoped>
.filter-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  .filter-title {
    margin-top: 50px;
    color: #2e98b0;
    font-size: 1.25rem;
    text-align: center;
  }
  .filter-groups {
    flex-grow: 1;
    padding: 10px 20px;
    .filter-group {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .filter-group-name {
        width: 70px;
        font-weight: bold;
        font-size: 0.9rem;
        flex-shrink: 0;
      }
      .filter-group-items {
        display: flex;
        flex-grow: 1;
        flex-wrap: wrap;
        button {
          border: none;
          background-color: #d4daec;
          color: #5b5b5b;
          font-size: 0.7rem;
          border-radius: 35px;
          width: 70px;
          height: 27px;
          margin: 5px;
          word-break: keep-all;
          &.active {
            background-color: #a6e7ed;
          }
        }
      }
    }
  }
  .filter-footer {
    margin: 20px 45px 30px;
    .filter-apply {
      display: block;
      width: 100%;
      padding: 10px 20px;
      border: none;
      font-size: 1.1rem;
      border-radius: 25px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
      background-color: #16adb9;
      color: #ffffff;
    }
  }
}
</style>
