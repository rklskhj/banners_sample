<template>
<div>
   <img :src="img" alt="splash" class="img-splash"> 
  </div>
</template>
<script>

export default {
  name: 'BlockSplash',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {

    }
  },
  mounted() {
      setTimeout(()=>{
        this.routerPush(this.$store.getters.brand.startpage);
      }, 1700);
    },
  
  methods: {
    
  },
  computed: {
    img() {
        return this.$store.getters.brand.splash;
      }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.img-splash {
  object-fit: contain;
  width: 100%;
  height: 100vh;
}
</style>

