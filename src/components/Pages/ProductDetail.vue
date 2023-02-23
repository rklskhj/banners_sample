<template>
<div>
  <t1-t-block-product-detail-card/>
  <block-product-detail-tab/>
  <block-product-detail-bottom-btn/>

</div>
</template>
<script>
import t1TBlockProductDetailCard from "@/components/Components/Block/BlockProductDetailCard/t1/BlockProductDetailCard.vue"
import BlockProductDetailTab from "@/components/Components/Block/BlockProductDetailTab/BlockProductDetailTab.vue"
import BlockProductDetailBottomBtn from "@/components/Components/Block/BlockProductDetailBottomBtn/BlockProductDetailBottomBtn.vue"

export default {
  name: 'ProductDetail',
  components: {
    t1TBlockProductDetailCard,
    BlockProductDetailTab,
    BlockProductDetailBottomBtn
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


