<template>
<div :style="[containStyle, brandColor.main]">
  <div class="flex-between">
    <div class="full-width">
      <div class="flex-between">
        <div class="size-18 weight-500 margin-bottom-4" :style="brandColor.main">문의</div>
        <div class="size-14 p-primary" @click="clickInquiry">
          문의하기
        </div>
      </div>
      <!--<div v-if="count && count > 0" class="flex" style="font-size:16px;align-items:baseline">-->
      <!--  <div class="size-14" :style="brandColor.sub">{{ count }}개의 사용자 문의</div>-->
      <!--</div>-->
    </div>
    
  </div>
</div>
</template>
<script>

export default {
  name: 'CardInquiryTotalReg',
  components: {

  },
  mixins: [

  ],
  props: {
    count: {
      type: Number,
      required: true,
    },
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
    clickInquiry() {
      if (this.isLogin) {
        this.routerPush(`inquiry_reg?product_id=${this.product.id}`)
      } else {
        this.toast('로그인 후 문의 작성이 가능합니다.');
        this.routerPush('/signin');
      }
    }
  },
  computed: {
    containStyle() {
      return {
        padding: '24px 0 0',
      }
    }
  },
  watch: {
    
  }
}
</script>


