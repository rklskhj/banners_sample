<template>
<div>
  <div class="flex-justify position-relative"><block-inquiry-reg-modal @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockInquiryRegModal from "@/components/Components/Block/BlockInquiryRegModal/BlockInquiryRegModal.vue"

export default {
  name: 'InquiryRegModal',
  components: {
    BlockInquiryRegModal
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


