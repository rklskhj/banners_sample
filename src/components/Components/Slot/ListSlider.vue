<template>
  <div class="image-slider-container">
    <div class="flex position-relative">

      <!-- 왼쪽 화살표 -->
      <i v-if="arrow && listData.length > 1"
         class="slider-arrow material-icons unselect"
         :style="arrowLeftComputedStyle"
         @click="$refs.slick.prev()">keyboard_arrow_left</i>

      <!-- 슬라이드 리스트 -->
      <div style="overflow: hidden; flex:1"
           ref="cardlist">

        <transition name="fade">
          <slick :ref="slickId"
                 v-if="reRender"
                 @afterChange="handleAfterChange"
                 :options="slickOptions">

            <!-- 카드뷰 -->
            <slot name="card"></slot>

          </slick>
        </transition>

        <!-- Indicator -->
        <div class="indicator-container" v-if="indicator && listData.length > 1">
          <div class="indicator-wrapper">
            <div v-for="i in Array.from({length:listData.length}, (v,k) => k)" :key="'ic'+i" @click="$refs[slickId].goTo(i)">
              <div v-if="i === currentSlide" :style="currentIndicatorStyle"></div>
              <div v-else :style="indicatorStyle"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 화살표 -->
      <i v-if="arrow && listData.length > 1"
         class="slider-arrow material-icons unselect"
         :style="arrowRightComputedStyle"
         @click="$refs[slickId].next()">keyboard_arrow_right</i>
    </div>
  </div>
</template>

<script>
  import Slick from 'vue-slick'
  import uuidv4 from 'uuid/v4'

  export default {
    name: 'list-slider',

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
      arrowLeftStyle: {
        type: Object,
        required: false
      },
      arrowRightStyle: {
        type: Object,
        required: false
      },
      centerPadding: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        currentSlide: 0,
        reRender: true,
        slickId: '',
        rendered: false
      }
    },

    created() {
      this.slickId = 'slick-'+uuidv4();
    },

    mounted() {
      if(!this.rendered) {
        this.$nextTick(() => {
          this.reRenderSlick();
          this.rendered = true;
        });
      }
    },


    methods: {
      reRenderSlick() {
        if(this.reRender === false) return;

        this.$nextTick(() => {
          this.reRender = false;
          setTimeout(() => {
            this.reRender = true;

            this.$nextTick(() => {
              this.$refs[this.slickId].$el.getElementsByClassName('slick-list')[0].addEventListener('touchstart', () => {
                console.log('touchstart');
                this.$refs[this.slickId].play();
              });
            });
          },200);
        });
      },

      handleAfterChange(event, slick, currentSlide) {
        this.currentSlide = currentSlide;
      }
    },

    computed: {
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
          centerPadding: this.centerPadding,
          centerMode: false,
          autoplay: this.autoplay,
          arrows: false,
          dots: false,
          slidesToShow: this.slidesToShow,
          slidesToScroll: this.slidesToScroll,
          autoplaySpeed: this.autoplaySpeed,
          responsive: [ { settings: { waitForAnimate : false, pauseOnFocus : false, pauseOnHover : false, swipe : false } } ]
        }
      },
      arrowLeftComputedStyle() {
        if (this.arrowLeftStyle) return this.arrowLeftStyle;
        else {
          return {
            height: '24px',
            fontSize: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.2)',
            top: 'calc(50% - 12px)',
            color: 'white',
            left: '8px'
          }
        }
      },

      arrowRightComputedStyle() {
        if (this.arrowRightStyle) return this.arrowRightStyle;
        else {
          return {
            height: '24px',
            fontSize: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.2)',
            top: 'calc(50% - 12px)',
            color: 'white',
            right: '8px'
          }
        }
      },
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

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

  .fade-enter-active
    transition opacity .5s
  .fade-enter
    opacity 0

</style>
