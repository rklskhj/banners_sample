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
      vertical: true,
      fullWidth: true,
      indicator: true,
      bannerList: [],
      ratioValue: 2,
      indicatorType: "bar_vertical",
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


