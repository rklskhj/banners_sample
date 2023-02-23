<template>
<div style="width:100%;padding:80px 0 120px 0;height: 100%;min-height:100vh">
  <div class="p-border-sub p-bg-white radius-12 overflow-hidden" style="margin:auto;width:564px">
    <block-my-page-member></block-my-page-member>
    <block-my-page-menu-member></block-my-page-menu-member>
  </div>
</div>
</template>
<script>
import BlockMyPageMember from "@/components/Components/Block/BlockMypage/BlockMyPageMember.vue"
import BlockMyPageMenuMember from "@/components/Components/Block/BlockMypage/BlockMyPageMenuMember.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockMyPageMemberPc',
  components: {
    BlockMyPageMember,
    BlockMyPageMenuMember
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


