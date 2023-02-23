<template>
<page-header :style="containerBg">
  <template v-slot:left>
    <i class="material-icons header-icon" :style="brandColor.main"
    @click="clickArrow">arrow_back</i>
  </template>
  <template v-slot:center>
    <div class="header-title flex-align unselect" :style="brandColor.main"
      @click="clickTitle">
      <div>{{ selectedCategory }}</div>
      <i class="material-icons" style="font-size:20px">arrow_drop_down</i>
    </div>
  </template>
  <template v-slot:right>
    <block-button-menu v-bind="buttonMenu[0]"/>
  </template>
  <template v-slot:gnb>
    <template v-if="visibleState1">
      <div class="list-wrap full-width block-gnb-temp"
           v-dragscroll.x="true"
           @dragscrollmove.prevent.self="onDrag"
           :class="{'dragscroll':isIE}"
           ref="dragscroll1">
        <div class="grab-bing flex-align full-width" ref="grabbing">
          <div v-for="(item,idx) in menu"
               :key="'tab-'+idx" class="unselect list-item gnb-text-color"
               :style="itemStyle(item, 1)"
               @click.stop.prevent="clickTab1(item,idx)"
               :ref="'tabItem'+idx">
               {{ item.name }}
                <!--<div v-if="item.id===selectedTab" class="indicator" :style="indicatorStyle"></div>     -->
          </div>
        </div>
      </div>
    </template>
    <!--2차 카테고리-->
    <template v-if="visibleState2">
      <div class="list-wrap full-width"
           v-dragscroll.x="true"
           @dragscrollmove.prevent.self="onDrag"
           :class="{'dragscroll':isIE}"
           ref="dragscroll2">
        <div class="grab-bing flex-align full-width" ref="grabbing">
          <div v-for="(child,idx) in selectedItem1.child"
             :key="'tab-child-'+idx" class="unselect list-item gnb-text-color"
             :style="itemStyle(child, 2)"
             @click.stop.prevent="clickTab2(child,idx)"
             :ref="'childItem'+idx">
             {{ child.name }}
          </div>
        </div>
      </div>
    </template>
    <!--3차 카테고리-->
    <template v-if="visibleState3">
      <div class="list-wrap full-width"
           v-dragscroll.x="true"
           @dragscrollmove.prevent.self="onDrag"
           :class="{'dragscroll':isIE}"
           ref="dragscroll3">
        <div class="grab-bing flex-align full-width" ref="grabbing">
          <div v-for="(grand,idx) in selectedItem2.child"
             :key="'tab-grand-'+idx" class="unselect list-item gnb-text-color"
             :style="itemStyle(grand, 3)"
             @click.stop.prevent="clickTab3(grand,idx)"
             :ref="'grandItem'+idx">
             {{ grand.name }}
          </div>
        </div>
      </div>
    </template>
  </template>
</page-header>
</template>
<script>
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"

