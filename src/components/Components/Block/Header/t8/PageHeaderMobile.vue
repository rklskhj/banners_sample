<template>
<page-header :style="containerBg">
    <template v-slot:left>
      <i class="material-icons"
        @click="clickBack">keyboard_arrow_left</i>
    </template>
    <template v-slot:center>
      <block-header-text v-bind="headerText"></block-header-text>
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

  },
  data() {
    return {
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
            "color": ""
          }
        }
      ],
      "headerText": {
        "index": 0,
        "title": "상세",
        "visible": true,
        "textColor": "brandColor.main",
        "textStyle": {}
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
        backgroundColor: this.parseColor(this.bgColor),
        borderBottom: this.brandBorder.main.border
      }
    }
  },
  watch: {
    
  }
}
</script>


