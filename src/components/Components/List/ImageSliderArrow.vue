<template>
  <div class="image-slider-container flex-center">
    <div class="flex-center position-relative" :style="{width:containerWidth+'px'}">

      <!-- 왼쪽 화살표 -->
      <i v-if="arrow"
         class="slider-arrow arrow-left material-icons unselect"
         :style="arrowLeftComputedStyle"
         @click="$refs.slick.prev()">keyboard_arrow_left</i>

      <div class="flex" :style="{width:contentWidth+'px'}">

        <!-- 슬라이드 리스트 -->
        <div style="overflow: hidden; flex:1"
             ref="cardlist">

          <slick ref="slick"
                 v-if="reRender"
                 @afterChange="handleAfterChange"
                 :options="slickOptions">

            <!-- 카드뷰 -->
            <div v-for="(item,idx) in listData" :key="'img-slider-'+idx"
                 class="slide-card" :style="slideCardStyle">
              <div v-if="item.link && item.link !== ''" @click="getHref(item.link)">
                <div :style="imgStyle(item)"></div>
              </div>
              <div v-else :style="imgStyle(item)"></div>
            </div>
          </slick>

        </div>

      </div>

      <!-- 오른쪽 화살표 -->
      <i v-if="arrow"
         class="slider-arrow arrow-right material-icons unselect"
         :style="arrowRightComputedStyle"
         @click="$refs.slick.next()">keyboard_arrow_right</i>


      <!-- Indicator -->
      <div class="indicator-container" v-if="indicator">
        <div class="indicator-wrapper">
          <div v-for="i in Array.from({length:listData.length}, (v,k) => k)" :key="'ic'+i" @click="$refs.slick.goTo(i)">
            <div v-if="i === currentSlide" :style="currentIndicatorStyle"></div>
            <div v-else :style="indicatorStyle"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import Slick from 'vue-slick'

  export default {
    name: 'image-slider-arrow',

    components: {
      Slick
    },

    props: {
      arrow: {
        type: Boolean,
        default: false
      },
      indicator: {
        type: Boolean,
        default: false
      },
      listData: {
        type: Array,
        required: true
      },
      height: {
        type: Number,
        required: false
      },
      autoplay: {
        type: Boolean,
        default: false
      },
      slidesToShow: {
        type: Number,
        default: 1
      },
      slidesToScroll: {
        type: Number,
        default: 1
      },
      autoplaySpeed: {
        type: Number,
        default: 3000
      },
      containerWidth: {
        type: Number,
        default: 900
      },
      contentWidth: {
        type: Number,
        default: 800
      },
      arrowLeftStyle: {
        type: Object,
        required: false
      },
      arrowRightStyle: {
        type: Object,
        required: false
      },
      slideCardStyle: {
        type: Object,
        required: false
      },
      imageStyle: {
        type: Object,
        required: false
      },
    },

    data() {
      return {
        currentSlide: 0,
        reRender: true
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.reRenderSlick();
      });
    },

    methods: {
      reRenderSlick() {
        if(this.reRender === false) return;

        this.$nextTick(() => {
          this.reRender = false;
          setTimeout(() => {
            this.reRender = true;
          },500);
        });
      },

      getHref(link) {
        location.target = (link.indexOf('http:')>-1 || link.indexOf('https:')>-1) ? '_blank' : '';
        location.href = link;
      },

      getTarget(link) {
        return (link.indexOf('http:')>-1 || link.indexOf('https:')>-1) ? '_blank' : '';
      },

      handleAfterChange(event, slick, currentSlide) {
        this.currentSlide = currentSlide;
      },

      imgStyle(img) {
        let height = '60px';
        if(this.height)
          height = this.height + 'px';

        return {
          width: '100%',
          height: height,
          backgroundImage: this.imageStyle&&this.imageStyle.backgroundImage ?
            this.imageStyle.backgroundImage : `url(${img.url})`,
          backgroundPosition: this.imageStyle&&this.imageStyle.backgroundPosition ?
            this.imageStyle.backgroundPosition : 'center',
          backgroundSize: this.imageStyle&&this.imageStyle.backgroundSize ?
            this.imageStyle.backgroundSize : 'cover',
          backgroundRepeat: this.imageStyle&&this.imageStyle.backgroundRepeat ?
            this.imageStyle.backgroundRepeat : 'no-repeat',
          marginBottom: '-5px'
        }
      },
    },

    computed: {

      arrowLeftComputedStyle() {
        if (this.arrowLeftStyle) return this.arrowLeftStyle;
        else {
          return {
            fontSize: '40px',
            top: 'calc(50% - 20px)',
            left: 0
          }
        }
      },

      arrowRightComputedStyle() {
        if (this.arrowRightStyle) return this.arrowRightStyle;
        else {
          return {
            fontSize: '40px',
            top: 'calc(50% - 20px)',
            right: 0
          }
        }
      },

      currentIndicatorStyle() {
        return {
          width: '8px',
          height: '8px',
          borderRadius: '100%',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          marginRight: '4px'
        };
      },

      indicatorStyle() {
        return {
          width: '8px',
          height: '8px',
          borderRadius: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          marginRight: '4px'
        };
      },

      // 슬릭 옵션
      slickOptions() {

        return {
          infinite: true,
          variableWidth: false,
          centerPadding: '',
          centerMode: false,
          autoplay: this.autoplay,
          arrows: false,
          dots: false,
          slidesToShow: this.slidesToShow,
          slidesToScroll: this.slidesToScroll,
          autoplaySpeed: this.autoplaySpeed,
        }
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .cg-list-image-slider-container
    position relative
    width 100%

  .slider-arrow
    position absolute
    z-index 1

  .indicator-container
    position absolute
    width 100%
    bottom 16px

  .indicator-wrapper
    display flex
    justify-content center
</style>
