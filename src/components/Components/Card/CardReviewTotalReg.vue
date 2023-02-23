<template>
<div :style="[containStyle, brandColor.main]">
  <div class="flex-between">
    <div>
      <rating :rateSize="16" :value="product.rate"
        rateColor="#ffc351" style="margin-bottom:4px"></rating>
      <div class="flex" style="font-size:16px;align-items:baseline">
        <div style="margin-right:8px" class="size-24 weight-500">{{ computedRate }}</div>
        <div class="size-12" :style="brandColor.sub">{{ product.reviews_count }}개의 사용자 리뷰</div>
      </div>
    </div>
    
    <!--<div :style="[brandColor.main, brandBgColor.sub]" style="padding:9px 14px;border-radius:4px" -->
    <!--  class="size-12" @click="clickBtn">-->
    <!--  리뷰 작성-->
    <!--</div>-->
  </div>
</div>
</template>
<script>

export default {
  name: 'CardReviewTotalReg',
  components: {

  },
  mixins: [

  ],
  props: {
    product: {
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
    clickBtn() {
      if(this.isLogin) {
        this.routerPush(`review_reg?product_id=${this.product.id}`)
      }
      else {
        this.routerPush('signin')
      }
    }
  },
  computed: {
    containStyle() {
      return {
        padding: '32px 0',
      }
    },
    computedRate() {
      return this.product.rate.toFixed(1);
    }
  },
  watch: {
    
  }
}
</script>


