<template>
<div>
  <div class="flex-justify position-relative"><block-wt-verify :value="value" @next="$emit('next')" @end="$emit('end')"/></div>
</div>

</template>
<script>
import BlockWtVerify from "@/components/Components/Block/BlockWtVerify/BlockWtVerify.vue"

export default {
  name: 'WtVerifyPc',
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


