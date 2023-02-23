<template>
<div class="block-partner-signup-container" :style="containerStyle">
  <transition name="fade">
    <div :style="pcMaxWidth" v-show="partnerName!==''">
    <div style="display:grid;row-gap:8px">
      <div v-if="visible.title" :style="menuTitle">{{ title }}</div>
      <div v-if="visible.content" :style="menuContent">{{ content }}</div>
    </div>
    <div class="flex-align" :style="buttonWrapStyle" style="margin-top:28px;gap:16px">
      <a :href="signinUrl">
        <button class="p-bg-primary p-border-primary p-white">{{ partnerName }} 로그인</button>
      </a>
      <button class="p-bg-white p-primary p-border-primary" @click="clickSignup">{{ partnerName }} {{ signupName }}</button>
    </div>
  </div>
  </transition>
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

export default {
  name: 'BlockPartnerSignupPc',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "isDev": false,
      "title": "파트너가 되어 수익을 만들어보세요!",
      "images": [
        {
          "src": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lpthemecallc2ca/non-path/29397423.png"
        }
      ],
      "styles": {
        "block": {
          "align": "left",
          "color": {
            "title": "brandColor.main",
            "content": "brandColor.sub"
          },
          "fontSize": {
            "title": 38,
            "content": 18
          }
        }
      },
      "content": "누구나 파트너가 될 수 있습니다.",
      "visible": {
        "title": true,
        "content": true
      },
      "signupName": "",
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
    signinUrl() {
      return `https://${this.$store.getters.service.service_key}.platformfy.com/office/partner`;
    },
    containerStyle() {
      return {
        width: this.isDev ? '100%' : '100vw',
        height: '412px',
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        backgroundImage: `url(${this.images[0].src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'norepeat'
      }
    },
    menuTitle() {
      return {
        color: this.parseColor(this.styles.block.color.title),
        fontSize: this.styles.block.fontSize.title + 'px',
        textAlign: this.styles.block.align,
        whiteSpace: 'pre-wrap',
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
    },
    buttonWrapStyle() {
      return {
        justifyContent: {
          'left': "flex-start",
          'center': "center",
          'right': 'flex-end'
        }[this.styles.block.align]
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
button {
    cursor: pointer;
    width: 240px;
    height: 56px;
    font-size: 16px;
    border-radius: 8px;
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
  @media (max-width: 500px) {
    .content {
      font-size: 14px;
      margin: 32px 0;
    }
    .button-wrap {
      gap: 10px;
    }
  }
</style>
<style>
.block-partner-signup-container .sweet-modal {
    width: 562px;
    border-radius: 12px;
  }
  .block-partner-signup-container .sweet-modal.is-alert .sweet-content {
    padding: 32px !important;
  }
  
  @media (max-width: 500px) {
   .block-partner-signup-container .sweet-modal {
      width: 343px;
    } 
  }
</style>
