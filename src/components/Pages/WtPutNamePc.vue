<template>
<div>
  <div class="flex-justify position-relative"><block-wt-put-name :value="value" @next="$emit('next')" @end="$emit('end')"/></div>
</div>
</template>
<script>
import BlockWtPutName from "@/components/Components/Block/BlockWtPutName/BlockWtPutName.vue"

export default {
  name: 'WtPutNamePc',
  components: {
    BlockWtPutName
  },
  mixins: [

  ],
  props: {
    value: {
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


