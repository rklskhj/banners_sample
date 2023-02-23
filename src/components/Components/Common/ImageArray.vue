<template>
  <div class="flex">
    <div v-for="(img,idx) in computedImgs" :key="`img-${idx}`" :style="padding(idx)">
      <div :style="imgStyle(img)" class="position-relative">
        <div v-if="idx===4" class="more">더보기</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ImageArray",
    props: {
      imgs: {
        type: Array,
        required: true
      }
    },
    created() {
      this.computedImgs = cloneItem(this.imgs).splice(0,5);
    },
    data() {
      return {
        layout_gutter: 4,
        computedImgs: []
      }
    },
    methods: {
      imgStyle(img) {
        return {
          width: '60px',
          height: '60px',
          borderRadius: '4px',
          backgroundImage: `url("${img}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }
      },
      padding(idx) {
        if(idx === 0) {
          return {
            paddingRight: (this.layout_gutter * 2/3) + 'px'
          }
        }
        else if(idx === this.imgs.length-1) {
          return {
            paddingLeft: (this.layout_gutter * 2/3) + 'px'
          }
        }

        else {
          let padding = (this.layout_gutter / 3) + 'px';
          return {
            paddingLeft: padding,
            paddingRight: padding
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .more
    position absolute
    width 100%
    height 100%
    background-color rgba(0,0,0,0.5)
    color white
    text-align center
    line-height 60px
    font-size 11px
    border-radius 4px
</style>