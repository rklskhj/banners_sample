<template>
<div class="parBtnDiv flex-align p-bg-white" :style="buttonWidth">
    <btn
        @clicked="clickBtn"
        class="p-white p-bg-brand"
        :customStyle="customStyle"
        :ga="ga"
    >{{ name }}</btn>
    <button-inquirying v-if="product" :product="product" text="문의"
      :style="inquiryBtnStyle"></button-inquirying>
  </div>
</template>
<script>
import ButtonInquirying from "@/components/Components/Button/ButtonInquirying.vue"

export default {
  name: 'ButtonOutlink',
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
      default: "구매 바로가기",
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

  },
  mounted() {

  },
  
  methods: {
    getData() {
      let field = 'id,sns_inquiry_type,partner,homepage,enable_homepate,kakao,inquiry_conversion_type,order_conversion_type,partner,stock,price';
      let url = `user/${this.user.user_id}/mapping/product/${this.$route.query.id}?fields=${field}`;
      url += '&hit=false';
      this.$axios.get(url)
      .then(res => {
        this.product = res.data; 
    });
    },
    clickBtn() {
        let openLink = window.open('', '_blank');
        if(this.user.user_id) {
          this.$axios.get(`user/${this.user.user_id}/outlink/product/${this.$route.query.id}`).then(res => {
            if(res.status === 200) {
              if (res.data.link) {
                openLink.location.href = res.data.link;
              } else {
                openLink.close();
                this.toast('바로가기 링크가 없습니다.');
              }
            }
          });
        }
        else {
          this.$axios.get('public/outlink/product/'+this.$route.query.id).then(res => {
            if(res.status === 200) {
              if (res.data.link) {
                openLink.location.href = res.data.link;
              } else {
                openLink.close();
                this.toast('바로가기 링크가 없습니다.');
              }
            }
          });
        }
      }
  },
  computed: {
    buttonWidth() {
      return `width:${this.$store.getters.deviceWidth}px`;
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

