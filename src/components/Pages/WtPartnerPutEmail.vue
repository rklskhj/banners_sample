<template>
<div>
  <block-wt-put-email :value="value" @next="$emit('next')" @end="$emit('end')"/>
</div>

</template>
<script>
import BlockWtPutEmail from "@/components/Components/Block/BlockWtPutEmail/BlockWtPutEmail.vue"

export default {
  name: 'WtPartnerPutEmail',
  components: {
    BlockWtPutEmail
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


