<template>
  <div>
    <btn
        @clicked="clickBtn"
        :color="brandColor.white"
        :backgroundColor="brandBgColor.brand"
        :customStyle="customStyle"
        :ga="ga"
    >{{ computedName }}</btn>

  </div>
</template>

<script>
  export default {
    name: "btnCounsel",

    props: {
      product: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        default: '신청하기'
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
        this.routerPush(`counsel_reg?id=${this.product.id}&type=counsel&form_id=${this.product.form}`);
      }
    },
    computed: {
      isDone() {
        let done = false;

        // 상품 판매 기간 완료
        if(this.product.price.end_date &&
          this.dayjs(this.product.price.end_date) < this.dayjs()) {
          done = true;
        }

        return done;
      },
      computedName() {
        let name = this.name;
        if(this.isDone) {
          name = '상담이 마감되었습니다';
        }
        return name;
      }
    }
  }
</script>

<style scoped>

</style>