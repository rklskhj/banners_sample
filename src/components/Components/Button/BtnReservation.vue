<template>
  <div class="flex-align" style="padding: 16px 0px;">
    <btn
        @clicked="clickBtn"
        :color="brandColor.white"
        :backgroundColor="brandBgColor.brand"
        :customStyle="customStyle"
        :ga="ga"
    >{{name}}</btn>
    <div class="flex-align">
      <icon-circle-like likeType="product" color="main" borderRadius="8px" style="margin:0 12px;"></icon-circle-like>
      <icon-circle-share @share="$refs.share.share=true" color="main"></icon-circle-share>
    </div>
    <share ref="share" v-if="product" :product="product"></share>
  </div>
</template>

<script>
  export default {
    name: "BtnReservation",

    props: {
      product: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        default: '예약하기'
      },
      customStyle: {
        type: Object,
        required: false
      },
      // Google Analytics 세팅할 경우
      ga: {
        type: Object,
        required: false
      }
    },
    methods: {
      clickBtn() {
        if(this.isDone) return;
        this.routerPush(`reserve_option_reservation?id=${this.product.id}`);
      }
    },
    computed: {
    }
  }
</script>

<style scoped>

</style>