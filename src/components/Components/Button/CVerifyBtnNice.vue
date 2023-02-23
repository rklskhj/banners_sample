<template>
<div class="btn-nice">
        <btn
                @clicked="clickBtn"
                :color="brandColor.white"
                :backgroundColor="brandBgColor.brand">휴대폰 본인 인증</btn>
        <form name="form_chk" method="post">
            <!-- 요청모드 (필수 데이터) -->
            <input type="hidden" name="m" value="checkplusSerivce">
            <!-- get으로 요청 -->
            <input type ="hidden" name="recvMethodType" value ="get">
            <!-- 업체정보 암호화 데이터 -->
            <input type="hidden" name="EncodeData" :value="enc_data">
            <!-- 팝업 호출 링크 -->
            <!--<btn  ="javascript:fnPopup();"> CheckPlus 안심본인인증 Click</a>-->
        </form>
    </div>
</template>
<script>

export default {
  name: 'CVerifyBtnNice',
  components: {

  },
  mixins: [

  ],
  props: {
    redirectUrl: {
      type: String,
      default: "signup",
      required: false,
    },

  },
  data() {
    return {
      "enc_data": "",
      "returnMsg": ""
    }
  },
  created() {

    },
  mounted() {

    },
  
  methods: {
    clickBtn() {
      let nice = this.$store.getters.social_key.nice;
      if(nice === undefined || nice.enable.service === false || nice.sitecode === '' || nice.sitepasswd === '') {
        this.toast('본인인증 서비스가 정상 등록되지 않았습니다.\n관리자에게 문의해주세요.');
        return;
      }
        let url = 'checkplus_main';
        if(this.$store.getters.device==='mobile') {
          let query = this.$route.query;
          let key = Object.keys(query);
          url += '?device_type=mobile';
          url += `&redirect_return_url=${this.$store.getters.brand.domain}/${this.redirectUrl}`;
          
          for (let k in query) {
            if (key[0] === k) {
              url += `?${k}=${query[k]}`
            } else if (k !== 'name') {
              url += encodeURIComponent(`&${k}=${query[k]}`)
            }
          }
          console.log(url, 'url_test')
          // url += `&redirect_return_url=http://localhost:8000/signup?signup_type=1`;
        } else {
          // url += `?redirect_return_url=http://localhost:8000/nice_verify`;
          url += `?redirect_return_url=${this.$store.getters.brand.domain}/nice_verify`;
        }
        this.$axios.get(url).then(res=>{
          if(res.status===200) {
            this.returnMsg = res.data.returnMsg;
            this.enc_data = res.data.enc_data;
            setTimeout(()=> {
              this.fnPopup();
            },200);
          }
        })
      },
    fnPopup() {
        if(this.$store.getters.device==='mobile') {
           document.form_chk.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
           document.form_chk.target = "_self";
           document.form_chk.submit();
        } else {
          window.name ="Parent_window";
          window.open('', 'popupChk', 'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
          document.form_chk.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
          document.form_chk.target = "popupChk";
          document.form_chk.submit();
        }
      }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


