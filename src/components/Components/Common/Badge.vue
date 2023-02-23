<template>
  <div v-if="isVisible" class="badge"
       :style="[brandBgColor.alert, brandColor.white, badgeStyle]">{{ val }}</div>
</template>

<script>
  export default {
    name: "Badge",
    props: {
      val: {
        type: [String, Number]
      },
      badgeStyle: {
        type: Object,
        required: false
      }
    },
    computed: {
      isVisible() {
        if(this.val === undefined
          || this.val === 0
          || this.val === '0'
          || this.val === '') {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .badge
    border-radius 50%
    font-size 11px
    font-weight bold
    position absolute
    right -6px
    top -2px
    width 15px
    height 15px
    line-height 15px
    text-align center
</style>