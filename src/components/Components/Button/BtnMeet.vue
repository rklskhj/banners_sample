<template>
  <div>
    <btn
        @clicked="clickBtn"
        :color="brandColor.white"
        :backgroundColor="backgroundStyle"
        :customStyle="customStyle"
        :ga="ga"
    >{{ computedName }}</btn>

  </div>
</template>

<script>
  export default {
    name: "btnMeet",

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
        this.routerPush(`reserve_option_meet?id=${this.product.id}`);
      }
    },
    computed: {
      isDone() {
        let done = false;

        //재고 사용, 재고 없는 경우
        if(this.product.stock_type === 0 && this.product.stock <= 0) {
          done = true;
        }
        // 상품 판매 기간 완료
        else if(this.product.price.end_date &&
          this.dayjs(this.product.price.end_date) < this.dayjs()) {
          done = true;
        }

        return done;
      },
      computedName() {
        let name = this.name;
        if(this.isDone) {
          name = '모임이 마감되었습니다';
        }
        return name;
      },
      backgroundStyle() {
        let style = this.brandBgColor.brand;
        if(this.isDone) {
          style = {
            backgroundColor: this.brandColor.help.color
          }
        }
        return style;
      }
    }
  }
</script>

<style scoped>

</style>