<template>
  <banner
    @getBanner="$emit('getBanner')"
    style="margin-bottom: 0px"
    :bannerId="bannerId"
    :bannerList="bannerList"
    :fullWidth="fullWidth"
    :ratio="ratio"
    :indicator="indicator"
    :indicatorType="indicatorType"
    :vertical="vertical"
    :arrow="arrow"
    :arrowRightStyle="arrowRightStyle"
    :arrowLeftStyle="arrowLeftStyle"
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
      ratio: 0.2,
      ratioValue: 2,
      bannerId: 2,
      vertical: false,
      fullWidth: false,
      indicator: true,
      bannerList: [],
      indicatorType: "num",
      arrow: false,
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
        right: "-40px",
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
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
        left: "-40px",
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
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
  },
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


