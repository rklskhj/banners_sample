<template>
<div>
  <block-wt-signup-done :value="value" @next="$emit('next')" @end="$emit('end')"/>
</div>

</template>
<script>
import BlockWtSignupDone from "@/components/Components/Block/BlockWtSignupDone/BlockWtSignupDone.vue"

export default {
  name: 'WtSignupDone',
  components: {
    BlockWtSignupDone
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


