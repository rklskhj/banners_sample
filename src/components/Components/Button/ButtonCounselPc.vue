<template>
<div>
    <btn
        @clicked="clickBtn"
        :customStyle="customStyle"
        :ga="ga"
        class="p-white p-bg-brand"
    >{{ computedName }}</btn>

  </div>
</template>
<script>

export default {
  name: 'ButtonCounselPc',
  components: {

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
    product: {
      type: Object,
      required: true,
    },
    customStyle: {
      type: Object,
      required: false,
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
  },
  watch: {
    
  }
}
</script>


