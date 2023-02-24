<template>
  <div
    :class="slidesToShow === 3 && $store.getters.device === 'pc' && opacity === true ? 'block-container' : 'image-slider-container'"
    @mouseover="arrowHoverhandler(true)"
    @mouseleave="arrowHoverhandler(false)"
  >
    <div
      class="flex position-relative"
      style="height: 100%; margin-bottom: -5px"
    >
      <!-- 왼쪽 화살표 -->
      <i
        v-if="arrow && listData.length > 1 && reRender"
        class="slider-arrow material-icons unselect"
        :style="arrowLeftComputedStyle"
        @click="$refs.slick.prev()"
        >keyboard_arrow_left</i
      >

      <!-- 슬라이드 리스트 -->
      <div style="flex: 1" ref="cardlist" :style="containerStyle">
        <transition name="fade">
          <slick
            ref="slick"
            v-if="reRender"
            @beforeChange="handleBeforeChange"
            @afterChange="handleAfterChange"
            :options="slickOptions"
          >
            <!-- 카드뷰 -->
            <div
              class="position-relative"
              :class="slidesToShow === 3 && $store.getters.device === 'pc'  && opacity === true? 'card-wrapper' : ''"
              v-for="(item, idx) in listData"
              :key="'img-slider-' + idx"
            >
              <div :class="$store.getters.device === 'pc' ? 'dim' : 'm-dim'" v-if="dim"></div>
              <div
                v-if="item.link && item.link !== ''"
                :class="{ unselect: item.link && item.link !== '' }"
                @click="getHref(item.link)"
              >
                <e-image
                  :useRatio="useRatio"
                  :img="item.url ? item.url : item"
                  :width="width"
                  :height="height"
                  :imgs="imgs"
                  :imgPaddingTb="imgPaddingTb"
                  :imgPaddingLr="imgPaddingLr"
                  :imgRadius="imgRadius"
                  :imageRates="imageRates"
                  :useNaturalRatio="useNaturalRatio"
                  :isBg="true"
                  :isLazy="false"
                  :style="eImageStyle"
                  class="position-relative"
                  :class="slidesToShow === 3 && $store.getters.device === 'pc' && opacity === true ? 'card' : ''"
                >
                  <template slot="inner">
                    <slot name="inner"></slot>
                  </template>
                </e-image>
              </div>

              <div v-else>
                <e-image
                  :useRatio="useRatio"
                  :img="item.url ? item.url : item"
                  :width="width"
                  :height="height"
                  :imgPaddingTb="imgPaddingTb"
                  :imgPaddingLr="imgPaddingLr"
                  :imgRadius="imgRadius"
                  :imageRates="imageRates"
                  :useNaturalRatio="useNaturalRatio"
                  :isBg="true"
                  :isLazy="false"
                  :style="eImageStyle"
                  class="position-relative"
                  :class="slidesToShow === 3 && $store.getters.device === 'pc' && opacity === true ? 'card' : ''"
                >
                  <template slot="inner">
                    <slot name="inner"></slot>
                  </template>
                </e-image>
              </div>
            </div>
          </slick>
        </transition>

        <!-- Indicator -->
        <template v-if="indicator">
          <!-- dot -->
          <template v-if="indicatorType === 'dot'">
            <div
              class="indicator-container"
              v-if="listData.length > 1 && reRender"
            >
              <div class="indicator-wrapper">
                <div
                  v-for="i in Array.from(
                    { length: listData.length },
                    (v, k) => k
                  )"
                  :key="'ic' + i"
                  @click="$refs.slick.goTo(i)"
                >
                  <div
                    v-if="i === currentSlide"
                    :style="currentIndicatorStyle"
                  ></div>
                  <div v-else :style="indicatorStyle"></div>
                </div>
              </div>
            </div>
          </template>
          <!-- dot_over -->
          <template v-if="indicatorType === 'dot_over'">
            <div
              class="dot-over-indicator-container"
              v-if="listData.length > 1 && reRender"
            >
              <div class="indicator-wrapper">
                <div
                  v-for="i in Array.from(
                    { length: listData.length },
                    (v, k) => k
                  )"
                  :key="'ic' + i"
                  @click="$refs.slick.goTo(i)"
                >
                  <div
                    v-if="i === currentSlide"
                    :style="currentIndicatorStyle"
                  ></div>
                  <div v-else :style="indicatorStyle"></div>
                </div>
              </div>
            </div>
          </template>
          <!-- num (0/0) -->
          <template v-else-if="indicatorType === 'num'">
            <div
              class="num-indicator-container flex-center"
              :style="numIndicatorStyle"
              v-if="listData.length > 0 && reRender"
            >
              <div
                v-for="i in Array.from(
                  { length: listData.length },
                  (v, k) => k
                )"
                :key="'num-' + i"
              >
                <div v-if="i === currentSlide">
                  <span>{{ currentSlide + 1 }}</span>
                  <span> / {{ listData.length }}</span>
                </div>
              </div>
            </div>
          </template>
          <!-- m_num (0/0) -->
          <template v-else-if="indicatorType === 'm_num'">
            <div
              class="m-num-indicator-container flex-center"
              :style="numIndicatorStyle"
              v-if="listData.length > 0 && reRender"
            >
              <div
                v-for="i in Array.from(
                  { length: listData.length },
                  (v, k) => k
                )"
                :key="'num-' + i"
              >
                <div v-if="i === currentSlide">
                  <span>{{ currentSlide + 1 }}</span>
                  <span> / {{ listData.length }}</span>
                </div>
              </div>
            </div>
          </template>
          <!-- dot_num -->
          <template v-else-if="indicatorType === 'dot_num'">
            <div
              :class="
                customWidth
                  ? 'custom-dot-num-indicator-container'
                  : 'dot-num-indicator-container'
              "
              v-if="listData.length > 0 && reRender"
            >
              <div
                v-for="i in Array.from(
                  { length: listData.length },
                  (v, k) => k
                )"
                :key="'num-' + i"
              >
                <div v-if="i === currentSlide">0{{ currentSlide + 1 }}</div>
                <div v-else class="dot-wrapper"><div class="dot"></div></div>
              </div>
            </div>
          </template>
          <!-- bar_vertical -->
          <template v-else-if="indicatorType === 'bar_vertical'">
            <div
              :class="
                fullWidth
                  ? 'full-bar-v-indicator-container'
                  : 'bar-v-indicator-container'
              "
              v-if="listData.length > 1 && reRender"
            >
              <div :style="barVerticalWrapper">
                <div :style="currentBarVerticalStyle(currentSlide)"></div>
              </div>
            </div>
          </template>
          <!-- m_bar_vertical -->
          <template v-else-if="indicatorType === 'm_bar_vertical'">
            <div
              class="m-bar-v-indicator-containe"
              v-if="listData.length > 1 && reRender"
            >
              <div :style="MbarVerticalWrapper">
                <div :style="currentMBarVerticalStyle(currentSlide)"></div>
              </div>
            </div>
          </template>
          <!-- bar_vertical_gauge -->
          <template v-else-if="indicatorType === 'bar_vertical_gauge'">
            <div
              class="bar-v-indicator-container"
              v-if="listData.length > 1 && reRender"
            >
              <div :style="barVerticalWrapper">
                <div :style="currentBarVerticalGaugeStyle(currentSlide)"></div>
              </div>
            </div>
          </template>
          <!-- bar_horizontal -->
          <template v-else-if="indicatorType === 'bar_horizontal'">
            <div
              class="bar-h-indicator-container"
              v-if="listData.length > 1 && reRender"
            >
              <div :style="barHorizontalWrapper">
                <div :style="currentBarHorizontalStyle(currentSlide)"></div>
              </div>
            </div>
          </template>
          <!-- bar_horizontal_gauge -->
          <template v-else-if="indicatorType === 'bar_horizontal_gauge'">
            <div
              class="bar-h-indicator-container"
              v-if="listData.length > 1 && reRender"
            >
              <div :style="barHorizontalWrapper">
                <div
                  :style="currentBarHorizontalGaugeStyle(currentSlide)"
                ></div>
              </div>
            </div>
          </template>
          <!-- num_bar_horizontal -->
          <template v-else-if="indicatorType === 'num_bar_horizontal'">
            <div
              :class="
                fullWidth
                  ? 'full-bar-num-h-indicator-container'
                  : 'bar-num-h-indicator-container'
              "
              v-if="listData.length > 1 && reRender"
            >
              <div
                :class="
                  fullWidth ? 'full-current-slide-num' : 'current-slide-num'
                "
              >
                0{{ currentSlide + 1 }}
              </div>
              <div :style="barHorizontalWrapper" style="margin-top: 2px">
                <div :style="currentBarHorizontalStyle(currentSlide)"></div>
              </div>
            </div>
          </template>
        </template>
      </div>

      <!-- 오른쪽 화살표 -->
      <i
        v-if="arrow && listData.length > 1 && reRender"
        class="slider-arrow material-icons unselect"
        :style="arrowRightComputedStyle"
        @click="$refs.slick.next()"
        >keyboard_arrow_right</i
      >

      <!-- 컨트롤러 -->
      <div class="controller-container" v-if="controller">
        <i class="material-icons unselect" @click="$refs.slick.prev()"
          >keyboard_arrow_left</i
        >
        <i class="material-icons unselect" @click="clickPlayStatus">{{
          playStatus ? "pause" : "play_arrow"
        }}</i>
        <i class="material-icons unselect" @click="$refs.slick.next()"
          >keyboard_arrow_right</i
        >
      </div>
    </div>
  </div>
