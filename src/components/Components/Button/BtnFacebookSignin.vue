<template>
<div v-if="socialKey.facebook.enable.login" @click="fbLogin"
  class="grid-box sns-button" :style="[{backgroundColor: bg, color: text}, radius]">
  <div class="col-3 flex-center">
    <div :style="iconStyle"></div>
  </div>
  <div class="col-9 flex-center">
    <div class="weight-500">페이스북 계정으로 로그인</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BtnFacebookSignin',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "bg": "#1877f2",
      "text": "#fff"
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    fbLogin() {
        location.href = 'https://www.facebook.com/v2.10/dialog/oauth?client_id=%s&redirect_uri=%s'
          .format(this.socialKey.facebook.client_id, encodeURIComponent(this.socialKey.facebook.redirect_url));
      }
  },
  computed: {
    socialKey() {
        return this.$store.getters.social_key;
      },
    iconStyle() {
      return {
        backgroundImage: 'url("https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/localtheme/non-path/21620529.png")',
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

