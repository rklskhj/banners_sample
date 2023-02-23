<template>
<div>
  <transition name="slide">
    <div v-if="optionState" class="full-width position-fixed" 
      style="height: 100%" :style="optionModalStyle">
      <transition name="fade">
        <div v-if="vDim" @click="$emit('closePage')" class="dim" style="height: 100%"></div>
      </transition>
      
      <div class="full-width position-absolute option-content p-bg-white"
        style="max-height: 70vh">
        <div style="padding: 0 16px 2px">
          <div class="size-16 weight-500"
            style="padding-bottom: 16px; color: black">옵션선택</div>
          

          <div v-if="option1.length===0 && option2.length===0" style="margin-top: 12px">
            <div class="size-14" :style="brandColor.sub"
              style="line-height:14px; margin:24px 0px 8px;">수량</div>
            <quantity-input-popup v-if="product" :value.sync="order.ordered_count" 
                                  :min="product.minimum" :max="product.maximum"
                                  :numberStyle="numberStyle"
                                  :numInput="false"></quantity-input-popup>
          </div>
          <div v-else style="padding-top:12px; overflow-y: auto; max-height: 40vh">
            <div class="size-14 p-sub" style="margin-bottom: 8px">* 필수옵션</div>
            <template v-for="(item1, idx) in option1">
              <c-input-dropdown v-if="item1.options && item1.options.length !== 0" :key="'key-'+idx"
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
                :placeholder="item1.name"
                :fullState="essentialState"
                :fullLength="option1.length"></c-input-dropdown>
            </template>
            <div v-if="option2 && option2.length !== 0" style="margin-top: 24px">
               <div class="size-14 p-sub" style="margin-bottom: 8px">선택옵션</div>
              <template v-for="(item2,idx) in option2">
                <c-input-dropdown v-if="item2.options && item2.options.length !== 0" :key="'key-'+idx"
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
            
            <!-- 필수 옵션 수량 -->
            <template v-for="(item,idx) in optionEss">
              <div v-if="optionEss&&optionEss.length>0" :key="'esskey-'+idx"
                :style="optQuantityStyle(idx, optionEss)">
                <div class="flex-between">
                  <div class="size-12 ellipsis p-sub"
                    style="display: block; width: 100%">{{ computedName(item) }}</div>
                  <i class="material-icons p-sub3 unselect" @click="deleteEss(idx)"
                    style="font-size: 20px">close</i>
                </div>
                <div class="flex-between" style="margin-top: 12px; align-items: flex-end">
                  <quantity-input v-if="option1[0].maximum>1"
                    :min="item[0].minimum"
                    :max="item[0].maximum"
                    :inputStyle="inputCustomStyles()"
                    :btnMinusStyle="btnMinusCustomStyle(item[0])"
                    :btnPlusStyle="btnPlusCustomStyle(item[0])"
                    @update:value="val => computedVal(val,item)"
                    :disableState="disableState"
                    :value="item[0].quantity"
                    :numInput="false"></quantity-input>
                  <div class="size-18 weight-500">{{ computedEssprice(item) | currency }}</div>
                </div>
                <!-- <dropdown-option-amount v-if="option1[0].maximum>1"
                    style="margin-top: 12px"
                    :amounts="item[0].maximum"
                    :value="item[0].quantity"
                    @update:value="val => computedVal(val, item)"></dropdown-option-amount> -->
              </div>
            </template>
            <!-- 추가 옵션 수량 -->
            <template v-for="(item2,idx) in optionAdd">
              <div v-if="optionAdd&&optionAdd.length>0" :key="'item2-keys-'+idx"
                :style="optQuantityStyle(idx, optionAdd)">
                <div class="flex-between">
                  <div class="size-12 ellipsis p-sub"
                    style="display: block; width: 100%">{{ item2.label }}</div>
                  <i class="material-icons p-sub3 unselect" @click="deleteAdd(idx)"
                    style="font-size: 20px">close</i>
                </div>
                <div class="flex-between" style="margin-top: 12px; align-items: flex-end">
                  <quantity-input v-if="item2.maximum>1"
                    :min="item2.minimum"
                    :max="item2.maximum"
                    :inputStyle="inputCustomStyles()"
                    :btnMinusStyle="btnMinusCustomStyle(item2)"
                    :btnPlusStyle="btnPlusCustomStyle(item2)"
                    @update:value="val => computedAdd(val,item2)"
                    :value="item2.quantity"
                    :numInput="false"></quantity-input>
                  <div class="size-18 weight-500">{{ item2.price * item2.quantity | currency }}</div>
                </div>
                <!-- <dropdown-option-amount v-if="item2.maximum>1"
                  style="margin-top: 12px"
                  :amounts="item2.maximum"
                  :value="item2.quantity"
                  @update:value="val => computedAdd(val, item2)"></dropdown-option-amount> -->
              </div>
            </template>
          </div>
        </div>
        
        <div class="p-border-top-sub"
          style="padding-top: 8px; padding-bottom: 8px">
          <div class="flex-between full-width p-main" style="gap: 0 16px; padding: 0 16px">
            <div class="size-14 weight-500 p-sub">총 금액({{ $store.getters.selectedResv.days }}박)</div>
            <div class="size-16 bold" style="flex: 1; text-align: right">
              {{ calcPrice | currencyNum }}<span class="size-16 weight-400">원</span></div>
          </div>
        </div>
        
        <div class="flex-align" style="padding: 0 16px">
          <btn @clicked="clickAccount" :color="btnStyle.color" :backgroundColor="btnStyle.bg"
              fontWeight="normal" :customStyle="{fontSize: '14px', height: '48px'}">
              예약하기</btn>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
