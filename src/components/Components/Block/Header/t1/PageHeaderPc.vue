<template>
<div class="page-header-relative full-width"
  :style="containerBg">
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth">
      <block-menuset v-bind="menusetList[2]"></block-menuset>
      
      <div class="flex-align">
        <block-header-auth-text style="margin-right:24px"></block-header-auth-text>
        <block-menuset v-bind="menusetList[3]"
          :key="'menu-'+menusetList[3].index"></block-menuset>
      </div>
    </div>
    
    <div class="position-absolute header-border full-width"></div>
  </div>
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth" style="padding: 20px 0 4px">
      <div class="flex-align">
        <block-header-logo style="margin-right:24px" v-bind="headerLogo"></block-header-logo>
        <block-header-search v-bind="searchInput"></block-header-search>
      </div>
      
      <div class="flex-align">
        <template v-for="(menu, idx) in buttonMenu">
          <block-button-menu v-bind="menu"
            :key="'menu-'+idx"></block-button-menu>
        </template>
      </div>
      <!--<block-menuset v-bind="menusetList[4]"></block-menuset>-->
    </div>
  </div>
  
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth">
      <div class="flex-align">
        <block-hamburger style="margin-right:32px" v-bind="hamburger"></block-hamburger>
        <!--<block-header-auth></block-header-auth>-->
        <block-menuset v-bind="menusetList[0]"></block-menuset>
      </div>
      
      <block-menuset v-bind="menusetList[1]"></block-menuset>
    </div>
  </div>

