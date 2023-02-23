<template>
<div>
  <div v-if="product.price.price_type === 0" style="padding-top: 32px">
    <div class="unselect flex-between size-16 full-width p-bg-white radius-8" @click="clickSchedule"
      :class="{
        'p-border-primary': $store.getters.selectedResv === undefined,
        'p-border-main': $store.getters.selectedResv !== undefined
      }" style="padding: 0px 18px; height: 56px">
      <div class="flex-align">
        <i class="material-icons-outlined p-sub"
          style="font-size: 20px; margin-right: 10px">calendar_today</i>
        <div :class="{
          'p-sub2': $store.getters.selectedResv === undefined,
          'p-main': $store.getters.selectedResv !== undefined
        }">{{ computedSchedule }}</div>
      </div>
      <i class="material-icons bold" style="font-size: 20px"
        :class="{
          'p-primary': $store.getters.selectedResv === undefined,
          'p-sub': $store.getters.selectedResv !== undefined
        }">keyboard_arrow_right</i>
      
    </div>
    
    <div v-if="(option1 && option1.length > 0) || (option2 && option2.length > 0)"
      style="margin-top: 24px; padding-bottom: 24px">
      <!-- 옵션별 재고 사용 & 선택된 일정에서 selectorStocks 있을때 -->
      <template v-if="product.reserve_policy.limit_type === 1">
        <c-input-dropdown
            :options="selectorStocks.filter(item => item.option_type === 0)"
            :optionType="'reservation'" :limitType="1"
            @update:value="updateStock"            
            :containerCustomStyle="optionDropdownStyle(0, selectorStocks).container"
            :dropdownCustomStyle="optionDropdownStyle(0, selectorStocks).dropdown"
            :dropListCustomStyle="optionDropdownStyle(0, selectorStocks).dropList"
            :dropItemCustomStyle="optionDropdownStyle(0, selectorStocks).dropItem"
            :placeholderCustomStyle="optionDropdownStyle(0, selectorStocks).placeholder"
            :iconCustomStyle="optionDropdownStyle(0, selectorStocks).dropArrowIcon"
            :labelCustomStyle="optionDropdownStyle(0, selectorStocks).label"
            :placeholder="'필수옵션'"
            :addState="addStateStocks"></c-input-dropdown>
      </template>

      <template v-else>
        <template v-for="(item1, idx) in option1"
          :style="{marginBottom: idx !== option1.length - 1 ? '8px' : '0px'}">
          <c-input-dropdown v-if="item1.options && item1.options.length !== 0" :key="'key-'+idx"
            :options="item1.options"
            :optionType="'reservation'"
            @update:value="res => addEssential(res, item1)"
            @empty="type => emptyOpt(type)"
            :containerCustomStyle="optionDropdownStyle(idx, option1).container"
            :dropdownCustomStyle="optionDropdownStyle(idx, option1).dropdown"
            :dropListCustomStyle="optionDropdownStyle(idx, option1).dropList"
            :dropItemCustomStyle="optionDropdownStyle(idx, item1).dropItem"
            :placeholderCustomStyle="optionDropdownStyle(idx, option1).placeholder"
            :iconCustomStyle="optionDropdownStyle(idx, option1).dropArrowIcon"
            :labelCustomStyle="optionDropdownStyle(idx, option1).label"
            :placeholder="`${item1.name}`"
            :fullState="essentialState"
            :fullLength="option1.length"></c-input-dropdown>
        </template>
      </template>

      <div v-if="option2 && option2.length !== 0" style="margin-top:24px;">
        <div class="size-14 p-sub" style="margin-bottom: 8px">추가옵션</div>
        <template v-for="(item2,idx) in option2"
          :style="{marginBottom: idx !== option2.length - 1 ? '8px' : '0px'}">
          <c-input-dropdown v-if="item2.options && item2.options.length !== 0" :key="'key2-'+idx"
            :options="item2.options"
            :optionType="product.reserve_policy.limit_type === 1 ? 'reservation_add' : ''"
            :limitType="product.reserve_policy.limit_type === 1 ? 1 : 0"
            @update:value="res => updateValue(res, item2)"
            @empty="(type,val) => emptyOpt(type, val)"
            :containerCustomStyle="optionDropdownStyle(idx, option2).container"
            :dropdownCustomStyle="optionDropdownStyle(idx, option2).dropdown"
            :dropListCustomStyle="optionDropdownStyle(idx, option2).dropList"
            :dropItemCustomStyle="optionDropdownStyle(idx, item2).dropItem"
            :placeholderCustomStyle="optionDropdownStyle(idx, option2).placeholder"
            :iconCustomStyle="optionDropdownStyle(idx, option2).dropArrowIcon"          
            :labelCustomStyle="optionDropdownStyle(idx, option2).label"
            :placeholder="item2.name"
            :addState="addState"></c-input-dropdown>
        </template>
      </div>
      <!-- 선택 된 옵션 수량 -->
      <div style="margin: 24px 0">
        <!-- 필수 옵션 수량 -->
        <template v-for="(item,idx) in optionEss">
          <div v-if="optionEss&&optionEss.length>0" :key="'esskey-'+idx+item[0].id"
            class="radius-8" :style="optQuantityStyle(idx, optionEss)">
            <div class="flex-between" style="margin-bottom: 14px">
              <div class="size-14 p-sub" style="width: 90%">
                {{ computedName(item) }}</div>
              <i v-if="product.reserve_policy.limit_type !== 0 || (product.reserve_policy.limit_type === 0 && $store.getters.selectedResv.remain > 1)"
                class="material-icons unselect p-help" @click="deleteEss(idx)"
                style="text-align: center; font-size: 16px">close</i>
            </div>
            <div class="flex-between">
              <div class="col-7">
                <quantity-input v-if="option1[0].maximum>1"
                  :min="computedOptionMinimum(item[0])"
                  :max="computedOptionMaximum(item[0])"
                  :inputStyle="optionQuantityStyle(item[0]).input"
                  :btnMinusStyle="optionQuantityStyle(item[0]).btnMinus"
                  :btnPlusStyle="optionQuantityStyle(item[0]).btnPlus"
                  @update:value="val => computedVal(val,item)"
                  :disableState="disableState"
                  :value="item[0].quantity"
                  :numInput="false"></quantity-input>
              </div>
              <div class="col-5 flex-end">
                <div class="size-18 weight-500 p-main">
                  {{ computedEssprice(item) | currencyNum }}<span class="size-16">원</span></div>
                
              </div>
            </div>
          </div>
        </template>
        <!-- 추가 옵션 수량 -->
        <template v-for="(item2,idx) in optionAdd">
          <div v-if="optionAdd&&optionAdd.length>0" :key="'item2-keys-'+idx"
            class="radius-8" :style="optQuantityStyle(idx, optionAdd)" style="margin-top:12px">
            <div class="flex-between" style="margin-bottom: 14px">
              <div class="size-14 p-sub" style="width: 90%">{{ item2.label }}</div>
              <i class="material-icons unselect p-help" @click="deleteAdd(idx)"
                style="text-align: center; font-size: 16px">close</i>
            </div>
            <div class="flex-between">
              <div class="col-7">
                <quantity-input v-if="item2.maximum>1"
                  :min="item2.minimum"
                  :max="item2.maximum"
                  :inputStyle="optionQuantityStyle(item2).input"
                  :btnMinusStyle="optionQuantityStyle(item2).btnMinus"
                  :btnPlusStyle="optionQuantityStyle(item2).btnPlus"
                  @update:value="val => computedAdd(val,item2)"
                  :value="item2.quantity"
                  :numInput="false"></quantity-input>
              </div>
              <div class="col-5 flex-end">
                <div class="size-18 weight-500 p-main">
                  {{ item2.price * item2.quantity | currencyNum }}<span class="size-16">원</span></div>
                
              </div>
            </div>
            
          </div>
        </template>
      </div>
    </div>
    <div v-else>
      <template v-if="$store.getters.selectedResv">
        <div class="radius-8" :style="optQuantityStyle()"
          style="margin-top: 24px">
          <div class="flex-between" style="margin-bottom: 14px">
            <div class="size-14 p-sub" style="width: 90%">
              {{ product.name }}</div>
          </div>
          <div class="flex-between">
            <div class="col-7">
              <quantity-input
                :min="product.reserve_policy.limit_type === 0 && product.reserve_policy.limit_count ? product.reserve_policy.minimum : 1"
                :max="computedMaximum"
                :inputStyle="quantityStyle($store.getters.selectedResv).input"
                :btnMinusStyle="quantityStyle($store.getters.selectedResv).btnMinus"
                :btnPlusStyle="quantityStyle($store.getters.selectedResv).btnPlus"
                @update:value="val => computedCount(val)"
                :disableState="disableState"
                :value="product.reserve_policy.limit_type === 0 && product.reserve_policy.limit_count ? product.reserve_policy.minimum : $store.getters.selectedResv.ordered_count"
                :numInput="false"></quantity-input>
            </div>
            <div class="col-5 flex-end">
              <div class="size-18 weight-500 p-main">
                {{ $store.getters.selectedResv.sale_price * $store.getters.selectedResv.ordered_count | currencyNum }}<span class="size-16">원</span></div>
              
            </div>
          </div>
        </div>
      </template>
    </div>
    <div :class="{
      'p-border-top-sub': ($store.getters.selectedResv && $store.getters.selectedResv.ordered_count) || (option1 && option1.length > 0) || (option2 && option2.length > 0)
    }" style="padding: 24px 0">
      <div class="flex-between" style="gap: 0 16px">
        <div class="size-16 weight-500 p-sub">총 금액<span v-if="product.payment_type === 2"> (현장결제)</span></div>
        <div class="size-22 bold p-main">{{ currencyNum(calcPrice()) }}<span
          class="size-18 weight-500">원</span></div>
      </div>
      <div v-if="product.payment_type === 2" class="radius-8 flex-center size-14 p-highlight"
        style="margin-top: 16px; height: 42px; background-color: #fef6f6">현장에서 결제하는 상품입니다.</div>
    </div>
  </div>
  <div class="flex-align">
    <button-inquirying-pc :product="product"
      :class="{'col-12': product.inquiry_conversion_type > 0 && product.price.price_type !== 0, 'col-5': product.inquiry_conversion_type > 0 && product.price.price_type === 0}"
      :style="inquiryBtnStyle"></button-inquirying-pc>
    <btn v-if="product.price.price_type === 0"
        @clicked="clickBtn"
        class="p-white"
        :backgroundColor="isBtnEnable ? brandBgColor.primary : brandBtn.bg.gray"
        :customStyle="customStyle"
        :class="{'col-12': product.inquiry_conversion_type===0, 'col-7': product.inquiry_conversion_type>0}"
        :ga="ga"
        
    >{{name}}</btn>
  </div>
    <!--<icon-circle-like likeType="product" color="main" :borderRadius="8" style="margin-left:12px;" :containStyle="containStyle"></icon-circle-like>-->
   <!-- <div class="flex-align">
      <icon-circle-like likeType="product" color="main" borderRadius="8px" style="margin:0 12px;"></icon-circle-like>
      <icon-circle-share @share="$refs.share.share=true" color="main"></icon-circle-share>
    </div>
    <share ref="share" v-if="product" :product="product"></share>-->
