<template>
  <div class="flex-center full-width">
    <div :style="bannerWidth" style="min-height: 95px">
      <div
        v-if="
          (isShowing && urlVideo && urlVideo.length > 0) ||
          (lpVideo && lpVideo.length > 0) ||
          (banner && banner.length > 0)
        "
        class="full-width"
        :style="brandBgColor.main"
        name="Banner"
      >
        <div
          class="video-wrapper"
          v-if="urlVideo && urlVideo.length > 0"
          :style="[wrapperStyle]"
        >
          <iframe
            :src="computedVideo"
            allow="autoplay;"
            :style="
              $store.getters.device === 'pc' ? pcIframeStyle : iframeStyle
            "
          ></iframe>
        </div>

        <div
          class="video-wrapper"
          v-if="lpVideo && lpVideo.length > 0"
          :style="[wrapperStyle]"
          style="background-color: white"
        >
          <video
            :src="lpVideo[0].url"
            type="video/mp4"
            loop="true"
            muted="true"
            autoplay="true"
            playsinline
            :style="$store.getters.device === 'pc' ? pcVideoStyle : {}"
          ></video>
        </div>

        <image-slider
          :listData="banner"
          :height="imgBannerHeight"
          v-if="banner && banner.length > 0"
          :style="[imageSliderStyle]"
          :imgRadius="imgRadius"
          :useRatio="useRatio"
          :imageRates="imageRates"
          :imgPaddingTb="imgPaddingTb"
          :imgPaddingLr="imgPaddingLr"
          :autoplay="autoplay"
          :vertical="vertical"
          :autoplaySpeed="autoplaySpeed"
          :slidesToScroll="slidesToScroll"
          :arrow="arrow"
          :controller="controller"
          :indicator="indicator"
          :indicatorType="indicatorType"
          :arrowLeftStyle="arrowLeftStyle"
          :arrowRightStyle="arrowRightStyle"
          :slidesToShowStyle="slidesToShowStyle"
          :customIndicatorStyle="customIndicatorStyle"
          :customCurrentIndicatorStyle="customCurrentIndicatorStyle"
          :slidesToShow="slidesToShow"
          :centerMode="centerMode"
          :centerPadding="centerPadding"
          :variableWidth="variableWidth"
          :fullWidth="fullWidth"
          :customWidth="customWidth"
          :arrowHover="arrowHover"
          :dim="dim"
        >
          <template slot="inner">
            <slot name="inner"></slot>
          </template>
        </image-slider>
      </div>
    </div>
  </div>
</template>

