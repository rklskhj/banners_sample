<template>
<div>
  <block-all-inquiry @closePage="$emit('closePage')" :prop="prop"/>
</div>
</template>
<script>
import BlockAllInquiry from "@/components/Components/Block/BlockAllInquiry/BlockAllInquiry.vue"

export default {
  name: 'AllInquiryOverlay',
  components: {
    BlockAllInquiry
  },
  mixins: [

  ],
  props: {
    prop: {
      type: Object,
    },

  },
  data() {
    return {

    }
  },
  created() {

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


