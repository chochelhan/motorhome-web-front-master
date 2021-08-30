<template>
  <div class="filter-groups">
    <div v-for="group in categoryGroups" v-bind:key="group.categoryNo" class="filter-group">
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
</template>

<script>
export default {
  name: 'CategoryGroups',
  props: {
    value: Array,
    boardCode: String
  },
  data () {
    return {
      categoryGroups: [],
      selected: [].concat(this.value)
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
      this.$emit('input', this.selected)
    },
    unselect (item, group) {
      if (group.required) {
        let groupSelected = this.selected.filter(_item => group.categoryNames.indexOf(_item) > -1)
        if (groupSelected.length > 1) {
          this.selected = this.selected.filter(_item => _item !== item)
        }
      } else {
        this.selected = this.selected.filter(_item => _item !== item)
      }
      this.$emit('input', this.selected)
    },
    toggle (item, group) {
      if (this.selected.indexOf(item) > -1) {
        this.unselect(item, group)
      } else {
        this.select(item, group)
      }
    },
    check () {
      return new Promise((resolve, reject) => {
        try {
          this.categoryGroups.forEach(group => {
            if (group.required) {
              if (this.selected.filter(item => group.categoryNames.indexOf(item) > -1).length < 1) {
                throw new Error(`${group.categoryGroupName}은 필수선택 입니다.`)
              }
            }
          })
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  created () {
    this.$api.get(`/categories`, {
      params: {
        boardCode: this.boardCode
      }
    }).then(response => {
      this.categoryGroups = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
.filter-groups {
  flex-grow: 1;
  padding: 10px 0;
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
</style>
