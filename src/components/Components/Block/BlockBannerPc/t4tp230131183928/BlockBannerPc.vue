<template>
  <banner
    @getBanner="$emit('getBanner')"
    style="margin-bottom: 20px"
    :bannerId="bannerId"
    :bannerList="bannerList"
    :fullWidth="fullWidth"
    :ratio="ratio"
    :indicator="indicator"
    :indicatorType="indicatorType"
    :vertical="vertical"
    :arrow="arrow"
    :arrowRightStyle="arrowRightStyle"
    :customWidth="customWidth"
    :imgRadius="imgRadius"
    :slidesToShowStyle="slidesToShowStyle"
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
      imgRadius: 20,
      vertical: true,
      fullWidth: true,
      customWidth: true,
      indicator: true,
      bannerList: [],
      indicatorType: "dot_num",
      arrow: false,
    };
  },
  created() {},
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


