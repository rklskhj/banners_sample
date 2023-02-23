<template>
  <div>
    <div class="flex-justify position-relative">
      <block-product-detail-card-pc />
    </div>
    <div class="flex-justify position-relative">
      <block-product-detail-tab-pc />
    </div>
  </div>
</template>
<script>
import BlockProductDetailCardPc from "@/components/Components/Block/BlockProductDetailCard/BlockProductDetailCardPc.vue";
import BlockProductDetailTabPc from "@/components/Components/Block/BlockProductDetailTab/BlockProductDetailTabPc.vue";

export default {
  name: "ProductDetailPc",
  components: {
    BlockProductDetailCardPc,
    BlockProductDetailTabPc,
  },
  mixins: [],
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


