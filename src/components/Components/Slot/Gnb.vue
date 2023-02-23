<template>
  <div class="full-width" v-if="menu && menu.length>0">
    <!-- 스크롤 -->
    <div class="list-wrap full-width"
         v-dragscroll.x="true"
         @dragscrollmove.prevent.self="onDrag"
         :class="{'dragscroll':isIE}"
         ref="dragscroll"
         :style="grabStyle">
      <div class="grab-bing flex-align full-width" ref="grabbing">
        <div v-for="(item,idx) in menu"
             :key="'tab-'+item.id" class="unselect list-item"
             :style="itemStyle(item.id)"
             @click.stop.prevent="clickTab(item,idx)"
             :ref="'tabItem'+idx">
             {{ item.name }}
              <div v-if="item.id===selectedTab" class="indicator" :style="indicatorStyle"></div>     
        </div>
      </div>

    </div>

    <div class="list-wrap full-width"
         v-dragscroll.x="true"
         @dragscrollmove.prevent.self="onDrag"
         :class="{'dragscrollTwo':isIE}"
         ref="dragscrollTwo"
         :style="grabStyle"
         v-if="childStateOne">
      <div class="grab-bing flex-align full-width" ref="grabbing"
          >
          <div v-for="(item,idx) in childListOne"
              :key="'tab-'+item.id" class="unselect list-item position-relative"
              :style="childStyle(item.id)"
              @click.stop.prevent="clickTabOne(item,idx)"
              :ref="'childItem'+idx">
              {{ item.name }}
                <div v-if="item.id===selectedTab" class="indicator" :style="indicatorStyle"></div>     
          </div>
      </div>
    </div>

    <div class="list-wrap full-width"
         v-dragscroll.x="true"
         @dragscrollmove.prevent.self="onDrag"
         :class="{'dragscrollThree':isIE}"
         ref="dragscrollThree"
         :style="grabStyle"
         v-if="childStateTwo">
      <div class="grab-bing flex-align full-width" ref="grabbing"
        >
        <div v-for="(item,idx) in childListTwo"
             :key="'tab-'+item.id" class="unselect list-item"
             :style="childTwoStyle(item.id)"
             @click.stop.prevent="clickTabTwo(item,idx)"
             :ref="'childTwoItem'+idx">
             {{ item.name }}
              <div v-if="item.id===selectedTab" class="indicator" :style="indicatorStyle"></div>     
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {dragscroll} from 'vue-dragscroll'
  import MenuMixin from "@/components/Mixins/MenuMixin";

  export default {
    name: "Gnb",
    directives: {
      dragscroll
    },
    mixins: [
      MenuMixin
    ],
    props: {

      // 선택된 탭 id
      // qeury와 같이 number로 판단하고 싶을때 number로 치환시켜 보내주어야 한다
      initialTab: {
        type: [String, Number],
        required: false
      },
      selectedItemStyle: {
        type: Object,
        required: false
      },
      wrapStyle: {
        type: Object,
        required: false
      },
      customItemStyle: {
        type: Object,
        required: false
      },
      indicatorStyle: {
        type: Object,
        required: false
      },
      scrollable: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    created() {
      this.init();
    },
    data() {
      return {
        selectedTab: 0,
        selectedChildTab: undefined,
        selectedChildTabTwo: undefined,
        dragging: false,
        scrollArray: [],
        scrollArrayTwo: [],
        scrollArrayThree: [],
        selectedIndex: undefined,
        selectedTwoIndex: undefined,
        selectedThreeIndex: undefined,
        childListOne: [],
        childListTwo: [],
        menu: undefined
      }
    },

    computed: {
      childStateOne() {
        let menu = this.computedMenu[0];
        if(menu && menu.child && menu.child.length>0) {
          return true;
        }
        else {
          return false;
        }
      },
      childStateTwo() {
        let menu = this.computedChildMenu ? this.computedChildMenu[0] : [];
        if(menu && menu.child && menu.child.length>0) {
          return true;
        }
        else {
          return false;
        }
      },
      grabStyle() {
        if(this.wrapStyle) return this.wrapStyle;
        else {
          return {
            borderBottom: this.brandBorder.main.border,
          }
        }
      },
      computedChildMenu() {
        let result = [];
        if(this.childStateOne && this.childListOne.length>0) {
          this.childListOne.forEach(item => {
            if(item.id === this.selectedChildTab) {
              result.push(item);
            }
          })
          return result;
        }
      },
      computedMenu() {
        let result = [];
        this.menu.forEach(item => {
          if(item.id === this.selectedTab)
            result.push(item);
        });
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
        if(this.scrollable) {
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
      }
    },

    watch: {
      /* selectedTab(n) {
        if(!find(this.menu, 'id', n)) {
          this.clickTab(this.menu[0], 0);
          return;
        } else {
          this.$emit('select', n);
        }
        if(this.$route.path.indexOf('home')===-1) {
          let query = cloneItem(this.$route.query);
          query.tab = n;
          this.$route.meta.clickPush = true;
          this.$router.replace({
            path: this.$route.path,
            query: query
          });
        }
      }  */
      // '$route.query.gnb'(n) {
      //   setTimeout(() => {
      //     let one = find(this.menu, 'id', n);
      //     let two = find(this.childListOne, 'id', n);
      //     let three = find(this.childListTwo, 'id', n);
      //     if(one) {
      //       this.clickTab(one, one.index);
      //     }
          // if(two) {
          // }
          // if(three) {
          // }
      //   },300)
        
      // },
      selectedChildTabTwo(n) {
        if(this.childListTwo && this.childListTwo.length>0) {
          // if(!find(this.childListTwo, 'id', n)) {
          //   this.clickTab(this.childListTwo[0], 0);
          //   return;
          // } else {
          //   this.$emit('selectedGnb', n);
          // }
          if(this.$route.path.indexOf('home')===-1 && n) {
            let query = cloneItem(this.$route.query);
            query.gnb = n;
            // this.$route.meta.clickPush = true;
            this.$router.replace({
              path: this.$route.path,
              query: query
            });
          }
        }
      },

    },

    methods: {
      async init() {
        this.menu = await this.setMenus('gnb', 'mobile');

        if (this.initialTab!==undefined) {
          if (typeof(this.initialTab)==='number') {
            this.selectedTab = parseInt(this.initialTab);
          }
          else if (typeof(this.initialTab)==='string') {
            this.selectedTab = this.initialTab;
          }
        }

        if(this.$route.query.gnb && this.menu && this.menu.length>0) {
          for(let i=0;i<this.menu.length;i++) {
            if(this.menu[i].id === Number(this.$route.query.gnb)) {
  
                this.clickTab(this.menu[i], i, true);
                if(this.menu[i].child && this.menu[i].child.length>0) this.clickTabOne(this.menu[i].child[0], 0);
              
            }
            else {
              if(this.menu[i].child && this.menu[i].child.length>0) {
                for(let j=0;j<this.menu[i].child.length;j++) {
                  if(this.menu[i].child[j].id === Number(this.$route.query.gnb)) {
                    this.clickTab(this.menu[i], i, true);
                    this.clickTabOne(this.menu[i].child[j], j);
                  }
                  else {
                    if(this.menu[i].child[j].child && this.menu[i].child[j].child.length>0) {
                      for(let k=0;k<this.menu[i].child[j].child.length;k++) {
                        if(this.menu[i].child[j].child[k].id === Number(this.$route.query.gnb)) {
                          this.clickTab(this.menu[i], i, true);
                          this.clickTabOne(this.menu[i].child[j], j, true);
                          this.clickTabTwo(this.menu[i].child[j].child[k], k);
                        }
                      }
                    }
                  }
                }
              }
            }
            
          }
          // this.selectedTab = Number(this.$route.query.gnb);
          // this.selectedChildTab = Number(this.$route.query.gnb);
        }

        if(this.isIE) {
          setTimeout(() => {
            dragscroll.reset();
          },1000);
        }

        // 스크롤 
        this.$nextTick(() => {
          let totalWidth = 0;
          // 스크롤아이템 width 저장
          for (let i=0; i<this.menu.length; i++) {
            if (this.$refs[`tabItem${i}`]&&this.$refs[`tabItem${i}`][0]) {
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
        
      },

      itemStyle(id) {
        let obj = {
          padding: '13px 16px'
        };

        if (id===this.selectedTab) {
          if(this.selectedItemStyle) {
            return Object.assign(obj, this.selectedItemStyle);
          }
          else {
            obj.color = this.brandColor.brand.color;
            obj.borderBottom = `2px solid ${this.brandColor.brand.color}`;
          }
        } 

        if (this.customItemStyle) {
          return Object.assign(obj, this.customItemStyle);
        } else {
          return obj;
        }
      },

      childStyle(id) {
        let obj = {
          padding: '13px 16px'
        };

        if (id===this.selectedChildTab) {
          if(this.selectedItemStyle) {
            return Object.assign(obj, this.selectedItemStyle);
          }
          else {
            obj.color = this.brandColor.brand.color;
            obj.borderBottom = `2px solid ${this.brandColor.brand.color}`;
          }
        } 

        if (this.customItemStyle) {
          return Object.assign(obj, this.customItemStyle);
        } else {
          return obj;
        }
      },

      childTwoStyle(id) {
        let obj = {
          padding: '13px 16px'
        };

        if (id===this.selectedChildTabTwo) {
          if(this.selectedItemStyle) {
            return Object.assign(obj, this.selectedItemStyle);
          }
          else {
            obj.color = this.brandColor.brand.color;
            obj.borderBottom = `2px solid ${this.brandColor.brand.color}`;
          }
        } 

        if (this.customItemStyle) {
          return Object.assign(obj, this.customItemStyle);
        } else {
          return obj;
        }
      },

      clickTab(item, idx, boo) {
        this.scrollArrayTwo = [];
        this.childListOne = [];
        // 드래그앤드 시 클릭방지
        if (this.dragging) {
          this.dragging = false;
          return;
        }
        else {
          this.selectedChildTab = undefined;
          this.selectedChildTabTwo = undefined;
          if(item.child) this.childListOne = item.child;
          this.selectedTab = item.id;
          if(this.childListOne.length===0) {
            if(this.selectedTab || this.selectedTab===0) this.$emit('select', this.selectedTab, item);
          }
          this.dragging = false;

          if(!boo) {
            if(this.menu && this.menu.length>0) {
              // if(!find(this.menu, 'id', n)) {
              //   this.clickTab(this.menu[0], 0);
              //   return;
              // } else {
              //   this.$emit('selectedGnb', n);
              // }
              if(this.$route.path.indexOf('home')===-1) {
                let query = cloneItem(this.$route.query);
                if(this.selectedTab===0) query.gnb = '';
                else query.gnb = this.selectedTab;
                if(query.category1) delete query.category1;
                if(query.category2) delete query.category2;
                if(query.category3) delete query.category3;
                // this.$route.meta.clickPush = true;
                this.$router.replace({
                  path: this.$route.path,
                  query: query
                });

              }

              if(this.childListOne && this.childListOne.length>0) this.clickTabOne(this.childListOne[0], 0) 
            }
          }

          

          this.$nextTick(() => {
            if(this.childListOne.length>0) {
              let totalWidth = 0;
              // 스크롤아이템 width 저장
              for (let i=0; i<this.childListOne.length; i++) {
                if (this.$refs[`childItem${i}`]&&this.$refs[`childItem${i}`].length>0) {
                  let width = this.$refs[`childItem${i}`][0].offsetWidth;
                  this.scrollArrayTwo.push({
                    id : this.childListOne[i].id,
                    name : this.childListOne[i].name,
                    width: width,                        // 본인 너비
                    accumulatedWidth: totalWidth+width   // 본인 누적너비
                  });
                  totalWidth += width;                   // 총 너비
                }
                // 현재 선택된 탭 index 저장
                // if (this.childListOne[i].id === this.selectedTab) {
                //   this.selectedIndex = i;
                // }
              }
            }
          })
          
          

          // 스크롤 위치
          if (this.scrollable) {
            this.setScroll(idx, 'one');
          }
        }
      },
      clickTabOne(item, idx, boo) {
        this.scrollArrayThree = [];
        this.childListTwo = [];
        // 드래그앤드 시 클릭방지
        if (this.dragging) {
          this.dragging = false;
          return;
        }
        else {
          this.selectedChildTabTwo = item.id;
          if(item.child) this.childListTwo = item.child;
          this.selectedChildTab = item.id;
          if(this.childListTwo.length===0) {
            this.$emit('select', this.selectedChildTab, item);
          }
          this.dragging = false;

          if(!boo) {
            if(this.childListOne && this.childListOne.length>0) {
              // if(!find(this.childListOne, 'id', n)) {
              //   this.clickTab(this.childListOne[0], 0);
              //   return;
              // } else {
              //   this.$emit('selectedGnb', n);
              // }
              if(this.$route.path.indexOf('home')===-1) {
                let query = cloneItem(this.$route.query);
                query.gnb = this.selectedChildTab;
                // this.$route.meta.clickPush = true;
                this.$router.replace({
                  path: this.$route.path,
                  query: query
                });
              }
            }
          }

          if(this.childListTwo) this.clickTabTwo(this.childListTwo[0], 0);

          this.$nextTick(() => {
            if(this.childListTwo.length>0) {
              let totalWidth = 0;
              // 스크롤아이템 width 저장
              for (let i=0; i<this.childListTwo.length; i++) {
                if (this.$refs[`childTwoItem${i}`]&&this.$refs[`childTwoItem${i}`].length>0) {
                  let width = this.$refs[`childTwoItem${i}`][0].offsetWidth;
                  this.scrollArrayThree.push({
                    id : this.childListTwo[i].id,
                    name : this.childListTwo[i].name,
                    width: width,                        // 본인 너비
                    accumulatedWidth: totalWidth+width   // 본인 누적너비
                  });
                  totalWidth += width;                   // 총 너비
                }
                // 현재 선택된 탭 index 저장
                // if (this.childListTwo[i].id === this.selectedTab) {
                //   this.selectedIndex = i;
                // }
              }
            }
          })
          

          // 스크롤 위치
          if (this.scrollable) {
            this.setScroll(idx, 'two');
          }
        }
      },
      clickTabTwo(item, idx) {
        // 드래그앤드 시 클릭방지
        if (this.dragging) {
          this.dragging = false;
          return;
        }
        else {
          this.selectedChildTabTwo = item.id;
          this.$emit('select', this.selectedChildTabTwo, item);
          this.dragging = false;

          // 스크롤 위치
          if (this.scrollable) {
            this.setScroll(idx, 'three');
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
      setScroll(index, str) {
        let target = undefined;
        if(str==='one') {
          target = this.scrollArray[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscroll.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        else if(str==='two') {
          target = this.scrollArrayTwo[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscrollTwo.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        else if(str==='three') {
          target = this.scrollArrayThree[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscrollThree.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
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

  .grab-bing
    white-space nowrap
    position relative
    text-overflow ellipsis

  .list-item
    display inline-block

</style>
