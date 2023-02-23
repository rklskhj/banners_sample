<template>
  <div v-if="socialKey.kakao.enable.login">
    <btn v-if="buttonStyle==='bar'"
         :color="brandColor.white"
         :backgroundColor="{backgroundColor: 'rgb(251, 227, 0)'}"
         @clicked="kktLogin">
      <div class="flex-center">
        <img class="btn-img" src="/static/image/icon/ic_kakao.png">
        <div class="btn-txt">카카오톡 계정으로 {{ isSignup ? '가입' : '로그인' }}하기</div>
      </div>
    </btn>
    <img v-else class="unselect" @click="kktLogin" src="/static/image/icon/ic_circle_kakao.svg">
  </div>
</template>

<script>
  export default {
    name: "BtnSigninKakao",
    props: {
      buttonStyle: {
        type: String,
        default: 'bar'
      }
    },
    computed: {
      isSignup() {
        return this.$route.path.indexOf('signup') > -1;
      },
      socialKey() {
        return this.$store.getters.social_key;
      }
    },

    methods: {
      kktLogin() {
        location.href = 'https://kauth.kakao.com/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code'
          .format(this.socialKey.kakao.restapi_key, encodeURIComponent(this.socialKey.kakao.redirect_url));
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .btn-img
    width 24px
    height 24px
    margin-right 4px
  .btn-txt
    color rgb(59,30,30)
    font-size 14.25px
</style>