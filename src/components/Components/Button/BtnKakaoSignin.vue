<template>
<div v-if="socialKey.kakao.enable.login" @click="kktLogin"
  class="grid-box sns-button" :style="[{backgroundColor: bg, color: text}, radius]">
  <div class="col-3 flex-center">
    <div :style="iconStyle"></div>
  </div>
  <div class="col-9 flex-center">
    <div class="weight-500">카카오 계정으로 로그인</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BtnKakaoSignin',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "bg": "#ffeb00",
      "text": "#3c1e1e"
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    kktLogin() {
        location.href = 'https://kauth.kakao.com/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code'
          .format(this.socialKey.kakao.restapi_key, encodeURIComponent(this.socialKey.kakao.redirect_url));
      }
  },
  computed: {
    socialKey() {
        return this.$store.getters.social_key;
      },
    iconStyle() {
      return {
        backgroundImage: 'url("https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/localtheme/non-path/26247518.png")',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: '24px',
        height: '24px'
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.sns-button {
  width: 100%;
  height: 48px;
}
</style>

