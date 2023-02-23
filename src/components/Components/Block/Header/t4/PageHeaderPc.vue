<template>
<div class="page-header full-width"
  :style="containerBg">
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth">
      <block-menuset v-bind="menusetList[2]"></block-menuset>
      <div class="flex-align">
        <block-header-auth-text :vCart="true" style="margin-right:24px"></block-header-auth-text>
        <block-menuset v-bind="menusetList[3]"></block-menuset>
      </div>
    </div>
    
    <div class="position-absolute header-border full-width"></div>
  </div>
  
  <div class="flex-justify">
    <div class="flex-between" :style="pcMaxWidth">
      <div class="flex-align">
        <block-header-logo v-bind="headerLogo"></block-header-logo>
      </div>
      <block-menuset v-bind="menusetList[0]"></block-menuset>
      <block-menuset v-bind="menusetList[1]"></block-menuset>
    </div>
  </div>
</div>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderAuthText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuthText.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockHeaderLogo,
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
          "list": [],
          "index": 2,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 6,
          "limitIndex": 6,
          "selectState": false,
          "visibleLimit": 6,
          "menuItemStyle": {
            "padding": "20px",
            "fontSize": "16px"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "id": 3,
          "key": "header_top_left",
          "list": [],
          "index": 3,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "limitIndex": 6,
          "selectState": false,
          "visibleLimit": 6,
          "menuItemStyle": {
            "padding": "12px 8px",
            "fontSize": "12px",
            "fontWeight": "400"
          },
          "containerStyle": {
            "fontSize": "12px"
          }
        },
        {
          "id": 4,
          "key": "header_top_right1",
          "list": [],
          "index": 4,
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
            "fontSize": "12px"
          }
        }
      ],
      "searchValue": ""
    }
  },
  created() {
    this.$emit('headerChange',false);
    this.getMenusetInit();
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
        
        return tab === id;
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
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

input {
  height: 48px;
  width: 256px;
  border: none;
  padding: 12px 40px 12px 16px;
}
.header-border {
  border-bottom: 1px solid #F8F8F8;
  bottom: 0;
}
</style>

