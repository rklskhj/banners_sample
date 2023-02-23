<template>
<div>
  <page-header>
    <div slot="right">
      <i class="material-icons header-icon" @click="clickClose" style="margin: 0 10px;">close</i>
    </div>
    <span class="header-title" slot="center">이용약관</span>
  </page-header>
  <div :style="[pageBg, pagePadding]" style="overflow-y:auto;padding-top:50px;height:100vh">
    <e-editor v-if="limit" :html="limit"></e-editor>
  </div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockTermsofserviceOverlay',
  components: {

  },
  mixins: [
    PageMixin,
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "limit": undefined
    }
  },
  created() {
      this.$axios.get(`public/policy`)
      .then(res => {
        this.limit = res.data.policy.limit;
      })
    },
  
  methods: {
    clickClose() {
      this.$emit('closePage');
    }
  },
  computed: {
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    
  }
}
</script>


