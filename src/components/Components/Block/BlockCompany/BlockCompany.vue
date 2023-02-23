<template>
<div :style="pagePadding">
  <e-editor v-if="company_desc_mobile" :html="company_desc_mobile"></e-editor>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockCompany',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "company_desc_mobile": undefined
    }
  },
  created() {
    this.$axios.get(`public/service/info`)
    .then(res => {
      this.company_desc_mobile = res.data.company_desc_mobile;
    })
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
.e-editor.sun-editor-editable {
    padding: 16px 0;
  }
</style>

