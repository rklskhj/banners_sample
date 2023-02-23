<template>
<div v-if="product" class="parBtnDiv flex-align p-bg-white" :style="buttonWidth">
    <btn
        @clicked="clickBtn"
        class="p-white p-bg-primary"
        :customStyle="customStyle"
        :ga="ga">
      <!--<i class="material-icons" style="font-size: 14px;margin-right:4px">{{ icon }}</i>-->
      {{ name }}
      <!-- 전화연결 팝업 -->
      <portal to="btn-call-modal">
        <div class="page-modal">
          <sweet-modal ref="callModal" overlay-theme="dark" @close="onCloseModal" :enableMobileFullscreen="false">
            <modal @confirm="clickCall" @cancel="$refs.callModal.close()" style="padding:20px">
              <div slot="header">전화연결</div>
              <div slot="content">확인 버튼을 누르시면 전화연결이 진행됩니다. 진행하시겠습니까?</div>
            </modal>
          </sweet-modal>
        </div>
      </portal>
    </btn>
    
    <button-inquirying v-if="product" :product="product" text="문의하기"
      :style="inquiryBtnStyle"></button-inquirying>
    <!--<div class="flex-align">
      <icon-circle-request v-if="product.inquiry_conversion_type !== 0 && inquiryIcon !== ''"
        :icon="inquiryIcon"
        style="margin-left:8px" :product="product" color="main"></icon-circle-request>
      <icon-circle-share style="margin-left: 8px"
        @share="$refs.share.share=true" color="main"></icon-circle-share>
    </div>-->

    <share ref="share" v-if="product" :product="product"></share>
  </div>
</template>
<script>
import ButtonInquirying from "@/components/Components/Button/ButtonInquirying.vue"

export default {
  name: 'ButtonCall',
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
    icon: {
      type: String,
      default: "call",
    },
    name: {
      type: String,
      default: "전화걸기",
    },
    width: {
      type: String,
      default: "100%",
    },
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "product": undefined,
      "inquiryIcon": ""
    }
  },
  created() {
    this.getData();
    // this.getInquiryIcon(this.product.inquiry_conversion_type);
    },
  
  methods: {
    getData() {
      let field = 'id,sns_inquiry_type,partner,homepage,enable_homepate,kakao,inquiry_conversion_type,order_conversion_type,partner';
      let url = `user/${this.user.user_id}/mapping/product/${this.$route.query.id}?fields=${field}`;
      url += '&hit=false';
      this.$axios.get(url)
      .then(res => {
        this.product = res.data; 
    });
    },
    onCloseModal() {
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

<style>
.sweet-content-content {
    font-weight: normal;
  }
.grab-bing {
  white-space: nowrap;
  position: relative;
}

.helpBtn {
  border-radius: 8px;
  height: 48px;
  color: white;
  justify-content: center;
  align-items: center;
}
.parBtnDiv {
  position:fixed;
  bottom: 0;
  padding: 10px 16px;
  height: 68px;
  z-index: 101;
}
</style>
