<template>
<div>
  <div class="flex-justify position-relative"><block-logout-modal @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockLogoutModal from "@/components/Components/Block/BlockLogoutModal/BlockLogoutModal.vue"

export default {
  name: 'LogoutModal',
  components: {
    BlockLogoutModal
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


