<template>
<div>
  <router-link to="/partner_center" target="_blank">
    <div class="flex-align unselect" style="gap:8px">
      <svg :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_15_17116)">
          <path d="M17 15H19V17H17V15ZM17 11H19V13H17V11ZM17 7H19V9H17V7ZM13.74 7L15 7.84V7H13.74Z" :fill="brandColor.main.color"/>
          <path d="M10 3V4.51L12 5.84V5H21V19H17V21H23V3H10Z"  :fill="brandColor.main.color"/>
          <path d="M8.17 5.70001L15 10.25V21H1V10.48L8.17 5.70001ZM10 19H13V11.16L8.17 8.09001L3 11.38V19H6V13H10V19Z"  :fill="brandColor.main.color"/>
        </g>
        <defs>
          <clipPath id="clip0_15_17116">
            <rect :width="iconSize" :height="iconSize" :fill="brandBgColor.main.backgroundColor"/>
          </clipPath>
        </defs>
      </svg>
      <div :style="textStyles">{{ partnerName }}센터</div>
      
    </div>
  </router-link>
</div>
</template>
<script>

export default {
  name: 'ButtonPartnerCenter',
  components: {

  },
  mixins: [

  ],
  props: {
    iconSize: {
      type: Number,
      default: 24,
    },
    textStyle: {
      type: Object,
    },

  },
  data() {
    return {
      "partnerName": "파트너"
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    textStyles() {
      let deco = {
        fontSize: '16px',
        fontWeight: 500,
        color: this.brandColor.main.color
      }
      if(this.textStyle) {
        deco = this.textStyle;
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


