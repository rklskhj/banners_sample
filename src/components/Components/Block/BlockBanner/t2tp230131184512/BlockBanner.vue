<template>
<banner @getBanner="$emit('getBanner')" 
        :bannerId="bannerId" 
        :bannerList="bannerList"
        :fullWidth="fullWidth" 
        :ratio="ratio"
        :indicator="indicator" 
        :indicatorType="indicatorType"
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
      "ratio": 0.667,
      "bannerId": 1,
      "vertical": false,
      "fullWidth": true,
      "indicator": true,
      "bannerList": [],
      "ratioValue": 3,
      "indicatorType": "m_num"
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


