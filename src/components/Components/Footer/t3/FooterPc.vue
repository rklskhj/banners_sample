<template>
<div class="flex-center p-border-top-main" :style="containerBg">
  <div style="padding: 24px 0" :style="pcMaxWidth">
    <block-header-logo v-bind="headerLogo" style="width: fit-content"></block-header-logo>
    <block-menuset v-bind="menusetList"
      style="margin-top: 20px; width: fit-content"></block-menuset>
    <div class="flex-align" style="margin-top: 24px">
      <block-button-menu v-bind="buttonMenu"></block-button-menu>
      <button-kakao-plus style="margin-left: 16px"></button-kakao-plus>
    </div>
    <block-business-info v-bind="businessInfo"></block-business-info>
    <static-text style="margin-top: 12px"></static-text>
  </div>
</div>
</template>
<script>
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import ButtonKakaoPlus from "@/components/Components/Common/ButtonKakaoPlus.vue"
import StaticText from "@/components/Components/Footer/FooterBlocks/StaticText.vue"
import BlockBusinessInfo from "@/components/Components/Footer/FooterBlocks/BlockBusinessInfo.vue"
import HeaderFooterMixin from "@/components/Components/Mixins/HeaderFooterMixin"

export default {
  name: 'FooterPc',
  components: {
    BlockMenuset,
    BlockButtonMenu,
    BlockHeaderLogo,
    ButtonKakaoPlus,
    StaticText,
    BlockBusinessInfo
  },
  mixins: [
    HeaderFooterMixin
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
              "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/59783072.svg",
              "outlink": "https://facebook.com",
              "visible": true,
              "img_type": "img",
              "linkType": "outlink"
            },
            {
              "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/05122805.svg",
              "outlink": "https://twitter.com",
              "visible": true,
              "img_type": "img",
              "linkType": "outlink"
            },
            {
              "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/09863887.svg",
              "outlink": "https://instagram.com",
              "visible": true,
              "img_type": "img",
              "linkType": "outlink"
            },
            {
              "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/13996070.svg",
              "outlink": "https://tumblr.com",
              "visible": true,
              "img_type": "img",
              "linkType": "outlink"
            }
          ],
          "index": 0,
          "visible": true,
          "buttonStyle": {
            "color": "brandColor.main",
            "width": "24px",
            "height": "24px",
            "marginRight": "16px"
          }
        }
      ],
      "headerLogo": {
        "link": "home",
        "type": "footer_pc",
        "visible": true,
        "imgStyle": {
          "maxWidth": "150px",
          "maxHeight": "24px",
          "minHeight": "20px"
        },
        "linkType": "link",
        "containStyle": {}
      },
      "menusetList": [
        {
          "id": 1,
          "key": "footer",
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
          "selectState": true,
          "visibleLimit": 10,
          "menuItemStyle": {
            "fontSize": "14px",
            "marginRight": "32px"
          },
          "containerStyle": {
            "fontSize": "14px"
          }
        }
      ],
      "businessInfo": {
        "list": [],
        "delim": "|",
        "styles": {
          "color": "brandColor.sub2",
          "fontSize": "12px",
          "marginTop": "24px",
          "lineHeight": "20px"
        },
        "visible": true
      }
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor)
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.footer-menu {
  margin-right:20px;
}
</style>

