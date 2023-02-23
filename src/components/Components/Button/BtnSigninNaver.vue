<template>
  <div v-if="socialKey.naver.enable.login">
    <btn v-if="buttonStyle==='bar'"
         :color="brandColor.white"
         :backgroundColor="{backgroundColor: 'rgb(0, 198, 59)'}"
         @clicked="naverLogin">
      <div class="flex-center">
        <img class="btn-img" src="/static/image/icon/ic_naver.png">
        <div class="btn-txt">네이버 계정으로 {{ isSignup ? '가입' : '로그인' }}하기</div>
      </div>
    </btn>
    <img v-else class="unselect" @click="naverLogin" src="/static/image/icon/ic_circle_naver.svg">
  </div>
</template>

<script>
  export default {
    name: "BtnSigninNaver",
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
      naverLogin() {
        let url = "https://nid.naver.com/oauth2.0/authorize?response_type=token&amp;client_id=%s&amp;redirect_uri=%s/signin/naver/"
          .format(this.socialKey.naver.client_id, encodeURIComponent(location.origin));

        console.log(url);

        location.replace(url);
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
    color rgb(255, 255, 255)
    font-size 14.25px
</style>