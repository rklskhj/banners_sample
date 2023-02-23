<template>
<div>
  <div class="flex-justify position-relative"><block-wt-put-email :value="value" @next="$emit('next')" @end="$emit('end')"/></div>
</div>

</template>
<script>
import BlockWtPutEmail from "@/components/Components/Block/BlockWtPutEmail/BlockWtPutEmail.vue"

export default {
  name: 'WtPutEmailPc',
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


