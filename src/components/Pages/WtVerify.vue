<template>
<div>
  <block-wt-verify :value="value" @next="$emit('next')" @end="$emit('end')"/>
</div>

</template>
<script>
import BlockWtVerify from "@/components/Components/Block/BlockWtVerify/BlockWtVerify.vue"

export default {
  name: 'WtVerify',
  components: {
    BlockWtVerify
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


