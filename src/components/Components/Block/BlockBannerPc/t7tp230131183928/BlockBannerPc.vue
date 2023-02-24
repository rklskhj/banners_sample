<template>
  <banner
    @getBanner="$emit('getBanner')"
    style="margin-bottom: 24px"
    :bannerId="bannerId"
    :bannerList="bannerList"
    :fullWidth="fullWidth"
    :ratio="ratio"
    :indicator="indicator"
    :indicatorType="indicatorType"
    :vertical="vertical"
    :arrow="arrow"
    :slidesToShowStyle="slidesToShowStyle"
    :arrowRightStyle="arrowRightStyle"
    :arrowLeftStyle="arrowLeftStyle"
    :slidesToShow="slidesToShow"
    :centerPadding="centerPadding"
    :customCurrentIndicatorStyle="customCurrentIndicatorStyle"
    :customIndicatorStyle="customIndicatorStyle"
    :arrowHover="arrowHover"
  ></banner>
</template>
<script>
export default {
  name: "BlockBannerPc",
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      ratio: 0.14,
      ratioValue: 2,
      bannerId: 2,
      slidesToShow: 3,
      centerPadding: 16,
      vertical: false,
      fullWidth: false,
      indicator: true,
      bannerList: [],
      indicatorType: "dot_over",
      arrow: false,
      arrowRightStyle: {
        width: "52px",
        height: "52px",
        textAlign: "center",
        lineHeight: "52px",
        fontSize: "48px",
        borderRadius: "50%",
        backgroundColor: "black",
        top: "calc(50% - 30px)",
        color: "rgba(79, 79, 79)",
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
        right: "-27px",
      },
      arrowLeftStyle: {
        width: "52px",
        height: "52px",
        textAlign: "center",
        lineHeight: "52px",
        fontSize: "48px",
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.2)",
        top: "calc(50% - 30px)",
        color: "white",
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
        left: "-27px",
      },
      slidesToShowStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "330px",
        margin: "0 auto",
      },
      customCurrentIndicatorStyle: {
          width: "8px",
          height: "8px",
          borderRadius: "100%",
          backgroundColor: "",
          marginRight: "10px",
      },
      customIndicatorStyle: {
        width: "8px",
          height: "8px",
          borderRadius: "100%",
          backgroundColor: "",
          marginRight: "10px",
      },
      arrowHover: true,
    };
  },
  created() {
    this.arrowRightStyle.color = this.brandColor.sub.color;
    this.arrowRightStyle.backgroundColor =
      this.brandBgColor.main.backgroundColor;
    this.arrowLeftStyle.color = this.brandColor.sub.color;
    this.arrowLeftStyle.backgroundColor =
      this.brandBgColor.main.backgroundColor;
    this.customCurrentIndicatorStyle.backgroundColor = this.brandColor.main.color;
    this.customIndicatorStyle.backgroundColor = this.brandBgColor.sub.backgroundColor;
    
  },
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


