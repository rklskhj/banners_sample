<template>
<page-header :style="containerBg">
    <template v-slot:left>
      <block-button-menu v-bind="buttonMenu[0]"/>
      <block-header-logo v-bind="headerLogo" :containStyle="containStyle"/>
    </template>
    <template v-slot:right>
      <block-button-menu v-bind="buttonMenu[1]"/>
    </template>
    <template v-slot:gnb>
      <block-header-gnb v-bind="gnb" ref="gnb"
                        @update:dragging="val => gnb.dragging = val"
                        @clickTab="val => clickTab1(val.item, val.idx)"></block-header-gnb>
    </template>
  </page-header>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHeaderGnb from "@/components/Components/Block/Header/Blocks/BlockHeaderGnb.vue"

export default {
  name: 'PageHeaderMobile',
  components: {
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
        }
      },
      "bgColor": "brandBgColor.main",
      "buttonMenu": [
        {
          "list": [
            {
              "icon": "menu",
              "link": "category",
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
        },
        {
          "list": [
            {
              "icon": "search",
              "link": "search",
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
      "containStyle": {
        "height": "64px",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center"
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
          // scroll array1 ??????
          this.onReg1();
        }

        setTimeout(() => {
          this.$nextTick(() => {
            // ???????????? ?????? ???????????????
            this.getInitItem();
          });
        }, 300)

        // ?????? ?????????
        if(this.gnb.colorSet.main === '') {
          this.gnb.colorSet.main = this.brandColor.main;
          this.gnb.colorSet.sub = this.brandColor.brand;
        }
      },
    getInitItem() {
        // link??? ????????? ???????????????
        let query = location.pathname.slice(1) + location.search;
        this.gnb.menu.forEach(item => {
          if(item.link===query) {
            // 1depth ??????
            this.gnb.selectedItem1 = item;
            if(this.type==='scroll') {
              // ????????? ??????
              this.setScroll(item.index,'one');
            }
          }
        })
      },
    onReg1() {
        // ????????? array1 ??????
        setTimeout(() => {
          this.$nextTick(() => {
            let totalWidth = 0;
            // ?????????????????? width ??????
            for (let i=0; i<this.gnb.menu.length; i++) {
              if (this.$refs.gnb.$refs.dragscroll1&&this.$refs.gnb.$refs[`tabItem${i}`][0]) {
                // console.log('refs', this.$refs.oneDepth.$refs[`tabItem${i}`])
                let width = this.$refs.gnb.$refs[`tabItem${i}`][0].offsetWidth;
                this.scrollArray1.push({
                  id : this.gnb.menu[i].id,
                  name : this.gnb.menu[i].name,
                  width: width,                        // ?????? ??????
                  accumulatedWidth: totalWidth+width   // ?????? ????????????
                });
                totalWidth += width;                   // ??? ??????
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
            // ???????????? ????????? ??????
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


