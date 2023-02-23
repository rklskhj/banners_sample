<template>
<div class="page-header full-width"
  :style="containerBg">
  <div class="flex-justify" :style="{borderBottom: brandBorder.sub.border}">
    <div class="flex-end" :style="pcMaxWidth">
      <block-menuset v-bind="menusetList[1]"></block-menuset>
    </div>
    
  </div>
  <div class="flex-justify">
    <div class="flex-between" :style="pcMaxWidth" style="padding: 8px 0">
      <div class="flex-align">
        <block-header-logo v-bind="headerLogo"></block-header-logo>
        <block-header-search v-bind="searchInput"></block-header-search>
      </div>
      
      <div class="position-relative">
        <i class="unselect material-icons-outlined" @click="clickCart" :style="brandColor.main">shopping_cart</i>
        <div v-if="cartLength !== 0" id="cartLength"
          class="flex-align flex-justify position-absolute size-10 weight-500"
          :style="[brandBgColor.primary, brandColor.white, notifyStyle]">{{ cartLength }}</div>
      </div>
      
    </div>
  </div>
  
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth">
      <div class="flex-align">
        <block-hamburger v-bind="hamburger"></block-hamburger>
        <!--<block-header-auth></block-header-auth>-->
        <block-menuset v-bind="menusetList[0]"></block-menuset>
      </div>
      
      <block-select-delivery-base-pc></block-select-delivery-base-pc>
      
    </div>
  </div>

</div>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockHeaderSearch from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderSearch.vue"
import BlockHamburger from "@/components/LaunchPack_Common/Header/Blocks/BlockHamburger.vue"
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockSelectDeliveryBasePc from "@/components/LaunchPack_Common/Block/BlockSelectDeliveryBasePc.vue"
import BlockHeaderAuth from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuth.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockHeaderLogo,
    BlockHeaderSearch,
    BlockHamburger,
    BlockMenuset,
    BlockSelectDeliveryBasePc,
    BlockHeaderAuth
  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "list": [],
      "notify": {
        "top": "-4px",
        "right": "-4px",
        "width": "16px",
        "height": "16px",
        "borderRadius": "50%"
      },
      "bgColor": "brandBgColor.main",
      "showMenu": false,
      "hamburger": {
        "id": 5,
        "list": [],
        "color": "brandColor.sub",
        "menuKey": "hamburger",
        "visible": true,
        "maxLength": 20,
        "buttonName": "카테고리",
        "activeColor": "brandColor.brand",
        "activeBgColor": "brandBgColor.sub2"
      },
      "cartLength": 1,
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
          "list": [],
          "index": 1,
          "moreBtn": true,
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
            "padding": "20px 16px",
            "fontSize": "16px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "id": 4,
          "key": "footer",
          "list": [],
          "index": 2,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "limitIndex": 10,
          "selectState": false,
          "visibleLimit": 6,
          "menuItemStyle": {
            "padding": "12px 12px",
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
          "color": "#4f4f4f",
          "right": "12px"
        },
        "inputStyle": {
          "color": "brandColor.main",
          "width": "364px",
          "height": "44px",
          "padding": "10px 18px",
          "borderRadius": "8px",
          "backgroundColor": "brandBgColor.main"
        },
        "borderColor": "brandBorder.main",
        "placeholder": "검색어를 입력하세요."
      },
      "searchValue": "",
      "searchIconStyle": {}
    }
  },
  created() {
    this.$emit('headerChange',false);
    this.getMenusetInit();
    this.setCartLength();
  },
  mounted() {
    
  },
  updated() {

  },
  
  methods: {
    clickCart() {
      if(this.$route.path.indexOf('ui/builder')===-1) {
        this.$router.push('/cart');
      }
    },
    setCartLength() {
      this.cartLength = this.$store.getters.cart ? this.$store.getters.cart.length : 0;
    },
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
    },
    notifyStyle() {
      return {
        "top": "-4px",
        "right": "-4px",
        "width": "16px",
        "height": "16px",
        "borderRadius": "50%"
      }
    }
  },
  watch: {
    '$route.query'(n) {
      if (!n || !n.search) {
        this.searchValue = '';
      }
    },
    '$store.getters.cart'(n) {
      this.cartLength = n.length;
    }
  }
}
</script>
<style scoped>
.page-header {
  height: 194px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>

