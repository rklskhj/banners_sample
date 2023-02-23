<template>
<div v-if="showBtn">
  <div v-if="product && product.price.price_type === 0"
  class="parBtnDiv flex-align p-bg-white" :style="buttonWidth">
    
    <btn 
          @clicked="buyProduct"
          :customStyle="customStyle"
          :backgroundColor="isBtnEnable ? brandBgColor.primary : brandBtn.bg.gray"
          :ga="ga" class="p-white"
      >{{ isBtnEnable ? name : '품절' }}</btn>
      <button-inquirying v-if="product"
        :product="product" text="문의하기"
        :style="inquiryBtnStyle"></button-inquirying>
  </div>
  <portal to="double-layer-modal">
    <block-option-choose-action-sheet v-if="product"
      :product="product"
      :isDiscount="isDiscount"
      :optionState="optionState"
      :vDim="vDim"
      @closePage="clickBack"></block-option-choose-action-sheet>
  </portal>
  
  <!--<block-product-option v-if="showOption" :product="product" :type="type" @closePage="closePage"></block-product-option>-->
</div>
</template>
<script>
import ButtonInquirying from "@/components/Components/Button/ButtonInquirying.vue"
import BlockOptionChooseActionSheet from "@/components/Components/Block/BlockOptionChooseActionSheet/BlockOptionChooseActionSheet.vue"

export default {
  name: 'ButtonDelivery',
  components: {
    ButtonInquirying,
    BlockOptionChooseActionSheet
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
      "vDim": false,
      "product": undefined,
      "showBtn": false,
      "showOption": false,
      "optionState": false,
      "childProduct": [],
      "selectorStocks": undefined
    }
  },
  created() {
    this.getData();
    this.getSelectorStocks();
    window.onpopstate = () => {
      this.vDim = false;
      if (this.$store.getters.popstate[0] === 'push option') {
        this.unlock(document.querySelector('html'));
        this.unlock(document.querySelector('body'));
        this.$store.commit('removePopstate');
      }
    } 
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
      let url = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}`
      url += `?fields=id,parent,img,name,simple_desc,tags,form,order_conversion_type,category1,category2,category3,inquiry_conversion_type`
      url += `,rate,stock,stock_type,input,like_count,reviews_count,visit,price,related_products,selectors,sns_inquiry_type`
      url += `,minimum,maximum,partner,address,dong,distance,params,imgs,common_info,info,operating_time,phone,params,location,enable_option,enable_prod`
      url += '&hit=false';
      this.$axios.get(url).then(res => {
        res.data.info = res.data.info.replace(/<img /gi, '<img style="margin:0 -16px;max-width:100vw" ');
        res.data.isOrderable = true;
        this.product = res.data;
        
        if (this.product.price.price_type === 0) {
          this.showBtn = true;
        } else if (this.product.price.price_type !== 0 && this.product.inquiry_conversion_type > 0) {
          this.showBtn = true;
        } else if (this.product.price.price_type !== 0 && this.product.inquiry_conversion_type === 0) {
          this.showBtn = false;
        }
      });
    },
    getSelectorStocks() {
      this.$axios.post(`public/product/${this.$route.query.id}/selector_stocks`)
      .then(res => {
        this.selectorStocks = res.data.stocks;
      });
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
      if (!this.isBtnEnable) return;
      // this.$root.$emit('page_actionsheet', 'ProductOptionDeliverySheet', {"prop": {product: this.product}});
      history.pushState('push option', '');
      this.$store.commit('setPopstate', 'push option');
      this.optionState = true;
      this.lock(document.querySelector('html'));
      this.lock(document.querySelector('body'));
    },
    clickBack() {
      history.back();
      this.unlock(document.querySelector('html'));
      this.unlock(document.querySelector('body'));
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
    isDiscount() {
      if (this.product.price.is_discount) {
        if (this.product.price.discount_period_type === false) {
          if (this.product.price.discount_start !== null && this.product.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.product.price.discount_start || currentDate > this.product.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else if (this.product.price.discount_start !== null && this.product.price.discount_end === null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.product.price.discount_start) {
              return false;
            } else {
              return true;
            }
          } else if (this.product.price.discount_start === null && this.product.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate > this.product.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          let resv = this.$store.getters.selectedResv;
          if (resv) {
            if (!resv.period) {
              if (!resv.all_time) {
                let index = this.product.discount_time.findIndex(item => {
                  return item.start_time === resv.start_time && item.end_time === resv.end_time
                })
                if (index > -1) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }            
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    buttonWidth() {
      return {
        width: this.$store.getters.deviceWidth + 'px'
      }
    },
    inquiryBtnStyle() {
      let deco = {
        marginLeft: '8px',
        width: '50%'
      }
      if (this.product.price.price_type !== 0 && this.product.inquiry_conversion_type > 0) {
        deco.marginLeft = '0px';
        deco.width = '100%';
      }
      return deco;
    },
    isBtnEnable() {
      if (this.product.stock_type === 0 && this.product.stock === 0 && !this.product.enable_option) {
        return false;
      } else if (this.product.enable_option) {
        return this.selectorStocks.filter(stock => stock.option_type === 0 && stock.enable_stock && stock.stock === 0).length !== this.selectorStocks.filter(stock => stock.option_type === 0).length
      } else {
        return true;
      }
    }
  },
  watch: {
    optionState(n) {
      if(n) {
        setTimeout(()=>{
          this.vDim = n;
        },300);
      }
    },
    vDim(n) {
      if(!n) {
        setTimeout(()=>{
          this.optionState = n;
        },100);
      }
    }
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

