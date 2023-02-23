<template>
<div>
  <div class="flex-justify position-relative"><block-profile-overlay @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockProfileOverlay from "@/components/Components/Block/BlockProfileOverlay/BlockProfileOverlay.vue"

export default {
  name: 'ProfileOverlay',
  components: {
    BlockProfileOverlay
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


