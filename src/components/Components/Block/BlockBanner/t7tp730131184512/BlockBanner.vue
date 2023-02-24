<template>
<banner @getBanner="$emit('getBanner')" 
        :bannerId="bannerId" 
        :bannerList="bannerList"
        :fullWidth="fullWidth" 
        :ratio="ratio"
        :indicator="indicator" 
        :indicatorType="indicatorType"
        :customNumIndicatorStyle="customNumIndicatorStyle"
        :vertical="vertical">
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
      "ratio": 0.2,
      "bannerId": 1,
      "vertical": false,
      "fullWidth": true,
      "indicator": true,
      "bannerList": [],
      "ratioValue": 3,
      "indicatorType": "m_num",
      "customNumIndicatorStyle": {
        right: "20px",
        bottom: "8px",
      }

    }
  },
  created() {

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


