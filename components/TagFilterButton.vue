<template>
  <button type="button" class="tag-filter">#</button>
</template>

<style lang="scss" scoped>
.tag-filter {
  position: relative;
  background-color: #409aff;
  border-radius: 3px;
  border: none;
  color: #ffffff;
  font-size: 0.85rem;
  padding: 0 10px;
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 5px;
    height: 5px;
    background-color: #409aff;
    bottom: -2px;
    left: 5px;
    transform: rotate(-90deg) skew(40deg);
  }
}
</style>