<template>
<div class="position-relative">
    <div class="flex-align size-14 weight-400 unselect p-sub">
      <img src="/static/image/icon/ic_compare_arrows.svg" style="width:16px;height:14px">
      <div style="margin-left:4px" @click="clickSort">{{ selectedSort.label }}</div>
    </div>
    <div class="dropdown-list-pc p-bg-white" v-if="isPc && sortState">
      <div v-for="(item,idx) in sortOptions" :key="'sort-'+idx"
           class="unselect dropdown-item-pc" style="padding:8px 20px" @click="clickSortitem(item)">
        <div class="size-13 weight-400">{{ item.label }}</div>
      </div>
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
            <div class="size-16 weight-500 margin-bottom-8">정렬</div>
            <div v-for="(item,idx) in sortOptions" :key="'sort-'+idx"
                 class="flex-align" :style="sortItem(idx)"
                 @click="clickSortitem(item)">
              <div class="position-relative outer-circle radius-half" style="margin-right:18px"
                :class="{
                  'p-border-primary': item.value === selectedSort.value,
                  'p-border-sub': item.value !== selectedSort.value
                }">
                <div class="position-absolute inner-circle radius-half p-bg-primary"
                  v-if="item.value===selectedSort.value"></div>
              </div>
              <div class="size-13 weight-400">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </transition>
    </portal>
  </div>
</template>
<script>

export default {
  name: 'DropdownSort',
  components: {

  },
  mixins: [

  ],
  props: {
    isPc: {
      type: Boolean,
      default: false,
    },
    model: {
      type: String,
      default: "product",
    },

  },
  data() {
    return {
      "vDim": false,
      "height": 0,
      "filterId": 1,
      "sortState": false,
      "sortOptions": [],
      "selectedSort": {
        "label": "최신 순",
        "value": "-created_time"
      }
    }
  },
  created() {
    this.height = window.innerHeight;
    this.init();
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
    init() {
        this.$axios.get(`public/service/set/filter/${this.filterId}`).then(res =>{
          let key = 'sort';
          if(this.model !== 'product') {
            key += '_' + this.model;
          }
          let sorts = res.data[key].filter(item => { return item.is_active });
          this.sortOptions = res.data[key].filter(item => { return item.is_active });
          if (this.model !== 'product') {
            this.sortOptions = this.sortOptions.filter(item => item.value.indexOf('price') === -1);
            
            this.sortOptions.forEach(option => {
              if (option.value === 'rate_avg') {
                option.value = '-rate'
              }
            })
          } else if (this.model === 'product') {
            this.sortOptions.forEach(option => {
              if (option.value === '-price__price') {
                option.value = '-price__mixed_price'
              } else if (option.value === 'price__price') {
                option.value = 'price__mixed_price'
              }
            })
          }
          if(this.sortOptions.length>0) {
            if (this.model === 'partner' && this.sortOptions.findIndex(i => i.value === 'distance') > -1) {
              this.selectedSort.value = this.sortOptions[this.sortOptions.findIndex(i => i.value === 'distance')].value;
              this.selectedSort.label = this.sortOptions[this.sortOptions.findIndex(i => i.value === 'distance')].label;
            } else {
              this.selectedSort.value = this.sortOptions[0].value;
              this.selectedSort.label = this.sortOptions[0].label;
            }
          }
        });
      },
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
    clickSortitem(item) {
        this.selectedSort.value = item.value;
        this.selectedSort.label = item.label;
        this.$emit('onSort', this.selectedSort.value);
        this.clickBack();
      },
    sortItem(idx) {
        let deco = {
          padding: '18px 0'
        };

        if(idx<this.sortOptions.length-1) {
          deco.borderBottom = this.brandBorder.sub.border;
        }
        return deco;
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
    padding: 16px 24px 20px;
  }
  .outer-circle {
    width: 16px;
    height: 16px;
  }
  .inner-circle {
    width: 10px;
    height: 10px;
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

