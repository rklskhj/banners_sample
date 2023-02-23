<template>
<div class="page-header-relative full-width"
  :style="containerBg">
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth">
      <block-menuset v-bind="menusetList[1]"
        ></block-menuset>
      <div class="flex-align">
        <block-header-auth-text style="margin-right:24px"></block-header-auth-text>
        <block-menuset v-bind="menusetList[2]"
          :key="'menu-'+menusetList[2].index"></block-menuset>
      </div>
    </div>
  </div>
  
  <div class="flex-center position-relative">
    <block-header-logo v-bind="headerLogo"></block-header-logo>
  </div>
  
  <div class="flex-justify position-relative">
    <div class="grid-box" :style="pcMaxWidth">
      <div class="col-8 flex-align">
        <block-hamburger  style="margin-right:32px" v-bind="hamburger"></block-hamburger>
        <block-menuset v-bind="menusetList[0]"></block-menuset>
      </div>
      <div class="col-4 flex-end">
        <block-header-search v-bind="searchInput" style="margin-right:32px"></block-header-search>
        <block-button-menu v-bind="buttonMenu[0]"></block-button-menu>
      </div>
    </div>
  </div>

</div>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockHamburger from "@/components/LaunchPack_Common/Header/Blocks/BlockHamburger.vue"
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderSearch from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderSearch.vue"
import BlockHeaderAuthText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuthText.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockHeaderLogo,
    BlockHamburger,
    BlockMenuset,
    BlockHeaderSearch,
    BlockHeaderAuthText,
    BlockButtonMenu
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
        "list": [],
        "color": "brandColor.main",
        "menuKey": "hamburger",
        "visible": true,
        "maxLength": 20,
        "buttonName": "카테고리",
        "activeColor": "brandColor.brand",
        "activeBgColor": "brandBgColor.sub2"
      },
      "buttonMenu": [
        {
          "list": [
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
          "height": "36px",
          "margin": "16px 0",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center"
        }
      },
      "limitIndex": 4,
      "menusetList": [
        {
          "id": 1,
          "key": "header",
          "list": [],
          "index": 0,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "limitIndex": 10,
          "selectState": true,
          "visibleLimit": 10,
          "menuItemStyle": {
            "padding": "20px",
            "fontSize": "16px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "id": 3,
          "key": "header_top_left",
          "list": [],
          "index": 1,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 4,
          "limitIndex": 4,
          "selectState": false,
          "visibleLimit": 4,
          "menuItemStyle": {
            "padding": "12px 12px",
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
          "list": [],
          "index": 2,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 4,
          "limitIndex": 4,
          "selectState": false,
          "visibleLimit": 4,
          "menuItemStyle": {
            "padding": "12px 12px",
            "fontSize": "12px",
            "fontWeight": "400"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "id": 5,
          "key": "header_2",
          "list": [],
          "index": 5,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 2,
          "limitIndex": 2,
          "selectState": false,
          "visibleLimit": 2,
          "menuItemStyle": {
            "padding": "12px 8px",
            "fontSize": "13px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        }
      ],
      "searchInput": {
        "visible": true,
        "iconStyle": {
          "top": "10px",
          "color": "#4f4f4f",
          "right": "12px",
          "fontSize": "20px"
        },
        "inputStyle": {
          "color": "brandColor.main",
          "width": "240px",
          "height": "40px",
          "padding": "4px 40px 4px 16px",
          "lineHeight": "40px",
          "borderRadius": "8px",
          "backgroundColor": "brandBgColor.main"
        },
        "borderColor": "brandBorder.main",
        "placeholder": "검색어를 입력하세요"
      },
      "searchValue": ""
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
  border-bottom: 1px solid #D8D8D8;
  bottom: 0;
}
.logo-center {
  left: 50%;
  transform: translateX(-50%);
}
</style>

