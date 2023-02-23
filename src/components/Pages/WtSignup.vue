<template>
<div>
  <block-wt-signup :value="value" @next="$emit('next')" @end="$emit('end')"/>
</div>

</template>
<script>
import BlockWtSignup from "@/components/Components/Block/BlockWtSignup/BlockWtSignup.vue"

export default {
  name: 'WtSignup',
  components: {
    BlockWtSignup
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


