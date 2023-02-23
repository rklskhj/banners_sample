<template>
  <div :style="containerStyle" class="input-phone-verify">
    <div v-if="formType.label && label"
      :style="labelStyle">{{ label.replace('*', '') }}
      <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
    <template v-if="vForm">
      <div class="flex full-width" style="gap: 10px">
        <input type="text" v-model="phone" :class="{'error': error}"
          :readonly="valid && (success || remainNum > 0)"
          maxlength="11" placeholder="휴대폰 번호 입력" @keyup="onKeyup"
          style="width: 100%" :style="inputStyle">
        <button class="unselect button"
          :style="phoneVerifyButtonStyle" :disabled="disabled" @click="clickValid">인증하기</button>
      </div>
      <div class="msg-error" v-if="error">
        <img src="/static/image/icon/ic_warning_circle_error.svg">
        <div>{{ errorMsg }}</div>
      </div>
      <div class="flex" style="margin-top:10px;gap:0 10px" v-if="valid">
        <div class="position-relative" style="flex: 1">
          <input type="text" placeholder="인증번호 입력" maxlength="6" v-model="validNum" @keyup="onKeyupValid"
            style="width: 100%" :style="inputStyle">
          <div class="p-highlight" :style="remainStyle" v-if="remainNum>-1">{{ remain }}</div>
        </div>
        <button class="unselect button button-confirm"
          :style="phoneVerifyButtonStyle"
          @click="confirm" :disabled="success">확인</button>
      </div>

      <div class="msg-error" v-if="errorValid">
        <img src="/static/image/icon/ic_warning_circle_error.svg">
        <div>{{ errorValidMsg }}</div>
      </div>
      <div class="msg-success" v-if="success">
        <img src="/static/image/icon/ic_check_success.svg">
        <div class="size-14 p-sub2">인증번호가 일치합니다</div>
      </div>
      <div v-if="valid" class="size-14 p-sub2" style="margin-top:8px">인증번호를 받지 못하셨나요?
        <span class="unselect weight-700" style="text-decoration: underline" @click="reSend">인증번호 재전송</span>
      </div>
    </template>
    <div v-else class="blank"></div>
  </div>
</template>

<script>
  import {numToTime} from '@/utils/helper/format-helper'
  import FormMixin from "@/components/Mixins/FormMixin";

  export default {
    name: "CInputPhoneVerify",
    components: {

    },
    mixins: [
      FormMixin,
    ],
    mounted() {
    },
    props: {
      value: {
        type: String
      },
      label: {
        type: String,
        required: false
      },
      phoneVerifyButtonCustom: {
        type: Object,
        required: false
      },
      remainCustom: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        vForm: true,
        disabled: false,
        phone: '',
        validNum: '',
        valid: false,
        success: false,
        error: false,
        errorMsg: '필수입력 사항입니다.',
        errorValid: false,
        errorValidMsg: '필수입력 사항입니다.',
        remainNum: -1,
        itv: undefined,
        appVerifier: undefined,
        auth: undefined,
        confirmationResult: undefined,
        localId: ''
      }
    },
    async created() {
      this.phone = this.value;
    },
    computed: {
      remain() {
        return numToTime(this.remainNum).substring(2);
      },
      phoneVerifyButtonStyle() {
        if (this.phoneVerifyButtonCustom) {
          return this.phoneVerifyButtonCustom;
        } else {
          return {
            width: '120px',
            height: '40px',
            border: this.brandBorder.sub.border,
            borderRadius: '8px',
            fontSize: '14px',
            color: this.brandColor.sub.color,
            fontFamily: 'inherit'
          }
        }
      },
      remainStyle() {
        if (this.remainCustom) {
          return this.remainCustom;
        } else {
          return {
            position: 'absolute',
            top: 'calc(50% - 12px)',
            right: '20px'
          }
        }
      }
    },
    methods: {
      onKeyup(e) {
        this.phone = e.target.value.replace(/[^0-9]/gi, '');
      },
      onKeyupValid(e) {
        this.validNum = e.target.value;
      },
      clickValid() {
        // 인증 관련 로직 실행
        if(this.phone === '') {
          this.error = true;
          this.errorMsg = '필수입력 사항입니다.';
        } else if(this.phone.length<10) {
          this.error = true;
          this.errorMsg = '휴대폰번호를 정확히 입력해주세요';
        } else {
          // 인증 처리
          let params = {
            phone: this.phone
          }
          this.$axios.post('public/phone/verify/send', params).then(res => {
            this.toast('인증번호가 발송되었습니다.');
            this.disabled = true;
            this.error = false;
            this.valid = true;
            this.remainNum = 180;
            this.itv = setInterval(this.intervalRemain, 1000);
          }).catch(() => {
            this.toast('인증번호 발송에 실패했습니다.');
          })
        }
      },
      reSend() {
        if (!this.success) {
          this.$axios.post('public/phone/verify/send', params).then(res => {
            this.toast('인증번호가 발송되었습니다.');
            clearInterval(this.itv);
            this.disabled = true;
            this.error = false;
            this.valid = true;
            this.remainNum = 180;
            this.itv = setInterval(this.intervalRemain, 1000);
          }).catch(() => {
            this.toast('인증번호 발송에 실패했습니다.');
          })
        }
      },
      confirm() {
        let params = {
          phone: this.phone,
          verify_num: this.validNum
        }
        this.$axios.post('public/phone/verify/confirm', params).then(res => {
          if (this.remainNum > 0) {
            this.errorValid = false;
            this.success = true;
            this.remainNum = -1;
            this.$emit('auth', true);
            clearInterval(this.itv);
            this.$emit('update:value',`${this.phone}`);
          } else {
            this.errorValidMsg = '인증번호가 만료되었습니다.';
            this.errorValid = true;
            this.disabled = false;
          }
        }).catch(() => {
          this.toast('인증번호가 잘못되었거나 만료되었습니다.')
          this.errorValidMsg = '인증번호가 잘못되었거나 만료되었습니다.';
          this.errorValid = true;
        })
      },
      intervalRemain() {
          this.remainNum--;
          if(this.remainNum===0) {
            clearInterval(this.itv);
            this.errorValidMsg = '인증번호가 만료되었습니다.';
            this.errorValid = true;
            this.disabled = false;
          }
      },
    },
    watch: {
    }
  }
</script>

<style lang="stylus" scoped>
  input
    flex 1
    font-family inherit
  
  button
    font-family inherit

  .blank
    height 100px
  
  .msg-error
  .msg-success
    display flex
    align-items center
    margin-top 8px
    gap 0 4px
</style>
<style lang="stylus">
  .input-phone-verify
    .dropdown
      padding 0 8px
      height 44px
      line-height 44px
    .options
      width 280px

  .cc
    display flex
    align-items center
    gap 4px
  .img-cc
    width 16px
    height 12px
  .cc-name
    font-size 12px
</style>
