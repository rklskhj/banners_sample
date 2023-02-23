<template>
<div v-if="showBtn" class="parBtnDiv p-bg-white flex-align p-border-top-sub" style="gap: 0 20px" :style="buttonWidth">
  <div v-if="product.price.price_type === 0" style="flex: 0 0 auto">
    <div class="flex-align" style="gap: 0 4px">
      <div v-if="$store.getters.selectedResv && $store.getters.selectedResv.price && $store.getters.selectedResv.price.is_discount"
        class="size-18 bold p-highlight">
        {{ $store.getters.selectedResv.price.discount_rate > 0 ? `${$store.getters.selectedResv.price.discount_rate}%` : `-${currency($store.getters.selectedResv.price.discount_price / $store.getters.selectedResv.days)}` }}</div>
      <div class="size-18 bold p-main">{{ $store.getters.selectedResv ? currencyNum($store.getters.selectedResv.price.price_per_day / $store.getters.selectedResv.days) : currencyNum(product.price.price) }}<span class="size-14 weight-400">원/박</span></div>
    </div>
    <div class="unselect size-14 weight-400 p-main" style="margin-top: 6px; text-decoration: underline"
      @click="clickSchedule">{{ computedSchedule }}</div>
  </div>
  <btn v-if="product.price.price_type === 0"
      @clicked="clickBtn"
      class="p-white"
      :backgroundColor="isBtnEnable ? brandBgColor.primary : brandBtn.bg.gray"
      :customStyle="customStyle"
      :ga="ga"
      :useWidth="false"
      style="flex: 1"
      :style="resvBtnOpacity"
  >{{!isBtnEnable && (product.is_expired || !product.possible_booking_resv) ? '예약마감' : name}}</btn>
  <portal to="double-layer-modal">
    <block-booking-option-choose-action-sheet v-if="product"
      :product="product"
      :optionState="optionState"
      :vDim="vDim"
      @closePage="clickBack"></block-booking-option-choose-action-sheet>
  </portal>
</div>
</template>
<script>
import BlockBookingOptionChooseActionSheet from "@/components/Components/Block/BlockBookingOptionChooseActionSheet/BlockBookingOptionChooseActionSheet.vue"

export default {
  name: 'ButtonBooking',
  components: {
    BlockBookingOptionChooseActionSheet
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
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "vDim": false,
      "loading": false,
      "product": undefined,
      "showBtn": false,
      "optionState": false
    }
  },
  created() {
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
    this.$nextTick(() => {
      this.getEnableResv();
      this.getData();
    })
  },
  beforeDestroy() {
    // 이동되는 페이지가 주문/결제 페이지 또는 검색 페이지가 아닌 경우, 선택했던 날짜 초기화
    if (this.$route.path !== '/order_booking' && this.$route.path !== '/search') {
      this.$store.commit('setSelectedResv', undefined);
    }
    this.unlock(document.querySelector('html'));
    this.unlock(document.querySelector('body'));
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
    clickSchedule() {
      this.$root.$emit('page_overlay', 'SchedulePeriodBookingOverlay')
    },
    getData() {
      if(this.loading) return;
      
      this.loading = true;
      let field = 'id,name,img,sns_inquiry_type,partner,homepage,enable_homepage,kakao,inquiry_conversion_type,order_conversion_type';
      field += ',price,sum_price,maximum,minimum,is_expired,stock_infinite,booking_policy,selectors,payment_type,possible_booking_resv'
      let url = `user/${this.user.user_id}/mapping/product/${this.$route.query.id}?fields=${field}`;
      if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.resv_date && this.$store.getters.selectedResv.resv_end_date) {
        url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`;
        url += `&booking=${this.$store.getters.selectedResv.resv_date},${this.$store.getters.selectedResv.resv_end_date}`
      }
      url += '&hit=false';
      this.$axios.get(url)
      .then(res => {
        this.loading = false;
        this.product = res.data;
        if (this.product.price.price_type === 0) {
          this.showBtn = true;
        } else {
          this.showBtn = this.product.inquiry_conversion_type > 0;
        }
      }).catch(()=>{
        this.loading = false;
      });
    },
    lock(element) {
      element.style.overflow = 'hidden';
      element.style.touchAction = 'none';
    },
    unlock(element) {
      element.style.removeProperty('overflow');
      element.style.removeProperty('touch-action');
    },
    clickBtn() {
      let today = this.dayjs().format('YYYY-MM-DD');
      let resv = this.cloneItem(this.$store.getters.selectedResv);
      let param = {};

      if (this.$store.getters.selectedResv === undefined) {
        this.toast('일정을 선택해주세요.');
        return;
      } else if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.resv_date < today) {
        this.toast('오늘 날짜보다 이전 일정으로는 예약할 수 없습니다.');
        return;
      } else if (this.product.is_expired || !this.product.possible_booking_resv) {
        this.toast('마감된 일정으로는 예약할 수 없습니다.');
        return;
      } else if (!this.isOrderablePeriod) {
        this.toast('해당 일정으로는 예약할 수 없습니다.');
        return;
      }
      
      if (this.product.selectors.length > 0) {
        history.pushState('push option', '');
        this.$store.commit('setPopstate', 'push option');
        this.optionState = true;
        this.lock(document.querySelector('html'));
        this.lock(document.querySelector('body'));
      } else {
        if(resv.period) {
          param = resv;
          param.order_price = 0;
          param.discount_price = 0;
          param.product_id = this.product.id;
        }
        
        param.ordered_count = 1;
        param.discount_price = resv !== undefined ? resv.price.discount_price : 0;
        param.order_price = resv !== undefined ? resv.price.order_price : 0;
        param.product = this.cloneItem(this.product);
        param.resv = this.$store.getters.selectedResv;
        this.$store.commit('setReservation', param);
        this.$store.commit('setProductId', this.$route.query.id);
        setTimeout(() => {
          this.routerPush(`/order_booking?id=${this.$route.query.id}`);
        }, 500)
        
      }
      // this.routerPush(`reserve_option_booking?id=${this.$route.query.id}`);
    },
    clickBack() {
      history.back();
      this.unlock(document.querySelector('html'));
      this.unlock(document.querySelector('body'));
    }
  },
  computed: {
    isBtnEnable() {
      let today = this.dayjs().format('YYYY-MM-DD');
      if (this.$store.getters.selectedResv === undefined || (this.$store.getters.selectedResv && this.$store.getters.selectedResv.resv_date < today) || this.product.is_expired || !this.isOrderablePeriod || !this.product.possible_booking_resv) {
        return false;
      } else {
        return true;
      }
    },
    buttonWidth() {
      return `width:${this.$store.getters.deviceWidth}px`;
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
        let start_date = this.dateFormat(this.$store.getters.selectedResv.resv_date, 'date_6');
        let end_date = this.dateFormat(this.$store.getters.selectedResv.resv_end_date, 'date_6');
        return `${start_date} ~ ${end_date}`;
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
        marginLeft: '13px',
        width: '50%'
      }
      if (this.product.price.price_type !== 0 && this.product.inquiry_conversion_type > 0) {
        deco.marginLeft = '0px';
        deco.width = '100%';
      }
      return deco;
    }
  },
  watch: {
    '$store.getters.selectedResv'(n, o) {
      if (n !== o) {
        this.getData();
      }
    },
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
.sweet-content-content {
    font-weight: normal;
  }

.parBtnDiv {
  position:fixed;
  bottom: 0;
  padding: 10px 16px;
  width: 100%;
  height: 68px;
  z-index: 101;
}
</style>

