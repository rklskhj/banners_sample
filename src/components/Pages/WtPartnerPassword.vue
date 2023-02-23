<template>
<div>
  <block-wt-password :value="value" @next="$emit('next')" @end="$emit('end')"/>
</div>
</template>
<script>
import BlockWtPassword from "@/components/Components/Block/BlockWtPassword/BlockWtPassword.vue"

export default {
  name: 'WtPartnerPassword',
  components: {
    BlockWtPassword
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


