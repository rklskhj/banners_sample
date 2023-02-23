<template>
<div :style="pcMaxWidth">
    <e-editor v-if="company_desc" :html="company_desc"></e-editor>
  </div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockCompanyPc',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "company_desc": undefined
    }
  },
  created() {
    this.$axios.get(`public/service/info`)
    .then(res => {
      this.company_desc = res.data.company_desc;
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


