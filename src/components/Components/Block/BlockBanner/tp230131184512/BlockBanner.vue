<template>
<banner @getBanner="$emit('getBanner')" 
        :bannerId="bannerId" :bannerList="bannerList"
        :fullWidth="fullWidth" :ratio="ratio"
        :indicator="indicator" :indicatorType="indicatorType"
        :vertical="vertical"></banner>
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
      "ratio": 0.25,
      "bannerId": 11,
      "vertical": false,
      "fullWidth": true,
      "indicator": true,
      "bannerList": [
        {
          "url": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/44729864.png",
          "selected": true
        },
        {
          "url": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/45830049.png",
          "selected": true
        }
      ],
      "ratioValue": 3,
      "indicatorType": "dot"
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


