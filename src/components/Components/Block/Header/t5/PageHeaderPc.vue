<template>
<div class="page-header full-width"
  :style="containerBg">
  <div class="flex-justify position-relative">
    <div class="flex-between" :style="pcMaxWidth">
      <block-menuset v-bind="menusetList[0]"
        :key="'menu-'+menusetList[0].index"></block-menuset>
        
      <div class="flex-align">
        <block-header-auth-text style="margin-right:24px"></block-header-auth-text>
        <block-menuset v-bind="menusetList[1]"
          :key="'menu-'+menusetList[1].index"></block-menuset>
      </div>
    </div>
    
    <div class="position-absolute header-border full-width"></div>
  </div>
  
  <div class="flex-justify">
    <div class="flex-between" :style="pcMaxWidth">
      <div class="flex-align">
        <block-header-logo v-bind="headerLogo" style="margin-right:40px"></block-header-logo>
        <block-menuset v-bind="menusetList[2]"></block-menuset>
      </div>
  
      <block-button-menu v-bind="buttonMenu[0]"></block-button-menu>
    </div>
  </div>
</div>
</template>
<script>
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHeaderAuthText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuthText.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockMenuset,
    BlockHeaderLogo,
    BlockButtonMenu,
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
      "buttonMenu": [
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
              "icon": "person",
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
      "menusetList": [
        {
          "id": 3,
          "key": "header_top_left",
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
          "selectState": false,
          "visibleLimit": 6,
          "menuItemStyle": {
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
          "list": [],
          "index": 1,
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
        },
        {
          "id": 1,
          "key": "header",
          "list": [],
          "index": 2,
          "depth2": {
            "colorSet": {
              "sub": "brandColor.brand",
              "main": "brandColor.main",
              "backgroundColor": "brandBgColor.sub"
            },
            "maxLength": 10,
            "limitIndex": 10
          },
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "hoverDepth": true,
          "limitIndex": 10,
          "selectState": true,
          "visibleLimit": 10,
          "menuItemStyle": {
            "padding": "12px 20px",
            "fontSize": "16px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "16px"
          }
        }
      ]
    }
  },
  created() {
    this.$emit('headerChange',false);
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
    
  }
}
</script>
<style scoped>
.page-header {
  height: 106px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}


.header-border {
  border-bottom: 1px solid #F5F5F5;
  bottom: 0;
}
</style>

