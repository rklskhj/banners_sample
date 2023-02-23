<template>
<div :style="containerStyle">
    <div class="size-18" :style="brandColor.main" style="margin:56px 0 24px 0">이메일을 입력해주세요.</div>
    <c-input-email ref="email"
      placeholder="이메일 입력"
      :validate="valid"
      :inputCustomStyle="inputCustomStyle"
      :value.sync="value.email"></c-input-email>

    <div :class="{'unselect': valid.validate}" :style="[valid.validate ? brandBgColor.brand : brandBtn.bg.gray, brandColor.white]"
         style="text-align:center;border-radius: 8px;height:56px;line-height:56px;margin-top:56px" @click="apply">다음</div>
  </div>
</template>
<script>

export default {
  name: 'BlockWtPutEmail',
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
      "valid": {
        "validate": false,
        "error_msg": "",
        "valid_required": true
      }
    }
  },
  created() {
    if(!this.value.email) {
      this.value.email = '';
    }
    
  },
  mounted() {
    this.$nextTick(() => {
      if (this.value.email) {
        this.valid.validate = true;
      }
    })
  },
  
  methods: {
    apply() {
      if(this.$route.path.indexOf('partner_signup')>-1) {
        this.$emit('next');
      } else {
       if (this.valid.validate) {
        if(this.value.username === '' || this.value.username === undefined) {
          this.value.username = this.value.email;
          this.$axios.post('auth/user/check/email', { email: this.value.email }).then(res=>{
            if(res.data.result === 'ok') {
              this.$store.commit('setUsername', this.value.username);
              this.$emit('next');
            } else {
              if(res.data.login_type === 'email') {
                this.$refs.email.$refs.text.errorMsg = '이미 가입된 이메일 계정이 있습니다.'
                this.valid.error_msg = '이미 가입된 이메일 계정이 있습니다.'
                // this.toast('이미 가입된 이메일 계정이 있습니다.');
                this.value.username = '';
              } else {
                // this.toast(`해당 이메일주소로 가입한 ${res.data.sns} 계정이 있습니다.`);
                this.$refs.email.$refs.text.errorMsg = `해당 이메일주소로 가입한 ${res.data.sns} 계정이 있습니다.`
                this.valid.error_msg = `해당 이메일주소로 가입한 ${res.data.sns} 계정이 있습니다.`
                this.value.username = '';
              }
            }
          });
        } else {
          this.$store.commit('setUsername', this.value.username);
          console.log(this.value, 'value_test2')
          this.$emit('next');
        }
      } 
      }
    }
  },
  computed: {
    containerStyle() {
      return this.$store.getters.device === 'mobile' ? this.pagePadding : {width: '500px'};
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
    'valid.error_msg'(n) {
      if (n === '') {
        this.valid.validate = true;
        this.$refs.email.$refs.text.$refs.input.style.border = this.brandBorder.main.border;
      } else {
        if (n.indexOf('계정이 있습니다.') > -1) {
          this.$refs.email.$refs.text.$refs.input.style.border = this.brandBorder.highlight.border;
        } else {
          this.$refs.email.$refs.text.$refs.input.style.border = this.brandBorder.main.border;
        }
        this.valid.validate = false;
      }
    }
  }
}
</script>


