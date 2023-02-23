<template>
  <div v-if="product" ref="cardHeight">
    <div class="full-width"
         :style="[
          brandColor.main,
          pagePadding,
          {borderTop: brandBorder.main.border},
          {borderBottom: brandBorder.main.border}
        ]"
         style="padding-top:12px; padding-bottom:12px;">
      <div class="size-14 weight-500">배송정보</div>
      <div class="size-12">
        <div v-html="deliveryCharge" :style="brandColor.primary"></div>
        <div v-if="product.common_info.delivery_info" v-html="product.common_info.delivery_info"></div>
      </div>
    </div>

    <!-- 주문 버튼 -->
    <div>
      <!-- 옵션 사용 -->
      <div v-if="product.enable_option" style="margin-top:20px" :style="pagePadding">
        <c-input-dropdown
            :style="brandBgColor.sub"
            :options="optionArr1"
            margin-top="0"
            @update:value="selectOption"
            :containerCustomStyle="optionDropdownStyle.container"
            :dropdownCustomStyle="optionDropdownStyle.dropdown"
            placeholder="필수 옵션 선택"
            label="옵션선택(필수)"
            :labelCustomStyle="optionDropdownStyle.label"></c-input-dropdown>
        <div v-if="optionArr2.length>0" style="margin-bottom:16px" :style="pagePadding">
          <c-input-dropdown
              :style="brandBgColor.sub"
              :options="optionArr2"
              margin-top="0"
              @update:value="selectOption"
              :containerCustomStyle="optionDropdownStyle.container"
              :dropdownCustomStyle="optionDropdownStyle.dropdown"
              placeholder="추가 옵션 선택"
              label="추가선택"
              :labelCustomStyle="optionDropdownStyle.label"></c-input-dropdown>
        </div>
      </div>


      <!--이름 수량 가격-->
      <template v-if="order_product!==undefined && product.enable_option">
        <div v-for="(op, idx) in order_product.order_product_option" :key="'op-'+idx"
            class=" size-12"
            :style="[brandColor.sub, {backgroundColor: '#f8f8f8'}, brandBorder.main, radius, selectorStockStyle]"
            style="padding:12px; margin-bottom:12px;">
          <div class="flex-between">
            <div>
              <div class="flex">
                <div v-if="optionType(selectorStocks, op.option_id)===0" style="min-width:53px;">[기본옵션]</div>
                <div v-if="optionType(selectorStocks, op.option_id)===1" style="min-width:53px;">[추가옵션]</div>
                <div style="margin-left:4px">{{ optionName(selectorStocks, op.option_id) }}</div>
              </div>
            </div>
          </div>

          <div class="flex-between">
            <div>
              <div style="margin-top:8px">
                <quantity-input :value.sync="op.quantity" :disabled="true" :inputStyle="optionQuantityStyle.input"
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
      </template>

      <!--자체상품 (옵션 없을 경우)-->
      <div v-if="order_product!==undefined && !product.enable_option">
        <div class="flex-between size-12"
             :style="[brandColor.sub, brandBgColor.white, pagePadding]"
             style="padding: 14px 0;">
          <div class="size-14 weight-500" :style="brandColor.main">수량</div>
          <quantity-input :value.sync="order_product.quantity" :disabled="true" :inputStyle="optionQuantityStyle.input"
                          :btnMinusStyle="optionQuantityStyle.btn" :btnPlusStyle="optionQuantityStyle.btn"></quantity-input>
        </div>
      </div>


      <div :style="[pagePadding, {borderTop: brandBorder.main.border}]" style="padding-top: 16px">
        <div class="flex-between full-width" :style="brandColor.main"
          style="margin-bottom:22px">
          <div class="size-14 weight-500">상품 총액</div>
          <div class="size-18 weight-700">{{ totalPrice | currency }}</div>
        </div>
      </div>

      <div v-if="$store.getters.device === 'mobile' && product.stock_type === 1"
        class="flex-between" :style="pagePadding">
        <btn style="flex:1"
            @clicked="clickOrder"
            :customStyle="customStyle"
            :color="brandColor.white"
            :backgroundColor="brandBgColor.brand"
            :ga="ga">{{ name }}</btn>
        <i class="material-icons flex-center" @click="clickCart" :style="[brandBgColor.sub, brandColor.main]"
           style="margin:0 8px;width: 48px; height: 48px; border-radius: 8px;">shopping_cart</i>
        <icon-circle-share @share="$refs.share.share=true" :style="brandBgColor.sub" color="main"></icon-circle-share>

      </div>

      <div v-else-if="$store.getters.device === 'mobile' && product.stock_type === 0"
        class="flex-between" :style="pagePadding">
        <btn v-if="product.stock > 0" style="flex:1"
            @clicked="clickOrder"
            :customStyle="customStyle"
            :color="brandColor.white"
            :backgroundColor="brandBgColor.brand"
            :ga="ga">{{ name }}</btn>
        <div v-else :style="customSoldoutStyle" style="user-select: none; flex: 1">품절</div>
        <i v-if="product.stock > 0" class="material-icons flex-center" @click="clickCart" :style="[brandBgColor.sub, brandColor.main]"
           style="margin:0 8px;width: 48px; height: 48px; border-radius: 8px;">shopping_cart</i>
        <icon-circle-share @share="$refs.share.share=true" :style="brandBgColor.sub" color="main"></icon-circle-share>

      </div>

      <div v-else-if="$store.getters.device !== 'mobile' && product.stock_type === 1"
        class="flex-between" :style="pagePadding">
        <btn style="flex:1"
          @clicked="clickOrder"
          :customStyle="customStyle"
          :color="brandColor.white"
          :backgroundColor="brandBgColor.brand"
          :ga="ga">{{ name }}</btn>
        <div class="unselect size-14 bold flex-justify" @click="clickCart"
          :style="[brandBgColor.white, brandColor.primary, {border: `1px solid ${brandColor.primary.color}`}]"
          style="margin: 0 8px; width: 108px; height: 48px; border-radius: 8px; align-items: center">장바구니</div>
        <icon-circle-like likeType="product" :style="brandBgColor.sub"
          @liked="res => toggleLike(res)" :menuTitle="menuTitle"></icon-circle-like>
        <!-- <i class="material-icons flex-center" @click="clickCart" :style="[brandBgColor.sub, brandColor.main]"
           style="margin:0 8px;width: 48px; height: 48px; border-radius: 8px;">shopping_cart</i> -->
        <!-- <icon-circle-share @share="$refs.share.share=true" :style="brandBgColor.sub" color="main"></icon-circle-share> -->

      </div>

      <div v-else-if="$store.getters.device !== 'mobile' && product.stock_type === 0"
        class="flex-between" :style="pagePadding">
        <btn v-if="product.stock > 0" style="flex:1"
          @clicked="clickOrder"
          :customStyle="customStyle"
          :color="brandColor.white"
          :backgroundColor="brandBgColor.brand"
          :ga="ga">{{ name }}</btn>
        <div v-else :style="customSoldoutStyle" style="user-select: none; flex: 1">품절</div>
        <div v-if="product.stock > 0" class="unselect size-14 bold flex-justify" @click="clickCart"
          :style="[brandBgColor.white, brandColor.primary, {border: `1px solid ${brandColor.primary.color}`}]"
          style="margin: 0 8px; width: 108px; height: 48px; border-radius: 8px; align-items: center">장바구니</div>
        <icon-circle-like likeType="product" :style="brandBgColor.sub"
          @liked="res => toggleLike(res)" :menuTitle="menuTitle"></icon-circle-like>
        <!-- <i class="material-icons flex-center" @click="clickCart" :style="[brandBgColor.sub, brandColor.main]"
           style="margin:0 8px;width: 48px; height: 48px; border-radius: 8px;">shopping_cart</i> -->
        <!-- <icon-circle-share @share="$refs.share.share=true" :style="brandBgColor.sub" color="main"></icon-circle-share> -->

      </div>
      

    </div>
    <!-- 주문 버튼 END -->
    <share ref="share" v-if="product" :product="product"></share>
  </div>
