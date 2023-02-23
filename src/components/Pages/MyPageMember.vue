<template>
<div>
  <block-my-page-member/>
  <block-my-page-menu-member/>
</div>
</template>
<script>
import BlockMyPageMember from "@/components/Components/Block/BlockMypage/BlockMyPageMember.vue"
import BlockMyPageMenuMember from "@/components/Components/Block/BlockMypage/BlockMyPageMenuMember.vue"

export default {
  name: 'MyPageMember',
  components: {
    BlockMyPageMember,
    BlockMyPageMenuMember
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


