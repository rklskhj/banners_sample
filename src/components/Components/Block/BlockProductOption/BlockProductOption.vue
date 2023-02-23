<template>
<section>
  <div style="position: fixed; border-radius: 20px 20px 0 0; z-index: 9999; overflow: hidden; left: 0; bottom: 0; width: 100%; transition: transform 0.3s ease; will-change: transform"
  :style="brandBgColor.white">
  
  
  <div :style="pagePadding">
    <div class="full-width flex-justify">
      <i @click="$emit('closePage')" class="material-icons unselect">keyboard_arrow_down</i>
    </div>
    
    <div v-if="product" ref="cardHeight">
      <!-- 주문 버튼 -->
      <div>
        <!-- 옵션 사용 -->
        <div v-if="product.enable_option" style="margin-top: 12px">
          <div v-for="(selector, s_idx) in optionArr1" :key="`option1-${s_idx}`">
            <c-input-dropdown
              :ref="`optionArr1`"
              :options="selector.options"
              margin-top="0"
              @update:value="val=>selectOption1(val, selector)"
              :containerCustomStyle="optionDropdownStyle.container"
              :dropdownCustomStyle="optionDropdownStyle.dropdown"
              placeholder="필수 옵션 선택"
              :label="`*${selector.name}`"
              :disabled="selector.disabled"
              :customDropdownWrapStyle="{display: 'flex', alignItems: 'center'}"
              :labelCustomStyle="optionDropdownStyle.label"></c-input-dropdown>
          </div>
          <div v-for="(selector, s_idx) in optionArr2" :key="`option2-${s_idx}`" style="margin-bottom:16px">
            <c-input-dropdown
              :options="selector.options"
              margin-top="0"
              @update:value="val=>selectOption2(val, selector)"
              :containerCustomStyle="optionDropdownStyle.container"
              :dropdownCustomStyle="optionDropdownStyle.dropdown"
              placeholder="추가 옵션 선택"
              :label="selector.name"
              :customDropdownWrapStyle="{display: 'flex', alignItems: 'center'}"
              :labelCustomStyle="optionDropdownStyle.label"></c-input-dropdown>
          </div>
        </div>
        <div v-if="order_product!==undefined && product.enable_option" style="max-height: 170px; overflow-y: auto">
          <!--이름 수량 가격-->
          <div
              v-for="(op, idx) in order_product.order_product_option" :key="'op-'+idx"
              class=" size-12"
              :style="[brandColor.sub, {backgroundColor: '#f8f8f8'}, brandBorder.main, radius]"
              style="padding:12px; margin-bottom:12px;">
            <div class="flex-between">
              <div>
                <div class="flex">
                  <div v-if="optionType(selectorStocks, op.option_id)===0" style="min-width:53px;">[필수옵션]</div>
                  <div v-if="optionType(selectorStocks, op.option_id)===1" style="min-width:53px;">[추가옵션]</div>
                  <div style="margin-left:4px">{{ optionName(selectorStocks, op.option_id) }}</div>
                </div>
              </div>
            </div>
    
            <div class="flex-between">
              <div>
                <div style="margin-top:8px">
                  <quantity-input :value.sync="op.quantity" :disabled="true" :inputStyle="optionQuantityStyle.input" :max="maximum"
                                  :btnMinusStyle="optionQuantityStyle.btn" :btnPlusStyle="optionQuantityStyle.btn"></quantity-input>
                </div>
              </div>
    
              <div class="flex-end">
                <div class="size-16 weight-700" :style="brandColor.main">
                  {{ optionPrice(selectorStocks, op.option_id) * op.quantity | currency }}
                </div>
                <div class="option-delete-icon unselect" :style="brandBgColor.brand">
                  <i v-if="op.option_id" class="material-icons size-16"
                     :style="brandColor.white" @click="deleteOrderProduct(idx)">close</i>
                </div>
              </div>
            </div>
          </div>
          <!-- 품절된 옵션 목록 -->
          <div
            v-for="(op, idx) in soldout_options" :key="'op-'+idx"
            class=" size-12"
            :style="[brandColor.sub, {backgroundColor: '#f8f8f8'}, brandBorder.main, radius]"
            style="padding:12px; margin-bottom:12px;">
            <div class="flex-between">
              <div>
                <div class="flex">
                  <div v-if="optionType(selectorStocks, op.option_id)===0" style="min-width:53px;">[필수옵션]</div>
                  <div v-if="optionType(selectorStocks, op.option_id)===1" style="min-width:53px;">[추가옵션]</div>
                  <div style="margin-left:4px">{{ optionName(selectorStocks, op.option_id) }}</div>
                </div>
              </div>
            </div>
  
            <div class="flex-between">
              <div>
                <div style="margin-top:8px">
                  <quantity-input :value.sync="op.quantity" :disabled="true" :inputStyle="optionQuantityStyle.input" :max="maximum"
                                  :btnMinusStyle="optionQuantityStyle.btn" :btnPlusStyle="optionQuantityStyle.btn"></quantity-input>
                </div>
              </div>
  
              <div class="flex-end">
                <div class="size-16 weight-700" :style="brandColor.main">품절</div>
                <div class="option-delete-icon unselect" :style="brandBgColor.brand">
                  <i v-if="op.option_id" class="material-icons size-16"
                     :style="brandColor.white" @click="soldout_options.remove(idx)">close</i>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!--자체상품 (옵션 없을 경우)-->
        <div v-if="order_product!==undefined && !product.enable_option">
          <div class="flex-between size-12"
               :style="[brandColor.sub, brandBgColor.white]"
               style="padding: 14px 0;">
            <div class="size-14 weight-500" :style="brandColor.main">수량</div>
            <quantity-input :value.sync="order_product.quantity" :disabled="true" :inputStyle="optionQuantityStyle.input" :max="maximum"
                            :btnMinusStyle="optionQuantityStyle.btn" :btnPlusStyle="optionQuantityStyle.btn"></quantity-input>
          </div>
        </div>
  
  
        <div :style="[{borderTop: brandBorder.main.border}]"
        :class="{'flex-between': order_product !== undefined && product.enable_option, 'flex-end': order_product !== undefined && !product.enable_option}"
        style="padding-top: 16px; padding-bottom:22px">
          <div v-if="order_product!==undefined && product.enable_option" class="flex-between" :style="brandColor.main">
            <div class="size-14">총 수량</div>
            <div class="size-14 weight-500" style="margin-left: 8px">{{ totalQuantity }}개</div>
          </div>
          <div class="flex-between" :style="brandColor.main">
            <div class="size-14">주문 합계</div>
            <div class="size-16 weight-500" style="margin-left: 8px">{{ totalPrice | currency }}</div>
          </div>
        </div>
  
      </div>
    </div>
    
    
    <div v-if="type === 'order'" @click="clickOrder" style="margin-top: 10px; margin-bottom: 10px"
      class="button unselect flex size-14 weight-500 helpBtn" :style="brandBgColor.primary">바로 구매</div>
      
    <div v-if="product.enable_option && type === 'cart'" @click="clickCart" style="margin-top: 10px; margin-bottom: 10px"
      class="button unselect flex size-14 weight-500 helpBtn"
      :style="[brandBgColor.white, brandColor.brand, {border: `1px solid ${brandColor.brand.color}`}]">장바구니</div>
  </div>
  