</div>
</template>
<script>
import ButtonInquiryingPc from "@/components/Components/Button/ButtonInquiryingPc.vue"

export default {
  name: 'ButtonReservationPc',
  components: {
    ButtonInquiryingPc
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
      default: "예약하기",
    },
    product: {
      type: Object,
      required: true,
    },
    selectors: {
      type: Array,
    },
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "option1": [],
      "option2": [],
      "setResv": false,
      "optionAdd": [],
      "optionEss": [],
      "optionEssId": [],
      "disableState": false,
      "addStateStocks": false,
      "selectorStocks": []
    }
  },
  created() {
    this.$store.commit('setEssentialOption', []);
    this.$store.commit('setAdditionalOption', []);
    this.$store.commit('setSelectedResv', undefined);
  },
  mounted() {
    this.$nextTick(() => {
      this.setOptions();
    })
  },
  beforeDestroy() {
    // 이동되는 페이지가 주문/결제 페이지가 아닌 경우, 선택했던 날짜 초기화
    if (this.$route.path !== '/order_reservation') {
      this.$store.commit('setSelectedResv', undefined);
    }
  },
  
  methods: {
    getInitialSelectorStocks() {

    },
    clickSchedule() {
      let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
      if (currentDate >= this.product.price.start_date && currentDate <= this.product.price.end_date) {
        this.$root.$emit('page_modal', 'ScheduleReservationModal');
      } else {
        this.toast('판매 기간이 종료된 상품은 예약 날짜/시간을 선택할 수 없습니다.');
      }
    },
    setOptions() {

      let opt = this.product.selectors.filter(item => { return item.option_type === 0});
      if (opt.length > 0) {
        for(let i=0; i < opt.length; i++) {
          opt[i].index = i+1;
        }
        opt.forEach(item => {
          this.option1.push(this.setOption(item));
        })
          
      }
      opt = this.product.selectors.filter(item => { return item.option_type === 1});
      if (opt.length > 0) {
        for(let i=0; i < opt.length; i++) {
          opt[i].index = i+1;
        }
        opt.forEach(item => {
          this.option2.push(this.setOption(item));
        })

        let adds = this.selectors.filter(item => item.option_type === 1);
        if (adds.length > 0) {
          adds.forEach(item => {
            item.options.forEach(o => {
              this.option2.forEach(i => {
                i.options.forEach(option => {
                  if (option.value.id === o) {
                    option.value.enable_stock = item.enable_stock;
                    option.value.soldout = item.soldout;
                    option.value.stock = item.stock;
                  }
                })
              })
            })
          })
        }
      }
    },
    setOption(opt) {
      let option = {
        name: opt.name,
        minimum: opt.minimum,
        maximum: opt.maximum,
        value: undefined,
        options: [],
        option_type: opt.option_type
      };
      if (opt.index) {
        option.index = opt.index;
      }
      opt.options.forEach(item => {
        item.label = item.name;
        item.quantity = opt.minimum;
        option.options.push({
          value: item,
          label: item.label,
          type: opt.option_type,
          index: opt.index
        })
      })
      return option;
    },
    computedName(item) {
      let name = '';
      for(let i=0;i<item.length;i++) {
        if(i===0) {
          name = item[i].label
        }
        else name = name + ' X ' + item[i].label;
      }
      return name;
    },
    computedEssprice(item) {
      let price = 0;

      let resv = this.$store.getters.selectedResv;
      
      if (resv !== undefined) {
        price = resv.is_discount && resv.sale_price ? resv.sale_price : resv.price;
      }
      let essPrice = (price + item.reduce((a,c) => a + c.price, 0)) * item[0].quantity
      
      return essPrice;
    },
    computedCount(val) {
      let resv = this.$store.getters.selectedResv;
      let max = resv.stock_infinite ? resv.stock : this.product.maximum;
      resv.ordered_count = val;
      if (resv.ordered_count < max) {
        this.disableState = false;
        // this.$store.commit('setSelectedResv', resv);
      } else {
        this.disableState = true;
      }
    },
    computedVal(val, item) {
      let sum = 0;
      let max = this.option1[0].maximum;
      item.forEach(res => {
        res.quantity = val;
      });
        
      this.optionEss.forEach(ess => {
        sum = sum + ess[0].quantity;
      })
      if(sum<max) {
        this.disableState = false;
      }
      else {
        this.disableState = true;
      }
      this.commitOption();
    },
    computedAdd(val, item) {
      item.quantity = val;
      this.commitOption();
    },
    addEssential(res, opt) {
      if(res!==undefined && this.disableState===false) {
        opt.value = this.cloneItem(res);
      }
    },
    updateValue(res, opt) {
      if(res!==undefined) {
        opt.value = this.cloneItem(res);
      }
    },
    updateStock(val) {
      val = this.selectorStocks.find(i => i.value === val);
      let chk = '';
      val.options.forEach(item => {
        chk += item.id + '/';
      })
      if(this.optionEssId.length === 0 || this.optionEssId.indexOf(chk) === -1) {
        val = this.cloneItem(val);
        val.options.forEach(i => {
          i.label = i.name;
          i.quantity = i.minimum;
        });
        //재고
        let stock = val.stock;
        val.options[0].stock = stock;
        // 재고사용 & 첫번째 필수옵션의 최대값이 재고보다 클 때, 재고수량 최대로.
        if (val.enable_stock && val.options[0].maximum > stock) {
          val.options[0].maximum = stock;
        }
        this.optionEss.push(val.options);
        this.optionEssId.push(chk);
      }

      this.addStateStocks = true;
      setTimeout(()=>{
        this.addStateStocks = false;
      });
    },
    emptyOpt(type, val) {
      if(type===0) {
        if (!this.setResv) {
          this.toast('일정을 먼저 선택해주세요.');
          this.option1.forEach(item => {
            item.value = undefined;
          })
        } else {
          let arr = [];
          let chk = '';
          this.option1.forEach(item => {
            chk += item.value.id + '/';
            arr.push(item.value);
            item.value = undefined;
          })
          if(this.optionEssId.indexOf(chk)===-1) {
            if (this.product.reserve_policy.limit_type === 0 && this.$store.getters.selectedResv.remain === 1) {
              this.optionEssId[0] = chk;
              arr[0].maximum = 1;
              this.optionEss[0] = arr;
            } else {
              this.optionEssId.push(chk);
              if (this.product.reserve_policy.limit_type === 1) {
                let option = this.findOption(arr);
                if (option !== undefined) {
                  if (option.enable_stock) {
                    arr[0].maximum = option.stock;
                  }
                }
              } else {
                let option = this.findOption(arr);
                if (option !== undefined) {
                  arr[0].maximum = option.maximum;
                }
              }
              arr[0].quantity = this.computedOptionMinimum(arr[0])
              // 일정별 & 최대선택가능한 수량 0 이상일 경우 or 옵션별일 경우
              if((this.product.reserve_policy.limit_type === 0 && (this.optionEss.length === 0 || (this.optionEss.length > 0 && this.essOptionMaximum(arr[0]) - arr[0].quantity > 0))) ||
                this.product.reserve_policy.limit_type === 1) {
                  this.optionEss.push(arr);
                } else {
                  this.toast('선택가능한 옵션 수량 이상 선택하실 수 없습니다.');
                  this.optionEssId = this.optionEssId.filter(i => i !== chk);
                }
            }
          }
          else {
            arr = [];
            chk = '';
          }
        }
      }
      if(type===1) {
        if(!this.optionAdd.some(item => item.id === this.option2[val-1].value.id)) {
          let option = this.option2[val-1].value;
          option.quantity = option.minimum;
          this.optionAdd.push(option);
          
          // if (!this.option2[val-1].value.soldout && (!this.option2[val-1].value.enable_stock || (this.option2[val-1].value.enable_stock && this.option2[val-1].value.stock !== 0))) {
          //   this.optionAdd.push(this.option2[val-1].value);
          // }
        }
        this.option2[val-1].value = undefined;
      }
      
      this.commitOption();
    },
    commitOption() {
      this.$store.commit('setEssentialOption', this.optionEss);
      this.$store.commit('setAdditionalOption', this.optionAdd);
    },
    deleteEss(idx) {
      this.optionEss.splice(idx, 1);
      this.optionEssId.splice(idx, 1);
      // this.clickAccount();
    },
    deleteAdd(idx) {
      this.optionAdd.splice(idx, 1);
      // this.clickAccount();
    },
    clickBtn() {
        if(this.$store.getters.selectedResv === undefined) {
        this.toast('일정을 선택해주세요.');
        return;
      } else if (this.option1.length > 0 && this.optionEss.length === 0) {
        this.toast('필수 옵션을 선택해주세요.');
        return;
      } else if (this.option1.length > 0 && this.optionEss.length > 0) {
        let totalOptionQuantity = 0;
        this.optionEss.forEach(item => {
          totalOptionQuantity += item[0].quantity;
        })
        if (this.product.reserve_policy.limit_type === 0 && !this.$store.getters.selectedResv.stock_infinite) {
          if (totalOptionQuantity > this.$store.getters.selectedResv.stock) {
            this.toast(`${this.$store.getters.selectedResv.stock}보다 많은 수량으로 주문할 수 없습니다.`);
            return;
          }
        }
      }
        this.routerPush(`order_reservation?id=${this.product.id}`);
      },
    optionDropdownStyle(idx, option) {
      let deco = {
        container: {
          margin: idx === option.length - 1 ? '0px' : '0 0 16px 0',
        },
        label: {
          color: this.brandColor.sub.color,
          fontSize: '14px',
          lineHeight: '14px',
          margin: '0px 0px 8px'
        },
        dropdown: {
          backgroundColor: this.brandBgColor.white.backgroundColor,
          color: this.brandColor.main.color,
          height: '48px',
          padding: '12px 16px',
          fontSize: '14px',
          borderRadius: '8px',
          border: this.brandBorder.main.border
        },
        dropList: {
          top: '48px',
          borderRadius: '8px',
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.1)'
        },
        dropItem: {
          backgroundColor: this.brandBgColor.white.backgroundColor,
          color: this.brandColor.main.color,
          padding: '14px 16px'
        },
        dropArrowIcon: {
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '24px',
          color: this.brandColor.main.color
        },
        placeholder: {
          fontSize: '14px',
          color: this.brandColor.sub2.color,
        },
      }
      if (option.options && option.options.length > 0) {
        option.options.forEach((idx, item) => {
          if (idx === option.options.length - 1) {
            deco.dropItem.borderBottom = 'none';
          } else {
            deco.dropItem.borderBottom = this.brandBorder.main.border;
          }
        })
      }
      return deco;
    },
    optQuantityStyle(idx, option) {
      return {
        backgroundColor: '#fafafa',
        marginBottom: idx && option && idx === option.length - 1 ? '0px' : '12px',
        padding: '16px',
      }
    },
    quantityStyle(resv) {
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
          backgroundColor: (resv && !resv.stock_infinite && resv.ordered_count === 1) ?
            this.brandBgColor.sub2.backgroundColor : this.brandBgColor.white.backgroundColor,
          color: (resv && !resv.stock_infinite && resv.ordered_count === 1) ?
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
          backgroundColor: (resv && !resv.stock_infinite && resv.stock === resv.ordered_count) ?
            this.brandBgColor.sub2.backgroundColor : this.brandBgColor.white.backgroundColor,
          color: (resv && !resv.stock_infinite && resv.stock === resv.ordered_count) ?
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
    optionQuantityStyle(op) {
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
          backgroundColor: (op && op.minimum === op.quantity) || (op === undefined && op.minimum === op.quantity) ?
            this.brandBgColor.sub2.backgroundColor : this.brandBgColor.white.backgroundColor,
          color: (op && op.minimum === op.quantity) || (op === undefined && op.minimum === op.quantity) ?
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
          backgroundColor: (op && op.maximum === op.quantity) || (op === undefined && op.maximum === op.quantity) ?
            this.brandBgColor.sub2.backgroundColor : this.brandBgColor.white.backgroundColor,
          color: (op && op.maximum === op.quantity) || (op === undefined && op.maximum === op.quantity) ?
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
    calcPrice() {
      let price = 0;
      let resv = this.$store.getters.selectedResv;
      let essPrice = 0;
      let addPrice = 0;
      let ordered_count = resv ? resv.ordered_count : 1
      
      if (resv !== undefined) {
        price = resv.is_discount && resv.sale_price ? resv.sale_price : resv.price;
      }
      // 옵션 없을 때, essPrice에 금액*수량
      if(this.option1.length===0 && this.option2.length===0) {
        essPrice = price * ordered_count;
      }
      
      if(this.optionEss && this.optionEss.length>0) {
        // 필수옵션
        for(let i=0;i<this.optionEss.length;i++) {
          if (this.optionEss[i] && this.optionEss[i].length > 0) {
            // 필수옵션 n개의 금액 합계
            let esPrice = price + this.optionEss[i].reduce((a,c) => a + c.price, 0);
            // 필수옵션 금액 * 입력한 옵션 수량 누적
            essPrice += esPrice * this.optionEss[i][0].quantity;
          }
        }
      }
      // 추가옵션
      if(this.optionAdd && this.optionAdd.length>0) {
        addPrice = this.optionAdd.reduce((a,c) => a + (c.price * c.quantity), 0);
      }
      
      
      return essPrice + addPrice;
    },
    findOption(item) {
      let resv = this.$store.getters.selectedResv;
      if (resv !== undefined) {
        // 전체 옵션 조합 가져오기
        let selectorStocks = resv.selectorStocks;
        /* jshint -W080 */
        let selectedOption = undefined;
        /* jshint +W080 */
        let temp = []
        // 전체 옵션 조합에서, 현재 item과 일치하는 옵션 찾아오기
        selectorStocks.forEach(stock => {
          stock.opts.forEach(opt => {
            if (item.findIndex(i => i.id === opt) > -1) {
              temp.push(opt);
            }
          })
          // 중복으로 push된 값 제거
          let set = new Set(temp);
          temp = [...set];
          
          if (temp.length === stock.opts.length) {
            selectedOption = stock;
          }
        })

        return selectedOption;
      }
    },
    computedOptionMinimum(item) {
      // 일정별 모집인원 제한
      if (this.product.reserve_policy.limit_type === 0) {
        // 1회 구매 가능 수량
        if (this.product.reserve_policy.limit_count) {
          // 정책에서 최소값
          return this.product.reserve_policy.minimum;
        } else {
          // 옵션의 최소값
          return item.minimum;
        }
      } 
      // 옵션별로 모집인원 제한
      else {
        // 옵션의 최소값
        return item.minimum;
      }
    },
    essOptionMaximum(item) {
      let max = 0;
      if (this.product.reserve_policy.limit_type === 0) {
        // 1회 구매 가능 수량 제한 사용하는 경우
        if (this.product.reserve_policy.limit_count) {
          // 재고 무제한인 경우 정책의 최대값, 재고 무제한이 아닌 경우 옵션의 최대값, 정책 최대값, 재고 수량 중 가장 작은 값으로 지정
          if (this.$store.getters.selectedResv.stock_infinite) {
            max = this.product.reserve_policy.maximum;
          } else {
            // 정책 최대값과 재고 수량 중 작은 값 선택
            let value = this.product.reserve_policy.maximum > this.$store.getters.selectedResv.stock ? this.$store.getters.selectedResv.stock : this.product.reserve_policy.maximum
            // 옵션의 최대값과 비교하여 작은 값 선택
            max = value > item.maximum ? item.maximum : value;
          }
        }
        // 1회 구매 가능 수량 제한 사용 안하는 경우 
        else {
          // 해당 일정 재고 무한대이면, 옵션의 최대값, 아니면 재고
          max = this.$store.getters.selectedResv.stock_infinite ? item.maximum : this.$store.getters.selectedResv.stock
        }
        let totalOptionQuantity = this.optionEss.reduce((acc, cur) => acc + cur[0].quantity, 0)
        return Math.abs(max - totalOptionQuantity) + item.quantity
      }
    },
    computedOptionMaximum(item) {
      // 일정별 모집인원 제한
      if (this.product.reserve_policy.limit_type === 0) {
        return this.essOptionMaximum(item);
      }
      // 옵션별로 모집인원 제한
      else {
        // 재고사용 시, 재고, 아닐때 최대값
        return item.enable_stock ? item.stock : item.maximum;
      }
    }
  },
  computed: {
    computedMaximum() {
      // 일정별 모집인원 제한
      if (this.product.reserve_policy.limit_type === 0) {
        // 1회 구매가능 수량 설정
        if (this.product.reserve_policy.limit_count) {
          return this.product.reserve_policy.maximum;
        } 
        // 일정 재고
        else {
          return this.$store.getters.selectedResv.stock_infinite ? this.product.maximum : this.$store.getters.selectedResv.stock
        }
      } 
      // 옵션별 모집인원 제한 - 상품 자체에 재고 설정이 없으므로, 일정 재고로 처리 (무제한 재고 : 99로 설정)
      else {
        return this.$store.getters.selectedResv.stock_infinite ? 99 : this.$store.getters.selectedResv.stock

      }
    },
    essentialState() {
      return this.option1.length > 0 && this.option1.every(i => i.value);
    },
    addState() {
      return this.option2.length > 0 && this.option2.some(i => i.value);
    },
    isBtnEnable() {
      if (this.$store.getters.selectedResv === undefined) {
        return false;
      } else {
        return true;
      }
    },
    containStyle() {
      return {
        backgroundColor: this.brandBgColor.sub.backgroundColor,
        borderRadius:"8px",
        height:"48px",
        width:"48px",
      }
    },
    computedSchedule() {
      if (this.$store.getters.selectedResv !== undefined) {
        let resv = this.$store.getters.selectedResv;
        let org_start_date = resv.org_start_date;
        let start_date = this.dateFormat(resv.org_start_date, 'date_10');
        let start_time = this.dayjs(`${org_start_date} ${resv.start_time}`).format('A hh:mm');
        let end_time = this.dayjs(`${org_start_date} ${resv.end_time}`).format('A hh:mm');
        if (resv.all_time) {
          return `${start_date} 종일`;
        } else {
          return `${start_date} ${start_time} ~ ${end_time}`; 
        }
      } else {
        return '날짜/시간 선택';
      }
    },
    inquiryBtnStyle() {
      let deco = {
        height: '56px',
        marginRight: '16px'
      };
      if (this.product.price.price_type !== 0 && this.product.inquiry_conversion_type > 0) {
        deco.marginRight = '0px';
      }
      return deco;
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
    '$store.getters.selectedResv'(n) {
      if (n !== undefined) {
        this.setResv = true;
        if (this.product.reserve_policy.limit_type === 1) {
          if (this.optionEss && this.optionEss.length > 0) {
            this.optionEss.forEach(ess => {
              let option = this.findOption(ess);
              if (option !== undefined) {
                if (option.enable_stock) {
                  ess[0].maximum = option.stock;
                }
              }
            })
          }
        }
        this.selectorStocks = this.cloneItem(n.selectorStocks);
        this.optionEss = [];
        this.optionAdd = [];
        this.optionEssId = [];
      } else {
        this.setResv = false;
        this.selectorStocks = this.selectors;
      }
    },
    product(n) {
      this.option1 = [];
      this.option2 = [];
      this.setOptions();
    }
  }
}
</script>


