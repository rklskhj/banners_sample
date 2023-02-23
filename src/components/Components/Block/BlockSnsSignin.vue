<template>
<div v-if="socialKey">
    <btn-kakao-signin class="sns-item" v-if="socialKey.kakao.enable.login"></btn-kakao-signin>
    <btn-naver-signin class="sns-item" v-if="socialKey.naver.enable.login"></btn-naver-signin>
    <btn-facebook-signin class="sns-item" v-if="socialKey.facebook.enable.login"></btn-facebook-signin>
  </div>
</template>
<script>
import BtnKakaoSignin from "@/components/Components/Button/BtnKakaoSignin.vue"
import BtnFacebookSignin from "@/components/Components/Button/BtnFacebookSignin.vue"
import BtnNaverSignin from "@/components/Components/Button/BtnNaverSignin.vue"
import AuthMixin from "@/components/Components/Mixins/AuthMixin"

export default {
  name: 'BlockSnsSignin',
  components: {
    BtnKakaoSignin,
    BtnFacebookSignin,
    BtnNaverSignin
  },
  mixins: [
    AuthMixin
  ],
  props: {
    startPage: {
      type: String,
      default: "home",
    },

  },
  data() {
    return {
      "socialKey": undefined
    }
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
          let path = this.$store.getters.previousPath;
              if(!path) {
                path = this.$store.getters.brand.startpage;
              }
              this.$router.replace(path);
        });
      }
      
      this.getSns();
    },
  
  methods: {
    getSns() {
      this.$axios.get('public/service/social_key').then(res => {
        this.socialKey = res.data.social_key;
      })
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.sns-item {
    margin-top: 12px;
  }
</style>