</div>
<div @click="$emit('closePage')"
  style="position: fixed; top: 0; left: 0; z-index: 999; background: rgba(11, 10, 12, 0.35); width: 100%; height: 100%; opacity: 1"></div>
</section>
</template>
<script>
import FormMixin from "@/components/Components/Mixins/FormMixin"

export default {
  name: 'BlockProductOption',
  components: {

  },
  mixins: [
    FormMixin
  ],
  props: {
    type: {
      type: String,
    },
    product: {
      type: Object,
    },

  },
  data() {
    return {
      "maximum": undefined,
      "fixedState": false,
      "optionArr1": [],
      "optionArr2": [],
      "showOption": false,
      "formTypeData": {
        "box": "round",
        "list": "vertical",
        "align": "block",
        "input": "round",
        "label": false,
        "button": "round",
        "dropdown": "list",
        "inputIcon": false
      },
      "order_product": undefined,
      "selectorStocks": [],
      "soldout_options": [],
      "deliveryMethodArr": [],
      "requiredOptionsValue": [],
      "selectedDeliveryMethod": "quick"
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.maximum = this.product.maximum;
  },
  
  methods: {
    init() {
      this.order_product = {
        product_id: this.product.id,
        name: this.product.name,
        quantity: 1,
        comm_price: 0,
        point: 0,
        discount_price: 0,
        total_price: 0,
        img: this.product.img,
        delivery_price: this.product.price.delivery_price,
        order_product_option: [],
        product: this.product,
      }
      // 옵션 사용할 경우
      if(this.product.enable_option) this.getSelectorStocks();
      // 자체 상품일 경우
      else this.selectProduct();
      this.initOptions();
    },
    deleteOrderProduct(idx) {
      this.order_product.order_product_option.remove(idx);
    },
    //상품 선택
    selectProduct() {
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

      this.order_product.comm_price = comm_price;
      this.order_product.point = point_price;
      this.order_product.discount_price = discount_price;
      this.order_product.product_price = product_price;
      console.log('product_price', product_price)
      this.order_product.total_price = product_price - discount_price;
    },
    // 옵션 가져오기
    getSelectorStocks() {
      if(this.product.id) {
        this.$axios.post(`public/product/${this.product.id}/selector_stocks`)
          .then( res => {
            res.data.stocks.forEach(stock => {
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

              this.order_product.comm_price = comm_price;
              this.order_product.point = point_price;
              this.order_product.discount_price = discount_price;
              this.order_product.product_price = product_price;
            })
            this.selectorStocks = res.data.stocks;
            this.order_product.selectorStocks = res.data.stocks;
          });
      }
    },
    // 상품옵션 선택
    selectOption(value) {
      // order_product 중복 체크 후(option id체크) 있을 경우 종료
      let op = find(this.order_product.order_product_option, 'option_id', value);
      if(op) return;

      let total_price = 0;
      let comm_price = 0;
      let point_price = 0;
      let discount_price = 0;
      let price = this.product.price;

      this.selectorStocks.forEach(selector=> {
        if(selector.id===value) {
          // console.log('옵션가',selector.price);
          // console.log('상품가',price.price);
          // 속성 옵션일 경우 상품가격 + 옵션가
          if(selector.option_type===0) total_price = selector.price + price.price;
          else total_price = selector.price;
          // 0: 비율, 1: 금액
          // 수수료, 포인트, 할인 계산
          if(price.point_type===0) point_price = total_price * price.point_rate / 100;
          else point_price = price.point;
          if(price.discount_type===0) discount_price = total_price * price.discount_rate / 100;
          else discount_price = price.discount_price;
          if(price.comm_type===0) comm_price = total_price * price.comm_rate / 100;
          else comm_price = price.comm_price;

          let order_product_option = {
            option_id: selector.id,
            quantity: 1
          }

          this.order_product.order_product_option.push(order_product_option);
          // console.log('확인', this.order_product);
        }
      })

    },
    // 주문하기
    clickOrder() {
      
      let user = this.$store.getters.user;
      if (user.user_id === 0) {
        this.toast('로그인후 결제하시기 바랍니다.');
        this.routerPush('/signin');
        return;
      }
      
      // 속성옵션 필수값 체크
      if(this.product.enable_option) {
        if(this.order_product.order_product_option.length===0) {
          this.toast('주문할 상품을 선택해주세요.');
          return;
        }

        // let isOptionType0 = false;
        // this.order_product.order_product_option.some(op=> {
        //   let ss = find(this.selectorStocks, 'id', op.option_id);
        //   // 속성옵션 0, 추가옵션 1
        //   if(ss.option_type===0) isOptionType0 = true;
        //   return (ss.option_type===0)
        // })
        let selectedOption1 = [];
        this.order_product.order_product_option.forEach(op => {
          let item = find(this.selectorStocks, 'id', op.option_id);
          if (item.option_type === 0) {
            selectedOption1.push(item);
          }
        })
        // console.log('selectedOption1', selectedOption1)
        if (this.optionArr1.length !== 0 && selectedOption1.length === 0) {
          this.toast('상품 필수 옵션을 선택해주세요.');
          return;
        }
        
        // if(!isOptionType0) {
        //   this.toast('상품 속성 옵션을 선택해주세요.');
        //   return;
        // }
      }

      // 선택된 배송유형
      let order_product = this.cloneItem(this.order_product);
      order_product.delivery_method = this.selectedDeliveryMethod;
      let order = order_product;
      order.uid = this.uuidv4();
      this.$store.commit('setOrder', [order]);
      this.$emit('closePage');
      this.$router.push('order');
    },
    detectClientHeight() {
      this.$nextTick(function() {
        if(this.$refs.cardHeight) {
          if (document.documentElement.scrollTop > this.$refs.cardHeight.clientHeight) {
            this.fixedState = true;
            this.$emit('fixedState', true);
          }
          else {
            this.fixedState = false;
            this.$emit('fixedState', false);
          }
        }
      })
    },
    // 장바구니 넣기
    async clickCart() {
      if(this.product.enable_option) {
        if(this.order_product.order_product_option.length===0) {
          this.toast('옵션을 선택하세요');
          return;
        }
      }
      let order_product = this.cloneItem(this.order_product);
      order_product.uid = this.uuidv4();
      // 선택된 배송유형
      order_product.delivery_method = this.selectedDeliveryMethod;

      await this.$store.dispatch('syncCart', this);
      let cart = this.$store.getters.cart;
      let order_product_option = order_product.order_product_option;
      let index = cart.findIndex(item => item.product_id === order_product.product_id);
      if (index !== -1) {
        let item = cart[index];
        
        order_product_option.forEach(option => {
          let idx = item.order_product_option.findIndex(item => item.option_id === option.option_id);
          
          if (idx !== -1) {
            if (order_product_option[idx].quantity !== 1) {
              cart[index].order_product_option[idx].quantity += order_product_option[idx].quantity;
            } else {
              cart[index].order_product_option[idx].quantity += 1;
            }
            this.$store.commit('setCart', cart);
            this.$root.$emit('cart_popup', '이미 장바구니에 동일한 상품이 있어 수량이 추가되었습니다.')
          } else {
            cart[index].order_product_option.push(option);
            this.$store.commit('setCart', cart);
            this.$root.$emit('cart_popup', '이미 장바구니에 동일한 상품이 있어 수량이 추가되었습니다.')
          }
        })
        
      } else {
        this.$store.commit('setConcatCart', [order_product]);
        this.$root.$emit('cart_popup', '장바구니에 상품을 담았습니다.')
      }
      await this.$store.dispatch('syncPostCart', this);
    },
    optionType(selectorStocks, option_id) {
      if(!selectorStocks) return;
      let stock = find(selectorStocks, 'id', option_id);
      if (stock) return stock.option_type;
    },
    optionName(selectorStocks, option_id) {
      if(!selectorStocks) return;
      let stock = find(selectorStocks, 'id', option_id);
      if (stock) return stock.price > 0 ? `${stock.name}: +${stock.price}원` : `${stock.name}: ${stock.price}원`;
    },
    optionPrice(selectorStocks, option_id) {
      if(!selectorStocks) return;
      let stock = find(selectorStocks, 'id', option_id);
      if (stock) return stock.price;
    },
    // 필수옵션 선택
      selectOption1(option_id, selector) {
        // option_id: stocks의 id, selector: this.selectos의 item
        if(!option_id) return;
        let selector_item = find(this.requiredOptionsValue, 'selector_id', selector.id);
        let selectorIndex = this.optionArr1.findIndex(item => item.id===selector.id)
        if(selectorIndex+1<this.optionArr1.length) {
          this.optionArr1[selectorIndex+1].disabled = false;
        }
        if (!selector_item) {
          this.requiredOptionsValue.push({
            selector_id: selector.id,
            option_id: option_id
          });
        } else {
          selector_item.option_id = option_id
        }
        // 마지막 필수 옵션이 선택되었다면
        if(selectorIndex+1===this.optionArr1.length) {
          this.optionArr1.forEach(item => { item.disabled = true; });
          this.optionArr1[0].disabled = false;
          for(let item of this.$refs.optionArr1) {
            item.selectedValue = '';
          }
          let selectedOptions = [];
          this.requiredOptionsValue.forEach(item => {
            selectedOptions.push(item.option_id);
          })
          selectedOptions.sort(function(a,b) {
            return a-b;
          })
          // 주문 상품 추가 (order_product_option)
          for(const stock of this.selectorStocks) {
            stock.options.sort(function(a,b) {
              return a-b;
            })
            // 재고 배열에서 선택된 옵션 조합들을 찾으면 재고 id를 order_product_option에 추가
            if(JSON.stringify(stock.options)===JSON.stringify(selectedOptions)) {
              let option = find(this.order_product.order_product_option, 'option_id', stock.id);
              if(option) {
                let optionIndex = this.order_product.order_product_option.findIndex(item => item.option_id===stock.id)
                this.order_product.order_product_option[optionIndex].quantity += 1;
              }
              else {
                this.pushOption(stock);
              }
              break;
            }
          }
          this.requiredOptionsValue = [];
        }
      },
    // 추가옵션 선택
      selectOption2(option_id) {
        console.log(option_id)
        if(!option_id) return;
        for(const stock of this.selectorStocks) {
          if(stock.options[0]===option_id) {
            let option = find(this.order_product.order_product_option, 'option_id', stock.id);
            if(option) {
              let optionIndex = this.order_product.order_product_option.findIndex(item => item.option_id===stock.id)
              this.order_product.order_product_option[optionIndex].quantity += 1;
            }
            else {
              this.pushOption(stock);
            }
            break;
          }
        }
      },
    pushOption(opt) {
      let stock = this.selectorStocks.filter(item => { return item.id === opt.id })[0];
      if(stock.soldout) {
        if(this.soldout_options.findIndex(item => { return item.option_id ===  opt.id}) === -1) {
          this.soldout_options.push({
            option_id: opt.id,
            status: '품절'
          });
        }
      }
      else {
        this.order_product.order_product_option.push({option_id: opt.id, quantity: 1});
      }
    },
    initOptions() {
      let selectors = this.cloneItem(this.product.selectors)
      this.optionArr1 = selectors.filter(item => {
        item.disabled = true;
        return item.option_type===0;
      })
      if(this.optionArr1.length>0) {
        this.optionArr1[0].disabled = false;
      }
      this.optionArr2 = selectors.filter(item => {
        return item.option_type===1;
      })

    }
  },
  computed: {
    quanStyle() {
      return {
        borderBottom: `1px solid ${this.getColor('기본 테두리선 색상')}`
      }
    },
    optionDropdownStyle() {
      return {
        container: {
          margin: '0 0 8px 0'
        },
        dropdown: {
          color: this.brandColor.main.color,
          height: '32px',
          padding: '12px',
          fontSize: '12px',
          borderRadius: '4px',
          border: this.brandBorder.main.border,
          width: 'calc(100% - 100px)'
        },
        label: {
          backgroundColor: this.brandBgColor.white.backgroundColor,
          fontSize: '14px',
          fontWeight: 500,
          color: this.brandColor.main.color,
        }
      }
    },
    optionQuantityStyle() {
      return {
        input: {
          width: '48px',
          height: '24px',
          backgroundColor: '',
          border: 'none',
          textAlign: 'center',
          fontSize: '14px',
          color: this.brandColor.main.color,
          fontWeight: '700',
          fontFamily: 'Noto Sans CJK KR'
        },
        btn: {
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          color: this.brandColor.main.color,
          borderRadius: '4px',
          width: '24px',
          height: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '16px'
        }
      }
    },
    imgStyle() {
      return {
        width: '100%',
        height: '256px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url("${this.product.img}")`
      }
    },
    arrowLeftStyle() {
      return {
        top: 'calc(50% - 20px)',
        color: 'white',
        left: '12px',
        fontSize: '40px',
      }
    },
    arrowRightStyle() {
      return {
        top: 'calc(50% - 20px)',
        color: 'white',
        right: '12px',
        fontSize: '40px',
      }
    },
    computedPrice() {
      if(this.product.price.discount_type===1) {
        return this.product.price.price - this.product.price.discount_price;
      }
      else if(this.product.price.discount_type===0) {
        return this.product.price.price * (1 - (this.product.price.discount_rate / 100));
      }
    },
    deliveryCharge() {
      let delivery = this.product.price.delivery_price;
      let type = delivery.delivery_type;
      let result = ''
      switch (type) {
        // 고정배송비
        case 0:
          result = `<div>${delivery.fix_price}원</div>`;
          break;
        // 배송비 무료
        case 1:
          result = '<div>배송비 무료</div>';
          break;
        // 금액별 배송비
        case 2:
          let arr_price_charge = delivery.delivery_price_setting.sort((a,b) => {return a.min<b.min ? -1 : a.min>b.min ? 1 : 0})
          let str_price_charge = '';
          for(let i=0; i<arr_price_charge.length; i++) {
            let item = arr_price_charge[i];
            let price_price_charge = 0;
            if (item.price!==undefined) price_price_charge = item.price;
            else if (item.parcel_price!==undefined) price_price_charge = item.parcel_price;
            if (i===arr_price_charge.length-1) {
              str_price_charge += `<div>${item.min}원 이상 ~ <b>${price_price_charge}원</b></div>`;
            }
            else {
              str_price_charge += `<div>${item.min}원 이상 ${item.max}원 미만 <b>${price_price_charge}원</b></div>`;
            }
          }
          result = str_price_charge;
          break;
        // 수량별 배송비
        case 3:
          let arr_quantity_charge = delivery.delivery_price_setting.sort((a,b) => {return a.min<b.min ? -1 : a.min>b.min ? 1 : 0})
          let str_quantity_charge = '';
          for(let i=0; i<arr_quantity_charge.length; i++) {
            let item = arr_quantity_charge[i];
            let price_quantity_charge = 0;
            if (item.price!==undefined) price_quantity_charge = item.price;
            else if (item.parcel_price!==undefined) price_quantity_charge = item.parcel_price;
            if (i===arr_quantity_charge.length-1) {
              str_quantity_charge += `<div>${item.min}개 이상 ~ <b>${price_quantity_charge}원</b></div>`;
            }
            else {
              str_quantity_charge += `<div>${item.min}개 이상 ${item.max}개 미만 <b>${price_quantity_charge}원</b></div>`;
            }
          }
          result = str_quantity_charge;
          break;
      }
      return result;
    },
    totalQuantity() {
      if (this.order_product.order_product_option.length === 0) {
        return 0;
      } else {
        let quantity = 0;
        this.order_product.order_product_option.forEach(item => {
          quantity += item.quantity;
        })
        return quantity;
      }
    },
    totalPrice() {
      // console.log('전체 ',this.order_product)
      let totalPrice = 0;
      if(!this.order_product) return 0
      if(this.product.enable_option) {
        this.order_product.order_product_option.forEach(item=> {
          let op = find(this.selectorStocks, 'id', item.option_id);
          if(op!==undefined) {
            // 속성 옵션
            if(op.option_type===0) {
              totalPrice += (this.discountedPrice + op.price) * parseInt(item.quantity)
            }
            else totalPrice += op.price * parseInt(item.quantity)
          }
        })
      }
      else {
        totalPrice =this.discountedPrice * this.order_product.quantity;
      }
      return totalPrice;
    },
    discountedPrice() {
      if(this.isDiscount){

        if (this.product.price.discount_rate!==0 && this.product.price.discount_type===0) {
          let discountedPrice = this.product.price.price * (1 - (this.product.price.discount_rate / 100))
          return discountedPrice;
        }
        else if(this.product.price.discount_price!==0 && this.product.price.discount_type===1) {
          return this.product.price.price - this.product.price.discount_price;
        }}
      else return this.product.price.price;
    },
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
          return true;
        }
      } else {
        return false;
      }
    }
  },
  watch: {
    product(n) {
      this.init();
    }
  }
}
</script>

<style>
.option-delete-icon {
    border-radius: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
  }

.helpBtn {
  border-radius: 8px;
  height: 42px;
  color: white;
  justify-content: center;
  align-items: center;
}
</style>
