<template>
<div style="width:100%;padding:80px 0 120px 0;height:100%;min-height:100vh;">
  <div class="p-border-sub p-bg-white radius-12 overflow-hidden" style="margin:auto;width:564px">
    <block-my-page-guest></block-my-page-guest>
    <block-my-page-menu></block-my-page-menu>
  </div>
</div>
</template>
<script>
import BlockMyPageGuest from "@/components/Components/Block/BlockMypage/BlockMyPageGuest.vue"
import BlockMyPageMenu from "@/components/Components/Block/BlockMypage/BlockMyPageMenu.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockMyPageGuestPc',
  components: {
    BlockMyPageGuest,
    BlockMyPageMenu
  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "styles": {
        "backgroundColor": "brandBgColor.sub"
      }
    }
  },
  created() {
  },
  mounted() {
    this.setBg();
  },
  
  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.styles.backgroundColor);
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


