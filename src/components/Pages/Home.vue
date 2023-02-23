<template>
<div>
  <tp230131183120-t-block-blank/>
  <t4tp230131182921-t-block-text/>
  <t5tp230131183140-t-block-menu/>
  <block-banner/>
  <t1-t-block-home-product/>
  <t2-t-block-home-product/>
		<tp230131184512-t-block-banner/>
  <block-bookmarked/>
  <t1tp221115213550-t-block-exhibition-common/>
  <block-home-partner-near-me/>
  <t4-t-block-home-event/>

</div>
</template>
<script>
import tp230131183120TBlockBlank from "@/components/Components/Block/BlockBlank/tp230131183120/BlockBlank.vue"
import t4tp230131182921TBlockText from "@/components/Components/Block/BlockText/t4tp230131182921/BlockText.vue"
import t5tp230131183140TBlockMenu from "@/components/Components/Block/BlockMenu/t5tp230131183140/BlockMenu.vue"
import BlockBanner from "@/components/Components/Block/BlockBanner/BlockBanner.vue"
import t1TBlockHomeProduct from "@/components/Components/Block/BlockHomeProduct/t1/BlockHomeProduct.vue"
import t2TBlockHomeProduct from "@/components/Components/Block/BlockHomeProduct/t2/BlockHomeProduct.vue"
import tp230131184512TBlockBanner from "@/components/Components/Block/BlockBanner/tp230131184512/BlockBanner.vue"
import BlockBookmarked from "@/components/Components/Block/BlockBookmarked/BlockBookmarked.vue"
import t1tp221115213550TBlockExhibitionCommon from "@/components/Components/Block/t1tp221115213550/BlockExhibitionCommon.vue"
import BlockHomePartnerNearMe from "@/components/Components/Block/BlockHomePartnerNearMe/BlockHomePartnerNearMe.vue"
import t4TBlockHomeEvent from "@/components/Components/Block/BlockHomeEvent/t4/BlockHomeEvent.vue"

export default {
  name: 'Home',
  components: {
    tp230131183120TBlockBlank,
    t4tp230131182921TBlockText,
    t5tp230131183140TBlockMenu,
    BlockBanner,
    t1TBlockHomeProduct,
    t2TBlockHomeProduct,
    tp230131184512TBlockBanner,
    BlockBookmarked,
    t1tp221115213550TBlockExhibitionCommon,
    BlockHomePartnerNearMe,
    t4TBlockHomeEvent
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "deleted": []
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


