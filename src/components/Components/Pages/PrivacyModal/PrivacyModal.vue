<template>
<div>
  <div class="flex-justify position-relative"><block-privacy-modal @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockPrivacyModal from "@/components/Components/Block/BlockPrivacyModal/BlockPrivacyModal.vue"

export default {
  name: 'PrivacyModal',
  components: {
    BlockPrivacyModal
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


