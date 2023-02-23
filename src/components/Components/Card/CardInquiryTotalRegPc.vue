<template>
<div :style="[containStyle, brandColor.main]">
  <div class="flex-between">
    <div>
      <div class="size-20 weight-500 margin-bottom-4" :style="brandColor.main">문의</div>
      <div class="flex" style="font-size:16px;align-items:baseline">
        <div class="size-14" :style="brandColor.sub">{{ count }}개의 사용자 문의</div>
      </div>
    </div>
    
    <div :style="[brandColor.main, brandBgColor.white]" style="padding:12px 16px;border-radius:8px" 
      class="size-14 unselect weight-500" @click="routerPush(`inquiry_reg?product_id=${product.id}`)">
      문의 작성
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'CardInquiryTotalRegPc',
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
    
  },
  computed: {
    containStyle() {
      return {
        padding: '32px 0',
      }
    }
  },
  watch: {
    
  }
}
</script>


