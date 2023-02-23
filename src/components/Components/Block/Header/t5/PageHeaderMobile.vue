<template>
<page-header :full="true" :style="containerBg">
    <template v-slot:full>
      <div class="flex-align" style="padding: 10px 0">
        <block-header-logo v-bind="headerLogo"/>
        <div style="flex:1">
          <block-header-search v-bind="searchInput"></block-header-search>
        </div>
        <block-button-menu v-bind="buttonMenu[0]"></block-button-menu>
      </div>
    </template>
    <template v-slot:gnb>
      <block-header-gnb v-bind="gnb" ref="gnb"
                        @update:dragging="val => gnb.dragging = val"
                        @clickTab="val => clickTab1(val.item, val.idx)"></block-header-gnb>
    </template>
  </page-header>
</template>
<script>
import BlockHeaderSearch from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderSearch.vue"
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHeaderGnb from "@/components/Components/Block/Header/Blocks/BlockHeaderGnb.vue"

export default {
  name: 'PageHeaderMobile',
  components: {
    BlockHeaderSearch,
    BlockHeaderLogo,
    BlockButtonMenu,
    BlockHeaderGnb
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "gnb": {
        "id": 1,
        "key": "header",
        "menu": [],
        "type": "scroll",
        "index": 1,
        "visible": true,
        "colorSet": {
          "sub": "brandColor.brand",
          "main": "brandColor.main"
        },
        "dragging": false,
        "maxLength": 10,
        "limitIndex": 10,
        "selectState": true,
        "visibleLimit": 6,
        "selectedItem1": {
          "link": ""
        },
        "containerStyle": {
          "fontSize": "15px"
        }
      },
      "bgColor": "brandBgColor.main",
      "buttonMenu": [
        {
          "list": [
            {
              "icon": "shopping_cart",
              "link": "cart",
              "visible": true,
              "img_type": "icon",
              "linkType": "link"
            }
          ],
          "index": 0,
          "visible": true,
          "buttonStyle": {
            "color": "brandColor.main"
          }
        }
      ],
      "headerLogo": {
        "link": "home",
        "type": "header_mobile",
        "visible": true,
        "imgStyle": {
          "height": "24px"
        },
        "linkType": "link",
        "containStyle": {
          "display": "flex",
          "padding": "0 8px",
          "alignItems": "center",
          "lineHeight": 0,
          "justifyContent": "center"
        }
      },
      "searchInput": {
        "visible": true,
        "iconStyle": {
          "top": "6px",
          "left": "8px",
          "color": "brandColor.sub2",
          "fontSize": "18px"
        },
        "wrapStyle": {
          "width": "100%",
          "margin": "0 20px",
          "position": "relative",
          "lineHeight": 0
        },
        "inputStyle": {
          "flex": 1,
          "color": "brandColor.main",
          "width": "100%",
          "border": "brandBorder.main",
          "height": "30px",
          "padding": "8px 10px 8px 32px",
          "borderRadius": "6px",
          "backgroundColor": "brandBgColor.main"
        },
        "borderColor": "brandBorder.main",
        "placeholder": ""
      },
      "scrollArray1": []
    }
  },
  created() {
      this.getMenusetInit();
      
      this.buttonMenu.forEach(menu => {
      menu.list.forEach(i => {
        if(i.icon === 'shopping_cart') {
          i.visible = this.$store.getters.service
          .package.findIndex(item => ['mart', 'delivery'].indexOf(item)>-1) > -1;
        }
      });
    })
    },
  mounted() {

    },
  
  methods: {
    async getMenusetInit() {
        this.gnb.menu = [];
        let res = await this.$axios.get(`public/ui/menuset/style/${this.gnb.key}?activated=true`);
        let res_menu = res.data[0].menu;
        let list = [];
        res_menu.forEach(menu => {
          if(menu.is_category) {
            this.$store.getters.category.forEach(cat => {
              list.push({
                link: `product?gnb=${cat.id}`,
                linkType: 'link',
                name: cat.name,
                id: cat.id,
                icon: cat.img_before,
                index: cat.index,
                packages: cat.packages
              });
            });
          }
          else {
            list.push(menu);
          }
        });

        this.gnb.menu = list.slice(0, this.gnb.maxLength);

        if(this.gnb.type==='scroll') {
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
        this.gnb.menu.forEach(item => {
          if(item.link===query) {
            // 1depth 일때
            this.gnb.selectedItem1 = item;
            if(this.type==='scroll') {
              // 스크롤 이동
              this.setScroll(item.index,'one');
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
            for (let i=0; i<this.gnb.menu.length; i++) {
              if (this.$refs.gnb && this.$refs.gnb.$refs.dragscroll1&&this.$refs.gnb.$refs[`tabItem${i}`][0]) {
                // console.log('refs', this.$refs.oneDepth.$refs[`tabItem${i}`])
                let width = this.$refs.gnb.$refs[`tabItem${i}`][0].offsetWidth;
                this.scrollArray1.push({
                  id : this.gnb.menu[i].id,
                  name : this.gnb.menu[i].name,
                  width: width,                        // 본인 너비
                  accumulatedWidth: totalWidth+width   // 본인 누적너비
                });
                totalWidth += width;                   // 총 너비
              }
            }
          })
        },300)
      },
    clickTab1(item, idx) {
        if (this.gnb.dragging) {
          this.gnb.dragging = false;
          return;
        }
        else {
          this.gnb.selectedItem1 = item;
          if(this.type==='scroll') {
            // 가운데로 스크롤 이동
            this.setScroll(idx,'one');
          }

          this.linkPush(item.linkType, item.link);
        }
      },
    linkPush(linkType, link) {
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
    setScroll(index, str) {
        let target;
        if(str==='one') {
          target = this.scrollArray1[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.gnb.$refs.dragscroll1.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
      }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor),
        borderBottom: this.brandBorder.main.border
      }
    }
  },
  watch: {
    
  }
}
</script>


