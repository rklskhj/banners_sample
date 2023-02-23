<template>
<div>
  <block-partner-search-map-overlay @closePage="$emit('closePage')" :prop="prop"/>
</div>

</template>
<script>
import BlockPartnerSearchMapOverlay from "@/components/Components/Block/BlockPartnerSearchMapOverlay/BlockPartnerSearchMapOverlay.vue"

export default {
  name: 'PartnerSearchMapOverlay',
  components: {
    BlockPartnerSearchMapOverlay
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


