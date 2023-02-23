<template>
<div v-if="product && product.price.price_type === 0" ref="cardHeight" style="padding-top: 16px">
      <div class="full-width p-border-top-sub p-border-bottom-sub"
        style="padding: 12px 0">
        <div class="flex" style="align-items: flex-start">
          <div class="size-14 weight-500 col-3 p-sub">배송정보</div>
          <div class="size-14 weight-500 col-9 p-primary">
            <div v-html="deliveryCharge"></div>
            <div v-if="product.common_info.delivery_info" v-html="product.common_info.delivery_info"></div>
          </div>
          
        </div>
      </div>
  
      <!-- 주문 버튼 -->
      <div>
        <div style="padding: 32px 0">
          <!-- 옵션 사용 -->
          <div v-if="product.enable_option">
            <div v-for="(selector, s_idx) in optionArr1" :key="'option1-'+s_idx"
              :style="{marginBottom: s_idx !== optionArr1.length - 1 ? '8px' : '0px'}">
              <c-input-dropdown
                  :ref="'optionArr1'"
                  :options="selector.options"
                  :selectorStocks="selectorStocks"
                  margin-top="0"
                  optionType="delivery"
                  @update:value="val => selectOption1(val, selector)"
                  :containerCustomStyle="optionDropdownStyle.container"
                  :dropdownCustomStyle="optionDropdownStyle.dropdown"
                  :dropListCustomStyle="optionDropdownStyle.dropList"
                  :dropItemCustomStyle="optionDropdownStyle.dropItem"
                  :placeholder="selector.name"
                  label=""
                  :disabled="selector.disabled"
                  :labelCustomStyle="optionDropdownStyle.label"></c-input-dropdown>
              
            </div>
                
            <div v-if="optionArr2.length>0" style="margin-top:24px">
              <div v-for="(selector, s_idx) in optionArr2" :key="'option2-'+s_idx"
                :style="{marginBottom: s_idx !== optionArr2.length - 1 ? '8px' : '0px'}">
                <c-input-dropdown
                    :options="selector.options"
                    :selectorStocks="selectorStocks"
                    margin-top="0"
                    optionType="delivery"
                    @update:value="val => selectOption2(val, selector)"
                    :containerCustomStyle="optionDropdownStyle.container"
                    :dropdownCustomStyle="optionDropdownStyle.dropdown"
                    :dropListCustomStyle="optionDropdownStyle.dropList"
                    :dropItemCustomStyle="optionDropdownStyle.dropItem"
                    :placeholder="selector.name"
                    label="추가 옵션"
                    :labelCustomStyle="optionDropdownStyle.label"></c-input-dropdown>
              </div>
            </div>
          </div>
    
          <!--이름 수량 가격-->
          <div v-if="order_product!==undefined && product.enable_option && order_product.order_product_option.length > 0"
            style="margin-top: 32px">
            <div
              v-for="(op, idx) in order_product.order_product_option" :key="'op-'+idx"
              class=" size-14 p-sub p-bg-sub radius-8"
              :style="selectorStockStyle(idx)"
              style="padding:16px">
              <div class="flex-between">
                <div>
                  <div class="flex">
                    <div v-if="optionType(selectorStocks, op.option_id)===0" style="min-width:53px;">[기본옵션]</div>
                    <div v-if="optionType(selectorStocks, op.option_id)===1" style="min-width:53px;">[추가옵션]</div>
                    <div style="margin-left:4px">{{ optionName(selectorStocks, op.option_id) }}</div>
                  </div>
                </div>
                <div class="unselect p-help">
                  <i v-if="op.option_id" class="material-icons size-16"
                    @click="deleteOrderProduct(idx)">close</i>
                </div>
              </div>
      
              <div class="flex-between" style="margin-top:14px; align-items: flex-end">
                <div>
                  <div>
                    <quantity-input :value.sync="op.quantity" :disabled="true"
                      :inputStyle="optionQuantityStyle(order_product, op).input"
                      :min="computedQuantity(op).min" :max="computedQuantity(op).max"
                      :btnMinusStyle="optionQuantityStyle(order_product, op).btnMinus"
                      :btnPlusStyle="optionQuantityStyle(order_product, op).btnPlus"></quantity-input>
                  </div>
                </div>
      
                <div class="flex-end">
                  <div class="size-18 weight-500 p-main">
                    {{ optionPrice(selectorStocks, op.option_id) * op.quantity | currencyNum }}<span class="size-16">원</span>
                  </div>
                  
                </div>
              </div>
            </div>
            
          </div>
    
          <!--자체상품 (옵션 없을 경우)-->
          <div v-if="order_product!==undefined && !product.enable_option">
            <div class="flex-between size-12 radius-8 p-sub p-bg-sub"
              :style="pagePaddingAll">
              <quantity-input :value.sync="order_product.quantity" :disabled="true"
                :inputStyle="optionQuantityStyle(order_product).input"
                :min="product.minimum" :max="product.stock_type === 1 ? product.maximum : product.stock"
                :btnMinusStyle="optionQuantityStyle(order_product).btnMinus" 
                :btnPlusStyle="optionQuantityStyle(order_product).btnPlus"></quantity-input>
              <div class="size-18 weight-500 p-main">
                {{ discountedPrice  * order_product.quantity | currencyNum }}<span class="size-16">원</span></div>
            </div>
          </div>
        </div>
  
  
        <div class="p-border-top-sub" style="padding-top: 16px">
          <div class="flex-end full-width p-main">
            <div class="size-14 weight-500 p-sub">총 금액</div>
            <div class="size-28 weight-700" style="margin-left: 16px">
              {{ totalPrice | currencyNum }}<span class="size-18 weight-500">원</span></div>
          </div>
        </div>
  
        <div style="margin-top: 16px">
          <div class="flex-align full-width">
            <div v-if="isBtnEnable" class="unselect size-18 bold flex-justify p-bg-white p-primary p-border-primary radius-8" @click="clickCart"
              style="margin-right: 16px; width:100%; height: 56px; align-items: center">장바구니</div>
            <btn @clicked="clickOrder"
              :customStyle="customStyle"
              :backgroundColor="isBtnEnable ? brandBgColor.primary : brandBtn.bg.gray"
              :ga="ga">{{ isBtnEnable ? name : '품절' }}</btn>
            
          </div>
        </div>
  
      </div>
      <!-- 주문 버튼 END -->
      <share ref="share" v-if="product" :product="product"></share>
    </div>
