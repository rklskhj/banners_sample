<template>
<div class="flex-justify" style="word-break: break-all;padding: 40px 0">
    <div :style="pcMaxWidth">
      <div class="flex-align" style="gap:52px">
          <div style="flex:1">
            <div v-if="visible.title" class="margin-bottom-16"
                 :style="menuTitle">{{ title }}</div>
            <div v-if="visible.content" :style="menuContent">{{ content }}</div>
            <div v-if="visible.button" class="flex" :style="buttonWrapStyle">
              <button class="button" :style="buttonStyle" @click="clickLink(button)">{{ button.name }}</button>
            </div>
          </div>
          <div v-if="visible.image" style="flex:1" ref="imgWrap">
          <template v-for="(img, idx) in images">
            <e-image :key="'img-'+idx" :isBg="false" :isLazy="false" :img="img.src"
                     :useThumb="true" :width="width" :imageRates="img.imageRates"
                     :style="computedRadius"></e-image>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'BlockImageTextPc',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "title": "",
      "width": 0,
      "button": {
        "link": "https://lpthemecallc2ca.platformfy.com/office/partner/login",
        "name": "파트너 로그인",
        "style": {
          "text": "brandColor.white",
          "border": "brandBorder.primary",
          "background": "brandColor.primary"
        },
        "linkType": "outlink"
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
          "align": "left",
          "color": {
            "title": "brandColor.main",
            "content": "brandColor.main"
          },
          "fontSize": {
            "title": 24,
            "content": 44
          },
          "backgroundColor": "brandBgColor.sub"
        },
        "button": {
          "align": "left",
          "width": "240px",
          "height": "56px",
          "fontSize": 16
        }
      },
      "content": "지금 지원하고\n수익을 창출해보세요",
      "visible": {
        "image": true,
        "title": true,
        "button": true,
        "content": true
      },
      "imgRadius": 8
    }
  },
  created() {

    },
  mounted() {
    this.setBg();
    this.$nextTick(() => {
      this.width = this.$refs.imgWrap.clientWidth;
    })
  },
  
  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.styles.block.backgroundColor);
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
    'styles.block.backgroundColor'() {
      this.setBg();
    }
  }
}
</script>
<style scoped>
.button {
    margin-top: 36px;
    border-radius: 8px;
    cursor: pointer;
    padding: 12px;
  }
</style>

