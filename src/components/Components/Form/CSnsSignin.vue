<template>
  <div style="margin: 24px 0" :class="{'flex-center': buttonStyle==='circle'}">
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
  import AuthMixin from "@/components/Mixins/AuthMixin";
  import BtnSigninApple from "../Button/BtnSigninApple.vue";
  export default {
    name: "CSnsSignin",
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
      BtnSigninApple,
      BtnSigninNaver,
      BtnSigninFacebook,
      BtnSigninKakao
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
        });
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
