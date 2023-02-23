<template>
<div v-if="product.length > 0" :style="pcMaxWidth">
  <div class="flex-between full-width">
    <div style="margin-bottom: 16px; padding-top: 14px">
      <div class="size-22 weight-700" :style="brandColor.main">관련 상품</div>
    </div>
    <div class="flex">
      <i class="material-icons slide-arrow flex-center unselect" @click="$refs.slick.prev()">chevron_left</i>
      <i class="material-icons slide-arrow flex-center unselect" @click="$refs.slick.next()" style="margin-left:8px">chevron_right</i>
    </div>
  </div>
  <div class="full-width" style="height: 263px">
    <slick ref="slick" v-if="reRender && product && product.length" :options="slickOptions" style="height: 100%">
      <div v-for="(item,idx) in product"
        :key="`card-${item.id}`">
        <v1-t-card-product-pc
          :card="item"
          style="width: 172px"
          :style="childStyle(idx)"
          :cardProps="cardProps"></v1-t-card-product-pc>
      </div>
    </slick>
  </div>
</div>
</template>
<script>
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"

export default {
  name: 'BlockRelatedProductPc',
  components: {
    v1TCardProductPc
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
      "reRender": true,
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
      "slickOptions": {
        "dots": false,
        "arrows": false,
        "autoplay": false,
        "infinite": false,
        "centerMode": false,
        "slidesToShow": 6,
        "autoplaySpeed": "",
        "centerPadding": "",
        "variableWidth": true,
        "slidesToScroll": 1
      }
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
    reRenderSlick() {
      if(this.reRender === false) return;

      this.$nextTick(() => {
        this.reRender = false;
        setTimeout(() => {
          this.reRender = true;
          let currIndex = this.$refs.slick.currentSlide();

          this.$refs.slick.destroy()
          this.$nextTick(() => {
            this.$refs.slick.create()
            this.$refs.slick.goTo(currIndex, true)
          })
          this.vDelay = true;
          
        },500);
      });
    },
    childStyle(idx) {
      let deco = {
        margin: '0 12px'
      };
      if (idx === 0) {
        deco.marginLeft = '0px';
      } else if (idx === this.product.length - 1) {
        deco.marginRight = '0px';
      }
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    product() {
      this.reRenderSlick();
    }
  }
}
</script>


