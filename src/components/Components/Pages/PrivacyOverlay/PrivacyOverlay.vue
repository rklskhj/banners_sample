<template>
<div>
  <block-privacy-overlay @closePage="$emit('closePage')" :prop="prop"/>
</div>

</template>
<script>
import BlockPrivacyOverlay from "@/components/Components/Block/BlockPrivacyOverlay/BlockPrivacyOverlay.vue"

export default {
  name: 'PrivacyOverlay',
  components: {
    BlockPrivacyOverlay
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


