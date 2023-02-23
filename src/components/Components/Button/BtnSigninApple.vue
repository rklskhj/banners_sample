<template>
  <div v-if="socialKey.apple && socialKey.apple.enable.login && enableApple">
    <btn v-if="buttonStyle==='bar'"
         :color="brandColor.white"
         :backgroundColor="{backgroundColor: 'rgb(0, 0, 0)'}"
         @clicked="appleLogin">
      <div class="flex-center">
        <img class="btn-img" src="/static/image/icon/ic_apple.png">
        <div class="btn-txt">Apple로 {{ isSignup ? '등록' : '로그인' }}</div>
      </div>
    </btn>
    <img v-else class="unselect" @click="appleLogin" src="/static/image/icon/ic_circle_apple.svg">
  </div>
</template>

<script>
  export default {
    name: "BtnSigninApple",
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
      },
      enableApple() {
        return !( /Android/i.test(navigator.userAgent))
      }
    },

    methods: {
      async appleLogin() {
        const data = await AppleID.auth.signIn();
        // console.log(data)
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