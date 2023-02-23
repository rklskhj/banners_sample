<template>
<div style="text-align: center;margin-top: 20vh" :style="containerStyle">
  <div :style="brandColor.main"
       class="size-18 weight-500 text-center">간편하게 가입하고,<br>지금 바로 다양한 서비스를 이용해보세요.</div>
  <div :style="brandColor.sub" style="margin-top:12px" class="size-14">당신을 위한 특별한 서비스를 만나보세요.</div>
  <div class="unselect" :style="[brandBgColor.brand, brandColor.white]"
       style="border-radius: 8px;height:56px;line-height:56px;margin-top:56px" @click="clickEmail">이메일로 시작하기</div>
  <div v-if="$store.getters.brand.plugins.indexOf('sns_signin') > -1">
    <div :style="brandColor.sub3" class="size-12" style="margin-top:96px">SNS 계정으로 회원가입하기</div>
    <c-sns-signup button-style="circle" @next="nextSns"></c-sns-signup>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockWtSignup',
  components: {

  },
  mixins: [

  ],
  props: {
    value: {
      type: Object,
    },

  },
  data() {
    return {

    }
  },
  created() {
    if(!this.value.username) {
      this.value.username = '';
    }
  },
  
  methods: {
    clickEmail() {
      this.$emit('next');
    },
    nextSns() {
      ['user_id','name','profile','email'].forEach(key=>{
        let val = this.$route.query[key];
        if(val) {
          if(key === 'user_id') {
            this.value.username = val;
          } else {
            this.value[key] = val;
          }
        }
      });
      let step = Number(this.$route.query.step)+1;
      this.$router.replace(`${this.$route.path}?step=${step}`);
    }
  },
  computed: {
    containerStyle() {
      return this.$store.getters.device === 'mobile' ? this.pagePadding : {width: '500px'};
    }
  },
  watch: {
    
  }
}
</script>


