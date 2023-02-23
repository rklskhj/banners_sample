<template>
<div>
  <div class="flex-justify position-relative"><block-review-reg-modal @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockReviewRegModal from "@/components/Components/Block/BlockReviewRegModal/BlockReviewRegModal.vue"

export default {
  name: 'ReviewRegModal',
  components: {
    BlockReviewRegModal
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


