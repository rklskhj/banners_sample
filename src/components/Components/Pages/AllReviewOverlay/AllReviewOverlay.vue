<template>
<div>
  <block-all-review @closePage="$emit('closePage')" :prop="prop"/>
</div>
</template>
<script>
import BlockAllReview from "@/components/Components/Block/BlockAllReview/BlockAllReview.vue"

export default {
  name: 'AllReviewOverlay',
  components: {
    BlockAllReview
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


