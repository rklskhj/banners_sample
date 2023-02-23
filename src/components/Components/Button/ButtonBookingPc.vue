<template>
<div>
  <div v-if="product.price.price_type === 0" style="padding-top: 32px">
    <div class="unselect flex-align size-16 full-width radius-8 p-bg-white p-border-sub"
      @click="clickSchedule" style="height: 72px">
      <div style="padding: 12px 16px; flex: 1">
        <div class="size-13 weight-400 p-sub2">체크인</div>
        <div class="size-16 weight-500 p-main" style="margin-top: 4px">
          {{ $store.getters.selectedResv ? dateFormat($store.getters.selectedResv.resv_date, 'date_13') : '날짜 선택' }}</div>
      </div>
      <div class="divider"></div>
      <div style="padding: 12px 16px; flex: 1">
        <div class="size-13 weight-400 p-sub2">체크아웃</div>
        <div class="size-16 weight-500 p-main" style="margin-top: 4px">
          {{ $store.getters.selectedResv ? dateFormat($store.getters.selectedResv.resv_end_date, 'date_13') : '날짜 선택' }}</div>
      </div>
      <!-- <div class="flex-align">
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
        }">keyboard_arrow_right</i> -->
    </div>

    <div v-if="(option1 && option1.length > 0) || (option2 && option2.length > 0)"
      style="padding-top: 24px">
      <template v-for="(item1, idx) in option1"
        :style="{marginBottom: idx !== option1.length - 1 ? '8px' : '0px'}">
        <c-input-dropdown v-if="item1.options && item1.options.length !== 0" :key="'key-'+idx"
          :ref="'essential'+idx"
          :options="item1.options" :optionType="'booking'"
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
      <div v-if="option2 && option2.length !== 0" style="margin-top:24px;">
        <div class="size-14 p-sub" style="margin-bottom: 8px">추가옵션</div>
        <template v-for="(item2,idx) in option2"
          :style="{marginBottom: idx !== option2.length - 1 ? '8px' : '0px'}">
          <c-input-dropdown v-if="item2.options && item2.options.length !== 0" :key="'key-'+idx"
            :ref="'additional'+idx"
            :options="item2.options"
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
      <div style="margin: 32px 0">
        <!-- 필수 옵션 수량 -->
        <template v-for="(item,idx) in optionEss">
          <div v-if="optionEss&&optionEss.length>0" :key="'esskey-'+idx"
            class="radius-8" :style="optQuantityStyle(idx, optionEss)">
            <div class="flex-between" style="margin-bottom: 14px">
              <div class="size-14 p-sub" style="width: 90%">
                {{ computedName(item) }}</div>
              <i class="material-icons unselect p-help"
                style="font-size: 16px; text-align: center" @click="deleteEss(idx)">close</i>
            </div>
            <div class="flex-between">
              <div class="col-7">
                <quantity-input v-if="option1[0].maximum>1"
                  :disabled="true"
                  :min="item[0].minimum"
                  :max="item[0].maximum"
                  :inputStyle="inputCustomStyles()"
                  :btnMinusStyle="btnMinusCustomStyle(item[0])"
                  :btnPlusStyle="btnPlusCustomStyle(item[0])"
                  @update:value="val => computedVal(val,item)"
                  :disableState="disableState"
                  :value="item[0].quantity"
                  :numInput="false"></quantity-input>
              </div>
              <div class="col-5 flex-end">
                <div class="size-18 weight-500 p-main">
                  +{{ computedEssprice(item) | currencyNum }}<span class="size-16">원</span></div>
                
              </div>
            </div>
          </div>
        </template>
        <!-- 추가 옵션 수량 -->
        <template v-for="(item2,idx) in optionAdd">
          <div v-if="optionAdd&&optionAdd.length>0" :key="'item2-keys-'+idx"
            class="radius-8" :style="optQuantityStyle(idx, optionAdd)" style="margin-top:16px">
            <div class="flex-between" style="margin-bottom: 14px">
              <div class="size-14 p-sub" style="width: 90%">{{ item2.label }}</div>
              <i class="material-icons unselect p-help"
                style="font-size: 16px; text-align: center" @click="deleteAdd(idx)">close</i>
            </div>
            <div class="flex-between">
              <div class="col-7">
                <quantity-input v-if="item2.maximum>1"
                  :disabled="true"
                  :min="item2.minimum"
                  :max="item2.maximum"
                  :inputStyle="inputCustomStyles()"
                  :btnMinusStyle="btnMinusCustomStyle(item2)"
                  :btnPlusStyle="btnPlusCustomStyle(item2)"
                  @update:value="val => computedAdd(val,item2)"
                  :value="item2.quantity"
                  :numInput="false"></quantity-input>
              </div>
              <div class="col-5 flex-end">
                <div class="size-18 weight-500 p-main">
                  +{{ item2.price * item2.quantity | currencyNum }}<span class="size-16">원</span></div>
                
              </div>
            </div>
            
          </div>
        </template>
      </div>
      <div class="p-border-top-sub" style="padding-top: 24px">
        <div class="flex-between" style="gap: 0 16px">
          <div class="size-16 weight-500 p-sub">총 금액 <span v-if="$store.getters.selectedResv">({{ $store.getters.selectedResv.days }}박)</span></div>
          <div class="size-22 bold p-main"
            style="flex: 1; text-align: right">{{ currencyNum(calcPrice) }}<span
            class="size-18 weight-500">원</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex-align" style="margin-top: 16px">
    <button-inquirying-pc :product="product"
      :class="{'col-12': product.inquiry_conversion_type > 0 && product.price.price_type !== 0, 'col-5': product.inquiry_conversion_type > 0 && product.price.price_type === 0}"
      :style="inquiryBtnStyle"></button-inquirying-pc>
    <btn v-if="product.price.price_type === 0"
        @clicked="clickBtn"
        class="p-white"
        :backgroundColor="isBtnEnable ? brandBgColor.primary : brandBtn.bg.gray"
        :customStyle="customStyle"
        :class="{'col-12': product.inquiry_conversion_type===0,'col-7': product.inquiry_conversion_type>0}"
        :ga="ga"
    >{{ !isBtnEnable && (product.is_expired || !product.possible_booking_resv) ? '예약마감' : name }}</btn>
  </div>  
  
    <!--<div class="flex-align">
      <icon-circle-like likeType="product" color="main" :borderRadius="8" style="margin:0 12px;"></icon-circle-like>
      <icon-circle-share @share="$refs.share.share=true" color="main"></icon-circle-share>
    </div>-->
  <share ref="share" v-if="product" :product="product"></share>

