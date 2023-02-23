<template>
<div v-if="showBtn" class="parBtnDiv flex-align p-bg-white" style="gap: 0 8px" :style="buttonWidth">
    <button-inquirying v-if="product" :product="product"
      :text="product.price.price_type === 0 ? '문의' : '문의하기'"
      :style="inquiryBtnStyle"></button-inquirying>
    <btn v-if="product.price.price_type === 0"
        @clicked="clickBtn"
        class="p-white"
        :backgroundColor="isBtnEnable ? brandBgColor.primary : brandBtn.bg.gray"
        :customStyle="customStyle"
        :ga="ga"
    >{{product && !product.possible_reservation_resv ? '예약마감' : name}}</btn>
   <!-- <icon-circle-like likeType="product" color="main" borderRadius="8px" style="margin:0 12px;" :containStyle="containStyle"></icon-circle-like>
   <div class="flex-align">
      <icon-circle-like likeType="product" color="main" borderRadius="8px" style="margin:0 12px;"></icon-circle-like>
      <icon-circle-share @share="$refs.share.share=true" color="main"></icon-circle-share>
    </div>
    <share ref="share" v-if="product" :product="product"></share>-->
  </div>
</template>
<script>
import ButtonInquirying from "@/components/Components/Button/ButtonInquirying.vue"

export default {
  name: 'ButtonReservation',
  components: {
    ButtonInquirying
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
      "product": undefined,
      "showBtn": false
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  beforeDestroy() {
    // 이동되는 페이지가 주문/결제 페이지가 아닌 경우, 선택했던 날짜 초기화
    if (this.$route.path !== '/reserve_option_reservation') {
      this.$store.commit('setSelectedResv', undefined);
    }
  },
  
  methods: {
    getData() {
      let field = 'id,sns_inquiry_type,partner,price,homepage,enable_homepage,kakao,inquiry_conversion_type,order_conversion_type,possible_reservation_resv';
      let url = `user/${this.user.user_id}/mapping/product/${this.$route.query.id}?fields=${field}`;
      if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.resv_date && this.$store.getters.selectedResv.resv_end_date) {
        url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`;
        url += '&hit=false';
      }
      this.$axios.get(url)
      .then(res => {
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
    clickBtn() {
      if (!this.product.possible_reservation_resv) {
        return;
      }
      this.$store.commit('setSelectedResv', undefined);
      let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
      if (currentDate >= this.product.price.start_date && currentDate <= this.product.price.end_date) {
        this.$root.$emit('page_overlay', 'ScheduleReservationOverlay');
        // this.routerPush(`reserve_option_reservation?id=${this.$route.query.id}`);
      } else {
        this.toast('판매 기간이 종료된 상품은 예약할 수 없습니다.');
      }
    }
  },
  computed: {
    buttonWidth() {
      return `width:${this.$store.getters.deviceWidth}px`;
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
        width: '80px'
      }
      if (this.product.price.price_type !== 0 && this.product.inquiry_conversion_type > 0) {
        deco.marginRight = '0px';
        deco.width = '100%';
      }
      return deco;
    },
    isBtnEnable() {
      if (this.product && !this.product.possible_reservation_resv) {
        return false;
      } else {
        return true;
      }
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

