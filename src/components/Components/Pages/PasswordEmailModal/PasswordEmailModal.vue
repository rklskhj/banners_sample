<template>
<div>
  <div class="flex-justify position-relative"><block-password-email @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockPasswordEmail from "@/components/Components/Block/BlockPasswordEmail.vue"

export default {
  name: 'PasswordEmailModal',
  components: {
    BlockPasswordEmail
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