</div>
</template>
<script>
import ButtonInquiryingPc from "@/components/Components/Button/ButtonInquiryingPc.vue"

export default {
  name: 'ButtonBookingPc',
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
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "option1": [],
      "option2": [],
      "optionAdd": [],
      "optionEss": [],
      "optionEssId": [],
      "disableState": false
    }
  },
  created() {
    this.$store.commit('setEssentialOption', []);
    this.$store.commit('setAdditionalOption', []);
  },
  mounted() {
    this.$nextTick(() => {
      this.getEnableResv();
      this.setOptions();
    })
  },
  beforeDestroy() {
    // 이동되는 페이지가 주문/결제 페이지 또는 검색 페이지가 아닌 경우, 선택했던 날짜 초기화
    if (this.$route.path !== '/order_booking' && this.$route.path !== '/search') {
      this.$store.commit('setSelectedResv', undefined);
    }
  },
  
  methods: {
    async getEnableResv() {
      let resv = this.$store.getters.selectedResv;
      let resv_date = '';
      let resv_end_date = '';
      let dates = [];
      // 이미 선택된 resv가 있는 경우
      if (resv) {
        resv_date = resv.resv_date;
        resv_end_date = resv.resv_end_date;
        let calendar = [];
        
        let diff = this.dayjs(resv_date).diff(resv_end_date, 'month') + 1;
        for (let x=0; x <= diff; x++) {
          let date = this.dayjs(resv_date).add(x, 'month');
          let res_cal = await this.$axios.get(`public/booking/product/${this.product.id}/calendar/${date.year()}/${date.month()+1}`)
          calendar.push(...res_cal.data);
        }

        dates = calendar.filter(i => (i.date_str && i.date_str >= resv_date) && (i.date_str && i.date_str <= resv_end_date));
        this.setSelectedResv(dates);
        
      } 
      // 없는 경우, enable_resv에서 가져오기
      else {
        this.$axios.get(`/public/booking/product/${this.product.id}/enable_resv`).then(res => {
          if (res.data.schedule !== null) {
            this.setSelectedResv(res.data.schedule);
          } else {
            this.$store.commit('setSelectedResv', undefined);
          }
        })
      }
    },
    setSelectedResv(dates) {
      let resv_date = dates[0].date_str;
      let resv_end_date = dates[dates.length - 1].date_str;
      
      let order_price = dates.reduce((acc,cur) => acc+Number(cur.sale_price), 0);
      let discount_price = dates.reduce((acc, cur) => acc + Number(cur.is_discount ? cur.discount_type === 0 ? cur.discount_rate * cur.price : cur.discount_price : 0), 0)

      // 선택한 날짜가 2일 이상인 경우, 계산된 금액에서 하루씩 빼준다.
      if (dates.length > 1) {
        order_price = order_price - dates[dates.length - 1].sale_price;
        if (dates[dates.length - 1].is_discount) {
          if (dates[dates.length - 1].discount_type === 0) {
            discount_price = discount_price - (dates[dates.length - 1].price * dates[dates.length - 1].discount_rate)
          } else {
            discount_price = discount_price - dates[dates.length - 1].discount_price
          }
        }
      }
      let discount_rate = dates.sort((a, b) => b.discount_rate - a.discount_rate)[0].discount_rate;
      let price = {
        order_price: order_price,
        discount_price: Math.abs(discount_price),
        price_per_day : Math.round((dates.reduce((acc,cur) => acc+Number(cur.sale_price), 0) / dates.length) / 100) * 100,
        is_discount: dates.filter(i => i.is_discount).length > 0 ? true : false,
        discount_type: -1,
        discount_rate: discount_rate,
      }
      if (dates.length > 1) {
        price.price_per_day = Math.round(((dates.reduce((acc,cur) => acc+Number(cur.sale_price), 0) - dates[dates.length - 1].sale_price) / (dates.length - 1)) / 100) * 100
      }

      let resv = {
        period: true,
        resv_date: resv_date,
        resv_end_date: resv_end_date,
        days: this.dayjs(resv_end_date).diff(this.dayjs(resv_date), 'day') === 0 ? 1 : this.dayjs(resv_end_date).diff(this.dayjs(resv_date), 'day'),
        price: price
      }
      
      this.$store.commit('setSelectedResv', resv);
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
      let prodPrice = 0;

      if (resv !== undefined) {
        prodPrice = resv.price.order_price;
      }

      item.forEach(val => {
        price = prodPrice + (val.price * val.quantity);
      })
      return price;
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
    },
    computedAdd(val, item) {
      item.quantity = val;
    },
    addEssential(res, opt) {
      console.log('test')
      if(res!==undefined && this.disableState===false) {
        opt.value = this.cloneItem(res);
      }
    },
    updateValue(res, opt) {
      if(res!==undefined) {
        opt.value = this.cloneItem(res);
      }
    },
    emptyOpt(type, val) {
      if(type===0) {
        let arr = [];
        let chk = '';
        this.option1.forEach(item => {
          chk += item.value.id + '/';
          arr.push(item.value);
          item.value = undefined;
        })
        if(this.optionEssId.indexOf(chk)===-1) {
          this.optionEssId.push(chk);
          this.optionEss.push(arr);
        }
        else {
          arr = [];
          chk = '';
        }
      }
      if(type===1) {
        if(this.optionAdd&&this.optionAdd.some(item => item.id === this.option2[val-1].value.id)===false) {
          this.optionAdd.push(this.option2[val-1].value);  
        }
        this.option2[val-1].value = undefined;
      }
      
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
    clickSchedule() {
      this.$root.$emit('page_modal', 'SchedulePeriodBookingModal')
    },
    clickBtn() {
      let today = this.dayjs().format('YYYY-MM-DD');
      if(this.$store.getters.selectedResv === undefined) {
        this.toast('일정을 선택해주세요.');
        return;
      } else if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.resv_date < today) {
        this.toast('오늘 날짜보다 이전 일정으로는 예약할 수 없습니다.');
        return;
      } else if (this.product.is_expired || !this.product.possible_booking_resv) {
        this.toast('마감된 일정으로는 예약할 수 없습니다.')
        return;
      } else if (!this.isOrderablePeriod) {
        this.toast('해당 일정으로는 예약할 수 없습니다.');
        return;
      } else if (this.option1.length > 0 && this.optionEss.length === 0) {
        this.toast('필수 옵션을 선택해주세요.');
        return;
      }
      
      this.routerPush(`order_booking?id=${this.product.id}`);
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
        marginBottom: idx === option.length - 1 ? '0px' : '16px',
        padding: '16px',
      }
    },
    inputCustomStyles() {
      return {
        width: '40px',
        height: '32px',
        backgroundColor: this.brandBgColor.white.backgroundColor,
        border: this.brandBorder.main.border,
        textAlign: 'center',
        fontSize: '12px',
        color: this.brandColor.main.color,
        fontWeight: '500',
        fontFamily: 'Noto Sans CJK KR'
      }
    },
    btnMinusCustomStyle(op) {
      return {
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
      }
    },
    btnPlusCustomStyle(op) {
      return {
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
    },
    optionsQuantityStyle(op) {
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
            this.brandBgColor.sub.backgroundColor : this.brandBgColor.white.backgroundColor,
          color: this.brandColor.help.color,
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
            this.brandBgColor.sub.backgroundColor : this.brandBgColor.white.backgroundColor,
          color: this.brandColor.help.color,
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
    }
  },
  computed: {
    calcPrice() {
      let price = 0;
      let resv = this.$store.getters.selectedResv;
      let essPrice = 0;
      let addPrice = 0;

      if (resv !== undefined) {
        price = resv.price.order_price;
        
        // 옵션가 반영
        if(this.option1.length===0 && this.option2.length===0) {
          price = price * this.order.ordered_count;
        }
        
        if(this.optionEss && this.optionEss.length>0) {
          // let originPrice = 0;
          for(let i=0;i<this.optionEss.length;i++) {
            // originPrice = originPrice + price * this.optionEss[i][0].quantity;
            for (let j=0;j<this.optionEss[i].length;j++) {
              essPrice = essPrice + ((this.optionEss[i][j].price * this.optionEss[i][j].quantity) * this.$store.getters.selectedResv.days);
            }
          }
          price = price + essPrice;
        }
        
        if(this.optionAdd && this.optionAdd.length>0) {
          for(let i=0;i<this.optionAdd.length;i++) {
            addPrice = addPrice + (this.optionAdd[i].price * this.optionAdd[i].quantity);
          }
          price = price + addPrice;
        }
      }
      
      return price;
    },
    discountPrice() {
      let discount_price = 0;
      let has_discount = false;
      if (this.$store.getters.selectedResv) {
        let resv = this.$store.getters.selectedResv;
        // 할인 있을 경우 반영
        if(this.product.price.is_discount) {
          // 시간대 할인
          if(this.product.price.discount_period_type) {
            let start_time = resv.start_time;
            let end_time = resv.end_time;
            let discounts = this.product.discount_time.filter(item => {
              return item.start_time === start_time && item.end_time === end_time;
            }).length;
            if(discounts>0) {
              has_discount = true;
            }
          } 
          // 날짜별 할인
          else {
            let resv_date = resv.org_start_date !== undefined ? resv.org_start_date : resv.resv_date;
            // if(resv_date === undefined) {
            //   resv_date = resv.resv_date;
            // }
            let start_date = this.product.price.start_date;
            let end_date = this.product.price.end_date;
            
            if(this.dayjs(start_date).isBefore(resv_date) && this.dayjs(end_date).isAfter(resv_date)) {
              has_discount = true;
            }
          }
          
          if(has_discount) {
            // 할인율 적용
            if(this.product.price.discount_type === 0) {
              discount_price = this.product.price.price * (this.product.price.discount_rate/100);
            } 
            // 할인금액 적용
            else {
              discount_price = this.product.price.discount_price;
            }
          }
        }
        
      } else {
        discount_price = 0;
      }
      return discount_price;
    },
    essentialState() {
      if(this.option1 && this.option1.length>0) {
        return this.option1.every(item => item.value!==undefined)
      }
      else return false;
    },
    addState() {
      if(this.option2 && this.option2.length>0) {
        return this.option2.some(item => item.value!==undefined)
      }
      else return false;
    },
    isBtnEnable() {
      let today = this.dayjs().format('YYYY-MM-DD');
      if (this.$store.getters.selectedResv === undefined || (this.$store.getters.selectedResv && this.$store.getters.selectedResv.resv_date < today) || this.product.is_expired || !this.isOrderablePeriod || !this.product.possible_booking_resv) {
        return false;
      } else {
        return true;
      }
    },
    resvBtnOpacity() {
      let deco = {
        opacity: 1
      }
      if (this.$store.getters.selectedResv === undefined || this.product.is_expired || !this.isOrderablePeriod) {
        deco.opacity = 0.3;
      }
      return deco;
    },
    isOrderablePeriod() {
      if (this.$store.getters.selectedResv.days + 1 > this.product.maximum) {
        return false;
      } else {
        return true;
      }
    },
    computedSchedule() {
      if (this.$store.getters.selectedResv !== undefined) {
        let start_date = this.$store.getters.selectedResv.resv_date;
        let end_date = this.$store.getters.selectedResv.resv_end_date;
        return `${this.dateFormat(start_date, 'date_10')} ~ ${this.dateFormat(end_date, 'date_10')}`;
      } else {
        return '날짜 선택';
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
    inquiryBtnStyle() {
      let deco = {
        height: '56px',
        padding: '0 24px',
        marginRight: '16px'
      };
      if (this.product.price.price_type !== 0 && this.product.inquiry_conversion_type > 0) {
        deco.marginRight = '0px';
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.divider {
    width: 0.5px;
    height: 100%;
    background-color: #e3e3e3;
  }
</style>

