<template>
<div>
  <div class="flex-justify position-relative"><block-signout-modal @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockSignoutModal from "@/components/Components/Block/BlockSignoutModal/BlockSignoutModal.vue"

export default {
  name: 'SignoutModal',
  components: {
    BlockSignoutModal
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


