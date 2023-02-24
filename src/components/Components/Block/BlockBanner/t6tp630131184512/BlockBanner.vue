<template>
<banner @getBanner="$emit('getBanner')" 
        :bannerId="bannerId" 
        :bannerList="bannerList"
        :fullWidth="fullWidth" 
        :ratio="ratio"
        :indicator="indicator" 
        :vertical="vertical"
        :imgRadius="imgRadius"
        :slidesToShow="slidesToShow"
        :slidesToShowStyle="slidesToShowStyle"
        :variableWidth="variableWidth"
        :autoplay="autoplay"
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
      "ratioValue": 3,
      "bannerId": 1,
      "slidesToShow": 1,
      "imgRadius": 8,
      "vertical": false,
      "fullWidth": true,
      "indicator": false,
      "variableWidth": true,
      "autoplay": false,
      "bannerList": [],
      "slidesToShowStyle": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "311px",
        padding: "0 0 0 16px" 
      },
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


