<template>
<div class="page-header-relative full-width"
  :style="containerBg">
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth" style="padding-top: 20px">
      <div class="flex-align">
        <block-header-logo style="margin-right:24px" v-bind="headerLogo"></block-header-logo>
        <block-header-search v-bind="searchInput"></block-header-search>
      </div>
      
      <div class="flex-align">
        <template v-for="(menu, idx) in buttonMenu">
          <block-button-menu v-bind="menu"
            :key="'menu-'+idx"></block-button-menu>
        </template>
        <block-header-auth style="margin-left:24px"></block-header-auth>
      </div>
    </div>
  </div>
  
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth">
      <div class="flex-align">
        <block-hamburger v-bind="hamburger"></block-hamburger>
        <div class="divider" :style="`background-color:${brandBorder.sub.border.replace('1px solid ', '')}`"></div>
        <block-menuset v-bind="menusetList[0]"></block-menuset>
      </div>
      
      <button-partner-center></button-partner-center>
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
import BlockHeaderAuth from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuth.vue"
import ButtonPartnerCenter from "@/components/LaunchPack_Common/Header/Blocks/ButtonPartnerCenter.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockHeaderLogo,
    BlockHeaderSearch,
    BlockButtonMenu,
    BlockHamburger,
    BlockMenuset,
    BlockHeaderAuth,
    ButtonPartnerCenter
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
        "buttonHeight": 64,
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
          "index": 1,
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
            "margin": "0 20px",
            "fontSize": "16px",
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
  
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*z-index: 100;*/
}
.divider {
  width: 1px;
  height: 16px;
  margin: 0 16px 0 32px;
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

