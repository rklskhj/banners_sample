<template>
<div>
  <div class="flex-justify position-relative"><block-wt-signup :value="value" @next="$emit('next')" @end="$emit('end')"/></div>
</div>

</template>
<script>
import BlockWtSignup from "@/components/Components/Block/BlockWtSignup/BlockWtSignup.vue"

export default {
  name: 'WtSignupPc',
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


