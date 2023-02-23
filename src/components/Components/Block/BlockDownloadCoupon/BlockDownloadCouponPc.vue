<template>
<div style="text-align: left">
  <div class="flex-between">
    <div class="size-24 weight-500 full-width text-center p-main">쿠폰 다운로드</div>
    <i @click="$emit('close')" class="material-icons unselect p-main">close</i>
  </div>
  <div style="margin-top: 44px">
    <card-download-coupon
      v-for="(coupon, idx) in couponList" :key="'coupon-'+idx" :style="downloadCardStyle(idx)"
      :coupon="coupon" @getCoupon="$emit('getCouponList')"></card-download-coupon>
  </div>
  <div class="flex-align" style="margin-top: 20px">
    <!--<div @click="$emit('close')" class="unselect flex-center size-14 bold"-->
    <!--  style="height: 48px; width: 100%; border-radius: 8px; margin-right: 10px"-->
    <!--  :style="[{backgroundColor: brandColor.help.color}, brandColor.white]">닫기</div>-->
    <div @click="downloadCouponAll" class="unselect flex-center size-14 bold radius-8 p-bg-brand p-white"
      style="height: 48px; width: 100%">전체 받기</div>
  </div>
</div>
</template>
<script>
import CardDownloadCoupon from "@/components/Components/Card/CardDownloadCoupon.vue"

export default {
  name: 'BlockDownloadCouponPc',
  components: {
    CardDownloadCoupon
  },
  mixins: [

  ],
  props: {
    couponList: {
      type: Array,
      required: true,
    },

  },
  data() {
    return {
      "count": 0
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    downloadCardStyle(idx) {
      let deco = {
        marginBottom: '16px'
      }
      
      if (idx === this.couponList.length - 1) {
        deco.marginBottom = '0px'
      }
      
      return deco;
    },
    downloadCouponAll() {
      if (!this.isLogin) {
        this.toast('로그인 후 쿠폰을 다운로드 받을 수 있습니다.');
        this.routerPush('signin');
      } else {
        let downloadEnableList = [];
        this.couponList.forEach(coupon => {
          if (coupon.enable_status.enable) {
            downloadEnableList.push(coupon);
          }
        })
        if (downloadEnableList.length > 0) {
          this.downloadCouponResult(downloadEnableList);
        } else {
          this.toast('다운로드 가능한 쿠폰이 없습니다.');
        }
      }
    },
    async downloadCouponResult(list) {
      this.count = 0;

      for await (const coupon of list) {
        try {
          let res = await this.$axios.post(`/user/${this.user.user_id}/download_coupon/${coupon.id}`)
          if (res.status !== 200) {
            this.count += 1;
          }
        } catch (err) {
          this.count += 1;
        }
      }
      if (this.count > 0) {
        this.toast('다운로드 불가능한 쿠폰을 제외한 모든 쿠폰을 다운로드 받았습니다.');
      } else {
        this.toast('전체 쿠폰 목록을 다운로드 받았습니다.');
      }
      this.$emit('getCouponList')
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