</template>
<script>

export default {
  name: 'ButtonDeliveryPc',
  components: {

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
      default: "바로 구매하기",
    },
    product: {
      type: Object,
      required: true,
    },
    isDiscount: {
      type: Boolean,
    },
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "fixedState": false,
      "optionArr1": [],
      "optionArr2": [],
      "showOption": false,
      "order_product": undefined,
      "ordered_count": 0,
      "selectorStocks": [],
      "deliveryMethodArr": [],
      "requiredOptionsValue": [],
      "selectedDeliveryMethod": ""
    }
  },
  created() {
        this.order_product = {
          product_id: this.product.id,
          name: this.product.name,
          quantity: this.product.enable_option ? 1 : this.product.minimum,
          comm_price: 0,
          point: 0,
          discount_price: 0,
          total_price: 0,
          coupon_price: 0,
          img: this.product.img,
          delivery_price: this.product.price.delivery_price,
          order_product_option: [],
          product: this.cloneItem(this.product),
          option_id: 0
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
  
  methods: {
    optionMaximum(op) {
        let selectorStock = '';
        let maximum = '';
        this.selectorStocks.forEach(item => {
          if (item.id === op.option_id) {
            selectorStock = item;
            if (!selectorStock.enable_stock) {
              maximum = this.product.maximum;
            } else {
              maximum = selectorStock.stock;
            }
  
          } else {
            maximum = this.product.maximum;
          }
        })
        return maximum;
      },
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
          this.order_product.total_price = product_price - discount_price;
        },
    // 옵션 가져오기
        async getSelectorStocks() {
          if(this.product.id) {
            let res = await this.$axios.post(`public/product/${this.product.id}/selector_stocks`)
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
              this.order_product.total_price = product_price - discount_price;
            })
            this.selectorStocks = res.data.stocks;
            this.order_product.selectorStocks = res.data.stocks;
            
            let selectors = this.cloneItem(this.product.selectors)
            selectors.forEach(i => i.options.forEach(opt => {
              opt.minimum = i.minimum;
              opt.maximum = i.maximum;
              opt.enable_stock = this.selectorStocks.filter(sel => sel.options.indexOf(opt.id) > -1)[0].enable_stock
            }))
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
                  if (this.order_product.order_product_option[optionIndex].quantity + 1 > this.order_product.order_product_option[optionIndex].max) {
                    this.toast('최대 주문 수량 한도보다 많이 지정할 수 없습니다.');
                    return;
                  } else {
                    this.order_product.order_product_option[optionIndex].quantity += 1;
                  }
                }
                else {
                  this.ordered_count = 0;
                  let opt1 = this.product.selectors.filter(item=>{ return item.option_type === 0 })[0];
                  this.order_product.order_product_option.forEach(opt=>{
                    if(opt.option_type === 0)
                      this.ordered_count += opt.quantity;
                  });
                  if(opt1.maximum <= this.ordered_count) {
                    this.toast(`최대 ${opt1.maximum}개까지 주문할 수 있습니다.`);
                  } else {
                    this.pushOption(stock);
                  }
                }
                break;
              }
            }
            this.requiredOptionsValue = [];
          }
        },
    // 추가옵션 선택
        selectOption2(option_id) {
          if(!option_id) return;
          for(const stock of this.selectorStocks) {
            if(stock.options[0]===option_id) {
              let option = find(this.order_product.order_product_option, 'option_id', stock.id);
              if(option) {
                let optionIndex = this.order_product.order_product_option.findIndex(item => item.option_id===stock.id)
                if (this.order_product.order_product_option[optionIndex].quantity + 1 > this.order_product.order_product_option[optionIndex].max) {
                  this.toast('최대 주문 수량 한도보다 많이 지정할 수 없습니다.');
                  return;
                } else {
                  this.order_product.order_product_option[optionIndex].quantity += 1;
                }
              }
              else {
                this.pushOption(stock);
              }
              break;
            }
          }
        },
    // 옵션 추가시 재고 여부, 판매 가능 여부에 따라 추가
        pushOption(opt) {
          let price = this.product.price.price;
          if (this.isDiscount) {
            price = this.product.price.sale_price;
          }
          let stock = this.selectorStocks.filter(item => { return item.id === opt.id })[0];
          // let selector = this.product.selectors.filter(s => s.options.findIndex(option => option.id === opt.id) > -1)[0];
          let selector = this.product.selectors.filter(s => s.options.findIndex(option => option.id === opt.options.find(i => i === option.id)) > -1)[0];
          if(stock.soldout) {
            if(this.soldout_options.findIndex(item => { return item.option_id ===  opt.id}) === -1) {
              this.soldout_options.push({
                option_id: opt.id,
                status: '품절'
              });
            }
          }
          else {
            console.log(opt, 'opt')
            if (opt.option_type === 1) {
              if (this.optionArr1.length > 0) {
                let index = this.order_product.order_product_option.findIndex(option => option.option_type === 0);
                if (index === -1) {
                  this.toast('필수 옵션을 먼저 선택해주세요.');
                  return;
                } else {
                  this.order_product.option_id = opt.id;
                  this.order_product.order_product_option.push({
                    option_id: opt.id,
                    quantity: selector.minimum,
                    max: stock.enable_stock && stock.stock < selector.maximum ? stock.stock : selector.maximum,
                    option_type: opt.option_type,
                    name: opt.name,
                    total_price: opt.price
                  });
                }
              } else {
                this.order_product.option_id = opt.id;
                this.order_product.order_product_option.push({
                  option_id: opt.id,
                  quantity: selector.minimum,
                  max: stock.enable_stock && stock.stock < selector.maximum ? stock.stock : selector.maximum,
                  option_type: opt.option_type,
                  name: opt.name,
                  total_price: opt.price
                });
              }
            } else {
              this.order_product.option_id = opt.id;
              this.order_product.order_product_option.push({
                option_id: opt.id,
                quantity: selector.minimum,
                max: stock.enable_stock && stock.stock < selector.maximum ? stock.stock : selector.maximum,
                option_type: opt.option_type,
                name: opt.name,
                total_price: opt.price + price
              });
            }
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
                name: selector.name,
                quantity: 1
              }
  
              this.order_product.order_product_option.push(order_product_option);
              // console.log('확인', this.order_product);
            }
          })
  
        },
    // 주문하기
        clickOrder() {
          if (!this.isBtnEnable) return;
          // 회원정보 유무 체크
          let user = this.$store.getters.user;
          //console.log('회원유무', user)
          if(user.user_id===0) {
            this.toast('로그인후 결제하시기 바랍니다.');
            this.routerPush('/signin');
            return;
          }
          // 속성옵션 필수값 체크
          if(this.product.enable_option && this.optionArr1.length > 0) {
            if(this.order_product.order_product_option.length===0) {
              this.toast('상품 옵션을 선택해주세요.');
              return;
            }
  
            // let isOptionType0 = false;
            // this.order_product.order_product_option.some(op=> {
            //   let ss = find(this.selectorStocks, 'id', op.option_id);
            //   // 속성옵션 0, 추가옵션 1
            //   if(ss.option_type===0) isOptionType0 = true;
            //   return (ss.option_type===0)
            // })
            // if(!isOptionType0) {
            //   this.toast('상품 속성 옵션을 선택해주세요.');
            //   return;
            // }
            
            let selectedOption1 = [];
            this.order_product.order_product_option.forEach(op => {
              let item = find(this.selectorStocks, 'id', op.option_id);
              if (item.option_type === 0) {
                selectedOption1.push(item);
              }
            })
            if (this.optionArr1.length > 0 && selectedOption1.length === 0) {
              this.toast('상품 필수 옵션을 선택해주세요.');
              return;
            }
          }
  
          // 선택된 배송유형
          let order_product = this.cloneItem(this.order_product);
          if (order_product.discount_price > 0) {
            order_product.total_price += order_product.discount_price;
          }
          order_product.delivery_method = this.selectedDeliveryMethod;
          let order = order_product;
          if (order_product.order_product_option.length > 0) {
            let arr = [];
            
            order_product.order_product_option.forEach(item => {
              let op = this.cloneItem(order_product)
              op.uid = this.uuidv4();
              if (item.option_type === 0) {
                op.order_product_option = [item]
                arr.push(op)
              } else {
                arr[0].order_product_option.push(item)
              }
            })
            if (arr.length > 0) {
              this.$store.commit('setOrder', arr)
            }
          } else {
            order.uid = this.uuidv4();
            this.$store.commit('setOrder', [order]);
          }
          this.routerPush('order_delivery');
          // this.$router.push('order');
        },
    clickInquiry() {
        this.routerPush(`inquiry_reg?product_id=${this.product.id}`)
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
    optId(item) {
          if (item.order_product_option.length > 0) {
            // 옵션id, 옵션 타입 순으로 정렬 후, 상품아이디 앞에 놓고 문자열 변환
            let id = item.order_product_option.sort((a,b) => a.option_id - b.option_id)
              .sort((a,b) => a.option_type - b.option_type).reduce((a,c) => 
              a.concat(c.option_id), []);
            id.unshift(item.product_id)
            return id.toString();
            
          } else {
            return item.product_id.toString();
          }
        },
    divideOptionType(op) {
          if(op.order_product_option.length>0) {
            return op.order_product_option.filter(i => i.option_type === 0).map((i,index) => {
              let item = this.cloneItem(op);
              item.order_product_option = [];
              if(index === 0) {
                item.order_product_option = [i, ...op.order_product_option.filter(j => j.option_type === 1)];
              } else {
                item.order_product_option = [i];
              }
              return item;
            });
          } else {
            return [op];
          }
        },
    // 장바구니 넣기
        async clickCart() {
          if(this.product.enable_option && this.optionArr1.length > 0) {
            if(this.order_product.order_product_option.length === 0) {
              this.toast('상품 옵션을 선택해주세요.');
              return;
            }
          }
          let order_product = this.cloneItem(this.order_product);
          // 선택된 배송유형
          order_product.delivery_method = this.selectedDeliveryMethod;
          order_product.uid = this.uuidv4();
          // 필수옵션 복수 여부에 따라서 나눠서 가져오기
          let products = this.divideOptionType(order_product);
          products.forEach(i => {
            i.opt_id = this.optId(i);
          });
  
          await this.$store.dispatch('syncCart', this);
          
          let cart = this.$store.getters.cart;
          products.forEach(prod => {
            // opt_id 같은 상품 찾아서, 있으면 수량 추가하고 없으면 장바구니 자체에 항목 추가
            let index = cart.findIndex(i => i.opt_id === prod.opt_id);
            if (index > -1) {
              let cart_item = cart[index];
              // 옵션 사용하는 경우
              if (cart_item.order_product_option.length > 0) {
                // 기존 옵션 수량 + 추가할 수량이 최대 수량 보다 클 경우
                cart_item.order_product_option.forEach((opt, idx) => {
                  let option = prod.order_product_option[idx]
                  if(opt.quantity + option.quantity > option.max) {
                    // 기존 옵션 수량이 이미 최대 주문 수량 한도인 경우
                    if (opt.quantity === option.max) {
                      this.toast(`${option.name} 옵션이 이미 최대 주문 수량 한도만큼 장바구니에 담겨있습니다.`)
                    }
                    // 기존 옵션 수량이 최대 주문 수량 한도를 넘기지 않은 경우, 초과된 개수 toast 메시지로 알림
                    else {
                      this.toast(`${option.name} 옵션의 합이 최대 주문 수량 한도보다 ${(opt.quantity + option.quantity) - option.max}개 초과되었습니다.`);
                    }
                  } else {
                    // 기존 옵션 수량이 1개 초과로 있을 경우, 옵션 수량 더하고, 0개이면 수량 1 더함.
                    opt.quantity += opt.quantity > 1 ? option.quantity : 1;
                    this.toast('이미 장바구니에 동일한 상품이 있어 수량이 추가되었습니다.')
                  }
                })
                this.$store.commit('setCart', cart);
              }
              // 옵션 사용 안하는 경우
              else {
                if (cart_item.quantity + prod.quantity > this.product.maximum) {
                  // 장바구니에 담긴 수량이 이미 maximum과 같은 경우
                  if (cart_item.quantity === this.product.maximum) {
                    this.toast('이미 최대 주문 수량 한도만큼 장바구니에 담겨있습니다.');
                  }
                  // 기존 수량이 최대 주문 수량 한도를 넘기지 않은 경우, 초과된 개수 알림
                  else {
                    this.toast(`최대 주문 수량 한도보다 ${(cart_item.quantity + prod.quantity) - this.product.maximum}개 초과되었습니다.`);
                  }
                } else {
                  cart_item.quantity += prod.quantity > 1 ? prod.quantity : 1;
  
                  this.$store.commit('setCart', cart);
                  this.toast('이미 장바구니에 동일한 상품이 있어 수량이 추가되었습니다.')
                }
              }
            } else {
              this.toast('장바구니에 추가되었습니다.')
              this.$store.commit('setConcatCart', [prod])
            }
          })
    
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
          if (stock) return `${stock.name}`;
        },
    optionPrice(selectorStocks, option_id) {
          if(!selectorStocks) return;
          let stock = find(selectorStocks, 'id', option_id);
          if (stock) {
            if (stock.option_type === 0) {
              if (this.isDiscount) {
                return stock.price + this.product.price.sale_price;
              } else {
                return stock.price + this.product.price.price;
              }
            } else {
              return stock.price;
            } 
          }
        },
    optionQuantityStyle(order_product, op) {
        return {
          input: {
            width: '40px',
            height: '32px',
            backgroundColor: this.brandBgColor.white.backgroundColor,
            border: this.brandBorder.main.border,
            textAlign: 'center',
            fontSize: '12px',
            color: this.brandColor.main.color,
            fontWeight: '500',
            fontFamily: 'Noto Sans CJK KR'
          },
          btnMinus: {
            backgroundColor: this.brandBgColor.white.backgroundColor,
            color: (op && op.quantity === this.computedQuantity(op).min) || (op === undefined && order_product.product.minimum === order_product.quantity) ?
              this.brandColor.help.color : this.brandColor.sub.color,
            border: this.brandBorder.main.border,
            borderRight: '0px',
            borderRadius: '6px 0 0 6px',
            width: '30px',
            height: '32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px'
          },
          btnPlus: {
            backgroundColor: this.brandBgColor.white.backgroundColor,
            color: (op && op.quantity === this.computedQuantity(op).max) || (op === undefined && order_product.product.maximum === order_product.quantity) ?
              this.brandColor.help.color : this.brandColor.sub.color,
            border: this.brandBorder.main.border,
            borderLeft: '0px',
            borderRadius: '0px 6px 6px 0',
            width: '30px',
            height: '32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px'
          }
        }
      },
    selectorStockStyle(idx) {
        let deco = {
          marginBottom: '16px'
        }
        if (idx === 0) {
          deco.marginTop = '16px'
        }
        if (idx === this.order_product.order_product_option.length - 1) {
          deco.marginBottom = '0px'
        }
        return deco;
      },
    computedQuantity(op) {
        if (op.option_type === 0) {
          let index = this.order_product.product.selectors.findIndex(selector => selector.option_type === op.option_type);
          // let selectorStock = this.selectorStocks.filter(s => s.options.indexOf(op.option_id) > -1)[0];
          let selectorStock = this.selectorStocks.filter(s => s.id === op.option_id)[0];
          return {
            min: this.order_product.product.selectors[index].minimum,
            max: selectorStock.enable_stock ? selectorStock.stock : this.order_product.product.selectors[index].maximum
          }
        } else {
          let obj = {};
          let selectorStock = this.selectorStocks.find(s => s.id === op.option_id);
          this.order_product.product.selectors.forEach(selector => {
            selector.options.forEach(option => {
              if (option.name === op.name) {
                obj = {
                  min: selector.minimum,
                  max: selectorStock.enable_stock ? selectorStock.stock : selector.maximum
                }
              }
            })
          })
          return obj;
        }
      }
  },
  computed: {
    isBtnEnable() {
        return !this.product.soldout
      },
    quanStyle() {
          return {
            borderBottom: `1px solid ${this.getColor('기본 테두리선 색상')}`
          }
        },
    optionDropdownStyle() {
          return {
            container: {
              margin: '0px'
            },
            dropdown: {
              backgroundColor: this.brandBgColor.white,
              color: this.brandColor.sub2.color,
              border: this.brandBorder.main.border,
              height: '48px',
              padding: '12px 16px',
              fontSize: '14px',
              borderRadius: '8px'
            },
            dropList: {
              top: '48px',
              borderRadius: '8px',
            },
            dropItem: {
              backgroundColor: this.brandBgColor.white.backgroundColor,
              color: this.brandColor.main.color,
              padding: '12px 16px'
            },
            label: {
              backgroundColor: this.brandBgColor.white.backgroundColor,
              fontSize: '14px',
              fontWeight: 400,
              color: this.brandColor.sub.color,
              width: '100%',
              marginBottom: '8px'
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
          let result = ''
          if (delivery === null) {
            return result;
          } else {
            let type = delivery.delivery_type;
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
          }
        },
    totalPrice() {
          // console.log('전체 ',this.order_product)
          let totalPrice = 0;
          if(!this.order_product) return 0
          if(this.product.enable_option) {
            let index = this.selectorStocks.findIndex(stock => stock.option_type === 0);
            if (index === -1) {
              totalPrice = this.discountedPrice * this.order_product.quantity;
            }
            
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
            totalPrice = this.discountedPrice * this.order_product.quantity;
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
  watch: {
    
  }
}
</script>


