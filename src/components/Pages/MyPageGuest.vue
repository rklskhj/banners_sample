<template>
<div>
  <block-my-page-guest/>
  <block-my-page-menu/>
</div>

</template>
<script>
import BlockMyPageGuest from "@/components/Components/Block/BlockMypage/BlockMyPageGuest.vue"
import BlockMyPageMenu from "@/components/Components/Block/BlockMypage/BlockMyPageMenu.vue"

export default {
  name: 'MyPageGuest',
  components: {
    BlockMyPageGuest,
    BlockMyPageMenu
  },
  mixins: [

  ],
  props: {

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


