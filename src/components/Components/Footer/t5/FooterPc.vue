<template>
<div class="p-border-top-main" :style="containerBg">
  <div class="flex-center p-bg-sub2" style="padding: 16px 0;width:100%">
    <div :style="pcMaxWidth">
      <div class="flex-between">
        <div>
          <div class="flex-align size-16 weight-500 p-main"
            style="gap: 0 12px">고객센터<span class="size-28 weight-700">{{ center.call }}</span></div>
          <div class="size-13 p-sub">운영시간 : {{ center.time }}</div>
        </div>
        <block-menuset v-bind="menusetList"></block-menuset>
      </div>
      <!--<block-footer-menuset v-bind="menusetList[0]"></block-footer-menuset>-->
    </div>
  </div>
  <div class="flex-center" style="padding: 24px 0; width: 100%">
    <div :style="pcMaxWidth" class="flex-center">
      <div>
        <block-header-logo v-bind="headerLogo"></block-header-logo>
        <block-business-info v-bind="businessInfo"></block-business-info>
        <button-kakao-plus style="margin: 12px auto;display:flex;justify-content:center"></button-kakao-plus>
        <block-button-menu v-bind="buttonMenu" style="margin-top:12px"></block-button-menu>
        <static-text style="text-align:center; margin-top: 12px"></static-text>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockFooterMenuset from "@/components/Components/Footer/FooterBlocks/BlockFooterMenuset.vue"
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
    BlockFooterMenuset,
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
            "width": "24px",
            "height": "24px",
            "margin": "0 8px"
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
            "marginLeft": "32px"
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
          "textAlign": "center",
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

