<template>
<!--<div class="flex-between"-->
<!--  style="width: 100%; border-radius: 8px"-->
<!--  :style="[brandBorder.sub, brandBgColor.white]">-->
<!--  <div style="text-align: left">-->
<!--    <div class="size-16" :style="brandColor.brand">-->
<!--      {{ coupon.discount_type === 0 ? `${coupon.discount_rate}%` : currency(coupon.discount_price) }}</div>-->
<!--    <div class="size-14" :style="brandColor.main">{{ coupon.name }}</div>-->
<!--    <div v-if="coupon.enable_download_limit" class="size-12" :style="brandColor.sub">선착순 {{ coupon.download_limit_count }}장</div>-->
<!--    <div v-if="coupon.condition !== 0" class="size-12" :style="brandColor.sub">{{ currency(coupon.condition) }} 이상 구매 시</div>-->
<!--    <div class="size-12" :style="brandColor.sub">적용 대상: {{ available_range(coupon) }}</div>-->
<!--    <div v-if="coupon.limit_type === 0" class="size-12" :style="brandColor.sub">발급 후 {{ coupon.few_day }}일 동안 사용</div>-->
<!--    <div v-else-if="coupon.limit_type === 1" class="size-12" :style="brandColor.sub">~{{ dateFormat(coupon.end_date, 'date_3') }}까지 사용</div>-->
<!--    <div v-else-if="coupon.limit_type === 2" class="size-12" :style="brandColor.sub">-->
<!--      {{ dateFormat(coupon.coupon_start, 'date_time_7') }} ~ {{ dateFormat(coupon.coupon_end, 'date_time_7') }}</div>-->
<!--  </div>-->
<!--  <div>-->
<!--    <div v-if="coupon.enable_status.text !== '다운로드 기간 만료'"-->
<!--      @click="downloadCoupon(coupon)" class="flex-center" :class="[{unselect: coupon.enable_status.enable}]"-->
<!--      style="width: 40px; height: 40px; border-radius: 20px"-->
<!--      :style="{backgroundColor: coupon.enable_status.enable ? brandBgColor.brand.backgroundColor : '#dddddd'}">-->
<!--      <i class="material-icons" style="font-size: 18px" :style="brandColor.white">save_alt</i>-->
<!--    </div>-->
<!--    <div v-if="coupon.enable_status.text !== '가능'" class="size-10" style="text-align: center; width: 40px"-->
<!--      :style="{color: coupon.enable_status.enable === true ? brandColor.brand.color : '#777777' }">{{ coupon.enable_status.text }}</div>-->
<!--  </div>-->
<!--</div>-->

<div class="full-width overflow-hidden radius-8 p-border-sub p-bg-white">
  <div class="flex">
    <div class="col-9" style="padding: 16px 8px 20px 20px">
      <div class="flex-between" style="margin-bottom: 16px">
        <div>
          <div class="size-30 bold p-primary">
            {{ discount }}<span class="size-18 weight-500">{{ coupon.discount_type === 0 ? '% 할인' : '원' }}</span>
          </div>
          <div class="size-10 text-center flex-center radius-4 p-border-primary p-primary p-bg-white"
            :class="{'unselect': coupon.available_range !== 0}"
            style="display: inline-block; height: 16px; padding: 0 6px">
            {{ available_range(coupon) }}
          </div>
        </div>
        <div class="size-12 weight-500 flex-center text-center p-bg-sub p-sub"
          :style="benefitsTypeStyle">{{ benefitsType }}</div>
      </div>
      <div class="size-16 weight-500 p-main">{{ coupon.name }}</div>
      <div v-if="coupon.condition !== 0" class="size-12 p-sub2">
        최소 주문금액 {{ currency(coupon.condition) }}</div>
      
      <div v-if="coupon.limit_type === 0" class="size-12 p-primary">
        발급 후 {{ coupon.few_day }}일 동안 사용</div>
      <div v-else-if="coupon.limit_type === 1" class="size-12 p-primary">
        ~{{ dateFormat(coupon.end_date, 'date_3') }}까지 사용</div>
      <div v-else-if="coupon.limit_type === 2" class="size-12 p-primary">
        {{ dateFormat(coupon.coupon_start, 'date_time_7') }} ~ {{ dateFormat(coupon.coupon_end, 'date_time_7') }}</div>
    </div>
    <div class="col-3 flex-center p-border-left-sub"
      :class="{
        'p-bg-brand1': coupon.enable_status.text !== '마감' && coupon.enable_status.text !== '완료',
        'p-bg-white': coupon.enable_status.text === '마감' || coupon.enable_status.text === '완료'
      }"
      style="border-left-style: dashed">
      <div :class="{'unselect': coupon.enable_status.enable}"
        style="text-align: center" @click="downloadCoupon(coupon)">
        <i class="material-icons" style="font-size: 24px"
          :style="downloadBtnStyle(coupon)">save_alt</i>
        <div v-if="coupon.enable_status.text !== '가능'"
          class="size-12" style="text-align: center"
          :class="{
            'p-primary': coupon.enable_status.enable,
            'p-sub2': !coupon.enable_status.enable
          }">{{ coupon.enable_status.text }}
        </div>
      </div>
      
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'CardDownloadCoupon',
  components: {

  },
  mixins: [

  ],
  props: {
    coupon: {
      type: Object,
      required: true,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    available_range(coupon) {
      if (coupon.available_range === 0) {
        return '전체 상품 사용 가능'
      } else if (coupon.available_range === 1) {
        return '특정 상품'
      } else if (coupon.available_range === 2) {
        return '특정 카테고리'
      } else if (coupon.available_range === 3) {
        return '특정 파트너'
      }
    },
    downloadCoupon(coupon) {
      if (!this.isLogin) {
        this.toast('로그인 후 쿠폰을 다운로드 받을 수 있습니다.');
        this.routerPush('signin');
      } else {
        if (!coupon.enable_status.enable) {
          this.toast('다운로드 받을 수 없는 쿠폰입니다.');
          return;
        } else {
          this.$axios.post(`/user/${this.user.user_id}/download_coupon/${coupon.id}`).then(res => {
            if (res.status === 200) {
              this.toast('쿠폰이 다운로드 되었습니다.')
            } else {
              this.toast('쿠폰 다운로드에 실패했습니다.');
            }
          }).catch(() => {
            this.toast('쿠폰 다운로드에 실패했습니다.');
          })
          this.$emit('getCoupon')
        }
      }
    },
    downloadBtnStyle(coupon) {
      let deco = {
        color: this.brandColor.primary.color
      };
      if (!coupon.enable_status.enable) {
        deco.color = this.brandBorder.main.border.replace('1px solid ', '');
      }
      return deco;
    }
  },
  computed: {
    discount() {
      if (this.coupon.discount_type === 0) return `${this.coupon.discount_rate}`;
      if (this.coupon.discount_type === 1) return this.currencyNum(this.coupon.discount_price);
    },
    benefitsTypeStyle() {
      let deco = {
        width: '48px',
        height: '48px',
        borderRadius: '50px',
        padding: this.benefitsType === '배송비 할인' ? '6px' : '8px'
      }
      return deco;
    },
    benefitsType() {
      if (this.coupon.benefits_type === 0) {
        return '상품 할인';
      } else if (this.coupon.benefits_type === 1) {
        return '주문 할인';
      } else if (this.coupon.benefits_type === 2) {
        return '배송비 할인';
      }
    }
  },
  watch: {
    
  }
}
</script>


