<template>
<div>
  <div class="flex full-width list-horizontal">
    <!-- PC -->
    <div v-if="isPC"
         class="list-wrap full-width"
         :ref="`${refName}`"
         :class="{ dragscroll: isIE }"
         v-dragscroll.x="true"
         @dragscrollmove.prevent.self="onDrag"
         :style="wrapStyle">
      <div class="grab-bing full-width"
           :style="grabStyle"
           ref="horizontal">
        <slot name="card"></slot>
      </div>
    </div>
    <!-- Mobile or IE -->
    <div v-else class="list-wrap" :style="wrapStyle">
      <div class="grab-bing drag-scroll-mobile" 
        :style="grabStyle" ref="horizontal">
        <slot name="card"></slot>
      </div>
    </div>
  </div>

  <div class="full-width flex-align bar-wrap" 
    v-if="isProgress">
    <div :style="progressBar"></div>
    <div :style="progressBar2"></div>
  </div>
</div>
</template>

<script>
  import {dragscroll} from 'vue-dragscroll'

  export default {
    name: "ListHorizontal",
    directives: {
      dragscroll
    },
    props: {
      cardHeight: {
        type: [Number, String],
        required: false,
        default: 'auto'
      },
      refName: {
        type: String,
        required: false
      },
      wrapCustomStyle: {
        type: Object,
        required: false
      },
      grabCustomStyle: {
        type: Object,
        required: false
      },
      isProgress: {
        type: Boolean,
        required: false
      },
      // 안에 key 3개 넘겨주기. width: 카드 1개의 width. length: list의 length. margin: 카드간 margin.
      listInfo: {
        type: Object,
        requird: false
      },
      // css scroll snap 사용여부 (IE 미지원, 기본값 false)
      useScrollSnap: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        'scrollWidth': 0
      }
    },
    created() {
      if(this.isIE) {
        setTimeout(() => {
          dragscroll.reset();
        },1000);
      }
    },
    mounted() {
      let el = this.$refs.horizontal;
      el.addEventListener('scroll', () => {
        this.scrollWidth = el.scrollLeft;
      });
    },
    computed: {
      wrapStyle() {
        let deco = {};
        if (this.wrapCustomStyle) {
          deco = this.wrapCustomStyle;
        }
        if (typeof this.cardHeight === 'string') {
          deco.height = this.cardHeight;
        } else {
          deco.height = this.cardHeight + 'px';
        }
        return deco;
      },
      grabStyle() {
        let deco = {};
        if (this.grabCustomStyle) {
          deco = this.grabCustomStyle;
        }
        if (typeof this.cardHeight === 'string') {
          deco.height = this.cardHeight;
        } else {
          deco.height = (this.cardHeight+17) + 'px'
        }
        if (this.$store.getters.device === 'mobile' && this.useScrollSnap) {
          deco.scrollSnapType = 'x mandatory';
        }
        return deco;
      },
      isIE() {
        return navigator.userAgent.indexOf('Trident') > -1;
      },
      isPC() {
        return (this.$store.getters.browserType === 'pc');
      },
      progressBar() {
        let padding = this.$store.getters.brand.layout_padding * 2;
          let total = this.barScrollWidth - window.innerWidth + padding;
          if(total < 0) {
            this.scrollWidth = 100;
            total = 100;
          }

        return {
          width: `${this.scrollWidth*100/total}%`,
          height: '5px',
          backgroundColor: this.getColor('Primary Color')
        }
      },
      progressBar2() {
          let padding = this.$store.getters.brand.layout_padding * 2;
          let total = this.barScrollWidth - window.innerWidth + padding;
          if(total < 0) {
            this.scrollWidth = 100;
            total = 100;
          }

          return {
            width: `${(total-this.scrollWidth)*100/total}%`,
            height: '5px',
            backgroundColor: '#F2F2F2'
          }
      },
      barScrollWidth() {
        if(this.listInfo) {
          return (this.listInfo.length*this.listInfo.width) + ((this.listInfo.length-1)*this.listInfo.margin);
        }
      }
    },
    methods: {
      onDrag(e) {
        if(Math.abs(e.detail.deltaX) > 0) {
          this.$store.commit('setDragEnd', true);
        }
      },
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>


  .list-horizontal
    overflow hidden

  .list-wrap
    overflow hidden
    height 350px

  .grab-bing
    white-space nowrap
    position relative
    height 365px

  .drag-scroll-mobile
    overflow-x scroll
    -webkit-overflow-scrolling touch
    overflow-y hidden
    --ms-overflow-style none

  .grab-bing.drag-scroll-mobile::-webkit-scrollbar
    display: none

  .bar-wrap
    height 5px
    margin 16px 0

</style>