import DropdownOptionAmount from "@/components/Components/Common/DropdownOptionAmount.vue"
import FormMixin from "@/components/Components/Mixins/FormMixin"

export default {
  name: 'BlockBookingOptionChooseActionSheet',
  components: {
    DropdownOptionAmount
  },
  mixins: [
    FormMixin
  ],
  props: {
    vDim: {
      type: Boolean,
    },
    product: {
      type: Object,
      required: true,
    },
    optionState: {
      type: Boolean,
    },

  },
  data() {
    return {
      "resv": {},
      "order": {
        "ordered_count": 1
      },
      "option1": [],
      "option2": [],
      "optionAdd": [],
      "optionEss": [],
      "optionEssId": [],
      "disableState": false
    }
  },
  created() {
    console.log('test')
  },
  mounted() {
    this.$nextTick(() => {
      this.getOption1();
      this.getOption2();
    })
  },
  
  methods: {
    getOption1() {
      let opt = this.product.selectors.filter(item => { return item.option_type === 0});
      if(opt.length>0) {
        for(let i=0; i < opt.length; i++) {
          opt[i].index = i+1;
        }
        opt.forEach(item => {
          this.option1.push(this.setOption(item));
        })
      }
    },
    getOption2() {
      let opt = this.product.selectors.filter(item => { return item.option_type === 1});
      if(opt.length>0) {
        for(let i=0; i < opt.length; i++) {
          opt[i].index = i+1;
        }
        opt.forEach(item => {
          this.option2.push(this.setOption(item));
        })
      }
    },
    deleteEss(idx) {
      this.optionEss.splice(idx, 1);
      this.optionEssId.splice(idx, 1);
    },
    deleteAdd(idx) {
      this.optionAdd.splice(idx, 1);
    },
    clickAccount() {
      if(!this.btnEnable) {
        return;
      }
      let resv = this.cloneItem(this.$store.getters.selectedResv);
      let param = {};
      // 숙박 예약(기간)
      if(resv.period) {
        param = resv;
        param.order_price = 0;
        param.discount_price = 0;
        param.product_id = this.product.id;
      }
      
      // 옵션 없을 때
      if(!this.option1 && !this.option2) {
        param.ordered_count = this.order.ordered_count;
        param.discount_price = this.discountPrice;
      } 
      // 옵션 있을 때
      else {
        // 필수 옵션
        if(this.option1) {
          param.option1 = this.optionEss;
        }
        // 추가 옵션
        if(this.option2) {
          param.option2 = this.optionAdd;
        }
      }
      
      if (this.conversion===11) {
        param.discount_price = this.discountPrice;
      }
        
      // 금액 적용
      param.order_price = this.calcPrice;
      
      param.product = this.product;
      this.resv = this.$store.getters.selectedResv;
      param.resv = this.resv;
      this.$store.commit('setReservation', param);
      this.$store.commit('setProductId', this.$route.query.id);
      this.$emit('closePage');
      setTimeout(() => {
        this.routerPush(`/order_booking?id=${this.$route.query.id}`);
      }, 500)
    },
    computedVal(val, item) {
      let sum = 0;
      let max = this.option1[0].maximum;
      item.forEach(res => {
        res.quantity = val;
      });
      item.quantity = val;
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
    updateValue(res, opt) {
      if(res!==undefined) {
        opt.value = this.cloneItem(res);
      }
    },
    addEssential(res, opt) {
      if(res!==undefined && this.disableState===false) {
        opt.value = this.cloneItem(res);
        // this.optionEss.push(this.cloneItem(res));
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
          this.optionEss.push(arr)
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
      if(opt.index) {
        option.index = opt.index;
      }
      opt.options.forEach(item=>{
        item.label = item.name;
        item.quantity = opt.minimum;
        option.options.push({
          value: item,
          label: item.label,
          type: opt.option_type,
          index: opt.index
        });
      });
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
    optionDropdownStyle(idx, option) {
      let deco = {
        container: {
          margin: idx === option.length - 1 ? '0px' : '0 0 16px 0',
        },
        label: {
          color: this.brandColor.sub.color,
          fontSize: '14px',
          lineHeight: '14px',
          margin: '0px 0px 6px'
        },
        dropdown: {
          backgroundColor: this.brandBgColor.white.backgroundColor,
          color: this.brandColor.sub.color,
          width: '100%',
          height: '48px',
          padding: '12px 16px',
          fontSize: '16px',
          fontWeight: 500,
          borderRadius: '8px',
          border: this.brandBorder.sub.border
        },
        dropList: {
          top: '48px',
          borderRadius: this.radius.borderRadius,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.1)'
        },
        dropItem: {
          backgroundColor: this.brandBgColor.white.backgroundColor,
          color: this.brandColor.sub.color,
          fontWeight: 500,
          padding: '14px 16px',
          // borderBottom: option.options && idx === option.options.length - 1 ? 'none' : this.brandBorder.main.border
        },
        dropArrowIcon: {
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '24px',
          color: this.brandColor.main.color
        },
        placeholder: {
          fontSize: '16px',
          color: this.brandColor.sub.color,
          fontWeight: 500,
        }
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
        backgroundColor: this.brandBgColor.sub.backgroundColor,
        marginTop: idx === 0 ? '20px' : '12px',
        marginBottom: idx === option.length - 1 ? '0px' : '12px',
        padding: '16px',
        borderRadius: '4px',
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
          this.brandBgColor.sub.backgroundColor : this.brandBgColor.white.backgroundColor,
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
          this.brandBgColor.sub.backgroundColor : this.brandBgColor.white.backgroundColor,
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
  computed: {
    optionModalStyle() {
      let deco = {
        top: 0,
        left: 0,
        zIndex: 9999,
        width: this.$store.getters.deviceWidth + 'px'
      }
      if (this.$store.getters.browserType === 'pc') {
        deco.left = `calc(50% - (${this.$store.getters.deviceWidth} / 2)px)`;
      }
      return deco;
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
    days() {
      if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.days) {
        return this.$store.getters.selectedResv.days;
      } else {
        return 1;
      }
    },
    conversion() {
      return this.product.order_conversion_type;
    },
    btnEnable() {
      let enable = this.$store.getters.selectedResv !== undefined;
      if(this.option1 && this.option1.length !== 0) {
        enable = (this.optionEss.length >0 && this.$store.getters.selectedResv !== undefined);
      }
      return enable;
    },
    btnStyle() {
      let deco = {
        color: this.brandColor.white,
        bg: this.brandBtn.bg.gray
      };
      if(this.btnEnable) {
        deco = {
          color: this.brandColor.white,
          bg: this.brandBgColor.primary
        }
      }
      
      return deco;
    },
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
          let originPrice = price;
          for(let i=0;i<this.optionEss.length;i++) {
            for (let j=0;j<this.optionEss[i].length;j++) {
              essPrice = essPrice + ((this.optionEss[i][j].price * this.optionEss[i][j].quantity) * this.$store.getters.selectedResv.days);
            }
          }
          price = originPrice + essPrice;
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
      let resv = this.$store.getters.selectedResv;
      let discount_price = 0;
      if (resv !== undefined) {
        discount_price = resv.price.discount_price;
      }
      return discount_price;
    },
    inputStyle() {
      return {
        backgroundColor: this.brandBgColor.white.backgroundColor,
        padding: '16px',
        borderRadius: '4px'
      }
    },
    numberStyle() {
      return {
        backgroundColor: '#ffffff',
        padding: '2px 16px',
        borderRadius: '4px'
      }
    },
    dateText() {
      let text = '일정을 선택해주세요.'
      if(this.$store.getters.selectedResv) {
        let resv = this.$store.getters.selectedResv;
        if(resv.period) {
          let start_date = this.dateFormat(resv.resv_date, 'date_5');
          let end_date = this.dateFormat(resv.resv_end_date, 'date_5');
          text = start_date === end_date ? start_date : `${start_date} ~ ${end_date}`;
        } else {
          text = this.dateFormat(resv.org_start_date, 'date_5'); 
        }
      }
      
      return text;
    },
    timeText() {
      let text = '';
      if(this.$store.getters.selectedResv) {
        let resv = this.$store.getters.selectedResv;
        if(!resv.period) {
          if(resv.all_time) {
            text = '종일';
          } else {
            text = `${resv.start_time} ~ ${resv.end_time}`; 
          }  
        }
      }
      return text;
    },
    dateTextFull() {
      let text = '일정을 선택해주세요.'
      if(this.$store.getters.selectedResv) {
        let resv = this.$store.getters.selectedResv;
        if(resv.period) {
          let start_date = this.dateFormat(resv.resv_date, 'date_13');
          let end_date = this.dateFormat(resv.resv_end_date, 'date_13');
          text = start_date === end_date ? start_date : `${start_date} ~ ${end_date}`;
        } else {
          text = this.dateFormat(resv.org_start_date, 'date_13'); 
        }
      }
      
      return text;
    },
    closeStyle() {
      return {
        borderRadius: '4px',
        width: '24px',
        height: '24px',
        lineHeight: '24px',
        backgroundColor: this.brandBgColor.primary.backgroundColor,
        color: 'white',
        textAlign: 'center',
        marginLeft: '10px',
        fontSize: '18px'
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.dim {
    background-color: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .option-content {
    left: 0;
    bottom: 0;
    border-radius: 12px 12px 0px 0px;
    padding: 16px 0px 32px;
  }
</style>

