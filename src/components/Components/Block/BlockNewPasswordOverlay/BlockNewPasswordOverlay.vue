<template>
<div class="full-width">
    <page-header v-if="$store.getters.device==='mobile'">
      <div slot="left">
        <i class="material-icons" @click="clickClose">keyboard_arrow_left</i>
      </div>
      <span class="size-16 weight-500" slot="center">내 정보 수정</span>
    </page-header>
    <div v-else class="size-16 weight-500 flex-center">내 정보 수정</div>
    <div style="text-align:left;margin-top: 50px; padding-top: 10px" :style="pagePadding">
      <!--remove autocomplete-->
      <input style="display:none" aria-hidden="true">
      <input type="password" style="display:none" aria-hidden="true">
      <!--End remove autocomplete-->
      <c-input-password
      v-if="value.old_password!==undefined"
      placeholder="현재 비밀번호"
      :inputCustomStyle="inputCustomStyle"
      :validate="valid"
      :value.sync="value.old_password"></c-input-password>
      
      <c-input-password
      v-if="value.password!==undefined"
      placeholder="비밀번호 입력"
      :inputCustomStyle="inputCustomStyle"
      :validate="valid"
      :value.sync="value.password"></c-input-password>

    <c-input-password-re
      v-if="value.password_re!==undefined"
      placeholder="비밀번호 확인"
      :inputCustomStyle="inputCustomStyle"
      :password="value.password"
      :validate="validErr"
      :value.sync="value.password_re" @valid="onValid"></c-input-password-re>

    <div :style="[reValid !== 'ok' ? brandBtn.bg.gray : brandBgColor.brand]"
      class="p-white text-center radius-8"
      :class="{'unselect': reValid === 'ok'}"
      style="height:56px;line-height:56px;margin-top:56px" @click="apply">변경</div>
    </div>
    <div class="unselect size-12 text-center p-sub2" @click="clickFind"
    style="text-decoration:underline;margin-top:8px;padding:4px 0">비밀번호가 기억나지않으세요?</div>
  </div>
</template>
<script>
import AuthMixin from "@/components/Components/Mixins/AuthMixin"

export default {
  name: 'BlockNewPasswordOverlay',
  components: {

  },
  mixins: [
    AuthMixin
  ],
  props: {
    prop: {
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
      "value": {
        "password": "",
        "password_re": "",
        "old_password": ""
      },
      "reValid": "not",
      "validErr": {
        "validate": false,
        "error_msg": "",
        "valid_required": true
      }
    }
  },
  created() {
      if(this.value.username.indexOf('@')===-1) {
        let step = Number(this.$route.query.step)+1;
        this.$router.replace(`${this.$route.path}?step=${step}`);
      }
      if(!this.value.password) {
        this.value.password = '';
        this.value.password_re = '';
      }
    },
  mounted() {
    this.$nextTick(() => {
      for(let el of document.getElementsByClassName('sweet-box-actions')) {
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
    })
  },
  
  methods: {
    clickFind() {
      setTimeout(()=>{
        this.routerModal('PasswordEmailModal');
      }, 100);
      this.$emit('closePage');
    },
    clickClose() {
      this.$emit('closePage');
    },
    apply() {
      if(this.reValid === 'ok') {
        this.$axios.post('auth/user/login', {
          username: this.user.username,
          password: this.value.old_password
        }).then(res=> {
          if(res.status===200) {
            this.updateInfo();
          }
        }).catch(error=> {
          this.toast('현재 비밀번호를 잘못 입력하셨습니다.');
        })
      }
    },
    updateInfo() {
      this.$store.commit('setLoadingSpinner', true);
        let params = {
          username: this.user.username,
          password: this.value.password
        }
        this.$axios.patch(`user/${this.user.user_id}`,
          params).then(res=>{
          if(res.status===200) {
            this.toast('비밀번호가 변경되었습니다.');
            this.$store.commit('setLoadingSpinner', false);
            this.setUserData(res.data);
            this.$emit('closePage');
          }
        }).catch(err=> {
          if(!err.response.data.message) {
            this.toast(err.response.data.detail);
            this.$store.commit('setLoadingSpinner', false);
          }
          else {
            this.toast(err.response.data.message);
            this.$store.commit('setLoadingSpinner', false);
          }
        })
      },
    onValid(res) {
      this.reValid = res;
    }
  },
  computed: {
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


