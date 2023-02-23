<template>
<div>
  <div class="flex-justify position-relative"><block-termsofservice-modal @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockTermsofserviceModal from "@/components/Components/Block/BlockTermsofserviceModal/BlockTermsofserviceModal.vue"

export default {
  name: 'TermsofserviceModal',
  components: {
    BlockTermsofserviceModal
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


