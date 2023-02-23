<template>
<div>
  <div class="parBtnDiv flex-align p-bg-white" :style="buttonWidth">
    
    <div v-if="product.isOrderable && product.stock_type === 1"
      class="button unselect flex-center size-14 weight-500 radius-8 p-white p-bg-primary"
      style="width: 100%; height: 48px" @click="buyProduct">바로 구매</div>
    <div v-else-if="product.isOrderable && product.stock_type === 0 && product.stock > 0"
      class="button unselect flex-center size-14 weight-500 radius-8 p-white p-bg-primary"
      style="width: 100%; height: 48px" @click="buyProduct">바로 구매</div>
    <div v-if="product.isOrderable && product.stock_type === 1" @click="clickCart"
      class="button unselect flex-center size-14 weight-500 radius-8 p-white p-bg-white p-brand p-border-brand"
      style="width: 100%; height: 48px; margin-left: 8px">장바구니</div>
    <div v-if="product.isOrderable && product.stock_type === 0 && product.stock > 0" @click="clickCart"
      class="button unselect flex-center size-14 weight-500 radius-8 p-white p-bg-white p-brand p-border-brand"
      style="width: 100%; height: 48px; margin-left: 8px">장바구니</div>
    <div v-else-if="product.isOrderable && product.stock_type === 0 && product.stock <= 0" @click="toast('품절된 상품입니다.')"
      class="button unselect flex-center size-14 weight-500 radius-8 p-white" style="width: 100%; height: 48px; background-color: #222222">품절</div>
    <div v-else-if="product.isOrderable === false" @click="toast('해당 지점에서는 구매가 불가능한 상품입니다.')"
      class="button unselect flex-center size-14 weight-500 radius-8 p-white" style="width: 100%; height: 48px; background-color: #222222">구매 불가</div>
  </div>
  
  <block-product-option v-if="showOption" :product="product" :type="type" @closePage="closePage"></block-product-option>
</div>
</template>
<script>
import BlockProductOption from "@/components/Components/Block/BlockProductOption/BlockProductOption.vue"

export default {
  name: 'ButtonMart',
  components: {
    BlockProductOption
  },
  mixins: [

  ],
  props: {
    ga: {
      type: Object,
      required: false,
    },
    name: {
      type: String,
      default: "주문하기",
    },
    usePopup: {
      type: Boolean,
      default: false,
      required: false,
    },
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "type": "order",
      "product": undefined,
      "showOption": false,
      "childProduct": []
    }
  },
  created() {
    this.getData();
  },
  mounted() {
      // document.addEventListener('scroll', this.detectClientHeight);
    },
  updated() {
      
    },
  beforeDestroy() {
    // document.removeEventListener('scroll', this.detectClientHeight);
    this.unlock(document.querySelector('html'));
    this.unlock(document.querySelector('body'));
    this.showOption = false;
  },
  
  methods: {
    getData() {
      let getChildrenUrl = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}`
      getChildrenUrl += `?fields=children,rate,id&hit=false`
      this.$axios.get(getChildrenUrl).then(res => {
        let children = res.data.children;
        let index = children.findIndex(item => item.partner_id === this.$store.getters.defaultPartner.id);
        this.parentProd = {
          id: res.data.id,
          rate: res.data.rate
        }
        if (index !== -1) {
          this.productId = children[index].id;
        } else {
          this.productId = this.$route.query.id;
        }
        
        let url = `/user/${this.user.user_id}/mapping/product/${this.productId}`
        url += `?fields=id,parent,img,name,simple_desc,tags,form,order_conversion_type,category1,category2,category3`
        url += `,rate,stock,stock_type,input,like_count,reviews_count,visit,price,related_products,selectors`
        url += `,minimum,maximum,partner,address,dong,distance,params,imgs,common_info,info,operating_time,phone,params,location,enable_option,enable_prod&hit=false`
        this.$axios.get(url).then(res => {
          res.data.info = res.data.info.replace(/<img /gi, '<img style="margin:0 -16px;max-width:100vw" ');
          if (Number(this.productId) !== Number(this.$route.query.id)) {
            res.data.isOrderable = true;
          } else {
            res.data.isOrderable = false;
          }
          this.detail = res.data;
          this.$store.getters.brand.image_rates_field.forEach(rate => {
            if (rate.type === 'product_card') {
              this.imageRates = rate;
            }
          })
        });
      })
    },
    closePage() {
      this.showOption = false;
      this.unlock(document.querySelector('html'));
      this.unlock(document.querySelector('body'));
    },
    lock(element) {
      element.style.overflow = 'hidden';
      element.style.touchAction = 'none';
    },
    unlock(element) {
      element.style.removeProperty('overflow');
      element.style.removeProperty('touch-action');
    },
    buyProduct() {
      // this.$root.$emit('page_actionsheet', 'ProductOptionSheet', {product: this.product});
      this.showOption = true;
      this.type = 'order';
      this.lock(document.querySelector('html'));
      this.lock(document.querySelector('body'));
    },
    async clickCart() {
      if (this.product.enable_option) {
        this.toast('이 상품은 옵션이 있는 상품입니다. 옵션 선택 후 장바구니에 담을 수 있습니다.')
        this.showOption = true;
        this.type = 'cart';
        this.lock(document.querySelector('html'));
        this.lock(document.querySelector('body'));
      } else {
        let order_product = {
          product_id: Number(this.productId),
          name: this.product.name,
          quantity: 1,
          comm_price: 0,
          point: 0,
          discount_price: 0,
          total_price: 0,
          coupon_price: 0,
          img: this.product.img,
          delivery_price: this.product.price.delivery_price,
          order_product_option: [],
          product: this.cloneItem(this.product)
        }
        
        let comm_price = 0;
        let point_price = 0;
        let discount_price = 0;
        let price = this.product.price;
        let product_price = price.price;
        
        // 속성 옵션일 경우 상품가격 + 옵션가
        // 0: 비율, 1: 금액
        // 수수료, 포인트, 할인 계산
        if(price.is_point) {
          if(price.point_type===0) point_price = product_price * price.point_rate / 100;
          else point_price = price.point;
        }
        if(this.isDiscount) {
          if(price.discount_type===0) discount_price = product_price * price.discount_rate / 100;
          else discount_price = price.discount_price;
        }
        if(price.is_comm) {
          if(price.comm_type===0) comm_price = product_price * price.comm_rate / 100;
          else comm_price = price.comm_price;
        }

        order_product.comm_price = comm_price;
        order_product.point = point_price;
        order_product.discount_price = discount_price;
        order_product.product_price = product_price;
        order_product.total_price = product_price - discount_price;
        
        order_product.delivery_method = 'quick';
        order_product.uid = this.uuidv4();
        await this.$store.dispatch('syncCart', this);
        let cart = this.$store.getters.cart;
        let index = cart.findIndex(item => item.product_id === order_product.product_id);
        if (index !== -1) {
          cart[index].quantity += 1;
          this.$store.commit('setCart', cart);
          this.$root.$emit('cart_popup', '이미 장바구니에 동일한 상품이 있어 수량이 추가되었습니다.')
        } else {
          this.$store.commit('setConcatCart', [order_product]);
          this.$root.$emit('cart_popup', '장바구니에 상품을 담았습니다.')
        }
        await this.$store.dispatch('syncPostCart', this);
        
      }
    }
  },
  computed: {
    buttonWidth() {
      return `width:${this.$store.getters.deviceWidth}px`;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.parBtnDiv {
  position:fixed;
  bottom: 0;
  padding: 10px 16px;
  height: 68px;
  z-index: 101;
}
</style>

