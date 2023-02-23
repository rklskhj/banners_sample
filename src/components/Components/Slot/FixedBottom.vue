<template>
  <div class="fixed-bottom">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'FixedBottom'
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .fixed-bottom 
    position fixed
    bottom 0
    width 100%
    max-width 414px
    z-index 10
    transform translateX(-50%)
    left 50%

</style>
