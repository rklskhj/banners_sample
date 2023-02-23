<template>
<div class="block-container" :style="containerStyle">
    <div ref="imgWrap" :style="pagePadding">
      <div v-if="visible.title || visible.content" class="title-wrapper">
        <div v-if="visible.title" class="title" :style="titleStyle">{{ title }}</div>
        <div v-if="visible.content" class="content" :style="contentStyle">{{ content }}</div>
      </div>
      <div :ref="`card${idx}`" class="card" v-for="(card,idx) in cards" :key="`card-${idx}`" @click="clickLink(card)">
        <div class="position-relative">
          <e-image :isBg="false" :isLazy="false" :img="card.img" :useThumb="true" :width="width" :imgRadius="8"
                   :imageRates="styles.item.imageRates"></e-image>
          <div class="item-content">
            <div v-if="card.visible.title" class="item-title" :style="cardTitleStyle">{{ card.title }}</div>
            <div v-if="card.visible.description" class="item-description" :style="cardDescStyle">{{ card.description }}</div>
          </div>
        </div>
      </div>
      <div v-if="visible.button" class="flex" :style="buttonWrapStyle">
        <button class="button" :style="buttonStyle" @click="clickLink(button)">{{ button.name }}</button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'BlockStaticList',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "cards": [
        {
          "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/45085706.png",
          "link": "",
          "title": "부가 수익을 만들 수 있어요",
          "visible": {
            "title": true,
            "description": true
          },
          "linkType": "link",
          "description": "간단하게 상품을 판매하고\n수익을 만들 수 있어요."
        },
        {
          "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/45090658.png",
          "link": "",
          "title": "안전하게 거래할 수 있어요",
          "visible": {
            "title": true,
            "description": true
          },
          "linkType": "link",
          "description": "안전한 플랫폼 서비스를 통해 쉽고\n안전하게 거래할 수 있습니다."
        },
        {
          "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/45275854.png",
          "link": "",
          "title": "다양한 사람들을 만날 수 있어요",
          "visible": {
            "title": true,
            "description": true
          },
          "linkType": "link",
          "description": "다양한 회원, 파트너를\n만날 수 있는 기회!"
        }
      ],
      "title": "파트너가 되면 좋은 이유!",
      "width": 0,
      "button": {
        "link": "home",
        "name": "버튼",
        "linkType": "link"
      },
      "styles": {
        "item": {
          "align": "center",
          "color": {
            "title": "brandColor.main",
            "description": "brandColor.sub"
          },
          "fontSize": {
            "title": 16,
            "description": 14
          },
          "imageRates": {
            "ratio": "1:1"
          }
        },
        "block": {
          "align": "center",
          "color": {
            "title": "brandColor.main",
            "button": {
              "text": "brandColor.primary",
              "border": "brandBorder.primary",
              "background": "brandBgColor.white"
            },
            "content": "brandColor.sub"
          },
          "fontSize": {
            "title": 22,
            "button": 16,
            "content": 14
          },
          "imageRates": {
            "ratio": "8:1"
          },
          "backgroundColor": "brandBgColor.main"
        }
      },
      "content": "파트너로 활동해 보세요.",
      "visible": {
        "title": true,
        "button": false,
        "content": true
      }
    }
  },
  mounted() {
      this.$nextTick(() => {
        this.setWidth();
      })
    },
  
  methods: {
    clickLink(item) {
      if(item.link !== '') {
       if (item.linkType === 'link' || item.linkType === 'page') {
          this.routerPush(item.link);
        } else if (item.linkType === 'overlay') {
          this.routerOverlay(item.link);
        } else if (item.linkType === 'modal') {
          this.routerModal(item.link);
        } else if (item.linkType === 'drawer_left') {
          this.routerDrawerLeft(item.link);
        } else if (item.linkType === 'drawer_right') {
          this.routerDrawerRight(item.link);
        } else if (item.linkType === 'emit') {
          this.$emit(item.link);
        } else if (item.linkType === 'outlink') {
          if (item.link.indexOf('http') === 0) {
            const a = document.createElement("a");
            a.href = item.link;
            a.setAttribute('target', '_blank');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
          } else {
            this.routerPush(item.link);
          }
        }
      }
    },
    setWidth() {
        this.width = this.$refs.imgWrap.clientWidth - (Number(this.pagePadding.paddingLeft.replace('px','')) * 2);
      }
  },
  computed: {
    containerStyle() {
        return {
          backgroundColor: this.parseColor(this.styles.block.backgroundColor)
        }
      },
    titleStyle() {
        return {
          fontSize: this.styles.block.fontSize.title + 'px',
          fontWeight: 700,
          textAlign: this.styles.block.align,
          color: this.parseColor(this.styles.block.color.title),
          whiteSpace: "pre-wrap"
        }
      },
    contentStyle() {
        return {
          color: this.parseColor(this.styles.block.color.content),
          fontSize: this.styles.block.fontSize.content + 'px',
          fontWeight: 400,
          textAlign: this.styles.block.align,
          whiteSpace: "pre-wrap"
        }
      },
    cardStyle() {
        return {
          justifyContent: {
            left: 'flex-start',
            center: 'center',
            right: 'flex-end'
          }[this.styles.block.align]
        }
      },
    cardTitleStyle() {
        return {
          fontSize: this.styles.item.fontSize.title + 'px',
          fontWeight: 700,
          textAlign: this.styles.item.align,
          color: this.parseColor(this.styles.item.color.title),
          whiteSpace: "pre-wrap"
        }
      },
    cardDescStyle() {
        return {
          color: this.parseColor(this.styles.item.color.description),
          fontSize: this.styles.item.fontSize.description + 'px',
          fontWeight: 400,
          textAlign: this.styles.item.align,
          whiteSpace: "pre-wrap"
        }
      },
    buttonWrapStyle() {
        let align = {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end'
        }[this.styles.block.align];
        return `justify-content: ${align}`;
      },
    buttonStyle() {
        return {
          fontSize: this.styles.block.fontSize.button + 'px',
          color: this.parseColor(this.styles.block.color.button.text),
          border: `1px solid ${this.parseColor(this.styles.block.color.button.border)}`,
          backgroundColor: this.parseColor(this.styles.block.color.button.background),
          whiteSpace: "pre-wrap"
        }
      }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.block-container {
    padding: 25px 0;
    word-break: break-all;
  }
  .title-wrapper {
    display: grid;
    grid-row-gap: 8px;
    margin-bottom: 40px;
  }
  .item-description {
    margin-top: 4px;
  }
  .button {
    margin-top: 40px;
    width: 100%;
    border-radius: 8px;
    min-height: 56px;
    cursor: pointer;
  }
  .card {
    padding-bottom: 24px;
  }
  .card:last-child {
    padding-bottom: 0;
  }
  .item-content {
    position: absolute;
    bottom: -1px;
    width: calc(100% - 64px);
    padding: 20px 24px;
    margin: 0 32px;
    background-color: #fff;
  }
</style>

