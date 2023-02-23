<template>
<div class="block-container">
    <div :style="pcMaxWidth">
      <div v-if="visible.title || visible.content" class="title-wrapper">
        <div v-if="visible.title" class="title" :style="titleStyle">{{ title }}</div>
        <div v-if="visible.content" class="content" :style="contentStyle">{{ content }}</div>
      </div>
      <div class="flex" style="gap:24px;flex-wrap: wrap" :style="cardStyle">
        <div class="card" v-for="(card,idx) in cards" :key="`card-${idx}`" @click="clickLink(card)">
          <div style="padding:0 24px">
            <div :ref="`card${idx}`">
              <e-image v-if="card.visible.img" :isBg="false" :isLazy="false" :img="card.img" :useThumb="true" :width="width" imgRadius="100%"
                       :imageRates="styles.item.imageRates"></e-image>
            </div>
          </div>
          <div v-if="card.visible.title" class="item-title" :style="cardTitleStyle">{{ card.title }}</div>
          <div v-if="card.visible.description" class="item-description" :style="cardDescStyle">{{ card.description }}</div>
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
  name: 'BlockStaticListPc',
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
          "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/51124900.png",
          "link": "",
          "title": "01 파트너 등록",
          "visible": {
            "img": true,
            "title": true,
            "description": true
          },
          "linkType": "link",
          "description": "판매를 위해서 파트너를 등록해주세요"
        },
        {
          "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/51134763.png",
          "link": "",
          "title": "02 파트너 프로필 꾸미기",
          "visible": {
            "img": true,
            "title": true,
            "description": true
          },
          "linkType": "link",
          "description": "판매 정보를 추가해주세요"
        },
        {
          "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/51611058.png",
          "link": "",
          "title": "03 상품 등록하여 판매하기",
          "visible": {
            "img": true,
            "title": true,
            "description": true
          },
          "linkType": "link",
          "description": "다양한 구매자에게 판매를 시작해보세요"
        },
        {
          "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/51127466.png",
          "link": "",
          "title": "01 파트너 등록",
          "visible": {
            "img": true,
            "title": true,
            "description": true
          },
          "linkType": "link",
          "description": "판매를 위해서 파트너를 등록해주세요"
        }
      ],
      "title": "파트너 운영 방식",
      "width": 0,
      "button": {
        "link": "home",
        "name": "버튼",
        "linkType": "link"
      },
      "styles": {
        "item": {
          "cols": 4,
          "align": "center",
          "color": {
            "title": "brandColor.main",
            "description": "brandColor.sub"
          },
          "fontSize": {
            "title": 18,
            "description": 15
          },
          "imageRates": {
            "ratio": "1:1"
          }
        },
        "block": {
          "align": "left",
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
            "title": 28,
            "button": 16,
            "content": 18
          },
          "imageRates": {
            "ratio": "8:1"
          },
          "backgroundColor": "brandBgColor.main"
        }
      },
      "content": "어떻게 활동하나요?",
      "visible": {
        "title": true,
        "button": false,
        "content": true
      }
    }
  },
  mounted() {
    this.setBg();
      this.$nextTick(() => {
        this.setWidth();
      })
    },
  
  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.styles.block.backgroundColor);
    },
    setWidth() {
        const gap = 24;
        this.width = (Number(this.pcMaxWidth.width.replace('px','')) / this.styles.item.cols) - (((this.styles.item.cols-1) * gap) / this.styles.item.cols) - 48;
      },
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
    }
  },
  computed: {
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
    'styles.item.cols'() {
      this.setWidth();
    },
    'styles.block.backgroundColor'() {
      this.setBg();
    }
  }
}
</script>
<style scoped>
.block-container {
    padding: 80px 0;
    word-break: break-all;
  }
  .title-wrapper {
    display: grid;
    grid-row-gap: 8px;
    margin-bottom: 40px;
  }
  .grid {
    display: grid;
    grid-gap: 24px;
  }
  .item-title {
    margin-top: 24px;
  }
  .item-description {
    margin-top: 8px;
  }
  .button {
    margin-top: 40px;
    width: 400px;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    min-height: 56px;
  }
  .card {
    flex: 1;
    padding-bottom: 24px;
  }
</style>

