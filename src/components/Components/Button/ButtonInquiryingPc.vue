<template>
<div class="flex-center size-16 unselect p-bg-white p-border-main p-sub2 radius-8" 
    style="height: 100%" @click="clickInquiry" v-if="product.inquiry_conversion_type>0">
  <!--<span class="material-icons">{{ inquiryIcon }}</span>-->
  <div class="flex-center" style="width: 100%; height: 100%">문의하기</div>
</div>
</template>
<script>

export default {
  name: 'ButtonInquiryingPc',
  components: {

  },
  mixins: [

  ],
  props: {
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
        } else {
          this.toast('문의 카카오톡 채널 ID가 없습니다.');
        }
      } else if(ic_type===4) {
        if (this.product.partner.homepage !== '') {
          location.href = this.product.partner.homepage;
        } else {
          this.toast('문의 홈페이지 주소가 없습니다.');
        }
      }
    
    },
    clickLink(href) {
      window.open(href, '', 'width=440,height=768');
      return false;
    }
  },
  computed: {
    inquiryIcon() {
      let text = '';
      switch(this.product.inquiry_conversion_type) {
        case 1:
          text = 'call';
          break;
        case 2:
          text = 'email';
          break;
        case 3:
          text = 'call';
          break;
        case 4:
          text = 'home';
          break;
      }
      return text;
    }
  },
  watch: {
    
  }
}
</script>


