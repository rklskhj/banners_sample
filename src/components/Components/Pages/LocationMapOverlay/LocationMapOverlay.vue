<template>
<div>
  <block-location-map-overlay @closePage="$emit('closePage')" :prop="prop"/>
</div>

</template>
<script>
import BlockLocationMapOverlay from "@/components/Components/Block/BlockLocationMapOverlay/BlockLocationMapOverlay.vue"

export default {
  name: 'LocationMapOverlay',
  components: {
    BlockLocationMapOverlay
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


