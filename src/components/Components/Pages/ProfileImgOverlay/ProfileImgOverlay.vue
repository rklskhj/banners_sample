<template>
<div>
  <div class="flex-justify position-relative"><block-profile-img-overlay @closePage="$emit('closePage')" :prop="prop"/></div>
</div>

</template>
<script>
import BlockProfileImgOverlay from "@/components/Components/Block/BlockProfileImgOverlay/BlockProfileImgOverlay.vue"

export default {
  name: 'ProfileImgOverlay',
  components: {
    BlockProfileImgOverlay
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


