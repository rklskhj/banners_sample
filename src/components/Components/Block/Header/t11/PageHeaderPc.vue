<template>
<div class="page-header flex-center full-width"
  :style="containerBg">
  <div class="flex-between" :style="pcMaxWidth">
    <div class="flex-align">
      <block-header-logo v-bind="headerLogo"></block-header-logo>
      <block-menuset v-bind="menusetList[0]"></block-menuset>
    </div>
    
    <div class="flex-align">
      <template v-for="(menu, idx) in buttonMenu">
        <block-button-menu v-bind="menu" :key="'menu-'+idx"></block-button-menu>
      </template>
      <block-header-auth></block-header-auth>
    </div>
    
  </div>
</div>
</template>
<script>
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHeaderAuth from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuth.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockMenuset,
    BlockHeaderLogo,
    BlockButtonMenu,
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
      "bgColor": "brandBgColor.main",
      "showMenu": false,
      "buttonMenu": [
        {
          "list": [],
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
            "padding": "12px 12px",
            "fontSize": "16px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        }
      ],
      "searchValue": ""
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
      let res = await this.$axios.get(`public/ui/menuset/style/${item.key}?activated=true`, {
        cancelToken: null
      });
      let list = [];
      res.data[0].menu.forEach(async menu => {
        if(menu.is_category) {
          list = list.concat(this.getCategory());
        }
        else if(menu.is_board_category) {
          let board_categories = await this.getBoardCategory();
          list = list.concat(board_categories);
        }
        else {
          list.push(menu);
        }
        
        if(menu.children && menu.children.length>0) {
          let child_list = [];
          for(let child of menu.children) {
            if(child.is_category) {
              child_list = child_list.concat(this.getCategory());
            }
            else if(child.is_board_category) {
              let board_categories = await this.getBoardCategory();
              child_list = child_list.concat(board_categories);
            }
            else {
              child_list.push(child);
            }
          }
          menu.children = child_list;
        }
      });
      
      item.list = list.slice(0, item.maxLength);
    },
    getCategory() {
      return this.$store.getters.category.map(cat => {
        return {
          link: `product?gnb=${cat.id}`,
          linkType: 'link',
          name: cat.name,
          id: cat.id,
          icon: cat.img_before
        }
      });
    },
    async getBoardCategory() {
      let boardRes = await this.$axios.get('public/board/category');
      return boardRes.data.map(item=>{
        return {
          link: `board?category=${item.id}`,
          linkType: 'link',
          name: item.name,
          id: item.id,
          icon: item.img_before
        }
      })
    },
    currentCategory(id) {
      if (this.$route.path.indexOf('category')>-1) {
        let tab = "";
        if (this.$route.query.tab===undefined || this.$route.query.tab==="") tab = "";
        else tab = parseInt(this.$route.query.tab);
        
        return tab===id;
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
.page-header {
  height: 64px;
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
</style>

