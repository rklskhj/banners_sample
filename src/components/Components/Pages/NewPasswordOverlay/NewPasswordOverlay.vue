<template>
<div>
  <div class="flex-justify position-relative"><block-new-password-overlay @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockNewPasswordOverlay from "@/components/Components/Block/BlockNewPasswordOverlay/BlockNewPasswordOverlay.vue"

export default {
  name: 'NewPasswordOverlay',
  components: {
    BlockNewPasswordOverlay
  },
  mixins: [

  ],
  props: {
    prop: {
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


