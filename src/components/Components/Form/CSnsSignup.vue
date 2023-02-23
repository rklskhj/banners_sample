<template>
  <div style="margin: 24px 0" :class="{'flex-center': buttonStyle==='circle'}">
    <btn v-if="buttonStyle === 'bar'" :color="brandColor.white" style="margin-bottom:12px"
         :backgroundColor="brandBgColor.brand" @clicked="$emit('clickEmail')">
      <i class="material-icons" style="margin-right:8px">email</i>이메일로 회원가입하기
    </btn>
    <btn-signin-kakao :buttonStyle="buttonStyle" :style="`${buttonStyle === 'bar' ? 'margin-bottom:12px' : 'margin-right:16px'}`"></btn-signin-kakao>
    <btn-signin-facebook :buttonStyle="buttonStyle" :style="`${buttonStyle === 'bar' ? 'margin-bottom:12px' : 'margin-right:16px'}`"></btn-signin-facebook>
    <btn-signin-naver :buttonStyle="buttonStyle" :style="`${buttonStyle === 'bar' ? 'margin-bottom:12px' : 'margin-right:16px'}`"></btn-signin-naver>
    <btn-signin-apple :buttonStyle="buttonStyle"></btn-signin-apple>
  </div>
</template>

<script>
  import BtnSigninKakao from "../Button/BtnSigninKakao.vue";
  import BtnSigninFacebook from "../Button/BtnSigninFacebook.vue";
  import BtnSigninNaver from "../Button/BtnSigninNaver.vue";
  import BtnSigninApple from "../Button/BtnSigninApple.vue";
  import AuthMixin from "@/components/Mixins/AuthMixin";

  export default {
    name: "CSnsSignup",
    mixins: [
      AuthMixin
    ],
    props: {
      startPage: {
        type: String,
        default: 'home'
      },
      buttonStyle: {
        type: String,
        default: 'bar'
      }
    },
    components: {
      BtnSigninNaver,
      BtnSigninFacebook,
      BtnSigninKakao,
      BtnSigninApple
    },
    created() {
      if (this.$route.query.user_id !== undefined) {
        this.$axios.post('auth/user/login/social', {
          username: this.$route.query.user_id,
          password: '',
          token: this.$route.query.token
        }).then(res => {
          this.setUserData(res.data);

          this.setAuthHeader();
          //this.$router.back();
          this.$router.replace(this.startPage);
        }).catch(()=>{
          if(this.$route.query.step) {
            this.$emit('next');
          }
        });
      }
    },
    methods: {}
  }
</script>