</div>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockHeaderSearch from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderSearch.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHamburger from "@/components/LaunchPack_Common/Header/Blocks/BlockHamburger.vue"
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderAuthText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuthText.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockHeaderLogo,
    BlockHeaderSearch,
    BlockButtonMenu,
    BlockHamburger,
    BlockMenuset,
    BlockHeaderAuthText
  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "list": [],
      "bgColor": "brandBgColor.main",
      "showMenu": false,
      "hamburger": {
        "id": 5,
        "key": "hamburger",
        "list": [],
        "color": "brandColor.sub",
        "visible": true,
        "maxLength": 20,
        "buttonName": "카테고리",
        "activeColor": "brandColor.brand",
        "visibleLimit": 4,
        "activeBgColor": "brandBgColor.sub2"
      },
      "buttonMenu": [
        {
          "list": [
            {
              "icon": "favorite_border",
              "link": "like",
              "visible": true,
              "img_type": "icon",
              "linkType": "link"
            },
            {
              "icon": "shopping_cart",
              "link": "cart",
              "visible": false,
              "img_type": "icon",
              "linkType": "link",
              "useOutline": true
            },
            {
              "icon": "person_outline",
              "link": "mypage",
              "visible": true,
              "img_type": "icon",
              "linkType": "link"
            }
          ],
          "index": 0,
          "visible": true
        }
      ],
      "headerLogo": {
        "link": "home",
        "type": "header_pc",
        "visible": true,
        "imgStyle": {
          "height": "32px",
          "maxWidth": "400px"
        },
        "linkType": "link",
        "containStyle": {
          "height": "64px",
          "display": "flex",
          "padding": "0 8px",
          "alignItems": "center",
          "justifyContent": "center"
        }
      },
      "limitIndex": 4,
      "menusetList": [
        {
          "id": 1,
          "key": "header",
          "list": [
            {
              "id": 8,
              "icon": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecall/category/53619468.png",
              "link": "product?gnb=8",
              "name": "아시아",
              "linkType": "link"
            },
            {
              "id": 9,
              "icon": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecall/category/40638527.png",
              "link": "product?gnb=9",
              "name": "아라비안",
              "linkType": "link"
            },
            {
              "id": 10,
              "icon": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecall/category/31033450.png",
              "link": "product?gnb=10",
              "name": "라틴아메리카",
              "linkType": "link"
            },
            {
              "id": 11,
              "icon": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecall/category/04991249.png",
              "link": "product?gnb=11",
              "name": "유럽",
              "linkType": "link"
            }
          ],
          "index": 0,
          "moreBtn": true,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.sub",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "limitIndex": 10,
          "selectState": true,
          "visibleLimit": 10,
          "menuItemStyle": {
            "color": "rgba(79,79,79,1)",
            "padding": "20px",
            "fontSize": "16px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "id": 2,
          "key": "header_top_right2",
          "list": [
            {
              "img": "",
              "icon": "",
              "link": "notice",
              "name": "메뉴1",
              "expand": true,
              "outlink": "",
              "visible": true,
              "children": [],
              "disabled": false,
              "img_type": "icon",
              "linkType": "link"
            }
          ],
          "index": 1,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.sub",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "limitIndex": 10,
          "selectState": false,
          "visibleLimit": 6,
          "menuItemStyle": {
            "color": "rgba(79,79,79,1)",
            "padding": "12px 20px",
            "fontSize": "14px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "id": 3,
          "key": "header_top_left",
          "list": [
            {
              "img": "",
              "uid": "95397a94-3937-4861-a152-9c368cc1d245",
              "icon": "",
              "link": "company",
              "name": "회사소개",
              "expand": true,
              "outlink": "",
              "visible": true,
              "children": [],
              "disabled": false,
              "img_type": "icon",
              "linkType": "link"
            }
          ],
          "index": 2,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.sub",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "limitIndex": 10,
          "selectState": false,
          "visibleLimit": 6,
          "menuItemStyle": {
            "color": "rgba(79,79,79,1)",
            "padding": "12px 8px",
            "fontSize": "12px",
            "fontWeight": "400"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "id": 4,
          "key": "header_top_right1",
          "list": [
            {
              "img": "",
              "uid": "7b580570-1c47-400e-af42-8cb52a4efb89",
              "icon": "",
              "link": "faq",
              "name": "고객센터",
              "expand": true,
              "outlink": "",
              "visible": true,
              "children": [],
              "disabled": false,
              "img_type": "icon",
              "linkType": "link"
            }
          ],
          "index": 3,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.sub",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "limitIndex": 10,
          "selectState": false,
          "visibleLimit": 5,
          "menuItemStyle": {
            "color": "rgba(79,79,79,1)",
            "padding": "12px 8px",
            "fontSize": "12px",
            "fontWeight": "400"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        }
      ],
      "searchInput": {
        "visible": true,
        "iconStyle": {
          "top": "9px",
          "color": "#636363",
          "right": "12px"
        },
        "inputStyle": {
          "color": "brandColor.main",
          "width": "444px",
          "height": "42px",
          "padding": "8px 40px 8px 16px",
          "borderRadius": "8px",
          "backgroundColor": "brandBgColor.main"
        },
        "borderColor": "brandBorder.main",
        "placeholder": ""
      },
      "searchValue": "",
      "searchIconStyle": {}
    }
  },
  created() {
    this.$emit('headerChange',true);
    this.getMenusetInit();
    let pack = this.$store.getters.service.package;
    this.buttonMenu.forEach(menu => {
      menu.list.forEach(item => {
        if (item.icon === 'shopping_cart') {
        item.visible = pack.some(i => ['mart','delivery'].indexOf(i) > -1);
      }
      });
    })
  },
  mounted() {
    
  },
  updated() {

  },
  
  methods: {
    async getMenusetInit() {
      let index = 0;
      for(let item of this.menusetList) {
        item.index = index++;
        await this.getMenuset(item);
      }
    },
    async getMenuset(item) {
      if(this.isLogin) {
        item.key = item.key.replace('guest', 'member');
      } else {
        item.key = item.key.replace('member', 'guest');
      }
      let res = await this.$axios.get(`public/ui/menuset/style/${item.key}?activated=true`, {
        cancelToken: null
      });
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
              icon: cat.img_before
            });
          });
        }
        else {
          list.push(menu);
        }
      });
      
      item.list = list.slice(0, item.maxLength);
    },
    currentCategory(id) {
      if (this.$route.path.indexOf('category')>-1) {
        let tab = "";
        if (this.$route.query.tab===undefined || this.$route.query.tab==="") tab = "";
        else tab = parseInt(this.$route.query.tab);
        
        if (tab===id) return true;
        else return false;
      }
      else return false;
    },
    closeMenu() {
      this.showMenu = false;
    },
    search() {
      let tab = this.$route.query.tab ? this.$route.query.tab : '';
      if(this.searchValue) {
        this.routerPush(`product?tab=${tab}&search=${this.searchValue}`)
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
    categoryList() {
      return this.$store.getters.category;
    }
  },
  watch: {
    '$route.query'(n) {
      if (!n || !n.search) {
        this.searchValue = '';
      }
    }
  }
}
</script>
<style scoped>
.page-header-relative {
  height: 194px;
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*z-index: 100;*/
}

input {
  height: 48px;
  width: 256px;
  border: none;
  padding: 12px 40px 12px 16px;
}
.header-border {
  border-bottom: 1px solid #F5F5F5;
  bottom: 0;
}
</style>

