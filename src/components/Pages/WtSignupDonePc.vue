<template>
<div>
  <div class="flex-justify position-relative"><block-wt-signup-done :value="value" @next="$emit('next')" @end="$emit('end')"/></div>
</div>

</template>
<script>
import BlockWtSignupDone from "@/components/Components/Block/BlockWtSignupDone/BlockWtSignupDone.vue"

export default {
  name: 'WtSignupDonePc',
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


