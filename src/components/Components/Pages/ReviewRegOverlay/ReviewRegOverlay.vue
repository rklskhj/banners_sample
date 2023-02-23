<template>
<div><block-review-reg-overlay @closePage="$emit('closePage')" :prop="prop"/></div>
</template>
<script>
import BlockReviewRegOverlay from "@/components/Components/Block/BlockReviewRegOverlay/BlockReviewRegOverlay.vue"

export default {
  name: 'ReviewRegOverlay',
  components: {
    BlockReviewRegOverlay
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


