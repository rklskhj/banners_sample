<template>
<page-header :style="containerBg">
    <template v-slot:left>
      <i class="material-icons back-btn"
        @click="clickBack" :style="brandColor.main">arrow_back</i>
      <block-button-menu v-bind="buttonMenu[1]"/>
    </template>
    <template v-slot:center>
      <block-header-text v-bind="headerText"
        :title="headerTitle"></block-header-text>
    </template>
    <template v-slot:right>
      <block-button-menu v-bind="buttonMenu[0]"/>
    </template>
  </page-header>
</template>
<script>
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHeaderText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderText.vue"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"

export default {
  name: 'PageHeaderMobile',
  components: {
    BlockButtonMenu,
    BlockHeaderText
  },
  mixins: [
    HeaderMixin
  ],
  props: {
    korName: {
      type: String,
    },

  },
  data() {
    return {
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
              "icon": "home",
              "link": "home",
              "visible": true,
              "img_type": "icon",
              "linkType": "link",
              "useOutline": true
            }
          ],
          "index": 0,
          "visible": true,
          "buttonStyle": {
            "color": "brandColor.main"
          }
        }
      ],
      "headerText": {
        "index": 0,
        "visible": true,
        "textColor": {},
        "textStyle": {
          "fontSize": "16px",
          "fontWeight": 500
        }
      }
    }
  },
  created() {
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
    
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this[this.bgColor.split('.')[0]][this.bgColor.split('.')[1]].backgroundColor,
        borderBottom: this.brandBorder.main.border
      }
    },
    headerTitle() {
      return this.korName ? this.korName : '';
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.back-btn {
    padding: 0 6px;
  }
</style>

