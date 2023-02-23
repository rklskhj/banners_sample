<template>
<div style="word-break:break-all;padding: 40px 0" :style="containerStyle">
    <div :style="pagePadding" ref="imgWrap">
      <div v-if="visible.title"
           class="margin-bottom-16"
           :style="menuTitle">{{ title }}
      </div>
      <div v-if="visible.content" :style="menuContent">{{ content }}</div>
      <div v-if="visible.button" class="flex" :style="buttonWrapStyle">
        <button class="button" :style="buttonStyle" @click="clickLink(button)">{{ button.name }}</button>
      </div>
      <template v-if="visible.image">
        <template v-for="(img, idx) in images">
          <e-image :key="'img-'+idx" :isBg="false" :isLazy="false" :img="img.src"
                   :useThumb="true" :width="width" :imageRates="img.imageRates"
                   :style="computedRadius"></e-image>
        </template>
      </template>
    </div>
  </div>
</template>
<script>

export default {
  name: 'BlockImageText',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "title": "지금 지원하고  수익을 창출하세요",
      "width": 0,
      "button": {
        "link": "home",
        "name": "파트너 로그인",
        "style": {
          "text": "brandColor.white",
          "align": "center",
          "border": "brandBorder.primary",
          "fontSize": 16,
          "background": "brandColor.primary"
        },
        "linkType": "link"
      },
      "images": [
        {
          "src": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/34208648.png",
          "link": "home",
          "linkType": "link",
          "imageRates": {
            "ratio": "1:1"
          }
        }
      ],
      "styles": {
        "block": {
          "align": "center",
          "color": {
            "title": "main",
            "content": "sub"
          },
          "fontSize": {
            "title": 22,
            "content": 16
          },
          "backgroundColor": "brandBgColor.sub"
        },
        "button": {
          "align": "center",
          "width": "240px",
          "fontSize": 16
        }
      },
      "content": "",
      "visible": {
        "image": true,
        "title": true,
        "button": true,
        "content": false
      },
      "imgRadius": 8
    }
  },
  created() {

    },
  mounted() {
      this.$nextTick(()=>{
        this.setWidth();
        addEventListener('resize', this.setWidth);
      })
    },
  beforeDestroy() {
      removeEventListener('resize', this.setWidth);
    },
  
  methods: {
    setWidth() {
        this.width = this.$refs.imgWrap.clientWidth - (Number(this.pagePadding.paddingLeft.replace('px','')) * 2)
      },
    clickLink(item) {
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
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.parseColor(this.styles.block.backgroundColor)
      }
    },
    menuTitle() {
        return {
          color: this.parseColor(this.styles.block.color.title),
          fontWeight: 'bold',
          fontSize: this.styles.block.fontSize.title + 'px',
          textAlign: this.styles.block.align
        }
      },
    menuContent() {
        return {
          color: this.parseColor(this.styles.block.color.content),
          fontSize: this.styles.block.fontSize.content + 'px',
          textAlign: this.styles.block.align,
          whiteSpace: 'pre-wrap'
        }
      },
    computedRadius() {
        return {
          borderRadius: this.imgRadius + 'px'
        }
      },
    buttonWrapStyle() {
        let align = {
          left: 'flex-start',
          center: 'center',
          right: 'flex-end'
        }[this.styles.button.align];
        return `justify-content: ${align}`;
      },
    buttonStyle() {
        return {
          fontSize: this.styles.button.fontSize + 'px',
          color: this.parseColor(this.button.style.text),
          border: `1px solid ${this.parseColor(this.button.style.border)}`,
          backgroundColor: this.parseColor(this.button.style.background),
          width: this.styles.button.width,
          minHeight: this.styles.button.height
        }
      }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.button {
    margin: 36px 0;
    border-radius: 8px;
    cursor: pointer;
    padding: 12px;
  }
</style>

