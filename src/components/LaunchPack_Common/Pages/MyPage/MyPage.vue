<template>
<div :style="pageBg">
    <block-drawer-login></block-drawer-login>
  </div>
</template>
<script>
import BlockDrawerLogin from "@/components/LaunchPack_Common/Block/BlockDrawerLogin.vue"
import PageMixin from "@/components/Mixins/PageMixin"

export default {
  name: 'MyPage',
  components: {
    BlockDrawerLogin
  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {

    }
  },
  created() {
    },
  
  methods: {
    
  },
  computed: {
    pageBg() {
      return this.brandBgColor.white;
    }
  },
  watch: {
    
  }
}
</script>


