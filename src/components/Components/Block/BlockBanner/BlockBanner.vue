<template>
  <banner
    @getBanner="$emit('getBanner')"
    :bannerId="bannerId"
    :bannerList="bannerList"
    :fullWidth="fullWidth"
    :ratio="ratio"
    :indicator="indicator"
    :indicatorType="indicatorType"
    :vertical="vertical"
    :arrowLeftStyle="arrowLeftStyle"
  ></banner>
</template>
<script>
export default {
  name: "BlockBanner",
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      ratio: 0.25,
      bannerId: 1,
      vertical: false,
      fullWidth: true,
      indicator: true,
      bannerList: [],
      ratioValue: 3,
      indicatorType: "dot",
      arrowLeftStyle: {
        borderRadius: "100%",
        width: "72px",
        height: "72px",
      },
    };
  },
  created() {},
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


