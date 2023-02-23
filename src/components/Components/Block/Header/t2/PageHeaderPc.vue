<template>
<div class="page-header flex-center full-width"
  :style="containerBg">
  <div class="flex-between" :style="pcMaxWidth">
    <block-header-logo v-bind="headerLogo"></block-header-logo>
    <div class="flex-center" style="flex:1">
      <block-menuset v-bind="menusetList[0]"></block-menuset>
    </div>
    <div class="flex-center">
      <template v-for="(menu, idx) in buttonMenu">
        <block-button-menu v-bind="menu" :key="'menu-'+idx"></block-button-menu>
      </template>
      <block-header-auth></block-header-auth>
    </div>
    
  </div>
</div>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderAuth from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuth.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockHeaderLogo,
    BlockButtonMenu,
    BlockMenuset,
    BlockHeaderAuth
  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "img": "https://launchpack-storage.s3.amazonaws.com/media/masters/non-path/33353125.png",
      "list": [],
      "orgImg": "https://launchpack-storage.s3.amazonaws.com/media/masters/non-path/33353125.png",
      "bgColor": "brandBgColor.main",
      "buttonMenu": [
        {
          "list": [
            {
              "icon": "shopping_cart",
              "link": "cart",
              "visible": true,
              "img_type": "icon",
              "linkType": "link",
              "useOutline": true
            },
            {
              "icon": "search",
              "link": "search",
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
            "color": "brandColor.main",
            "padding": "20px 16px",
            "fontSize": "16px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
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
    });
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
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.page-header {
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>

