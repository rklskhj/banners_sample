<template>
  <div v-if="socialKey.facebook.enable.login">
    <btn v-if="buttonStyle==='bar'"
         :color="brandColor.white"
         :backgroundColor="{backgroundColor: 'rgb(24, 119, 242)'}"
         @clicked="fbLogin">
      <div class="flex-center">
        <img class="btn-img" src="/static/image/icon/ic_facebook.png">
        <div class="btn-txt">페이스북 계정으로 {{ isSignup ? '가입' : '로그인' }}하기</div>
      </div>
    </btn>
    <img v-else class="unselect" @click="fbLogin" src="/static/image/icon/ic_circle_facebook.svg">
  </div>
</template>

<script>
  export default {
    name: "BtnSigninFacebook",
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
      fbLogin() {
        location.href = 'https://www.facebook.com/v2.10/dialog/oauth?client_id=%s&redirect_uri=%s&scope=email'
          .format(this.socialKey.facebook.client_id, encodeURIComponent(this.socialKey.facebook.redirect_url));
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