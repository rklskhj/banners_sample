<template>
<div>
  <block-category-overlay @closePage="$emit('closePage')" :prop="prop"/>
</div>

</template>
<script>
import BlockCategoryOverlay from "@/components/Components/Block/BlockCategoryOverlay/BlockCategoryOverlay.vue"

export default {
  name: 'CategoryOverlay',
  components: {
    BlockCategoryOverlay
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


