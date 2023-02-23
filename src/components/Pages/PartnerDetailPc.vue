<template>
<div>
  <div class="flex-justify position-relative"><block-partner-detail-card-pc/></div>
  <div class="flex-justify position-relative"><block-partner-detail-tab-pc/></div>

</div>
</template>
<script>
import BlockPartnerDetailCardPc from "@/components/Components/Block/BlockPartnerDetailCard/BlockPartnerDetailCardPc.vue"
import BlockPartnerDetailTabPc from "@/components/Components/Block/BlockPartnerDetailTab/BlockPartnerDetailTabPc.vue"

export default {
  name: 'PartnerDetailPc',
  components: {
    BlockPartnerDetailCardPc,
    BlockPartnerDetailTabPc
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


