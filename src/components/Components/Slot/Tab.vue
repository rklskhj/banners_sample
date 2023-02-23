<template>
  <div class="full-width" :style="tabContainerStyle">

    <!-- 스크롤 탭 -->
    <div v-if="menu1 && menu1.scrollable" class="list-wrap full-width"
         v-dragscroll.x="menu1.scrollable ? true : false"
         @dragscrollmove.prevent.self="onDrag"
         :class="{'dragscroll':isIE}"
         ref="dragscroll">
      <div class="grab-bing full-width" ref="grabbing"
        :style="tabWrapStyle">
        <div v-for="(item,idx) in menu"
             :key="'tab-'+idx" class="unselect list-item"
             :style="tabItemStyle(item, idx)"
             @click.stop.prevent="clickTab(item,idx)"
             :ref="'tabItem'+idx">{{ item.name }}</div>
      </div>
    </div>

    <!-- 서브 탭 -->
    <div v-else-if="subMenu" class="flex" :style="[tabWrapStyle,tabListStyle]">
      <div v-for="(item,idx) in subMenu" :key="'tab-'+idx" class="unselect flex-center"
           :style="subtabItemStyle(item, idx)" @click.stop.prevent="clickSubTab(item,idx)">
           <div>{{ item.name }}</div>
           <div v-if="item.count>=0" :style="countStyle(item,idx)">{{ item.count }}</div>
      </div>
      
    </div>

    <!-- 일반 탭 -->
    <div v-else class="flex" :style="[tabWrapStyle,tabListStyle]">
      <div v-for="(item,idx) in menu" :key="'tab-'+idx" class="unselect flex-center"
           :style="tabItemStyle(item, idx)" @click.stop.prevent="clickTab(item,idx)">
           <div>{{ item.name }}</div>
           <div v-if="item.count>=0" :style="countStyle(item,idx)">{{ item.count }}</div>
      </div>
    </div>

    <div :style="divider1Style"></div>
    <!-- 컨텐트 -->
    <div v-for="item in computedMenu" :key="'content-'+item.id">
      <slot :name="item.id"></slot>
    </div>
  </div>
</template>

