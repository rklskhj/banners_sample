<template>
  <div class="flex-align full-width">
    <btn
        @clicked="clickBtn"
        :color="brandColor.white"
        :backgroundColor="brandBgColor.brand"
        :customStyle="customStyle"
        :ga="ga"><i class="material-icons" style="font-size: 14px;margin-right:4px">{{ icon }}</i>{{ name }}
      <!-- 전화연결 팝업 -->
      <portal to="btn-call-modal">
        <div class="page-modal">
          <sweet-modal ref="callModal" overlay-theme="dark" @close="onCloseModal">
            <modal @confirm="clickCall" @cancel="$refs.callModal.close()" style="padding:20px">
              <div slot="header">전화연결</div>
              <div slot="content">확인 버튼을 누르시면 전화연결이 진행됩니다. 진행하시겠습니까?</div>
            </modal>
          </sweet-modal>
        </div>
      </portal>
    </btn>
    <div class="flex-align">
      <icon-circle-request v-if="product.inquiry_conversion_type !== 0 && inquiryIcon !== ''"
        :icon="inquiryIcon"
        style="margin-left:8px" :product="product" color="main"></icon-circle-request>
      <icon-circle-share style="margin-left: 8px"
        @share="$refs.share.share=true" color="main"></icon-circle-share>
    </div>

    <share ref="share" v-if="product" :product="product"></share>
  </div>
</template>

<script>
  export default {
    components: {},
    name: "BtnCall",

    props: {
      icon: {
        type: String,
        default: 'call'
      },
      product: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        default: '전화걸기'
      },
      customStyle: {
        type: Object,
        required: false
      },
      // Google Analytics 세팅할 경우
      ga: {
        type: Object,
        required: false
      },
      width: {
        type: String,
        default: '100%'
      }
    },
    data() {
      return {
        inquiryIcon: '',
      }
    },
    created() {
      this.getInquiryIcon(this.product.inquiry_conversion_type);
    },
    methods: {
      onCloseModal(){
        setTimeout(()=>{
          let body = document.getElementsByTagName('body')[0];
          body.removeAttribute('style');
        },500);
      },
      clickBtn() {
        this.$refs.callModal.open();
      },
      clickCall() {
        let user_id = this.$store.getters.user.user_id;
        let url = `user/${user_id}/product/${this.$route.query.id}/call`;
        this.$axios.get(url).then(res=>{
          location.href = `tel:${res.data.call}`;
          this.$refs.callModal.close();
        })
      },
      getInquiryIcon(inquiry_conversion_type) {
        let partner = this.product.partner;
        switch(inquiry_conversion_type) {
          case 1:
            if (partner.phone !== null && partner.phone !== '') {
              this.inquiryIcon = 'call';
            } else {
              this.inquiryIcon = '';
            }
            break;
          case 2:
            if (partner.email !== null && partner.email !== '') {
              this.inquiryIcon = 'email';
            } else {
              this.inquiryIcon = '';
            }
            break;
          case 3:
            if (partner.kakao_channel_id !== null && partner.kakao_channel_id !== '') {
              this.inquiryIcon = 'chat_bubble';
            } else {
              this.inquiryIcon = '';
            }
            break;
          case 4:
            if (partner.homepage !== null && partner.homepage !== '') {
              this.inquiryIcon = 'home';
            } else {
              this.inquiryIcon = '';
            }
            break;
          case 0:
            this.inquiryIcon = '';
            break;
          default:
            this.inquiryIcon = 'home';
        }
      }
    },
    computed: {
      btnWrapStyle() {
        let deco = {
          width: `${this.width}`
        };
        return deco;
      }
    }
  }
</script>

<style>
  .sweet-content-content {
    font-weight: normal;
  }
</style>