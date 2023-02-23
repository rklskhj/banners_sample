<template>
<div>
  <template v-if="$store.getters.device === 'mobile'">
    <block-review-image-overlay @closePage="$emit('closePage')" :prop="prop"/>
  </template>
  <template v-else>
    <block-review-image-overlay-pc @closePage="$emit('closePage')" :prop="prop"/>
  </template>
</div>
</template>
<script>
import BlockReviewImageOverlay from "@/components/Components/Block/BlockReviewImageOverlay/BlockReviewImageOverlay.vue"
import BlockReviewImageOverlayPc from "@/components/Components/Block/BlockReviewImageOverlayPc/BlockReviewImageOverlayPc.vue"

export default {
  name: 'ReviewImageOverlay',
  components: {
    BlockReviewImageOverlay,
    BlockReviewImageOverlayPc
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


