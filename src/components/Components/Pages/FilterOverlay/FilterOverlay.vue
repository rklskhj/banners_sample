<template>
<div>
  <block-filter-overlay @closePage="$emit('closePage')" :prop="prop"/>
</div>

</template>
<script>
import BlockFilterOverlay from "@/components/Components/Block/BlockFilter/BlockFilterOverlay.vue"

export default {
  name: 'FilterOverlay',
  components: {
    BlockFilterOverlay
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


