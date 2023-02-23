<template>
<div>
  <block-termsofservice-overlay @closePage="$emit('closePage')" :prop="prop"/>
</div>

</template>
<script>
import BlockTermsofserviceOverlay from "@/components/Components/Block/BlockTermsofserviceOverlay/BlockTermsofserviceOverlay.vue"

export default {
  name: 'TermsofserviceOverlay',
  components: {
    BlockTermsofserviceOverlay
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


