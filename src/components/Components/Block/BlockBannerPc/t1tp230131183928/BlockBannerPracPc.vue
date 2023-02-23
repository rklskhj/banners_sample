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
      ratioValue: 3,
      indicatorType: "num_bar_horizontal",
    };
  },
  created() {},
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


