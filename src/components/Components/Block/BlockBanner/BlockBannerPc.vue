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
      indicator: true,
      bannerList: [],
      ratioValue: 2,
      indicatorType: "dot",
      arrow: true,
    };
  },
  created() {},
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


