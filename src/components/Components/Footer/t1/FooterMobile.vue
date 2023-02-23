<template>
<div style="padding: 20px 0" :style="[paddingBottomStyle, pagePadding, containerBg]">
  <block-header-logo v-bind="headerLogo" style="width:fit-content;margin-bottom:24px"></block-header-logo>
    <block-menuset v-bind="menusetList[0]"></block-menuset>
    <block-business-info v-bind="businessInfo"></block-business-info>
    <button-kakao-plus style="margin-top: 24px"></button-kakao-plus>
    <block-button-menu v-bind="buttonMenu" style="width:fit-content;margin:24px 0"></block-button-menu>
    <static-text></static-text>
  </div>
</template>
<script>
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import ButtonKakaoPlus from "@/components/Components/Common/ButtonKakaoPlus.vue"
import StaticText from "@/components/Components/Footer/FooterBlocks/StaticText.vue"
import BlockBusinessInfo from "@/components/Components/Footer/FooterBlocks/BlockBusinessInfo.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import HeaderFooterMixin from "@/components/Components/Mixins/HeaderFooterMixin"

export default {
  name: 'FooterMobile',
  components: {
    BlockMenuset,
    BlockHeaderLogo,
    ButtonKakaoPlus,
    StaticText,
    BlockBusinessInfo,
    BlockButtonMenu
  },
  mixins: [
    HeaderFooterMixin
  ],
  props: {

  },
  data() {
    return {
      "bgColor": "brandBgColor.sub2",
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
            "width": "20px",
            "height": "20px",
            "marginRight": "8px"
          }
        }
      ],
      "headerLogo": {
        "link": "home",
        "type": "footer_mobile",
        "visible": true,
        "imgStyle": {
          "maxWidth": "150px",
          "maxHeight": "30px",
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
            "sub": "brandColor.sub",
            "main": "brandColor.sub"
          },
          "maxLength": 10,
          "limitIndex": 10,
          "selectState": true,
          "visibleLimit": 10,
          "menuItemStyle": {
            "padding": "0 16px 12px 0",
            "fontSize": "13px",
            "fontWeight": 400
          },
          "containerStyle": {}
        }
      ],
      "businessInfo": {
        "list": [],
        "delim": "|",
        "styles": {
          "color": "brandColor.sub2",
          "fontSize": "12px",
          "marginTop": "12px",
          "lineHeight": "20px"
        },
        "visible": true
      },
      "paddingBottom": 20,
      "staticTextMobile": {
        "value": "Powered by launchpack",
        "styles": {
          "color": "#666666",
          "padding": 0,
          "textAlign": "left"
        }
      }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.toButton();
    })
  },
  
  methods: {
    toButton() {
      setTimeout(() => {
        if (document.getElementsByClassName('parBtnDiv')[0] === undefined) {
          this.toButton();
        } else {
          this.detectButton();
        }
        
      },50)
    },
    detectButton() {
      let ob = new this.ResizeObserver((e) => {
        this.paddingBottom = e[0].contentRect.height + 40;
      })
      ob.observe(document.getElementsByClassName('parBtnDiv')[0]);
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor)
      }
    },
    paddingBottomStyle() {
      let deco = {
        paddingBottom: `${this.paddingBottom}px`
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


