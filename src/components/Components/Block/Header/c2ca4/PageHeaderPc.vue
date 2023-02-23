<template>
<div class="page-header c2ca4-page-header flex-between full-width" :style="containerBg">
  <div class="flex-align" style="gap:6px">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.8356 28H6.16438C2.75342 28 0 25.2466 0 21.8356V6.16438C0 2.75342 2.75342 0 6.16438 0H21.8356C25.2466 0 28 2.75342 28 6.16438V21.8356C28 25.2466 25.2329 28 21.8356 28Z" fill="#32373F"/>
      <path opacity="0.5" d="M4.82198 19.4937C4.76718 19.5211 4.72608 19.5759 4.69869 19.6307C4.67129 19.6855 4.65759 19.7403 4.65759 19.8088C4.65759 19.8773 4.67129 19.9321 4.69869 19.9868C4.72608 20.0416 4.76718 20.0827 4.82198 20.1238L6.97266 21.3704C7.09594 21.4526 7.24663 21.48 7.39732 21.48C7.548 21.48 7.68499 21.4389 7.82197 21.3704L9.63019 20.3156L6.548 18.5074L4.82198 19.4937Z" fill="white"/>
      <path d="M23.1781 11.7671L14.4247 6.6575C14.3014 6.5753 14.1507 6.54792 14.0001 6.54792C13.8494 6.54792 13.7124 6.589 13.5754 6.6575L4.82198 11.7671C4.76718 11.7945 4.72608 11.8493 4.69869 11.9041C4.67129 11.9589 4.65759 12.0137 4.65759 12.0822C4.65759 12.1507 4.67129 12.2054 4.69869 12.2602C4.72608 12.315 4.76718 12.3561 4.82198 12.3972L13.5754 17.5068C13.6987 17.5753 13.8494 17.6164 14.0001 17.6164C14.1507 17.6164 14.2877 17.5753 14.4247 17.5068L23.1781 12.3972C23.2329 12.3698 23.274 12.315 23.3014 12.2602C23.3288 12.2054 23.3425 12.1507 23.3425 12.0822C23.3425 12.0137 23.3288 11.9589 23.3014 11.9041C23.274 11.8356 23.2329 11.7945 23.1781 11.7671Z" fill="white"/>
      <path opacity="0.8" d="M4.82198 15.6166C4.76718 15.644 4.72608 15.6988 4.69869 15.7399C4.67129 15.7947 4.65759 15.8495 4.65759 15.918C4.65759 15.9728 4.67129 16.0413 4.69869 16.0961C4.72608 16.1509 4.76718 16.192 4.82198 16.2194L10.274 19.4248C10.3973 19.4933 10.548 19.5344 10.6987 19.5344C10.8494 19.5344 11.0001 19.4933 11.1233 19.4248L12.959 18.3563L6.548 14.6166L4.82198 15.6166Z" fill="white"/>
    </svg>
    <div class="size-14 p-main">{{ $store.getters.service.title }} {{ partnerName }} 센터</div>
  </div>
  <div class="flex-align size-14 p-sub" style="gap:20px">
    <a :href="signinUrl" target="_blank">
      <div class="unselect">로그인</div>
    </a>
    <div class="unselect" @click="clickSignup">{{ partnerName }} {{ signupName }}</div>
  </div>
  
  <sweet-modal ref="modal" overlay-theme="dark" hideCloseButton>
    <div class="modal-container">
      <div class="content">
        <div>{{ modalContent }}</div>
      </div>
      <div class="button-wrap">
        <button class="p-bg-white p-primary p-border-primary" style="flex:1" @click="$refs.modal.close()">취소</button>
        <button class="p-bg-primary p-border-primary p-white" style="flex:1" @click="clickAccept">로그인</button>
      </div>
    </div>
  </sweet-modal>
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {

  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "bgColor": "brandBgColor.main",
      "signupName": "",
      "signupType": 0,
      "partnerName": "",
      "modalContent": "파트너 센터에 가입하려면 먼저 서비스에 로그인해주세요"
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    
  },
  updated() {

  },
  
  methods: {
    getData() {
      this.$axios.get('public/partner/setting').then(res => {
        if(res.status === 200) {
          this.signupType = res.data.signup_type;
          this.partnerName = res.data.partner_name;
          this.signupName = {
            0: '가입',
            1: '가입 신청',
            2: '입점문의'
          }[this.signupType]
        }
      });
    },
    clickSignup() {
      if(this.isLogin) {
        if(this.user.partner_id > 0) {
          this.modalContent = `이미 ${this.partnerName}에 가입된 계정입니다.`
          this.$refs.modal.open();
        } else {
          if(this.signupType === 0) {
           this.routerPush('/partner_signup');  
          } else if(this.signupType === 1) {
           this.routerPush('/partner_signup');  
          } else if(this.signupType === 2) {
           this.routerPush('/partner_inquiry_reg');  
          }
        }
      } else {
        this.modalContent = `${this.partnerName}센터에 가입하려면\n먼저 ${this.$store.getters.service.title}에 로그인해주세요.`;
        this.$refs.modal.open();
      }
    },
    clickAccept() {
      if(this.isLogin && this.user.partner_id>0) {
        location.href = this.signinUrl;
      } else {
        this.routerPush('/signin'); 
      }
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor)
      }
    },
    signinUrl() {
      return `https://${this.$store.getters.service.service_key}.platformfy.com/office/partner`;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 15px 24px 15px 12px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
}

.content {
    font-size: 20px;
    white-space: pre-line;
    margin: 48px 0 60px 0;
  }
.button-wrap {
  display: flex;
  gap: 16px;
}

button {
  cursor: pointer;
  width: 240px;
  height: 56px;
  font-size: 16px;
  border-radius: 8px;
}
</style>
<style>
.c2ca4-page-header .sweet-modal {
    width: 562px;
    border-radius: 12px;
  }
  .c2ca4-page-header .sweet-modal.is-alert .sweet-content {
    padding: 32px !important;
  }
  
  @media (max-width: 500px) {
   .c2ca4-page-header .sweet-modal {
      width: 343px;
    } 
  }
</style>
