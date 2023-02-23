<template>
  <div :style="containerStyle">
    <!-- 레이블 -->
    <div class="flex-align" v-if="formType.label && label">
      <div :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
    </div>

    <!-- 버튼 영역 -->
    <div :style="buttonStyle" @click="onClickEl">
      <div class="flex-center">
        <div>{{ message }}</div>
        <i class="material-icons" v-if="status"
           :style="brandColor.brand" style="margin-left:4px">check</i>
      </div>
    </div>

    <form id="payForm" accept-charset='euc-kr' onload="" style="">
      <input type="hidden" name="CASH_GB" id="CASH_GB" :value="form.CASH_GB">
      <input type="hidden" name="PAY_MODE" id="PAY_MODE" :value="form.PAY_MODE">
      <input type="hidden" name="Siteurl" id="Siteurl" :value="form.Siteurl">
      <input type="hidden" name="Tradeid" id="Tradeid" :value="form.Tradeid">
      <input type="hidden" name="CI_SVCID" id="CI_SVCID" :value="form.CI_SVCID">
      <input type="hidden" name="CI_Mode" id="CI_Mode" :value="form.CI_Mode">
      <input type="hidden" name="Okurl" id="Okurl" :value="form.Okurl">
      <input type="hidden" name="Cryptyn" id="Cryptyn" :value="form.Cryptyn">
      <input type="hidden" name="Keygb" id="Keygb" :value="form.Keygb">
      <input type="hidden" name="Callback" id="Callback" :value="form.Callback">
      <input type="hidden" name="Smstext" id="Smstext" :value="form.Smstext">
      <input type="hidden" name="Lmstitle" id="Lmstitle" :value="form.Lmstitle">
      <input type="hidden" name="Lmstext" id="Lmstext" :value="form.Lmstext">
      <input type="hidden" name="SUB_CPID" id="SUB_CPID" :value="form.SUB_CPID">
      <input type="hidden" name="DI_CODE" id="DI_CODE" :value="form.DI_CODE">
      <input type="hidden" name="CI_FIXCOMMID" id="CI_FIXCOMMID" :value="form.CI_FIXCOMMID">
      <input type="hidden" name="Closeurl" id="Closeurl" :value="form.Closeurl">
      <input type="hidden" name="MSTR" id="MSTR" :value="form.MSTR">
      <input type="hidden" name="LOGO_YN" id="LOGO_YN" :value="form.LOGO_YN">
      <input type="hidden" name="CALL_TYPE" id="CALL_TYPE" :value="form.CALL_TYPE">
      <input type="hidden" name="LOGIN_TYPE" id="LOGIN_TYPE" :value="form.LOGIN_TYPE">
    </form>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin';

  export default {
    name: "CInputVerify",

    mixins: [
      FormMixin
    ],

    props: {
      message: {
        type: String,
        default: "휴대폰 본인 인증"
      }
    },
    data() {
      return {
        status: false,
        form: {
          "MSTR": "",
          "Keygb": "0",
          "Okurl": "",
          "CASH_GB": "CI",
          "CI_Mode": "61",
          "Cryptyn": "Y",
          "DI_CODE": "",
          "LOGO_YN": "N",
          "Lmstext": "",
          "Siteurl": "",
          "Smstext": "",
          "Tradeid": "",
          "CI_SVCID": "",
          "Callback": "",
          "Closeurl": "",
          "Lmstitle": "",
          "PAY_MODE": "10",
          "SUB_CPID": "",
          "CALL_TYPE": "SELF",
          "CI_FIXCOMMID": ""
        }
      }
    },

    created() {
      // head에 js 파일 import
      let head = document.getElementsByTagName('head')[0];
      let script = document.createElement('script');
      script.src = 'https://auth.mobilians.co.kr/js/ext/ext_inc_comm.js';
      head.appendChild(script);

      this.form.Siteurl = this.$store.getters.brand.domain.replace('https://','');
      this.form.Okurl = `https://plugin.launchpack.co.kr/php/pg/latest/okurl.php?Siteurl=${this.form.Siteurl}${location.pathname}`;
      this.form.CI_SVCID = this.$store.getters.social_key.mobilians_certify.svcid;

      if(this.$store.getters.device === 'pc') {
        // POPUP
        this.form.CALL_TYPE= 'P';
      } else {
        // 페이지 이동
        this.form.CALL_TYPE = 'SELF';
      }

      // sns 가입의 경우
      if (this.$route.query.login_type !== '' &&
        this.$route.query.login_type !== undefined) {
        // query_string 모두 저장하고 okurl.php 에서 redirect 할 때 사용
        let params = location.search.split('&');

        // 본인확인서비스 redirect 정보에 이름이 있으므로 기존 sns query string 의 name 필드는 제거
        for (let i = 0; i < params.length; i++) {
          if(params[i].indexOf('name') > -1) {
            params.remove(i);
          }
        }

        let redirect_url = params[0];

        for (let i = 1; i < params.length; i++) {
          redirect_url += "&" + params[i]
        }

        this.form.MSTR = redirect_url;
      }

      // 본인인증완료 여부 초기화
      this.$store.commit('setIdentification', false);
      if(this.value && this.value !== '') {
        this.status = true;
        this.message = this.message + ' 완료';
      }
      else {
        // query string(type: personal_valid) 으로 인증여부 확인
        if (this.$route.query.type === 'personal_valid') {
          // 인증확인 후 요청시 생성한 Tradid 와 query string 의 Tradeid 가 일치하는지 확인하여
          // 인증확인여부 처리
          if (this.$store.getters.tradeId === this.$route.query.Tradeid) {
            this.status = true;
            this.message = this.message + ' 완료';
            this.$emit('update:value', true);
            this.$store.commit('setIdentification', true);
          }
        } else {
          // 거래번호 생성
          this.form.Tradeid = this.uuidv4();
          this.$store.commit('setTradeId', this.form.Tradeid);
          this.$emit('update:value',true);
        }
      }
    },
    methods: {
      onClickEl() {
        if (this.status) return;
        let payForm = document.getElementById('payForm');
        // ext_inc_comm.js에 선언되어 있는 함수를 호출
        MCASH_PAYMENT(payForm);
      }
    },
    computed: {
      buttonStyle() {
        // 인증 완료
        if(this.status) {
          return {
            padding: '14px 0',
            borderRadius: '8px',
            backgroundColor: this.brandBgColor.sub.backgroundColor,
            border: this.brandBorder.main.border,
            color: '#777777',
            fontSize: '15px',
            fontWeight: '500',
            textAlign: 'center',
          }
        }
        // 인증 전
        else {
          return {
            padding: '14px 0',
            borderRadius: '8px',
            backgroundColor: this.brandBgColor.brand.backgroundColor,
            border: this.brandBorder.main.border,
            color: 'white',
            fontSize: '15px',
            fontWeight: '500',
            textAlign: 'center',
          }
        }
      }
    }
  }
</script>
