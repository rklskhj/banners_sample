<template>
  <div class="image-single">
    <div class="position-relative" :style="imgStyle">
      <img :src="imgs[0]" :style="imgStyle" @click="vFull=true">
      <div class="position-absolute flex-center the-others"  @click="vFull=true"
           v-if="imgs.length>1">+{{imgs.length-1}}</div>
    </div>
    <!-- 전체 페이지 띄우기 -->
    <div class="full-page" v-if="vFull">
      <div class="full-header">
        <i class="material-icons"  style="color:white" @click="vFull=false">close</i>
      </div>
      <div class="full-width">
        <slick ref="slick">
          <template v-for="(img,idx) in imgs">
            <pinch-zoom :key="'full-image-'+idx" style="height:100vh">
              <img :src="img" :class="{'full-image': $store.getters.device !== 'pc'}">
            </pinch-zoom>
          </template>
        </slick>
      </div>
    </div>
  </div>
</template>

<script>
  import PinchZoom from 'vue-pinch-zoom';

  export default {
    name: "ImageSingle",
    components: {
      PinchZoom
    },
    props: {
      imgs: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      width: {
        type: Number,
        required: false,
        default: function() {
          return 60;
        }
      }
    },
    data() {
      return {
        vFull: false
      }
    },
    computed: {
      imgStyle() {
        let styles = {};
        styles.width = `${this.width}px`;
        styles.height = `${this.width}px`;
        styles.objectFit = 'cover';
        return styles;
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .the-others
    bottom 0
    right 0
    padding 6px 12px
    color #fff
    background-color rgba(0,0,0,0.6)

  .full-page
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    z-index 9999
    background black
    align-items center
    display flex

  .full-header
    top 0
    left 0
    width 100%
    height 50px
    z-index 1
    position absolute
    display flex
    align-items center
    justify-content flex-end
    padding-right 12px


  .full-image
    width 100%
</style>