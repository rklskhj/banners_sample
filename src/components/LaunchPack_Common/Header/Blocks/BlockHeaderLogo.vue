<template>
<div class="header-logo-container" :style="wrapStyle" v-show="visible">
  <lp-link :item="{linkType: linkType, link: link}">
    <img id="service-logo" :src="img" class="unselect" :style="iconStyle" />
  </lp-link>
</div>
</template>
<script>
import LpLink from "@/components/LaunchPack_Common/Common/LpLink.vue"

export default {
  name: 'BlockHeaderLogo',
  components: {
    LpLink
  },
  mixins: [

  ],
  props: {
    link: {
      type: String,
    },
    type: {
      type: String,
    },
    visible: {
      type: Boolean,
    },
    imgStyle: {
      type: Object,
      required: false,
    },
    linkType: {
      type: String,
    },
    containStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {

    }
  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    img() {
      return this.$store.getters.brand[`logo_${this.type}`];
    },
    iconStyle() {
      let deco= {};
      
      if(this.imgStyle) {
        deco = this.imgStyle;
      }
      else {
        deco.height = '32px';
      }
      return deco;
    },
    wrapStyle() {
      let deco = {};
      
      if(this.containStyle) {
        deco = this.containStyle;
      }
      else {
        deco.padding = '0 8px';
        deco.height = '64px';
        deco.display = 'flex';
        deco.alignItems = 'center';
        deco.justifyContent = 'center';
      }
      
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


