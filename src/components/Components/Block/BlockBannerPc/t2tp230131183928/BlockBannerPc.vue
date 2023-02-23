<template>
  <banner
    @getBanner="$emit('getBanner')"
    :bannerId="bannerId"
    style="margin-bottom: 0px"
    :bannerList="bannerList"
    :ratio="ratio"
    :indicator="indicator"
    :indicatorType="indicatorType"
    :fullWidth="fullWidth"
    :vertical="vertical"
    :arrow="arrow"
    :arrowRightStyle="arrowRightStyle"
    :arrowLeftStyle="arrowLeftStyle"
    :imgPaddingLr="imgPaddingLr"
    :slidesToShow="slidesToShow"
    :slidesToShowStyle="slidesToShowStyle"
    :centerMode="centerMode"
    :variableWidth="variableWidth"
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
      ratio: 0.2,
      bannerId: 2,
      vertical: false,
      fullWidth: true,
      indicator: false,
      bannerList: [],
      ratioValue: 2,
      imgPaddingLr: 20,
      slidesToShow: 3,
      centerMode: true,
      variableWidth: true,
      arrow: true,
      indicatorType: "dot_over",
      arrowRightStyle: {
        width: "72px",
        height: "72px",
        textAlign: "center",
        lineHeight: "72px",
        fontSize: "48px",
        borderRadius: "50%",
        backgroundColor: "black",
        top: "calc(50% - 30px)",
        color: "rgba(79, 79, 79)",
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
        right: "22.5rem",
      },
      arrowLeftStyle: {
        width: "72px",
        height: "72px",
        textAlign: "center",
        lineHeight: "72px",
        fontSize: "48px",
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.2)",
        top: "calc(50% - 30px)",
        color: "white",
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
        left: "22.5rem",
      },
      slidesToShowStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "1152px",
        marginBottom: "-5px",
      },
    };
  },
  created() {
    this.arrowRightStyle.color = this.brandColor.sub.color;
    this.arrowRightStyle.backgroundColor =
      this.brandBgColor.main.backgroundColor;
    this.arrowLeftStyle.color = this.brandColor.sub.color;
    this.arrowLeftStyle.backgroundColor =
      this.brandBgColor.main.backgroundColor;
  },
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


