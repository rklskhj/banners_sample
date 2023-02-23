<template>
<div class="flex-center btn-pill size-14 weight-500 unselect" :style="btnStyle" @click="$emit('clicked')">{{title}}</div>
</template>
<script>

export default {
  name: 'BtnPill',
  components: {

  },
  mixins: [

  ],
  props: {
    bg: {
      type: String,
      default: "primary",
      required: false,
    },
    color: {
      type: String,
      default: "main",
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    fontSize: {
      type: Number,
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
    btnStyle() {
      let bg = this.brandBgColor[this.bg].backgroundColor;
      let color = this.brandColor[this.color].color;
      
      let obj = {
        backgroundColor: bg,
        color: color
      };
      
      if (this.fontSize) obj.fontSize = this.fontSize + 'px';
      
      return obj;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.btn-pill {
    width: 128px;
    height: 40px;
    border-radius: 40px;
  }
</style>

