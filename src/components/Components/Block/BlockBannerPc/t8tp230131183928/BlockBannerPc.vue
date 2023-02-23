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
    :slidesToShowStyle="slidesToShowStyle"
    :arrowRightStyle="arrowRightStyle"
    :arrowLeftStyle="arrowLeftStyle"
    :dim="dim"
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
      fullWidth: true,
      indicator: true,
      bannerList: [],
      indicatorType: "dot",
      arrow: true,
      arrowRightStyle: {
        width: "72px",
        height: "72px",
        textAlign: "center",
        lineHeight: "72px",
        fontSize: "72px",
        borderRadius: "50%",
        top: "calc(50% - 30px)",
        color: "rgba(79, 79, 79)",
        textShadow: "0px 1px 4px rgba(0, 0, 0, 0.36)",
        right: "61px",
      },
      arrowLeftStyle: {
        width: "72px",
        height: "72px",
        textAlign: "center",
        lineHeight: "72px",
        fontSize: "72px",
        borderRadius: "50%",
        top: "calc(50% - 30px)",
        color: "white",
        textShadow: "0px 1px 4px rgba(0, 0, 0, 0.36)",
        left: "61px",
      },
      dim: true,
    };
  },
  created() {
    this.arrowRightStyle.color = this.brandColor.white.color;
    this.arrowLeftStyle.color = this.brandColor.white.color;
  },
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


