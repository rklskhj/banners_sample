<template>
<div :style="containerStyle">
  <template v-if="hasPlugin">
    <div class="size-18" :style="brandColor.main" style="margin:56px 0 24px 0">휴대폰으로 본인인증해주세요.</div>
    <c-verify-btn-nice></c-verify-btn-nice>
  </template>
  <template v-else>
    <div class="size-18" :style="brandColor.main" style="margin:56px 0 24px 0">휴대폰번호를 입력해주세요.</div>
    <c-input-phone ref="phone"
      placeholder="휴대폰번호 입력"
      :validate="valid"
      :inputCustomStyle="inputCustomStyle"
      :value.sync="phone"></c-input-phone>
    
    <div :class="{'unselect': valid.validate}" :style="[valid.validate ? brandBgColor.brand : brandBtn.bg.gray, brandColor.white]"
         style="text-align:center;border-radius: 8px;height:56px;line-height:56px;margin-top:56px" @click="apply">다음</div>
  </template>
</div>
</template>
<script>
import CVerifyBtnNice from "@/components/Components/Button/CVerifyBtnNice.vue"

export default {
  name: 'BlockWtVerify',
  components: {
    CVerifyBtnNice
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
      "phone": "",
      "valid": {
        "num": true,
        "alpha_g": true,
        "alpha_s": true,
        "special": true,
        "required": true,
        "validate": false,
        "error_msg": "",
        "max_length": 20,
        "min_length": 2,
        "valid_required": true
      }
    }
  },
  created() {
    if(!this.hasPlugin) {
      if (this.value.name === '' && this.value.username.indexOf('@') > -1) {
        this.value.name = this.value.username.split('@')[0];
      }
      // let step = Number(this.$route.query.step)+1;
      // this.$store.commit('setSignupData', this.value);
      // this.$router.replace(`${this.$route.path}?step=${step}`);
    } else {
      if (this.$store.getters.device==='pc') {
        if (this.$store.getters.verifyInfo && Object.keys(this.$store.getters.verifyInfo).length > 0) {
          ['name','birthdate','gender','phone'].forEach(key=>{
            let val = this.$store.getters.verifyInfo[key];
            if (val) {
              if (key === 'phone') {
                this.value.phone = val;
              } else if (key === 'birthdate') {
                this.value.birth = val.replace(/(\d{4})(\d{2})(\d{2})/gi,'$1-$2-$3');
              } else if(key === 'gender') {
                this.value.gender = val === '1' ? 'male' : 'female';
              }
              else {
                this.value[key] = val;
              }
            }
          });
          this.value.username = this.user.username;
          console.log('value', this.value);
          this.$store.commit('setSignupData', this.value);
          let step = Number(this.$route.query.step)+1;
          this.$router.replace(`${this.$route.path}?step=${step}`);
        } else {
          console.log('test2')
          this.value.id = 0;
        }
      } else {
        if(this.$route.query.type) {
          Object.keys(this.$store.getters.user).forEach(key=>{
            this.value[key] = this.$store.getters.user[key];
          });
          ['name','birthdate','gender','mobileno'].forEach(key=>{
            let val = this.$route.query[key];
            if(val) {
              if(key === 'mobileno') {
                this.value.phone = val;
              } else if(key === 'birthdate') {
                this.value.birth = val.replace(/(\d{4})(\d{2})(\d{2})/gi,'$1-$2-$3');
              } else if(key === 'gender') {
                this.value.gender = val === '1' ? 'male' : 'female';
              }
              else {
                this.value[key] = val;
              }
            }
          });
          this.value.username = this.user.username;
          this.$store.commit('setSignupData', this.value);
          let step = Number(this.$route.query.step)+1;
          this.$router.replace(`${this.$route.path}?step=${step}`);
        } else {
          this.value.id = 0;
        }
      }
    }
    
  },
  mounted() {
    this.$nextTick(() => {
      console.log('verifyInfo_mounted', this.$store.getters.verifyInfo)
    })
  },
  
  methods: {
    apply() {
      if (this.valid.validate && this.valid.error_msg === '') {
        this.value.phone = this.phone;
        this.$store.commit('setSignupData', this.value);
        this.$emit('next');
      }
    }
  },
  computed: {
    containerStyle() {
      return this.$store.getters.device === 'mobile' ? this.pagePadding : {width: '500px'};
    },
    hasPlugin() {
      return this.$store.getters.brand.plugins.indexOf('identity_verify') > -1 || this.$store.getters.brand.plugins.indexOf('nice_identity_verify') > -1;
    },
    inputCustomStyle() {
      return {
        padding: '0 12px',
        fontSize: '16px',
        height: '54px',
        lineHeight: '54px',
        borderRadius: '8px',
        border: this.brandBorder.main.border
      }
    }
  },
  watch: {
    phone(n) {
      this.valid.validate = n.length === 13
    },
    'valid.error_msg'(n) {
      if (n === '') {
        this.valid.validate = true;
        this.$refs.phone.$refs.input.style.border = this.brandBorder.main.border;
      } else {
        if (n.indexOf('입력해주세요') > -1) {
          this.$refs.phone.$refs.input.style.border = this.brandBorder.highlight.border;
        } else {
          this.$refs.phone.$refs.input.style.border = this.brandBorder.main.border;
        }
        this.valid.validate = false;
      }
    }
  }
}
</script>


