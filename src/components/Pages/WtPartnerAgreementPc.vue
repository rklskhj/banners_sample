<template>
<div>
  <div class="flex-justify position-relative"><block-wt-agreement :value="value" @next="$emit('next')" @end="$emit('end')"/></div>
</div>

</template>
<script>
import BlockWtAgreement from "@/components/Components/Block/BlockWtAgreement/BlockWtAgreement.vue"

export default {
  name: 'WtPartnerAgreementPc',
  components: {
    BlockWtAgreement
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


