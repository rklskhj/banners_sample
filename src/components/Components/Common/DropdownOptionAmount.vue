<template>
<div class="position-relative">
    <div class="flex-between size-12 weight-500 unselect p-main p-border-main radius-6"
      @click="clickSort" style="padding: 6px 12px; width: 100px">
      <div>{{ value | currencyNum }}</div>
      <i class="material-icons" style="font-size: 20px">keyboard_arrow_down</i>
    </div>
    
    <portal to="double-layer-modal">
      <transition name="slide">
        <div v-if="!isPc && sortState" class="full-width position-fixed" 
          :style="[heightStyle, sortStyle]">
          <transition name="fade">
            <div v-if="vDim" @click="clickBack" class="dim" 
              :style="heightStyle"></div>
          </transition>
          <div class="full-width position-absolute sort-content p-bg-white"
               :style="sortContentStyle" style="color:black"
               @click.stop.prevent v-if="sortState">
            <div class="size-16 weight-500 margin-bottom-16">수량선택</div>
            <div style="overflow-y: auto; padding-top: 12px; height: 50vh">
              <div v-for="(num, idx) in amounts" :key="'num-'+idx"
                class="unselect" :style="numStyle(idx)" @click="clickNum(num)">
                <div class="size-14 weight-500">{{ num }}</div>
              </div>
              
            </div>
            <!--<div v-for="(item,idx) in sortOptions" :key="'sort-'+idx"-->
            <!--     class="flex-align" :style="sortItem(idx)"-->
            <!--     @click="clickSortitem(item)">-->
            <!--  <div class="position-relative outer-circle" style="margin-right:18px"-->
            <!--       :style="item.value===selectedSort.value ? brandBorder.primary : brandBorder.sub">-->
            <!--    <div class="position-absolute inner-circle" v-if="item.value===selectedSort.value"-->
            <!--         :style="brandBgColor.primary"></div>-->
            <!--  </div>-->
            <!--  <div class="size-13 weight-400">{{ item.label }}</div>-->
            <!--</div>-->
          </div>
        </div>
      </transition>
    </portal>
  </div>
</template>
<script>

export default {
  name: 'DropdownOptionAmount',
  components: {

  },
  mixins: [

  ],
  props: {
    isPc: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      required: true,
    },
    amounts: {
      type: Number,
      required: true,
    },

  },
  data() {
    return {
      "vDim": false,
      "height": 0,
      "filterId": 1,
      "sortState": false
    }
  },
  created() {
    this.height = window.innerHeight;
    if(!this.isPc) {
      window.onpopstate = () => {
        this.vDim = false;
        if(this.$store.getters.popstate[0]==='push sort') {
          this.unlock(document.querySelector('html'));
          this.unlock(document.querySelector('body'));
          this.$store.commit('removePopstate');
        }
      };
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.height = window.innerHeight;
      })
    })
  },
  
  methods: {
    lock(element) {
      element.style.overflow = 'hidden';
      element.style.touchAction = 'none';
    },
    unlock(element) {
      element.style.removeProperty('overflow');
      element.style.removeProperty('touch-action');
    },
    clickSort() {
      if(!this.isPc) {
        history.pushState('push sort','');
        this.$store.commit('setPopstate', 'push sort');
        this.sortState = true;
        this.lock(document.querySelector('html'));
        this.lock(document.querySelector('body'));
      } else {
        this.sortState = !this.sortState;
      }
    },
    clickBack() {
        if(!this.isPc) {
          history.back();
          this.unlock(document.querySelector('html'));
          this.unlock(document.querySelector('body'));
        } else {
          this.sortState = !this.sortState;
        }
      },
    sortItem(idx) {
        let deco = {
          padding: '18px 0'
        };

        if(idx<this.sortOptions.length-1) {
          deco.borderBottom = this.brandBorder.sub.border;
        }
        return deco;
      },
    numStyle(idx) {
        let deco = {
          marginBottom: '24px'
        }
        if (idx === this.amounts - 1) {
          deco.marginBottom = '0px'
        }
        return deco;
      },
    clickNum(item) {
      this.$emit('update:value', item);
      this.clickBack();
    }
  },
  computed: {
    sortContentStyle() {
      let deco = {
        bottom: '0px'
      }
      if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
        deco.bottom = '-8px';
      }
      return deco;
    },
    heightStyle() {
      let deco = {
        height: '100vh'
      }
      if (this.$store.getters.showAddrBar) {
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
          if (navigator.userAgent.split('iPhone OS ')[1].substring(0,2) >= 15) {
            deco.height = `${this.height}px`
          } else {
            deco.height = 'calc(100vh - 120px)'
          }
        } else if (this.$store.getters.browserType !== 'pc') {
          if (navigator.userAgent.indexOf('SamsungBrowser') > -1) {
            if (navigator.userAgent.split('SamsungBrowser/')[1].substring(0,2) >= 16) {
              deco.height = `${this.height}px`;
            } else {
              deco.height = 'calc(100vh - 50px)'
            }
          } else {
            deco.height = 'calc(100vh - 50px)'
          }
        }
      }
      return deco;
    },
    sortStyle() {
      let deco = {
        left: 0,
        top: 0,
        zIndex: 9999,
        width: this.$store.getters.deviceWidth + 'px'
      }
      if (this.$store.getters.browserType === 'pc') {
        deco.left = `calc(50% - (${this.$store.getters.deviceWidth} / 2)px)`;
      }
      return deco;
    }
  },
  watch: {
    sortState(n) {
        if(n) {
          setTimeout(()=>{
            this.vDim = n;
          },300);
        }
      },
    vDim(n) {
        if(!n) {
          setTimeout(()=>{
            this.sortState = n;
          },100);
        }
      }
  }
}
</script>
<style scoped>
.dim {
    background-color: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .sort-content {
    left: 0;
    bottom: 0;
    border-radius: 12px 12px 0px 0px;
    padding: 16px 16px 20px;
  }
  .outer-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
  .inner-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: 2px;
    left: 2px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translateY(100%);
  }
  .dropdown-list-pc {
    background: #FFFFFF;
    box-shadow: 0px 4px 11px rgba(0, 0, 0, 0.25);
    position: absolute;
    text-align: center;
    width: 110px;
    top: 32px;
    right: 0;
    z-index: 1000;
  }
  .dropdown-item-pc:hover {
    background-color: #f0f0f0;
  }
</style>

