<template>
<banner @getBanner="$emit('getBanner')" 
        :bannerId="bannerId" 
        :bannerList="bannerList"
        :fullWidth="fullWidth" 
        :ratio="ratio"
        :indicator="indicator" 
        :indicatorType="indicatorType"
        :vertical="vertical"
        :dim="dim"
        :customCurrentIndicatorStyle="customCurrentIndicatorStyle"
        :customIndicatorStyle="customIndicatorStyle"
        >
</banner>
</template>
<script>

export default {
  name: 'BlockBanner',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "ratio": 0.667,
      "bannerId": 1,
      "vertical": false,
      "fullWidth": true,
      "indicator": true,
      "bannerList": [],
      "ratioValue": 3,
      "indicatorType": "dot",
      "dim": true,
      "customCurrentIndicatorStyle": {
          width: "7px",
          height: "7px",
          borderRadius: "100%",
          backgroundColor: "",
          marginRight: "10px",
      },
      "customIndicatorStyle": {
        width: "7px",
          height: "7px",
          borderRadius: "100%",
          backgroundColor: "",
          marginRight: "10px",
      }
    }
  },
  created() {
    this.customCurrentIndicatorStyle.backgroundColor = this.brandColor.main.color;
    this.customIndicatorStyle.backgroundColor = this.brandBgColor.sub.backgroundColor;
    
  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


