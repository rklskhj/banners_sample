<template>
<div class="flex-center p-border-top-main"
  :style="containerBg">
  <div class="flex"
    style="padding: 24px 0; align-items: flex-start; gap: 0 32px" :style="pcMaxWidth">
    <block-header-logo v-bind="headerLogo"></block-header-logo>
    <div class="flex-1">
      <div id="footer-menuset-wrapper" class="flex-between">
        <block-menuset v-bind="menusetList[0]"></block-menuset>
        <block-button-menu v-bind="buttonMenu"></block-button-menu>
      </div>
      <block-business-info v-bind="businessInfo"></block-business-info>
      <button-kakao-plus style="margin-top: 12px"></button-kakao-plus>
      <static-text style="margin-top: 12px"></static-text>
    </div>
      
  </div>
</div>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import ButtonKakaoPlus from "@/components/Components/Common/ButtonKakaoPlus.vue"
import StaticText from "@/components/Components/Footer/FooterBlocks/StaticText.vue"
import BlockBusinessInfo from "@/components/Components/Footer/FooterBlocks/BlockBusinessInfo.vue"
import HeaderFooterMixin from "@/components/Components/Mixins/HeaderFooterMixin"

export default {
  name: 'FooterPc',
  components: {
    BlockHeaderLogo,
    BlockMenuset,
    BlockButtonMenu,
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
            "marginLeft": "16px"
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
          "id": 4,
          "key": "footer",
          "list": [
            {
              "img": "",
              "icon": "",
              "link": "company",
              "name": "회사소개",
              "expand": true,
              "outlink": "",
              "visible": true,
              "children": [],
              "disabled": false,
              "img_type": "icon",
              "linkType": "link"
            },
            {
              "img": "",
              "icon": "",
              "link": "notice",
              "name": "공지사항",
              "expand": true,
              "outlink": "",
              "visible": true,
              "children": [],
              "disabled": false,
              "img_type": "icon",
              "linkType": "link"
            },
            {
              "img": "",
              "icon": "",
              "link": "TermsofserviceModal",
              "name": "이용약관",
              "expand": true,
              "outlink": "",
              "visible": true,
              "children": [],
              "disabled": false,
              "img_type": "icon",
              "linkType": "modal"
            },
            {
              "img": "",
              "icon": "",
              "link": "PrivacyModal",
              "name": "개인정보처리방침",
              "expand": true,
              "outlink": "",
              "visible": true,
              "children": [],
              "disabled": false,
              "img_type": "icon",
              "linkType": "modal"
            }
          ],
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
    img() {
      return this.$store.getters.brand.logo_footer_pc;
    },
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

<style>
#footer-menuset-wrapper .menuset-container .menu-item:first-child {
    margin-left: 0px !important;
  }
</style>
