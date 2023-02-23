<template>
<div class="parBtnDiv flex-align p-bg-white" :style="buttonWidth">
    <btn
        @clicked="clickBtn"
        :customStyle="customStyle"
        :ga="ga" class="p-white p-bg-brand"
    >{{ computedName }}</btn>
    <button-inquirying v-if="product" :product="product" text="문의"
      :style="inquiryBtnStyle"></button-inquirying>
  </div>
</template>
<script>
import ButtonInquirying from "@/components/Components/Button/ButtonInquirying.vue"

export default {
  name: 'ButtonCounsel',
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
      let field = 'id,sns_inquiry_type,partner,homepage,enable_homepate,kakao,inquiry_conversion_type,price,order_conversion_type,price,form';
      let url = `user/${this.user.user_id}/mapping/product/${this.$route.query.id}?fields=${field}`;
      url += '&hit=false';
      this.$axios.get(url)
      .then(res => {
        this.product = res.data; 
    });
    },
    clickBtn() {
        if(this.isDone) return;
        this.routerPush(`counsel_reg?id=${this.product.id}&type=counsel&form_id=${this.product.form}`);
      }
  },
  computed: {
    buttonWidth() {
      return `width:${this.$store.getters.deviceWidth}px`;
    },
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

