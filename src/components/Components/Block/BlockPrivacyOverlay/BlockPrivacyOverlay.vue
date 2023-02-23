<template>
<div>
  <page-header>
    <div slot="right">
      <i class="material-icons header-icon" @click="clickClose" style="margin: 0 10px;">close</i>
    </div>
    <span class="header-title" slot="center">개인정보처리방침</span>
  </page-header>
  <div :style="[pageBg, pagePadding]" style="overflow-y:auto;padding-top:50px;height:100vh">
    <e-editor v-if="term" :html="term"></e-editor>
  </div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockPrivacyOverlay',
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
      "term": undefined
    }
  },
  created() {
      this.$axios.get(`public/policy`)
      .then(res => {
        this.term = res.data.policy.term;
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


