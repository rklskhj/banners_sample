<template>
<div class="parBtnDiv flex-align p-bg-white" :style="buttonWidth">
    <btn
        @clicked="clickBtn"
        class="p-white"
        :backgroundColor="backgroundStyle"
        :customStyle="customStyle"
        :ga="ga"
    >{{ computedName }}</btn>
    <button-inquirying v-if="product" :product="product" text="문의"
      :style="inquiryBtnStyle"></button-inquirying>
  </div>
</template>
<script>
import ButtonInquirying from "@/components/Components/Button/ButtonInquirying.vue"

export default {
  name: 'ButtonMeet',
  components: {
    ButtonInquirying
  },
  mixins: [

  ],
  props: {
    ga: {
      type: Object,
      required: false,
    },
    name: {
      type: String,
      default: "신청하기",
    },
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "product": undefined
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      let field = 'id,sns_inquiry_type,partner,homepage,enable_homepage,kakao,inquiry_conversion_type,order_conversion_type,partner,stock,price';
      let url = `user/${this.user.user_id}/mapping/product/${this.$route.query.id}?fields=${field}`;
      url += '&hit=false';
      this.$axios.get(url)
      .then(res => {
        this.product = res.data; 
    });
    },
    clickBtn() {
        if(this.isDone) return;
        this.routerPush(`reserve_option_meet?id=${this.product.id}`);
      }
  },
  computed: {
    buttonWidth() {
      return `width:${this.$store.getters.deviceWidth}px`;
    },
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
    },
    inquiryBtnStyle() {
      let deco = {
        marginLeft: '8px',
        width: '100%'
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.parBtnDiv {
    position:fixed;
    bottom: 0;
    padding: 10px 16px;
    height: 68px;
    z-index: 101;
  }
</style>