<script>
  import {dragscroll} from 'vue-dragscroll'

  export default {
    name: "Tab",
    directives: {
      dragscroll
    },
    props: {
      menu: {
        type: Array,
        required: false
      },
      subMenu: {
        type: Array,
        required: false
      },
      menu1: {
        type: Object,
        default: function() {
          return {
            scrollable: false
          }
        }
      },
      indicator: {
        type: String,
        required: false
      },
      dividerStyle: {
        type: Object,
        required: false
      },
      selectedTabStyle: {
        type: Object,
        required: false
      },
      unselectedTabStyle: {
        type: Object,
        required: false
      },
      tabContainerStyle: {
        type: Object,
        required: false
      },
      // 선택된 탭 id
      initialTab: {
        type: [String, Number],
        required: false
      },
      tabPosition: {
        type: String,
        required: false
      },
      wrapRadius: {
        type: Boolean,
        required: false,
        default: undefined
      },
      tabColor: {
        type: String,
        required: false
      },
      tabRadius: {
        type: String,
        required: false
      },
      countStyles: {
        type: Object,
        required: false
      },
      selectedCountStyles: {
        type: Object,
        required: false
      },
      additionalTabWrap: {
        type: Object,
        required: false
      },
      tabMaxWidth: {
        type: String,
        required: false
      },
      tabMargin: {
        type: String,
        required: false
      }
    },
    created() {
      this.init();
    },
    data() {
      return {
        selectedTab: 0,
        selectedSubTab: 0,
        dragging: false,
        scrollArray: [],
        selectedIndex: undefined,
      }
    },

    computed: {
      tabWrapStyle() {
        let deco = {};
        if(this.tabPosition) {
          deco.display = 'flex'
          deco.justifyContent = `${this.tabPosition}`
          deco.alignItems = `${this.tabPosition}`
        }
        if(this.tabColor) {
          deco.backgroundColor = `${this.tabColor}`
        }
        if(this.tabRadius) {
          deco.borderRadius = `${this.tabRadius}`
        }

        if(this.tabMaxWidth) {
          deco.maxWidth = `${this.tabMaxWidth}`
        }

        if(this.tabMargin) {
          deco.margin = `${this.tabMargin}`
        }

        if (this.additionalTabWrap) {
          let addObj = this.cloneItem(this.additionalTabWrap);
          for(let prop in addObj) {
            deco[prop] = addObj[prop];
          }
        }
        return deco;
      },
      computedMenu() {
        let result = [];
        if(this.menu && this.menu.length>0) {
          this.menu.forEach(item => {
            if(item.id === this.selectedTab)
              result.push(item);
          });          
        }

        if(this.subMenu && this.subMenu.length>0) {
          this.subMenu.forEach(item => {
            if(item.id === this.selectedSubTab)
              result.push(item);
          });          
        }

        return result;
      },
      divider1Style() {
        let deco = {
          backgroundColor: this.getColor('기본 테두리선 색상'),
          width: '100%',
          height: '1px'
        };
        if (this.dividerStyle!==undefined) deco = this.dividerStyle;
        return deco;
      },
      tabListStyle() {
        let deco = {};
        if(this.menu1.scrollable) {
          deco = {
            overflowX: 'scroll',
            flexWrap: 'nowrap',
            display: '-webkit-box'
          }
        }
        return deco;
      },
      isIE() {
        if (navigator.userAgent.indexOf('Trident') > -1) return true;
        else return false;
      },
      /* grabStyle() {
        if(this.isIE){
          return {
            height: this.cardHeight + 'px'
          }
        } else {
          return {
            height: (this.cardHeight+17) + 'px'
          }
        }
      }, */
    },

    watch: {
      // '$route.query.tab'(n) {
      //   this.selectedTab = n;
      //   this.selectedSubTab = 0;
      // },
      '$route.query.sub'(n) {
        this.selectedSubTab = n;
      },
      selectedTab(n) {
        if(this.menu && this.menu.length>0) {
          if(!find(this.menu, 'id', n)) {
            this.clickTab(this.menu[0], 0);
            return;
          } else {
            this.$emit('selectedTab', n);
          }
          // if(this.$route.path.indexOf('home')===-1) {
          //   this.$store.commit('setLastTab', {
          //     path: this.$route.path,
          //     tab: n
          //   })
          // }
        }
        
      },
      selectedSubTab(n) {
        if(this.subMenu && this.subMenu.length>0) {
          if(!find(this.subMenu, 'id', n)) {
            this.clickSubTab(this.subMenu[0], 0);
            return;
          } else {
            this.$emit('selectedSubTab', n);
          }
          if(this.$route.path.indexOf('home')===-1) {
            let query = cloneItem(this.$route.query);
            query.sub = n;
            // this.$route.meta.clickPush = true;
            this.$router.replace({
              path: this.$route.path,
              query: query
            });
          }
        }
      }
    },

    methods: {
      init() {
        // if (this.$store.getters.lastTab.path === this.$route.path) {
        //   this.selectedTab = this.$store.getters.lastTab.tab;
        // } else {
          if (this.initialTab) {
            this.selectedTab = parseInt(this.initialTab);
          }
          if (this.$route.query.tab) {
            this.selectedTab = parseInt(this.$route.query.tab);
          }
          else {
            this.selectedTab = this.menu[0].id;
          }
        // }

        if (this.$route.query.sub) {
          this.selectedSubTab = parseInt(this.$route.query.sub);
        }
        else if(this.subMenu && this.subMenu.length>0) {
          this.selectedSubTab = this.subMenu[0].id;
        }

        if(this.isIE) {
          setTimeout(() => {
            dragscroll.reset();
          },1000);
        }

        // 스크롤 탭
        if (this.menu1 && this.menu1.scrollable) {
          this.$nextTick(() => {
            let totalWidth = 0;
            // 스크롤아이템 width 저장
            for (let i=0; i<this.menu.length; i++) {
              if (this.$refs[`tabItem${i}`]!==undefined) {
                let width = this.$refs[`tabItem${i}`][0].offsetWidth;
                this.scrollArray.push({
                  id : this.menu[i].id,
                  name : this.menu[i].name,
                  width: width,                        // 본인 너비
                  accumulatedWidth: totalWidth+width   // 본인 누적너비
                });
                totalWidth += width;                   // 총 너비
              }
              // 현재 선택된 탭 index 저장
              if (this.menu[i].id === this.selectedTab) {
                this.selectedIndex = i;
              }
            }
            // 스크롤 중앙 정렬
            this.setScroll(this.selectedIndex);
          })
        }
      },
      countStyle(item)  {
        let deco = {};
        if(this.countStyles) {
          deco = this.countStyles;
        }
        else {
          deco = {
            fontSize: '12px',
            color: `${this.getColor('Primary Color')}`,
          }
        }

        if (this.selectedTab === item.id) {
          if(this.selectedCountStyles) {
            deco = this.selectedCountStyles;
          }
        }

        deco.marginLeft = '6px'

        return deco;
      },
      tabItemStyle(item, idx) {
        let deco = {
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: '14px'
        }
        if(this.$store.getters.device === 'pc') {
          deco.padding = '20px';
          deco.fontSize = '15px';
        }

        if(!this.menu1.scrollable) {
          deco.width = `${ 100 / this.menu.length }%`;
        } else {
          deco.width = 'fit-content';
        }

        // 현재 선택된 탭
        if (this.selectedTab === item.id) {
          deco.color = this.getColor('브랜드 강조 색상');
          deco.borderBottom = '2px solid ' + this.getColor('브랜드 강조 색상');
          if (this.selectedTabStyle!==undefined) {
            if (this.wrapRadius) {
              if (idx % this.menu.length === 0) {
                this.selectedTabStyle.borderRadius = '8px 0 0 8px'
              }
              if (idx % this.menu.length === this.menu.length-1) {
                this.selectedTabStyle.borderRadius = '0 8px 8px 0'
              }
              deco = this.selectedTabStyle;
            }

            else {
              deco = this.selectedTabStyle;
            }
            
          }
          if (this.indicator) {
            deco.borderBottom = this.indicator;
          }
        }
        // 선택 안된 탭
        else {
          deco.color = this.getColor('기본 내용 색상');
          if (this.unselectedTabStyle!==undefined) {
            if (this.wrapRadius) {
              if (idx % this.menu.length === 0) {
                this.unselectedTabStyle.borderRadius = '8px 0 0 8px'
              }
              if (idx % this.menu.length === this.menu.length-1) {
                this.unselectedTabStyle.borderRadius = '0 8px 8px 0'
              }
              deco = this.unselectedTabStyle;
            }

            else {
              deco = this.unselectedTabStyle;
            }
          }
        }

        

        return deco;
      },
      subtabItemStyle(item,idx) {
        let deco = {
          padding: '12px 8px',
          textAlign: 'center',
          fontSize: '14px'
        }
        if(this.$store.getters.device === 'pc') {
          deco.padding = '20px';
          deco.fontSize = '15px';
        }

        // 현재 선택된 서브탭
        if (this.selectedSubTab === item.id) {
          deco.color = this.getColor('브랜드 강조 색상');
          deco.borderBottom = '2px solid ' + this.getColor('브랜드 강조 색상');
          if (this.indicator) {
            deco.borderBottom = this.indicator;
          }
          if (this.selectedTabStyle!==undefined) {
            if (this.wrapRadius) {
              if (idx % this.subMenu.length === 0) {
                this.selectedTabStyle.borderRadius = '8px 0 0 8px'
              }
              if (idx % this.subMenu.length === this.subMenu.length-1) {
                this.selectedTabStyle.borderRadius = '0 8px 8px 0'
              }
              deco = this.selectedTabStyle;
            }

            else {
              deco = this.selectedTabStyle;
            }
            
          }
          
        }
        // 선택 안된 서브탭
        else {
          deco.color = this.getColor('기본 내용 색상');
          if (this.unselectedTabStyle!==undefined) {
            if (this.wrapRadius) {
              if (idx % this.subMenu.length === 0) {
                this.unselectedTabStyle.borderRadius = '8px 0 0 8px'
              }
              if (idx % this.subMenu.length === this.subMenu.length-1) {
                this.unselectedTabStyle.borderRadius = '0 8px 8px 0'
              }
              deco = this.unselectedTabStyle;
            }

            else {
              deco = this.unselectedTabStyle;
            }
          }
        }

        return deco;
      },
      clickTab(item, idx) {
        // 드래그앤드 시 클릭방지
        if (this.dragging) {
          this.dragging = false;
          return;
        }
        else {
          if(item.disabled) return;
          this.selectedTab = item.id;
          // this.$emit('selectedTab', this.selectedTab);
          this.dragging = false;

          // 스크롤 위치
          if (this.menu1 && this.menu1.scrollable) {
            this.setScroll(idx);
          }
        }
      },
      clickSubTab(item, idx) {
        // 드래그앤드 시 클릭방지
        if (this.dragging) {
          this.dragging = false;
          return;
        }
        else {
          this.selectedSubTab = item.id;
          this.$emit('selectedSubTab', this.selectedSubTab);
          this.dragging = false;

          // 스크롤 위치
          if (this.menu1 && this.menu1.scrollable) {
            this.setScroll(idx);
          }
        }
      },
      onDrag(e) {
        // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
        if (Math.abs(e.detail.deltaX) > 1) {
          this.dragging = true;
        }
      },
      // 선택된 탭을 스크롤 중앙으로
      setScroll(index) {
        let target = this.scrollArray[index];
        if (target) {
          let result = (target.accumulatedWidth - (target.width/2));
          result -= (this.$store.getters.deviceWidth/2);
          this.$refs.dragscroll.scrollTo({
            behavior: 'smooth',
            left: result
          });
        }
      }
    },

  }
</script>

<style lang="stylus" type="stylus" scoped>

  .list-horizontal
    overflow hidden

  .list-wrap
    overflow hidden
    height auto

  .grab-bing
    white-space nowrap
    position relative
    height auto

  .list-item
    display inline-block

</style>
