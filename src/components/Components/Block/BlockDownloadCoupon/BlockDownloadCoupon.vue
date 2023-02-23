<template>
<section>
  <div class="p-bg-white"
    style="position: fixed; border-radius: 20px 20px 0 0; z-index: 9999; overflow: hidden; left: 0; bottom: 0; width: 100%; transition: transform 0.3s ease; will-change: transform">
    <div class="p-border-bottom-sub" :style="pagePadding" style="padding-bottom: 10px">
      <div class="flex-between" style="margin-top: 16px">
        <div>쿠폰 다운로드</div>
        <i @click="$emit('closePage')" class="unselect material-icons">close</i>
      </div>
      <div style="overflow-y: auto; max-height: calc(100vh - 110px)">
        <card-download-coupon
          v-for="(coupon, idx) in couponList" :key="'coupon-'+idx" :style="downloadCardStyle(idx)"
          :coupon="coupon" @getCoupon="$emit('getCouponList')"></card-download-coupon>
      </div>
    </div>
    <div style="padding: 10px 16px">
      <div @click="downloadCouponAll" class="flex-center unselect size-14 weight-500 radius-8 p-bg-brand p-white"
        style="width: 100%; height: 46px">전체받기</div>
    </div>
  </div>
  <div @click="$emit('closePage')"
    style="position: fixed; top: 0; left: 0; z-index: 999; background: rgba(11, 10, 12, 0.35); width: 100%; height: 100%; opacity: 1"></div>
</section>
</template>
<script>
import CardDownloadCoupon from "@/components/Components/Card/CardDownloadCoupon.vue"

export default {
  name: 'BlockDownloadCoupon',
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
    },
    downloadCardStyle(idx) {
      let deco = {
        marginBottom: '16px'
      }
      
      if (idx === 0) {
        deco.marginTop = '16px'
      }
      
      if (idx === this.couponList.length - 1) {
        deco.marginBottom = '0px'
      }
      
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