</template>

<script>
  export default {
    components: {},
    name: "btn-mart",
    props: {
      product: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        default: '주문하기'
      },
      customStyle: {
        type: Object,
        required: false
      },
      menuTitle: {
        type: String,
        required: false
      },
      // Google Analytics 세팅할 경우
      ga: {
        type: Object,
        required: false
      }
    },
    data () {
      return {
        fixedState: false,
        showOption: false,
        order_product: undefined,
        selectorStocks: [],
        deliveryMethodArr: [],
        selectedDeliveryMethod: ""
      }
    },
    created () {
      this.order_product = {
        product_id: this.product.id,
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
        product: this.cloneItem(this.product),
      }
      // 옵션 사용할 경우
      if(this.product.enable_option) this.getSelectorStocks();
      // 자체 상품일 경우
      else this.selectProduct();

      this.initializeDeliveryMethod();


      this.detectClientHeight();
    },
    updated() {
      this.detectClientHeight();
    },
    computed: {
      customSoldoutStyle() {
        let deco = this.cloneItem(this.customStyle);
        deco.backgroundColor = '#222222';
        deco.marginRight = '8px';
        return deco;
      },
      selectorStockStyle() {
        if (this.$store.getters.device === 'mobile') {
          return {
            marginLeft: '16px',
            marginRight: '16px'
          }
        }
      },
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
            backgroundColor: this.brandBgColor.sub,
            color: this.brandColor.main.color,
            height: '32px',
            padding: '12px',
            fontSize: '12px',
            borderRadius: '4px'
          },
          label: {
            backgroundColor: this.brandBgColor.white.backgroundColor,
            fontSize: '14px',
            fontWeight: 500,
            color: this.brandColor.main.color,
            paddingBottom: '4px'
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
      // 속성 옵션
      optionArr1() {
        let options = this.selectorStocks.filter(item=> {
          return item.option_type===0;
        })
        return options;
      },
      // 속성 옵션
      optionArr2() {
        let options = this.selectorStocks.filter(item=> {
          return item.option_type===1;
        })
        return options;
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
        if(this.product.price.is_discount){

          if (this.product.price.discount_rate!==0 && this.product.price.discount_type===0) {
            let discountedPrice = this.product.price.price * (1 - (this.product.price.discount_rate / 100))
            return discountedPrice;
          }
          else if(this.product.price.discount_price!==0 && this.product.price.discount_type===1) {
            return this.product.price.price - this.product.price.discount_price;
          }}
        else return this.product.price.price;
      }
    },
    methods: {
      toggleLike(res) {
        this.$emit('liked', res)
      },
      // 배송유형이 있을 경우 초기화 작업
      initializeDeliveryMethod() {
        let names = [
          { label: 'parcel', value: '택배' },
          { label: 'post', value: '등기 / 소포' },
          { label: 'cargo', value: '화물배송' },
          { label: 'visit', value: '방문수령' },
          { label: 'quick', value: '퀵배송' }
        ]
        // 배송 유형
        let items = this.product.price.delivery_price.delivery_method;
        if(items.length>1) {
          let arr = [];
          items.forEach(item=> {
            arr.push({ label: find(names, 'label', item).value, value: item })
          })
          this.deliveryMethodArr = arr;
        }
        else {
          if(items.length===1) {
            this.deliveryMethodArr = [
              { label: find(names, 'label', items[0]).value, value: items[0] }
            ]
          }
        }
        if(items.length>0) this.selectedDeliveryMethod = items[0]
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
        if(price.is_discount) {
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
        // 회원정보 유무 체크
        let user = this.$store.getters.user;
        //console.log('회원유무', user)
        // if(user.user_id===0) {
        //   this.toast('로그인후 결제하시기 바랍니다.');
        //   return;
        // }
        // 속성옵션 필수값 체크
        if(this.product.enable_option) {
          if(this.order_product.order_product_option.length===0) {
            this.toast('주문할 상품을 선택해주세요.');
            return;
          }

          let isOptionType0 = false;
          this.order_product.order_product_option.some(op=> {
            let ss = find(this.selectorStocks, 'id', op.option_id);
            // 속성옵션 0, 추가옵션 1
            if(ss.option_type===0) isOptionType0 = true;
            return (ss.option_type===0)
          })
          if(!isOptionType0) {
            this.toast('상품 속성 옵션을 선택해주세요.');
            return;
          }
        }

        // 선택된 배송유형
        let order_product = this.cloneItem(this.order_product);
        order_product.delivery_method = this.selectedDeliveryMethod;
        let order = order_product;
        order.uid = this.uuidv4();
        this.$store.commit('setOrder', [order]);
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
      clickCart() {
        if(this.product.enable_option) {
          if(this.order_product.order_product_option.length===0) {
            this.toast('옵션을 선택하세요');
            return;
          }
        }
        let order_product = this.cloneItem(this.order_product);
        // 선택된 배송유형
        order_product.delivery_method = this.selectedDeliveryMethod;
        let cart = order_product;
        cart.uid = this.uuidv4();
        this.$store.commit('setConcatCart', [cart]);
        this.toast('장바구니에 담았습니다.');
        // this.$router.push('cart');
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
    }
  }
</script>

<style scoped>
  .option-modal-wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: flex-end;
  }
  .option-modal {
    width: 100%;
    height: 375px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .option-delete-icon {
    border-radius: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
  }
  .divider {
    width: 100%;
    height: 1px;
    margin: 16px 0;
  }
</style>