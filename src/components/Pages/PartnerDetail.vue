<template>
<div>
  <block-partner-detail-card/>
  <block-partner-detail-tab/>

</div>
</template>
<script>
import BlockPartnerDetailCard from "@/components/Components/Block/BlockPartnerDetailCard/BlockPartnerDetailCard.vue"
import BlockPartnerDetailTab from "@/components/Components/Block/BlockPartnerDetailTab/BlockPartnerDetailTab.vue"

export default {
  name: 'PartnerDetail',
  components: {
    BlockPartnerDetailCard,
    BlockPartnerDetailTab
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


