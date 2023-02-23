<template>
<div class="block-partner-signup-container" :style="pagePadding">
  <div style="display:grid;row-gap:8px">
      <div :style="menuTitle">{{ title }}</div>
      <div :style="menuContent">{{ content }}</div>
    </div>

  <div class="flex" style="margin-top:40px;gap:12px">
    <a :href="signinUrl">
      <button class="p-bg-primary p-border-primary p-white">{{ partnerName }} 로그인</button>
    </a>
    <button style="flex:1" class="p-bg-white p-primary p-border-primary" @click="clickSignup">{{ partnerName }} {{ signupName }}</button>
  </div>
  <sweet-modal ref="modal" overlay-theme="dark" hideCloseButton :enableMobileFullscreen="false">
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

export default {
  name: 'BlockPartnerSignup',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "title": "파트너가 되어\n수익을 만들어보세요!",
      "styles": {
        "block": {
          "align": "center",
          "color": {
            "title": "brandColor.main",
            "content": "brandColor.sub"
          },
          "fontSize": {
            "title": 27,
            "content": 16
          }
        }
      },
      "content": "누구나 파트너가 될 수 있습니다.",
      "visible": {
        "title": true,
        "content": true
      },
      "signupName": "",
      "signupType": 0,
      "description": "누구나 파트너가 될 수 있습니다.",
      "partnerName": "",
      "modalContent": "파트너 센터에 가입하려면 먼저 서비스에 로그인해주세요"
    }
  },
  created() {
    this.getData();
  },
  mounted() {

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
        // 이미 가입된 유저 파트너
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
      } 
      // 로그인 전
      else {
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
    signinUrl() {
      return `https://${this.$store.getters.service.service_key}.platformfy.com/office/partner`;
    },
    menuTitle() {
      return {
        color: this.parseColor(this.styles.block.color.title),
        fontSize: this.styles.block.fontSize.title + 'px',
        textAlign: this.styles.block.align,
        fontWeight: 700
      }
    },
    menuContent() {
      return {
        color: this.parseColor(this.styles.block.color.content),
        fontSize: this.styles.block.fontSize.content + 'px',
        textAlign: this.styles.block.align,
        whiteSpace: 'pre-wrap'
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.block-partner-signup-container {
    padding-top: 60px;
    padding-bottom: 6px;
    white-space: pre-line;
    text-align: center;
  }
  a {
    width: 100%;
    flex: 1;
  }
  button {
    cursor: pointer;
    width: 100%;
    height: 56px;
    font-size: 16px;
    border-radius: 8px;
  }
  
  .content {
    font-size: 14px;
    margin: 16px 0 32px 0;
    white-space: pre-line;
  }
  .button-wrap {
    display: flex;
    gap: 10px;
  }
  .button-wrap button {
    height: 44px;
    font-size: 14px;
  }
</style>
<style>
.block-partner-signup-container .sweet-modal {
    width: 343px;
    border-radius: 12px;
  }
  .block-partner-signup-container .sweet-modal.is-alert .sweet-content {
    padding: 16px !important;
  }
</style>
