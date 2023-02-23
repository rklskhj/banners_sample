<template>
<div class="flex-center size-14 weight-500 unselect p-border-main p-sub radius-8" 
  style="padding:10px;height:48px" @click="clickInquiry" v-if="enable">
    {{ text }}
  </div>
</template>
<script>

export default {
  name: 'ButtonInquirying',
  components: {

  },
  mixins: [

  ],
  props: {
    text: {
      type: String,
      default: "문의하기",
    },
    width: {
      type: String,
    },
    product: {
      type: Object,
      required: true,
    },
    useWidth: {
      type: Boolean,
      default: true,
    },

  },
  data() {
    return {
      "enable": false
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    })
  },
  
  methods: {
    init() {
      this.enable =
        this.product.inquiry_conversion_type > 0 && (
        (this.product.partner.phone !== '') ||
        (this.product.partner.email !== '') ||
        (this.product.sns_inquiry_type === 0 && this.product.partner.kakao !== null && this.product.partner.kakao !== '') ||
        (this.product.sns_inquiry_type === 1 && this.product.kakao !== null && this.product.kakao !== '') ||
        (this.product.sns_inquiry_type === 0 && this.product.partner.enable_homepage && this.product.partner.homepage) ||
        (this.product.sns_inquiry_type === 1 && this.product.enable_homepage && this.product.homepage));
    },
    clickInquiry() {
      // 0: 없음 1: 전화 2: 이메일 3: 톡 문의 4: 홈페이지 문의
      let ic_type = this.product.inquiry_conversion_type;
      if(ic_type===1) {
        if (this.product.partner.phone !== '') {
          location.href = `tel:${this.product.partner.phone}`;
        } else {
          this.toast('문의 연락처가 없습니다.');
        }
      } else if(ic_type===2) {
        if (this.product.partner.email !== '') {
          location.href = `mailto:${this.product.partner.email}`;
        } else {
          this.toast('문의 이메일이 없습니다.');
        }
      } else if(ic_type===3) {
        if (this.product.partner.kakao !== '') {
          this.clickKakaoBtn();
        } else {
          this.toast('문의 카카오톡 채널 ID가 없습니다.');
        }
      } else if(ic_type===4 && this.product.partner.homepage) {
        if (this.product.partner.homepage !== '') {
          this.clickHomepageBtn();
        } else {
          this.toast('문의 홈페이지 주소가 없습니다.');
        }
      }
    },
    clickHomepageBtn() {
      if (this.product.sns_inquiry_type === 0 && 
      this.product.partner.enable_homepage && 
      this.product.partner.homepage) {
        location.href = this.product.partner.homepage;
      } else if(this.product.sns_inquiry_type === 1 &&
      this.product.enable_homepage && 
      this.product.homepage) {
        location.href = this.product.homepage;
      }
    },
    clickKakaoBtn() {
      if (this.product.sns_inquiry_type === 0) {
        if (this.product.partner.kakao !== '' && this.product.partner.kakao !== null) {
          if (this.product.partner.kakao.indexOf('pf.kakao.com/') !== -1) {
            const a = document.createElement("a");
            a.style.display = 'none';
            a.onclick = this.clickLink(this.product.partner.kakao);
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
          } else {
            Kakao.Channel.chat({
              channelPublicId: this.product.partner.kakao
            });
          }
          // this.$axios.post(`/public/product/${this.$route.query.id}/share/kakao`).then(res => {
          //   if (res.status === 200) {
          //     this.setGa('카카오톡 채널 바로가기', '클릭', `상품 id: ${this.$route.query.id}`, this.$route.query.id);
          //   }
          // })
        } else {
          return;
        }
      } else if (this.product.sns_inquiry_type === 1) {
        if (this.product.kakao !== '' && this.product.kakao !== null) {
          if (this.product.kakao.indexOf('pf.kakao.com/') !== -1) {
            const a = document.createElement("a");
            a.style.display = 'none';
            a.onclick = this.clickLink(this.product.kakao);
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
          } else {
            Kakao.Channel.chat({
              channelPublicId: this.product.kakao
            });
          }
          this.$axios.post(`/public/product/${this.$route.query.id}/share/kakao`).then(res => {
            if (res.status === 200) {
              this.setGa('카카오톡 채널 바로가기', '클릭', `상품 id: ${this.$route.query.id}`, this.$route.query.id);
            }
          })
        } else {
          return;
        }
      } else {
        return;
      }
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


