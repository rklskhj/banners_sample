<template>
<div class="txt-copyright p-sub">Copyright © {{ currentYear }} {{ copyRight }}. All Rights Reserved.<br>Powered by <a style="color: inherit" href="https://launchpack.co.kr/home" target="_blank">Launchpack</a>.</div>
</template>
<script>

export default {
  name: 'StaticText',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "copyRight": "Launchpack Corp",
      "currentYear": "2022"
    }
  },
  created() {
    this.currentYear = new Date().getFullYear();
    if(this.$store.getters.service && this.$store.getters.service.business_info.copyright) {
     this.copyRight = this.$store.getters.service.business_info.copyright; 
    }
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
<style scoped>
.txt-copyright {
    font-size: 12px;
  }
</style>

