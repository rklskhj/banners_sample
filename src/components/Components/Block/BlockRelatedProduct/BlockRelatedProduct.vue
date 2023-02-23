<template>
<div v-if="product.length > 0"> 
  <div class="size-18 weight-500" style="margin-bottom: 16px" :style="brandColor.main">관련 상품</div>

  <div class="list-grid">
    <v1-t-card-product v-for="(item, idx) in product" :key="'item-'+idx"
      :card="item"
      :cardProps="cardProps"></v1-t-card-product>
  </div>
  <!-- <list-horizontal v-if="product.length > 0">
    <div slot="card" class="flex" style="align-items: flex-start">
    </div>
  </list-horizontal> -->
</div>
</template>
<script>
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"

export default {
  name: 'BlockRelatedProduct',
  components: {
    v1TCardProduct
  },
  mixins: [

  ],
  props: {
    product: {
      type: Array,
      required: true,
    },

  },
  data() {
    return {
      "cardProps": {
        "type": "product",
        "visible": {
          "partner": {
            "name": true,
            "address": false,
            "simple_desc": false
          },
          "product": {
            "cart": false,
            "like": true,
            "name": true,
            "rate": false,
            "tags": false,
            "price": {
              "price": true,
              "org_price": false,
              "discount_price": true
            },
            "coupon": false,
            "review": false,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "cardHeight": 330
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      if(!this.product || this.product.length===0) {
        this.$axios.get(`public/board/${this.$route.query.board_id}/post/${this.$route.query.id}`).then(res=>{
          this.product = res.data.product_list ? res.data.product_list : [];
        });
      }
    },
    childStyle(idx) {
      let deco = {};
      if(idx===0) deco.paddingRight = '6px';
      else if(idx=== this.product.length - 1) deco.paddingLeft = '6px';
      else deco.padding = '0 6px';
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.list-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
</style>

