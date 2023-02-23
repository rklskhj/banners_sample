<template>
<div>
  <block-search-overlay @closePage="$emit('closePage')" :prop="prop"/>
</div>

</template>
<script>
import BlockSearchOverlay from "@/components/Components/Block/BlockSearchOverlay/BlockSearchOverlay.vue"

export default {
  name: 'SearchOverlay',
  components: {
    BlockSearchOverlay
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