<script>
import BlockMixin from "@/components/Mixins/BlockMixin";
export default {
  name: "Banner",
  mixins: [BlockMixin],
  props: {
    dim: {
      type: Boolean,
      default: false,
    },
    // PC모드에서 fullWidth 또는 pcMaxWidth 적용
    fullWidth: {
      type: Boolean,
      default: true,
    },
    customWidth: {
      type: Boolean,
      default: false,
    },
    indicatorType: {
      type: String,
      default: "dot",
    },
    indicator: {
      type: Boolean,
      default: false,
    },
    // custom height
    height: {
      type: Number,
      required: false,
    },
    // custom width
    width: {
      type: Number,
      required: false,
    },
    // custom ratio (cf. height = width * ${ratio})
    ratio: {
      type: Number,
      required: false,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    autoplaySpeed: {
      type: Number,
      default: 3000,
    },
    slidesToScroll: {
      type: Number,
      default: 1,
    },
    slidesToShow: {
      type: Number,
      default: 1,
    },
    bannerId: {
      type: Number,
      default: 0,
    },
    useRatio: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    controller: {
      type: Boolean,
      default: false,
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
      required: false,
    },
    customIndicatorStyle: {
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
    bannerList: {
      type: Array,
    },
    centerMode: {
      type: Boolean,
      default: false,
    },
    centerPadding: {
      type: Number,
      default: 0,
    },
    arrowHover: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      banner: [],
      bannerRatio: 0,
      imgBannerRatio: 0,
      bannerHeight: 200,
      imgBannerHeight: 200,
      lpVideo: [],
      urlVideo: [],
      screenWidth: window.innerWidth,
      isShowing: false,
      imageWidth: 0,
      imageRates: undefined,
    };
  },
  created() {
    this.init();
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        if(this.$store.getters.device === "pc") {  
          this.deviceWidth = window.innerWidth;
        }
        this.setScreenWidth();
        this.bannerStyle();
        this.imgBannerStyle();
      });
    });
  },
  methods: {
    setScreenWidth() {
      //this.screenWidth = window.innerWidth;
      this.screenWidth = this.deviceWidth;
      if (!this.fullWidth && !this.customWidth) {
        if (this.$store.getters.device === "pc") {
          this.screenWidth = Number(this.pcMaxWidth.width.replace("px", ""));
        } else {
          this.screenWidth =
            this.deviceWidth -
            Number(this.pagePadding.paddingLeft.replace("px", "")) * 2;
        }
      } else if (!this.fullWidth && this.customWidth) {
        if (this.$store.getters.device === "pc") {
          this.screenWidth =
            Number(this.pcMaxWidth.width.replace("px", "")) + 860;
        } else {
          this.screenWidth =
            this.deviceWidth -
            Number(this.pagePadding.paddingLeft.replace("px", "")) * 2;
        }
      }
    },
    init() {
      this.deviceWidth = this.$store.getters.deviceWidth;
      this.setScreenWidth();
    },
    getData() {
      if (this.bannerList && this.bannerList.length > 0) {
        this.getBannerListProps();
      } else {
        let url = "public/banner/list";
        if (this.bannerId && this.bannerId > 0) {
          this.getBanner(`public/banner/${this.bannerId}`);
        } else {
          if (this.$store.getters.device === "pc") {
            url += "/pc";
          }
          this.getBannerList(url);
        }
      }
    },
    getBannerListProps() {
      this.banner = this.bannerList.filter((i) => i.selected);
      this.imgBannerStyle();
    },
    getBanner(url) {
      this.$axios
        .get(url)
        .then((res) => {
          this.banner = [];
          this.lpVideo = [];
          let date = new Date().getTime();
          let start_date = new Date(res.data.start_date).getTime();
          let end_date = new Date(res.data.end_date).getTime();

          this.isShowing = date > start_date || date < end_date;
          this.$emit("isShowing", this.isShowing);
          // image banner
          if (res.data.type === 0) {
            for (let i = 0; i < res.data.imgs.length; i++) {
              let img = res.data.imgs[i];
              this.banner.push({
                url: img,
                link: res.data.links[i],
              });
            }
            this.imgBannerRatio = res.data.pc
              ? res.data.ratio_pc
              : res.data.ratio;
            this.imgBannerStyle();
          }
          // video banner
          else if (res.data.type >= 1) {
            for (let i = 0; i < res.data.imgs.length; i++) {
              let img = res.data.imgs[i];
              let video = res.data.type === 1 ? "lpVideo" : "urlVideo";
              this[video].push({
                url: img,
                link: res.data.links[i],
              });
            }
            this.bannerRatio = res.data.pc ? res.data.ratio_pc : res.data.ratio;
            this.bannerStyle();
          }
          setTimeout(() => {
            this.$emit("getBanner");
          }, 700);
        })
        .catch(() => {
          setTimeout(() => {
            this.$emit("getBanner");
          }, 700);
        });
    },
    getBannerList(url) {
      this.$axios
        .get(url)
        .then((res) => {
          if (res.data.start_date && res.data.end_date) {
            let date = new Date().getTime();
            let start_date = new Date(res.data.start_date).getTime();
            let end_date = new Date(res.data.end_date).getTime();

            this.isShowing = date > start_date || date < end_date;
          } else {
            this.isShowing = true;
          }
          this.$emit("isShowing", this.isShowing);

          if (res.data.length > 0) {
            let imgBanner = res.data.filter((item) => item.data[0].type === 0);
            if (imgBanner.length > 0) {
              this.imgBannerRatio = imgBanner[0].ratio;
              this.banner = imgBanner[0].data;
              this.imgBannerStyle();
            }
            let videoBanner = res.data.filter(
              (item) => item.data[0].type === 1 || item.data[0].type === 2
            );
            if (videoBanner.length > 0) {
              this.bannerRatio = videoBanner[0].ratio;
              if (videoBanner[0].data[0].type === 1)
                this.lpVideo = videoBanner[0].data;
              else if (videoBanner[0].data[0].type === 2)
                this.urlVideo = videoBanner[0].data;
              this.bannerStyle();
            }
          }
          setTimeout(() => {
            this.$emit("getBanner");
          }, 700);
        })
        .catch(() => {
          setTimeout(() => {
            this.$emit("getBanner");
          }, 700);
        });
    },
    bannerStyle() {
      let deviceWidth = "";

      /* PC */
      if (this.$store.getters.device === "pc") {
        deviceWidth = this.screenWidth;
        if (this.width) deviceWidth = this.width;

        // custom ratio
        if (this.ratio !== undefined) {
          this.bannerHeight =
            this.ratio === "full"
              ? window.innerHeight
              : deviceWidth * this.ratio;
        } else {
          const rates = {
            0: 1 / 3,
            1: 1 / 4,
            2: 1 / 5,
            3: 1 / 8,
            4: 1,
            5: 1 / 2,
          };
          this.bannerHeight = deviceWidth * rates[this.bannerRatio];
        }
      } else {
        /* Mobile */
        deviceWidth = this.deviceWidth;
        if (this.width) deviceWidth = this.width;

        // custom ratio
        if (this.ratio !== undefined) {
          this.bannerHeight =
            this.ratio === "full"
              ? window.innerHeight
              : deviceWidth * this.ratio;
        } else {
          const rates = {
            0: 3 / 4,
            1: 9 / 16,
            2: 1 / 2.35,
            3: 1 / 4,
            4: 1 / 8,
            5: 1,
            6: 1 / 1.3,
          };
          this.bannerHeight = deviceWidth * rates[this.bannerRatio];
        }
      }
      if (this.height) {
        this.bannerHeight = this.height;
      }
    },
    imgBannerStyle() {
      let deviceWidth = "";
      /* PC */
      if (this.$store.getters.device === "pc") {
        deviceWidth = this.screenWidth;
        if (this.width) deviceWidth = this.width;

        this.imageWidth = deviceWidth;

        // custom ratio
        if (this.ratio !== undefined) {
          if (this.ratio === "full") {
            this.imgBannerHeight = window.innerHeight;
            this.imageRates = { ratio: "fullscreen" };
          } else {
            this.imgBannerHeight = deviceWidth * this.ratio;
            this.imageRates = { ratio: `1:${this.ratio}` };
          }
        } else {
          // 풀스크린
          if (this.imgBannerRatio === 6) {
            this.imgBannerHeight = window.innerHeight;
            this.imageRates = { ratio: "fullscreen" };
          } else {
            const rates = {
              0: "3:1",
              1: "4:1",
              2: "5:1",
              3: "8:1",
              4: "1:1",
              5: "2:1",
              7: "16:9",
            }[this.imgBannerRatio];
            const [w, h] = rates.split(":");
            this.imgBannerHeight = (deviceWidth * Number(h)) / Number(w);
            this.imageRates = { ratio: rates };
          }
        }
      } else {
        /* Mobile */
        deviceWidth = this.screenWidth;
        if (this.width) deviceWidth = this.width;

        this.imageWidth = deviceWidth;

        // custom ratio
        if (this.ratio !== undefined) {
          if (this.ratio === "full") {
            this.imgBannerHeight = window.innerHeight;
            this.imageRates = { ratio: "fullscreen" };
          } else {
            this.imgBannerHeight = deviceWidth * this.ratio;
            this.imageRates = { ratio: `1:${this.ratio}` };
          }
        } else {
          // 풀스크린
          if (this.imgBannerRatio === 7) {
            this.imgBannerHeight = window.innerHeight;
            this.imageRates = { ratio: "fullscreen" };
          } else {
            const rates = {
              0: "4:3",
              1: "16:9",
              2: "2.35:1",
              3: "4:1",
              4: "8:1",
              5: "1:1",
              6: "1.3:1",
            }[this.imgBannerRatio];
            const [w, h] = rates.split(":");
            this.imgBannerHeight = (deviceWidth * Number(h)) / Number(w);
            this.imageRates = { ratio: rates };
          }
        }
      }
      if (this.height) {
        this.imgBannerHeight = this.height;
      }
    },
  },
  computed: {
    bannerWidth() {
      return { width: this.fullWidth ? "100%" : this.screenWidth + "px" };
    },
    imageSliderStyle() {
      if(this.imgRadius) {
        return {
          width: `${this.imageWidth}px`,
        height: `${this.imgBannerHeight + this.imgPaddingTb * 2}px`,
        padding: "40px 80px"
        }
      }else{
        return {
          width: `${this.imageWidth}px`,
          height: `${this.imgBannerHeight + this.imgPaddingTb * 2}px`,
        }
      }
    },
    pcVideoHeight() {
      return (this.screenWidth * 9) / 16;
    },
    computedVideo() {
      let url = this.urlVideo[0].url;
      // 유튜브
      if (url.indexOf("youtube") > -1) {
        if (url.indexOf("v=") > -1) {
          let leng = url.split("=").length;
          return (
            "https://www.youtube.com/embed/" +
            url.split("=")[leng - 1] +
            `?autoplay=1&controls=0&mute=1&modestbranding=1&rel=0&loop=1;playlist=${
              url.split("=")[leng - 1]
            }`
          );
        } else {
          let leng = url.split("/").length;
          return "https://www.youtube.com/embed/" + url.split("/")[leng - 1];
        }
      }

      // 유튜브 축약 링크
      if (url.indexOf("youtu.be") > -1) {
        let leng = url.split("/").length;
        return (
          "https://www.youtube.com/embed/" +
          url.split("/")[leng - 1] +
          `?autoplay=1&controls=0&mute=1&modestbranding=1&rel=0&loop=1;playlist=${
            url.split("/")[leng - 1]
          }`
        );
      }

      // 카카오tv 링크인 경우
      if (url.indexOf("tv.kakao") > -1) {
        let leng = url.split("/").length;
        if (url.indexOf("/v") > -1) {
          return `https://play-tv.kakao.com/embed/player/cliplink/${
            url.split("/")[leng - 1]
          }?service=player_share&loop=1&autoplay=1`;
        } else {
          return `https://play-tv.kakao.com/embed/player/cliplink/${
            url.split("/")[leng - 1].split("?")[0]
          }?service=player_share&loop=1&autoplay=1`;
        }
      }
      return url;
    },
    iframeStyle() {
      return {
        height: `${this.bannerHeight}px`,
      };
    },
    pcIframeStyle() {
      return {
        height: this.pcVideoHeight + "px",
        width: "100%",
        top: `calc(50% - ${this.pcVideoHeight / 2}px)`,
        position: "absolute",
      };
    },
    pcVideoStyle() {
      return {
        height: this.pcVideoHeight + "px",
        width: "100%",
        top: `calc(50% - ${this.pcVideoHeight / 2}px)`,
        position: "absolute",
      };
    },
    wrapperStyle() {
      return {
        height: this.bannerHeight + "px",
        overflow: "hidden",
        borderRadius: this.imgRadius + "px",
        padding: "40px 80px"
      };
    },
  },
  watch: {
    "$store.getters.deviceWidth"() {
      this.deviceWidth = this.$store.getters.deviceWidth;
    },
    bannerId() {
      this.banner = [];
      this.lpVideo = [];
      this.urlVideo = [];
      this.init();
      this.getData();
    },
    ratio() {
      this.setScreenWidth();
      this.bannerStyle();
      this.imgBannerStyle();
    },
  },
};
</script>

<style scoped>
.video-wrapper {
  position: relative;
  height: 0;
  margin-bottom: 2px;
}
.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  pointer-events: none;
}

</style>
