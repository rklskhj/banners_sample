<template>
<div v-if="visible" :style="containerStyle">
    <div class="size-18" :style="brandColor.main" style="margin:56px 0 24px 0">비밀번호를 입력해주세요.</div>
    <c-input-password
      v-if="value.password!==undefined"
      placeholder="비밀번호 입력"
      :inputCustomStyle="inputCustomStyle"
      :validate="valid"
      :value.sync="value.password" @update:value="onUpdate"></c-input-password>

    <c-input-password-re
      v-if="value.password_re!==undefined"
      placeholder="비밀번호 확인"
      :inputCustomStyle="inputCustomStyle"
      :password="value.password"
      :validate="validErr"
      :value.sync="value.password_re" @update:value="onUpdate"></c-input-password-re>

    <div :class="{'unselect': valid.validate}" :style="[valid.validate ? brandBgColor.brand : brandBtn.bg.gray, brandColor.white]"  class="unselect"
         style="text-align:center;border-radius: 8px;height:56px;line-height:56px;margin-top:56px" @click="apply">다음</div>
  </div>
</template>
<script>

export default {
  name: 'BlockWtPassword',
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
      },
      "visible": false,
      "validErr": {
        "validate": false,
        "error_msg": "",
        "valid_required": true
      }
    }
  },
  created() {
      if(!this.value.password) {
        this.value.password = '';
        this.value.password_re = '';
      }
      let user = this.$store.getters.user;
      if(this.$route.path.indexOf('partner_signup') > -1) {
        if(user.username.indexOf('@') > -1) {
          let step = Number(this.$route.query.step)+1;
          this.$router.replace(`${this.$route.path}?step=${step}`);
        }
      }
      else {
        if(user.username.indexOf('@') === -1) {
          let step = Number(this.$route.query.step)+1;
          this.$router.replace(`${this.$route.path}?step=${step}`);
        }
      }
      this.visible = true;
    },
  
  methods: {
    apply() {
      if (this.validErr.error_msg === '일치하는 비밀번호를 입력해주세요') {
        return;
      } else {
        console.log(this.value, 'value_test_password')
        this.$emit('next');
      }
    },
    onUpdate() {
      this.valid.validate = this.valid.error_msg === '';
      this.validErr.error_msg = '';
      this.validErr.validate = true;
      if(this.valid.validate && this.value.password !== this.value.password_re) {
        this.valid.validate = false;
        this.validErr.error_msg = '일치하는 비밀번호를 입력해주세요';
        this.validErr.validate = false;
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
    
  }
}
</script>


