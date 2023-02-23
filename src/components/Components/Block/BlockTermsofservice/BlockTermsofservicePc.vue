<template>
<div :style="pcMaxWidth" style="padding-top:40px">
  <div class="size-22 weight-500 margin-bottom-32 text-center" :style="brandColor.main">이용약관</div>
  <e-editor v-if="limit" :html="limit" style="padding:0"></e-editor>
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockTermsofservicePc',
  components: {

  },
  mixins: [
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
    this.getData();  
  },
  
  methods: {
    getData() {
      this.$axios.get(`public/policy`)
      .then(res => {
        this.limit = res.data.policy.limit;
      })
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


