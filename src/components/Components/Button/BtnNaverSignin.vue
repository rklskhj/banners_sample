<template>
<div v-if="socialKey.naver.enable.login" @click="naverLogin"
  class="grid-box sns-button" :style="[{backgroundColor: bg, color: text}, radius]">
  <div class="col-3 flex-center">
    <div :style="iconStyle"></div>
  </div>
  <div class="col-9 flex-center">
    <div class="weight-500">네이버 계정으로 로그인</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BtnNaverSignin',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "bg": "#03cf5d",
      "text": "#fff"
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    naverLogin() {
        let url = "https://nid.naver.com/oauth2.0/authorize?response_type=token&amp;client_id=%s&amp;redirect_uri=%s/signin/naver/"
          .format(this.socialKey.naver.client_id, encodeURIComponent(location.origin));


        location.replace(url);
      }
  },
  computed: {
    socialKey() {
        return this.$store.getters.social_key;
      },
    iconStyle() {
      return {
        backgroundImage: 'url("https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/localtheme/non-path/24139159.png")',
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

