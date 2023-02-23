<template>
  <div>
    <div ref="anchorHead" class="flex-center anchor-head" 
      :style="[headStyle, brandColor.main, brandBgColor.main]">
      <div class="flex-center anchor-head-wrap" :style="headWrapStyle">
        <div v-for="(item, idx) in menu" :key="item.id" class="unselect"
          @click="clickAnchor(item.id, idx)"
          :style="headItemStyle(item.id)">
          <span>{{item.name}}</span>
          <span v-if="item.count!==undefined">({{item.count}})</span>
        </div>
      </div>
    </div>

    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      required: true
    },
    anchorHeadStyle: {
      type: Object,
      required: false
    },
    headHeight: {   // 앵커 헤더 높이
      type: Number,
      required: false,
      default: function() {
        return 48;
      }
    },
    scrollOffset: {   // 헤더 등 fixed 처리 시 상위 offset
      type: Number,
      required: false,
      default: function() {
        return 0;
      }
    },
    anchorHeadItemStyle: {
      type: Object,
      required: false
    },
    anchorHeadUnselectedItemStyle: {
      type: Object,
      required: false
    },
    changeOffset: {   // 상위 엘레먼트 등 clientHeight 변경 시 감지
      type: Number,
      required: false
    },
    extraScrollAnchor: {
      type: Number,
      required: false
    },
  },

  created() {
    this.initializeAnchorTop();
    this.setHeadStyle();
  },

  mounted() {
    this.$nextTick(function() {
      if (this.$refs.anchorHead) {
        window.addEventListener('scroll', () => {
          this.onScroll();
        });
      }
    })
  },

  updated() {
    this.$nextTick(function() {
      if (this.$refs.anchorHead) {
        this.currentTop = this.$refs.anchorHead.getBoundingClientRect().top;
      }
    })
  },

  destroyed() {
    window.removeEventListener('scroll', () => {
      this.onScroll();
    });
  },
  
  watch: {
    changeOffset(n) {
      this.initializeAnchorTop();
    },
    extraScrollAnchor(n) {
      if (n!==-undefined) {
        this.clickAnchor(n);
        this.$emit('initialExtra');
      }
    }
  },  

  data() {
    return {
      currentTop: 0,
      initialAnchorTop: 0,
      anchorTop: 0,
      scrollUp: false,
      sticky_state: false,
      selectedTab: 0,
      headStyle: {},
      headWrapStyle: {}
    }
  },

  computed: {
    computedMenu() {
      let result = [];
      this.menu.forEach(item => {
        if(item.id === this.selectedTab)
          result.push(item);
      });
      return result;
    },
    scrollOptions() {
      return {
        // container: '#anchor',
        easing: 'ease-out',
        offset: -(this.scrollOffset + this.headHeight),
        force: true,
        cancelable: true,
        onStart: function() {
          // scrolling started
        },
        onDone: function() {
          // scrolling done
        },
        onCancel: function() {
          // scrolling has been interrupted
        },
        x: false,
        y: true
      };
    }
  },

  methods: {
    initializeAnchorTop() {
      this.$nextTick(function() {
        if (this.$refs.anchorHead) {
          let elOffset = this.$refs.anchorHead.offsetTop;
          this.initialAnchorTop = elOffset;
        }
      })
    },    
    onScroll() {
      this.$nextTick(function() {
        if (this.$refs.anchorHead) {

          let currentTop = this.currentTop;

          // sticky 상태가 아닐 경우
          if (currentTop > this.scrollOffset) {
            this.sticky_state = false;
            this.setHeadStyle();
          }
          else if (currentTop < this.scrollOffset) {
            this.sticky_state = true;
            this.setHeadStyle();
          }
          
          // sticky 상태 일 경우
          else {
            let pageScroll = $(window).scrollTop(); 

            if (pageScroll >= (this.initialAnchorTop - this.scrollOffset)) {
              this.sticky_state = true;
              this.setHeadStyle();
            }
            else {
              this.sticky_state = false;
              this.setHeadStyle();
            }
          }

        }
      })
    },
    clickAnchor(id, idx) {
      let duration = 500;
      this.$scrollTo(`#anchor${id}`, duration, this.scrollOptions);
      this.selectedTab = id;
    },
    setHeadStyle() {
      // head
      let head = {};
      if (this.sticky_state) {
        head.position = 'fixed';
        head.width = '100vw';
        head.top = `${this.scrollOffset}px`;
        head.left = 0;
      }
      else {
        head.position = 'static';
        head.width = '';
        head.top = '';
        head.left = '';
      }
      head.height = `${this.headHeight}px`;
      head.borderBottom = this.brandBorder.main.border;
      this.headStyle = head;

      // head wrap
      let head_wrap = {};
      if (this.anchorHeadStyle) head_wrap = this.anchorHeadStyle;
      if (this.sticky_state&&this.maxWidth) {
        head_wrap.width = this.maxWidth;
      }
      else head_wrap.width = '100%';
      this.headWrapStyle = head_wrap;

    },
    headItemStyle(id) {
      if (this.selectedTab===id) {
        if (this.anchorHeadItemStyle) return this.anchorHeadItemStyle;
      }
      else {
        if (this.anchorHeadUnselectedItemStyle) return this.anchorHeadUnselectedItemStyle;
      }

      let styles = {};
      styles.color = this.brandColor.main;
      if (this.selectedTab===id) styles.fontWeight = 'bold';
      return styles;
    }
  }
}
</script>

<style lang="stylus" scoped>

.anchor-head 
.anchor-head-wrap 
  display flex
  justify-content space-around
  align-items center
  z-index 10
  // background #fff

</style>