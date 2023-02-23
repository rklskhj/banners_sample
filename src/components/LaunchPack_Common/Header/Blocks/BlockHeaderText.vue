<template>
<div v-if="visible" :style="wrapStyle" id="block-header-text-title">
  {{ title }}
</div>
</template>
<script>

export default {
  name: 'BlockHeaderText',
  components: {

  },
  mixins: [

  ],
  props: {
    index: {
      type: Number,
    },
    title: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    textColor: {
    },
    textStyle: {
      type: Object,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    wrapStyle() {
      let deco = {};
      if(this.textStyle && Object.keys(this.textStyle).length>0) {
        deco = this.textStyle;
      }
      else {
        deco.fontSize = '13px';
      }
      deco.color = this.parseColor(this.textColor);
      
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