</template>

<script>
import Slick from "vue-slick";

export default {
  name: "image-slider",

  components: {
    Slick,
  },

  props: {
    arrow: {
      type: Boolean,
      default: false,
    },
    controller: {
      type: Boolean,
      default: false,
    },
    imageRates: {
      type: Object,
      default: () => {
        return {
          ratio: "4:3",
        };
      },
    },
    indicator: {
      type: Boolean,
      default: false,
    },
    indicatorType: {
      type: String,
      default: "dot", // dot, dot_over, num, dot_num, bar_vertical, bar_horizontal, num_bar_horizontal / 모바일은 m_ 붙이기
    },
    listData: {
      type: Array,
      required: true,
    },
    useRatio: {
      type: Boolean,
      default: true,
    },
    useNaturalRatio: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      required: false,
      default: 60,
    },
    imgPaddingTb: {
      type: Number,
      default: 0,
    },
    imgPaddingLr: {
      type: Number,
      default: 0,
    },
    imgRadius: {
      type: Number,
      default: 0,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    slidesToShow: {
      type: Number,
      default: 1,
    },
    slidesToScroll: {
      type: Number,
      default: 1,
    },
    autoplaySpeed: {
      type: Number,
      default: 3000,
    },
    arrowLeftStyle: {
      type: Object,
      required: false,
    },
    arrowRightStyle: {
      type: Object,
      required: false,
    },
    slidesToShowStyle: {
      type: Object,
      require: false,
    },
    imageStyle: {
      type: Object,
      required: false,
    },
    customIndicatorStyle: {
      type: Object,
      required: false,
    },
    customNumIndicatorStyle: {
      type: Object,
      required: false,
    },
    customCurrentIndicatorStyle: {
      type: Object,
      required: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    variableWidth: {
      type: Boolean,
      default: false,
    },
    centerMode: {
      type: Boolean,
      default: false,
    },
    centerPadding: {
      type: Number,
      default: 0,
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    customWidth: {
      type: Boolean,
      default: false,
    },
    arrowHover: {
      type: Boolean,
      default: false,
    },
    dim: {
      type: Boolean,
      default: false,
    },
    opacity: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      currentSlide: 0,
      reRender: true,
      width: 0,
      resizeListener: undefined,
      playStatus: true,
      dragging: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.width = this.$refs.cardlist.clientWidth;
      this.resizeListener = () => {
        this.width = this.$refs.cardlist.clientWidth;
      };
      window.addEventListener("resize", this.resizeListener);
    });
    this.reRenderSlick();
  },
  activated() {
    this.reRenderSlick();
  },
  methods: {
    currentBarVerticalStyle(index) {
      if (this.fullWidth === true) {
        let height = 304 / this.listData.length;
        return {
          position: "absolute",
          width: "8px",
          height: `${height}px`,
          backgroundColor: this.brandBgColor.white.backgroundColor,
          top: `${index === 0 ? 0 : index * height}px`,
        };
      } else {
        let height = 120 / this.listData.length;
        return {
          position: "absolute",
          width: "4px",
          height: `${height}px`,
          backgroundColor: this.brandBgColor.brand.backgroundColor,
          top: `${index === 0 ? 0 : index * height}px`,
        };
      }
    },
    currentMBarVerticalStyle(index) {
        let width = 255 / this.listData.length;
        return {
          position: "absolute",
          width: `${width}px`,
          height: "4px",
          backgroundColor: this.brandBgColor.brand.backgroundColor,
          left: `${index === 0 ? 0 : index * width}px`,
        };
    },
    currentBarVerticalGaugeStyle(index) {
      let height = 120 / this.listData.length;
      return {
        position: "absolute",
        width: "4px",
        height: `${height * (index + 1)}px`,
        backgroundColor: this.brandBgColor.brand.backgroundColor,
        top: 0,
      };
    },
    currentBarHorizontalStyle(index) {
      if (this.fullWidth === true) {
        let width = 224 / this.listData.length;
        return {
          position: "absolute",
          height: "8px",
          width: `${width}px`,
          backgroundColor: this.brandBgColor.brand.backgroundColor,
          left: `${index === 0 ? 0 : index * width}px`,
        };
      } else {
        let width = 150 / this.listData.length;
        return {
          position: "absolute",
          height: "4px",
          width: `${width}px`,
          backgroundColor: this.brandBgColor.brand.backgroundColor,
          left: `${index === 0 ? 0 : index * width}px`,
        };
      }
    },
    currentBarHorizontalGaugeStyle(index) {
      let width = 150 / this.listData.length;
      return {
        position: "absolute",
        height: "4px",
        width: `${width * (index + 1)}px`,
        backgroundColor: this.brandBgColor.brand.backgroundColor,
        left: 0,
      };
    },
    clickPlayStatus() {
      if (this.playStatus) {
        this.$refs.slick.pause();
      } else {
        this.$refs.slick.play();
      }
      this.playStatus = !this.playStatus;
    },
    reRenderSlick() {
      if (this.reRender === false) return;
      this.$nextTick(() => {
        this.reRender = false;
        setTimeout(() => {
          this.reRender = true;
          this.$nextTick(() => {
            let currIndex = this.$refs.slick.currentSlide();
            this.$refs.slick.destroy();
            this.$nextTick(() => {
              this.$refs.slick.create();
              this.$refs.slick.goTo(currIndex, true);
              this.$nextTick(() => {
                this.$refs.slick.reSlick();
              });
            });
          });
        }, 500);
      });
    },

    computedUrl(item) {
      if (item.url) return item.url;
      else return item;
    },

    getHref(link) {
      if (this.dragging) return;
      if (link.indexOf("http:") > -1 || link.indexOf("https:") > -1) {
        if (link.indexOf(location.origin) > -1) {
          this.routerPush(link.replace(location.origin, ""));
        } else {
          const a = document.createElement("a");
          a.href = link;
          a.setAttribute("target", "_blank");
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
        }
      } else {
        // location.href = link;
        this.routerPush(link);
      }
    },

    getTarget(link) {
      return link.indexOf("http:") > -1 || link.indexOf("https:") > -1
        ? "_blank"
        : "";
    },

    handleBeforeChange(event, slick, currentSlide, nextSlide) {
      this.currentSlide = nextSlide;
      this.dragging = true;
    },

    handleAfterChange(event, slick, currentSlide, nextSlide) {
      this.dragging = false;
    },
    arrowHoverhandler(isHover) {
      if (this.arrowHover) {
        this.arrow = isHover;
      }
    },

    imgStyle(img) {
      let height = "60px";

      if (typeof this.height === "string") {
        height = this.height;
      } else {
        height = `${this.height}px`;
      }

      return {
        width: "100%",
        height: height,
        // lazy background-image 적용
        backgroundImage: `url(${img.url ? img.url : img})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        marginBottom: "-5px",
      };
    },
  },

  computed: {
    containerStyle() {
      return {
        overflow: "hidden",
        borderRadius: this.imgRadius + "px",
      };
    },
    numIndicatorStyle() {
      if (this.customNumIndicatorStyle) return this.customNumIndicatorStyle;
      else {
        let right = 20;
        let bottom = 20;
        if (this.imgPaddingTb > 0 && this.imgPaddingLr > 0) {
          right += this.imgPaddingLr;
          bottom += this.imgPaddingTb;
          return {
            right: right + "px",
            bottom: bottom + 4 + "px",
          };
        } else {
          return {
            right: right + "px",
            bottom: bottom + "px",
          };
        }
      }
    },
    imgs() {
      let array = [];
      this.listData.forEach((item) => {
        if (item.url) {
          array.push(item.url);
        } else {
          array.push(item);
        }
      });
      return array;
    },
    currentIndicatorStyle() {
      if (this.customCurrentIndicatorStyle)
        return this.customCurrentIndicatorStyle;
      else {
        return {
          width: "8px",
          height: "8px",
          borderRadius: "100%",
          backgroundColor: this.brandBgColor.primary.backgroundColor,
          marginRight: "4px",
        };
      }
    },

    indicatorStyle() {
      if (this.customIndicatorStyle) return this.customIndicatorStyle;
      else {
        return {
          width: "8px",
          height: "8px",
          borderRadius: "100%",
          backgroundColor: "rgba(255, 255, 255, 1)",
          marginRight: "4px",
        };
      }
    },

    barVerticalWrapper() {
      if (this.fullWidth === true)
        return {
          width: "8px",
          height: "304px",
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          position: "relative",
        };
      else {
        return {
          width: "4px",
          height: "120px",
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          position: "relative",
        };
      }
      },
    MbarVerticalWrapper() {
        return {
          width: "255px",
          height: "4px",
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          position: "relative",
        };

    },
    barHorizontalWrapper() {
      if (this.fullWidth === true) {
        return {
          width: "224px",
          height: "8px",
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          position: "relative",
        };
      } else {
        return {
          width: "150px",
          height: "4px",
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          position: "relative",
        };
      }
    },
    // 슬릭 옵션
    slickOptions() {
      return {
        infinite: true,
        variableWidth: this.variableWidth,
        centerPadding: this.centerPadding + "px",
        centerMode: this.centerMode,
        autoplay: this.autoplay,
        arrows: false,
        dots: false,
        slidesToShow: this.slidesToShow,
        slidesToScroll: this.slidesToScroll,
        autoplaySpeed: this.autoplaySpeed,
        vertical: this.vertical,
      };
    },
    arrowLeftComputedStyle() {
      if (this.arrowLeftStyle) return this.arrowLeftStyle;
      else {
        return {
          height: "24px",
          fontSize: "24px",
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.2)",
          top: "calc(50% - 12px)",
          color: "white",
          left: "8px",
        };
      }
    },

    arrowRightComputedStyle() {
      if (this.arrowRightStyle) return this.arrowRightStyle;
      else {
        return {
          height: "24px",
          fontSize: "24px",
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.2)",
          top: "calc(50% - 12px)",
          color: "white",
          right: "8px",
        };
      }
    },
    eImageStyle() {
      if (this.slidesToShowStyle) {
        return this.slidesToShowStyle;
      } else {
        return {
          marginBottom: "-5px",
        };
      }
    },
  },
  watch: {
    listData() {
      this.reRenderSlick();
    },
    currentSlide(n) {
      this.$emit("change", n);
    },
  },
};
</script>

<style lang="stylus" type="stylus" scoped>
.cg-list-image-slider-container {
  position: relative;
  padding: 10px;
  width: 100%;
}

.card-wrapper {
  opacity: 0.5;
  transform: scale(0.8, 0.8);
  transition: all 0.4s ease-in-out;
}

.card {
  padding: 0 48px;
}

.slider-arrow {
  position: absolute;
  z-index: 1;
}

.indicator-container {
  position: absolute;
  width: 100%;
  bottom: 16px;
  z-index: 1;
}

.dot-over-indicator-container {
  position: absolute;
  width: 100%;
  bottom: -24px;
  z-index: 1;
}

.num-indicator-container {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  width: 48px;
  height: 26px;
  text-align: center;
}
.m-num-indicator-container {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  width: 44px;
  height: 20px;
  text-align: center;
}

.dot-num-indicator-container {
  position: absolute;
  bottom: 48px;
  left: 48px;
  color: white;
  font-size: 14px;
  text-align: center;
  line-height: 16px;

  .dot-wrapper {
    width: 100%;
    height: 16px;
    padding-top: 6px;
  }

  .dot {
    margin: auto;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: white;
  }
}

.custom-dot-num-indicator-container {
  position: absolute;
  bottom: 114px;
  left: 117px;
  color: white;
  font-size: 22px;
  text-align: center;
  line-height: 32x;

  .dot-wrapper {
    width: 100%;
    height: 16px;
    padding-top: 6px;
  }

  .dot {
    margin: auto;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    background-color: white;
  }
}
.m-bar-v-indicator-containe {
  position: absolute;
  left: 60px;
  bottom: 16px;
}

.bar-v-indicator-container {
  position: absolute;
  left: 40px;
  top: 32px;
}

.full-bar-v-indicator-container {
  position: absolute;
  left: 60px;
  top: 40px;
}

.bar-h-indicator-container, .bar-num-h-indicator-container, .full-bar-num-h-indicator-container {
  position: absolute;
  bottom: 20px;
}

.bar-h-indicator-container {
  left: 50%;
  transform: translateX(-50%);
}

.bar-num-h-indicator-container {
  display: flex;
  align-items: center;
  right: 48px;

  .current-slide-num {
    color: white;
    font-size: 14px;
    margin-right: 12px;
  }
}

.full-bar-num-h-indicator-container {
  display: flex;
  align-items: center;
  right: 384px;

  .full-current-slide-num {
    color: white;
    font-size: 24px;
    margin-right: 24px;
  }
}

.indicator-wrapper {
  display: flex;
  justify-content: center;
}

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-enter {
  opacity: 0;
}

.controller-container {
  position: absolute;
  top: 20px;
  right: 40px;
  line-height: 15px;
  padding: 4px 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;

  i {
    padding: 0 2px;
  }
}

.dim {
  position: absolute;
  width: 100%;
  max-height: 180px;
  height: 100%;
  bottom: -5px;
  left: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.864583) 86.46%,
    #ffffff 100%
  );
}
.m-dim {
  position: absolute;
  width: 100%;
  max-height: 130px;
  height: 100%;
  bottom: -5px;
  left: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.864583) 86.46%,
    #ffffff 100%
  );
}
</style>

<style lang="stylus">
.block-container {
  .slick-center {
    .card-wrapper {
      opacity: 1;
      transform: scale(1.1);
    }
  }
}
</style>
