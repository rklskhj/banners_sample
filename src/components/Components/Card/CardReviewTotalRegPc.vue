<template>
<div :style="[containStyle, brandColor.main]">
  <div class="flex weight-500" style="justify-content:space-between;align-items:flex-end">
    <div>
      <rating :rateSize="20" :value="product.rate" rateColor="#ffc351" style="margin-bottom:4px"></rating>
      <div class="flex" style="font-size:16px;align-items:baseline">
        <div style="margin-right:8px" class="size-32">{{ computedRate }}</div>
        <div class="size-20" :style="brandColor.sub">{{ product.reviews_count }}개의 리뷰</div>
      </div>
    </div>
    
    <!--<div :style="[brandColor.main, brandBgColor.white, radius]" style="padding:12px 16px;height:48px" -->
    <!--  class="size-14 unselect" @click="clickBtn">-->
    <!--  리뷰 작성-->
    <!--</div>-->
  </div>
</div>
</template>
<script>

export default {
  name: 'CardReviewTotalRegPc',
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
    //this.login_required = true;
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


