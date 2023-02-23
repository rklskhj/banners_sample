<template>
<div>
  <div class="flex-justify position-relative"><block-filter-modal @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockFilterModal from "@/components/Components/Block/BlockFilter/BlockFilterModal.vue"

export default {
  name: 'FilterModal',
  components: {
    BlockFilterModal
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


