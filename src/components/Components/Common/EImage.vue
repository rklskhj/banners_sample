<template>
  <div v-if="isBg && isLazy" :key="uid" :style="paddingStyle">
    <div class="overflow-hidden" v-lazy:background-image="imgSrc" :style="bgStyle">
      <slot name="inner"></slot>
    </div>
  </div>
  <div v-else-if="isBg" :key="uid" :style="paddingStyle">
    <div class="overflow-hidden" :style="bgStyle">
      <slot name="inner"></slot>
    </div>
  </div>
  <div v-else-if="isLazy" :style="imgWrapperStyle">
    <img v-if="imgSrc !== ''" v-lazy="imgSrc" :style="imgStyle"
         :key="uid" :alt="alt" :data-object-fit="objectFit" />
  </div>
  <div v-else :style="imgWrapperStyle">
    <img v-if="imgSrc !== ''" :key="uid" :style="imgStyle" :src="imgSrc" :alt="alt"
         :data-object-fit="objectFit" />
  </div>
</template>

<script>
  import uuidv4 from 'uuid/v4'
  import objectFitImages from 'object-fit-images'

  export default {
    props: {
      isLazy: {
        type: Boolean,
        default: false,
      },
      isBg: {
        type: Boolean,
        default: false
      },
      bgOption: {
        type: String
      },
      useThumb: {
        type: Boolean
      },
      img: {
        type: String
      },
      imageRates: {
        type: Object
      },
      category: {
        type: Number
      },
      width: {
        type: [Number, String]
      },
      height: {
        type: [Number, String],
      },
      imgPaddingTb: {
        type: Number,
        default: 0
      },
      imgPaddingLr: {
        type: Number,
        default: 0
      },
      imgRadius: {
        type: [Number, String],
        default: 0
      },
      objectFit: {
        type: String,
        default: 'cover'
      },
      useRatio: {
        type: Boolean,
        default: true
      },
      useNaturalRatio: {
        type: Boolean,
        default: false
      },
      imgs: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        alt: '',
        ratio: '',
        imgSrc: '',
        uid: '',
        naturalRatio: {},
        imgStyle: {},
        imgWrapperStyle: {},
        paddingStyle: {},
        bgStyle: {}
      }
    },
    created() {
      this.uid = uuidv4();
    },
    mounted() {
      this.$nextTick(() => {

        if (this.useRatio) {
          this.setRatio();
        }
        if (this.useNaturalRatio) {
          this.getNaturalRatio(this.img);
        }
        this.imgSrc = this.setImage(this.img);
        // this.setAlt();
        if (this.isBg) {
          this.paddingStyle = this.getPaddingStyle();
          this.bgStyle = this.getBgStyle();
        } else {
          this.imgWrapperStyle = this.getStyle('wrap');
          this.imgStyle = this.getImgStyle();
        }
        objectFitImages()

      })
    },
    activated() {
      this.$nextTick(() => {
        if (this.useRatio) {
          this.setRatio();
        }
        if (this.useNaturalRatio) {
          this.getNaturalRatio(this.img);
        }
        this.imgSrc = this.setImage(this.img);
        if (this.isBg) {
          this.paddingStyle = this.getPaddingStyle();
          this.bgStyle = this.getBgStyle();
        } else {
          this.imgWrapperStyle = this.getStyle('wrap');
          this.imgStyle = this.getImgStyle();
        }
        // this.setAlt();
        objectFitImages()
      })
    },
    methods: {
      getNaturalRatio(img) {
        let width = '';
        let height = '';
        let imgWidths = []
        let _this = this;
        if (this.imgs.length === 0) {
          let image = new Image();
          image.src = this.setImage(img);
          image.onload = function() {
            width = this.naturalWidth;
            height = this.naturalHeight;
            let gcd = _this.getGcd(width, height);
            _this.naturalRatio = {w: `${width / gcd}`, h: `${height / gcd}`}
          }
        }

        if (this.imgs.length !== 0) {
          this.imgs.forEach(item => {
            let imgTag = new Image();
            imgTag.src = this.setImage(item);
            imgTag.onload = function() {
              imgWidths.push({width: this.naturalWidth, height: this.naturalHeight})
              if (imgWidths.length === _this.imgs.length) {
                let maxWidth = imgWidths[0].width;
                let maxHeight = imgWidths[0].height;
                for(let i = 1; i < imgWidths.length; i++) {
                  let w = imgWidths[i].width;
                  let h = imgWidths[i].height;
                  maxWidth = (w > maxWidth) ? w : maxWidth;
                  maxHeight = (h > maxHeight) ? h : maxHeight;
                }
                width = maxWidth;
                height = maxHeight;
                let gcd = _this.getGcd(width, height);
                _this.naturalRatio = {w: `${width / gcd}`, h: `${height / gcd}`}
              }
            }
          })
        }
      },
      getGcd(a, b) {
        let temp = '';
        let m = '';
        if (b > a) {
          temp = a;
          a = b;
          b = temp
        }
        while (b != 0) {
          m = a % b;
          a = b;
          b = m;
        }
        return a;
      },
      setImage(image) {
        let img = ''
        if (image === this.dummyImage.bg) {
          img = image;
        } else if (this.useThumb) {
          let imageSrc = image;
          let temp = imageSrc.split('.');
          let path = temp[0].split('//')[1];
          if (path !== undefined) {
            if (path === "launchpack-storage" || path.indexOf("launchpack-service-")>-1) {
              temp[temp.length - 2] = `${temp[temp.length - 2]}_thumb`;
              img = temp.join('.');
            } else {
              img = image;
            }
          }
        } else {
          img = image;
        }
        // .webp 확장자로 전환은 이미지 url 경로에 'launchpack-storage'가 포함된 경우에만 전환함 (2020-11-24 수정)
        let path = img.split('.')[0].split('//')[1];
        if (path !== undefined) {
          if (path === 'launchpack-storage' || path.indexOf("launchpack-service-")>-1) {
            // Mac OS 11 버전 이상(M1 칩셋 이전 mac에서는 userAgent의 Mac OS X 버전이 10_15_6 이상인 경우)의 safari 브라우저 및 IE를 제외한 나머지 브라우저에서 .webp 포맷으로 변환
            // iPhone은 iOS 14.4 이상인 경우 webp 확장자 지원
            let macOSVersion = '';
            let iOSVersion = '';
            if (navigator.userAgent.indexOf('Mac OS X ') > -1) {
              if (navigator.userAgent.indexOf('iPhone OS') > -1) {
                iOSVersion = navigator.userAgent.split('iPhone OS ')[1].substring(0, 3);
              } else {
                macOSVersion = navigator.userAgent.split('Mac OS X ')[1].substring(0, 7);
                if (macOSVersion.indexOf(')') > -1) {
                  macOSVersion = macOSVersion.slice(0, -1);
                }
              }
            }

            if(navigator.userAgent.indexOf('Trident')===-1 && (navigator.userAgent.indexOf('Mac OS X') === -1 || (navigator.userAgent.indexOf('Mac OS X') > -1 && (macOSVersion >= '10_15_6' || iOSVersion >= '14_4')))) {
              img = img.replace('.jpg', '.webp').replace('.jpeg', '.webp').replace('.png', '.webp').replace('.JPG', '.webp').replace('.JPEG', '.webp').replace('.PNG', '.webp');
            }
          }
        }
        return img;
      },
      setAlt() {
        this.$axios.get(`https://ig7m3u7il7.execute-api.ap-northeast-2.amazonaws.com/v1/save_img_text?path=${this.img}`, {headers: ''}).then(res=>{
          this.alt = res.data;
        });
      },
      setRatio() {
        this.ratio = this.imageRates.ratio;

        if (this.imageRates.exception && this.imageRates.exception.length !== 0) {
          this.imageRates.exception.forEach(item => {
            if (item.category === this.category) {
              this.ratio = item.ratio;
            }
          })
        }
      },
      getImgStyle() {
        let deco = this.getStyle();
        deco.objectFit = this.objectFit;
        deco.fontFamily = `object-fit: ${this.objectFit}`

        return deco;
      },
      getPaddingStyle() {
        let deco = {};
        if(this.imgPaddingTb !== 0 && this.imgPaddingLr !== 0) {
          deco.padding = `${this.imgPaddingTb}px ${this.imgPaddingLr}px`
        }
        return deco;
      },
      getStyle(type) {
        let deco = {
          width: '',
          height: '',
          minHeight: '',
        }
        
        if (type === 'wrap') {
          deco.overflow = 'hidden'
        } else {
          deco.borderRadius = typeof this.imgRadius == 'number' ? this.imgRadius + 'px' : this.imgRadius;
          if(deco.borderRadius !== '') {
            deco.overflow = 'hidden';
          }
        }

        if (this.width) {
          if (typeof this.width === "string") {
            deco.width = this.width;
          } else {
            deco.width = type === 'bg' ? `${this.width - this.imgPaddingLr*2}px` : `${this.width}px`;
          }
        } else {
          deco.width = type === 'bg' ? `${this.$store.getters.deviceWidth - this.imgPaddingLr*2}px` : `${this.$store.getters.deviceWidth}px`;
        }
        
        if (this.useRatio) {
          if(this.ratio === 'fullscreen') {
            deco.width = `${window.innerWidth}px`;
            deco.height = `${window.innerHeight}px`;
          } else {
            let ratio = this.ratio.split(':');
            deco.height = `calc(${deco.width} * ${ratio[1]}/${ratio[0]})`;
          }
        } else if (this.useNaturalRatio) {
          deco.height = `calc(${deco.width} * ${this.naturalRatio.h}/${this.naturalRatio.w})`;
        } else {
          if (this.height) {
            if (typeof this.height === "string") {
              deco.height = this.height;
            } else {
              deco.height = `${this.height}px`;
            }
          } else {
            deco.height = '100px';
          }
        }

        deco.minHeight = deco.height;
        return deco;

      },
      getBgStyle() {
        let deco = this.getStyle('bg');

        deco.backgroundImage = `url(${this.imgSrc})`;
        deco.backgroundSize = 'cover';
        deco.backgroundPosition = 'center';
        deco.backgroundRepeat = 'no-repeat';
        return deco;
      }
    },
    computed: {

    },
    watch: {
      img(n) {
        this.img = n;
        if (this.useNaturalRatio) {
          this.getNaturalRatio(n);
        }
        this.imgSrc = this.setImage(n);
        // this.setAlt();
        if (this.useRatio) {
          this.setRatio();
        }
        if (this.isBg) {
          this.paddingStyle = this.getPaddingStyle();
          this.bgStyle = this.getBgStyle();
        } else {
          this.imgWrapperStyle = this.getStyle('wrap');
          this.imgStyle = this.getImgStyle();
        }
      },
      useRatio() {
        if (this.isBg) {
          this.paddingStyle = this.getPaddingStyle();
          this.bgStyle = this.getBgStyle();
        } else {
          this.imgWrapperStyle = this.getStyle('wrap');
          this.imgStyle = this.getImgStyle();
        }
      },
      width() {
        if (this.isBg) {
          this.paddingStyle = this.getPaddingStyle();
          this.bgStyle = this.getBgStyle();
        } else {
          this.imgWrapperStyle = this.getStyle('wrap');
          this.imgStyle = this.getImgStyle();
        }
      },
      imageRates: {
        handler() {
          if (this.useRatio) {
            this.setRatio();
          }
          if (this.isBg) {
            this.bgStyle = this.getBgStyle();
          } else {
            this.imgWrapperStyle = this.getStyle('wrap');
            this.imgStyle = this.getImgStyle();
          }
        },
        deep: true
      }
    }
  }
</script>

<style>

</style>