export default {
  name: 'PageHeaderMobile',
  components: {
    BlockButtonMenu
  },
  mixins: [
    HeaderMixin
  ],
  props: {

  },
  data() {
    return {
      "menu": [],
      "type": "scroll",
      "bgColor": "brandBgColor.main",
      "colorSet": {
        "sub": "brandColor.brand",
        "main": "brandColor.main"
      },
      "dragging": false,
      "buttonMenu": [
        {
          "list": [
            {
              "icon": "search",
              "link": "search?tab_id=0",
              "visible": true,
              "img_type": "icon",
              "linkType": "link"
            },
            {
              "icon": "shopping_cart",
              "link": "cart",
              "visible": true,
              "img_type": "icon",
              "linkType": "link",
              "useOutline": true
            }
          ],
          "index": 1,
          "visible": true,
          "buttonStyle": {
            "color": "brandColor.main"
          }
        }
      ],
      "childList1": [],
      "childList2": [],
      "selectedTab": 0,
      "scrollArray1": [],
      "scrollArray2": [],
      "scrollArray3": [],
      "selectedItem1": undefined,
      "selectedItem2": undefined,
      "selectedItem3": undefined
    }
  },
  created() {
    this.init();
  },
  mounted() {
    
  },
  activated() {
    this.init();
  },
  
  methods: {
    init() {
      this.childList1 = []
      this.childList2 = []
      this.scrollArray1 = []
      this.scrollArray2 = []
      this.scrollArray3 = []
      this.selectedItem1 = undefined
      this.selectedItem2 = undefined
      this.selectedItem3 = undefined
      
      this.getMenuset();
      this.buttonMenu.forEach(menu => {
      menu.list.forEach(i => {
        if(i.icon === 'shopping_cart') {
          i.visible = this.$store.getters.service
          .package.findIndex(item => ['mart', 'delivery'].indexOf(item)>-1) > -1;
        }
      });
    })
    },
    getMenuset() {
      let list = [];
      
      this.$store.getters.category.forEach(cat => {
        let child = [];
        
        if(cat.child && cat.child.length>0) {
          cat.child.forEach(chi => {
            let grand = [];
            
            if(chi.child && chi.child.length>0) {
              chi.child.forEach(gra => {
                grand.push({
                  link: `product?gnb=${gra.id}`,
                  linkType: 'link',
                  name: gra.name === '전체' ? '전체보기' : gra.name,
                  id: gra.id,
                  icon: gra.img_before,
                  index: gra.index,
                  packages: gra.packages
                })
              });  
            }
            
            child.push({
              link: `product?gnb=${chi.id}`,
              linkType: 'link',
              name: chi.name === '전체' ? '전체보기' : chi.name,
              id: chi.id,
              icon: chi.img_before,
              child: grand,
              index: chi.index,
              packages: chi.packages
            });
          });
        }
        
        list.push({
          link: `product?gnb=${cat.id}`,
          linkType: 'link',
          name: cat.name,
          id: cat.id,
          icon: cat.img_before,
          child: child,
          index: cat.index,
          packages: cat.packages
        });
      });
      
      this.$store.commit('setCategory', list);
      this.menu = list;
      
      if(this.type==='scroll') {
        // scroll array1 구성
        this.onReg1(); 
      }
      
      setTimeout(() => {
        this.$nextTick(() => {
          // 라우트로 바로 진입했을때
          this.getInitItem();          
        });
      }, 300)
      
    },
    getInitItem() {
      // link와 정확히 일치하는지
      let query = location.pathname.slice(1) + location.search;
      this.menu.forEach(item => {
        if(item.link===query) {
          this.selectedItem2 = undefined;
          this.selectedItem3 = undefined;
          // 1depth 일때
          this.selectedItem1 = item;
          // 전체 있을때
          if(item.child.length>0) {
            if(item.child[0].id===item.id) {
              this.selectedItem2 = item.child[0];
            }
          }
          
          if(this.type==='scroll') {
            // 스크롤 이동
            this.setScroll(item.index,'one'); 
          }
        }
        else {
          if(item.child&&item.child.length>0) {
            item.child.forEach(child => {
              if(child.link===query) {
                this.selectedItem3 = undefined;
                // 2depth 일때
                this.selectedItem1 = item;
                this.selectedItem2 = child;
                // 전체 있을때
                if(child.child.length>0) {
                  if(child.child[0].id===child.id) {
                    this.selectedItem3 = child.child[0];
                  }
                }
                
                if(this.type==='scroll') {
                  this.onReg2();
                  this.setScroll(item.index,'one');
                  setTimeout(() => {
                    this.setScroll(child.index,'two');
                  },300) 
                }
              }
              else {
                if(child.child&&child.child.length>0) {
                  child.child.forEach(grand => {
                    if(grand.link===query) {
                      // 3depth 일때
                      this.selectedItem1 = item;
                      this.selectedItem2 = child;
                      this.selectedItem3 = grand;
                      
                      if(this.type==='scroll') {
                        this.onReg2();
                        this.onReg3();
                        this.setScroll(item.index,'one');
                        setTimeout(() => {
                          this.setScroll(child.index,'two');
                        },300);
                        setTimeout(() => {
                          this.setScroll(grand.index,'three');
                        },300); 
                      }
                    }
                  })
                } 
              }
            })
          }
        }
      })
    },
    onReg1() {
      // 스크롤 array1 등록
      setTimeout(() => {
        this.$nextTick(() => {
          let totalWidth = 0;
          // 스크롤아이템 width 저장
          for (let i=0; i<this.menu.length; i++) {
            if (this.$refs.dragscroll1&&this.$refs[`tabItem${i}`][0]) {
              // console.log('refs', this.$refs.oneDepth.$refs[`tabItem${i}`])
              let width = this.$refs[`tabItem${i}`][0].offsetWidth;
              this.scrollArray1.push({
                id : this.menu[i].id,
                name : this.menu[i].name,
                width: width,                        // 본인 너비
                accumulatedWidth: totalWidth+width   // 본인 누적너비
              });
              totalWidth += width;                   // 총 너비
            }
          }
        })
      },300)
    },
    onReg2() {
      // 스크롤 array2 등록
      setTimeout(() => {
        this.$nextTick(() => {
          let totalWidth = 0;
          // 스크롤아이템 width 저장
          for (let i=0; i<this.selectedItem1.child.length; i++) {
            if (this.$refs.dragscroll2&&this.$refs[`childItem${i}`][0]) {
              let width = this.$refs[`childItem${i}`][0].offsetWidth;
              this.scrollArray2.push({
                id : this.selectedItem1.child[i].id,
                name : this.selectedItem1.child[i].name,
                width: width,                        // 본인 너비
                accumulatedWidth: totalWidth+width   // 본인 누적너비
              });
              totalWidth += width;                   // 총 너비
            }
          }
        })
      },300)
    },
    onReg3() {
      // 스크롤 
      setTimeout(() => {
        this.$nextTick(() => {
          let totalWidth = 0;
          // 스크롤아이템 width 저장
          for (let i=0; i<this.selectedItem2.child.length; i++) {
            if (this.$refs.dragscroll2&&this.$refs[`childItem${i}`][0]) {
              let width = this.$refs[`childItem${i}`][0].offsetWidth;
              this.scrollArray3.push({
                id : this.selectedItem2.child[i].id,
                name : this.selectedItem2.child[i].name,
                width: width,                        // 본인 너비
                accumulatedWidth: totalWidth+width   // 본인 누적너비
              });
              totalWidth += width;                   // 총 너비
            }
          }
        })
      },300)
    },
    linkPush(link) {
      if(link.indexOf('?')>-1 && link.split('?')[0] === this.$route.path.replace('/','')) {
        this.$router.replace(link);
      }
      else {
        if(linkType === 'link' || linkType === 'page') {
          this.routerPush(link);
        } else if(linkType === 'overlay') {
          this.routerOverlay(link);
        } else if(linkType === 'modal') {
          this.routerModal(link);
        } else if(linkType === 'drawer_left') {
          this.routerDrawerLeft(link);
        } else if(linkType === 'drawer_right') {
          this.routerDrawerRight(link);
        } else if(linkType === 'emit') {
          this.$emit(link);
        } else if(linkType === 'outlink') {
          if(link.indexOf('http') === 0) {
            const a = document.createElement("a");
            a.href = link;
            a.setAttribute('target', '_blank');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a); 
          } else {
            this.routerPush(link);
          }
        }
      }
    },
    clickTab1(item, idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedItem2 = undefined;
        this.selectedItem3 = undefined;
        this.scrollArray2 = [];
        this.scrollArray3 = [];
        this.selectedItem1 = item;
        
        if(item.child.length>0) {
          // 전체 있을때
          if(item.child[0].id===item.id) {
            this.selectedItem2 = item.child[0]
          }
          
          if(this.type==='scroll') {
            // scrollArray2 등록
            this.onReg2(); 
          }
        }
        if(this.type==='scroll') {
          // 가운데로 스크롤 이동
          this.setScroll(idx,'one'); 
        }
        
        this.linkPush(item.link);
      }
    },
    clickTab2(item, idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedItem3 = undefined;
        this.scrollArray3 = [];
        this.selectedItem2 = item;
        
        if(item.child.length>0) {
          // 전체 있을때
          if(item.child[0].id===item.id) {
            this.selectedItem3 = item.child[0];
          }
          
          if(this.type==='scroll') {
            // scrollArray3 등록
            this.onReg3(); 
          }
        }
        if(this.type==='scroll') {
          // 가운데로 스크롤 이동
          this.setScroll(idx,'two'); 
        }
        
        this.linkPush(item.link); 
      }
    },
    clickTab3(item, idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedItem3 = item;
      
        if(this.type==='scroll') {
          // 가운데로 스크롤 이동
          this.setScroll(idx,'three'); 
        }
        
        this.linkPush(item.link); 
      }
    },
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    },
    setScroll(index, str) {
        let target;
        if(str==='one') {
          target = this.scrollArray1[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscroll1.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        else if(str==='two') {
          target = this.scrollArray2[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscroll2.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        else if(str==='three') {
          target = this.scrollArray3[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscroll3.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        
      },
    itemStyle(item, index) {
      let selectedItem = this[`selectedItem${index}`];
      let obj = {
        padding: '13px 16px'
      };
      
      if(selectedItem && item.id===selectedItem.id) {
        obj.color = this.parseColor(this.colorSet.sub);
        obj.borderBottom = `2px solid ${this.parseColor(this.colorSet.sub)}`;
      }
      else {
        obj.color = this.parseColor(this.colorSet.main);
        obj.borderBottom = `2px solid transparent`;
      }
      return obj;
    },
    clickTitle() {
      this.$root.$emit('page_overlay', 'CategoryOverlay', {prop: {"selectedItem1": this.selectedItem1, "selectedItem2": this.selectedItem2, "selectedItem3": this.selectedItem3, "toggle": true}});
    },
    clickArrow() {
      if(this.selectedItem3) {
        this.selectedItem3 = undefined;
        this.scrollArray3 = [];
        this.linkPush(this.selectedItem1.link);
      }
      else {
        this.clickBack();
      }
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor),
        borderBottom: this.brandBorder.main.border
      }
    },
    indicatorStyle() {
      return {
        width: '100px',
        height: '2px',
        backgroundColor: 'red'
      }
    },
    visibleState1() {
      return (!this.selectedItem1&&!this.selectedItem2&&!this.selectedItem3)
    },
    visibleState2() {
      return (this.selectedItem1&&this.selectedItem1.child.length>0&&!this.selectedItem2&&!this.selectedItem3) || (this.selectedItem2&&this.selectedItem2.child.length===0&&!this.selectedItem3)
    },
    visibleState3() {
      return (this.selectedItem2&&this.selectedItem2.child.length>0)
    },
    selectedCategory() {
      if(this.selectedItem3) {
        return this.selectedItem2.name
      }
      else {
        if(this.selectedItem2) {
          if(this.selectedItem2.child.length>0) {
            return this.selectedItem2.name
          }
          else {
            return this.selectedItem1.name
          }
        }
        else {
          if(this.selectedItem1) {
            return this.selectedItem1.name
          }
          else {
            return '전체상품'
          }  
        }
      }
    }
  },
  watch: {
    '$route.query.gnb'(n) {
      this.childList1 = []
      this.childList2 = []
      this.scrollArray1 = []
      this.scrollArray2 = []
      this.scrollArray3 = []

      if(this.type==='scroll') {
        // scroll array1 구성
        this.onReg1(); 
      }
      
      setTimeout(() => {
        this.$nextTick(() => {
          this.getInitItem();          
        });
      }, 200)
    }
  }
}
</script>
<style scoped>
.header-title {
  font-weight: normal;
}
.list-wrap {
  overflow: hidden;
}
.grab-bing {
  white-space: nowrap;
  position: relative;
}
.list-item {
  display: inline-block;
}
</style>

