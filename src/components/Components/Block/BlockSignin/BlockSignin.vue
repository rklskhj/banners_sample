<template>
<div style="padding:56px 0 100px;width:100%" :style="signinStyle">
  <div class="text-center" style="margin-bottom:56px;">
    <div class="size-18 weight-500" :style="brandColor.main">간편하게 로그인하고,<br>지금 바로 다양한 서비스를 이용해보세요.</div>
    <div class="size-14" style="margin-top:12px" :style="brandColor.sub2">당신을 위한 특별한 서비스를 만나보세요.</div>
  </div>
  <!--로그인 폼 요소-->
  <component :is="form.elType" v-for="(form,idx) in formData" :key="'form-'+idx"
             v-bind="form" :value.sync="form.value" @onEnter="login"
             :formType="formTypeCustom"
             :containerCustomStyle="{marginTop: '8px'}"
             :inputCustomStyle="inputStyle"></component>

  <!--로그인 버튼-->
  <div class="unselect" :style="buttonCustom" style="margin-top:16px" @click="login">로그인</div>
  <div class="flex-between size-12" style="margin-top:12px" :style="brandColor.sub2">
    <div @click="routerModal('PasswordEmailModal')">비밀번호 재설정</div>
    <div @click="routerPush('signup')">회원가입</div>
  </div>

  <!-- 소셜 로그인 폼 -->
  <template v-if="$store.getters.brand.plugins.indexOf('sns_signin') > -1">
    <div class="text-center" 
        :style="brandColor.sub3" 
        style="margin:56px 0 36px 0">SNS 계정으로 로그인하기</div>
    <c-sns-signin button-style="circle"></c-sns-signin>
  </template>
    

</div>
</template>
<script>
import BlockSnsSignin from "@/components/Components/Block/BlockSnsSignin.vue"
import FormMixin from "@/components/Components/Mixins/FormMixin"
import AuthMixin from "@/components/Components/Mixins/AuthMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockSignin',
  components: {
    BlockSnsSignin
  },
  mixins: [
    FormMixin,
    AuthMixin,
    FormCustomMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "formData": []
    }
  },
  created() {
      this.getForm();
    },
  mounted() {
    if(this.$route.query.signout) {
      this.toast('탈퇴한 회원입니다');
    }
   },
  
  methods: {
    getForm() {
        let data = [
          {
            name: '아이디',
            field: 'username',
            label: '',
            placeholder: '이메일 입력',
            format: 'CInput_email',
            validate: {
              required: true,          // 값 필수 여부
              valid_required: true,     // validation 필수 여부
              min_length: 4,            // 최소 문자 수
              max_length: 30,           // 최대 문자 수
              alpha_s: true,            // 알파벳 소문자
              alpha_g: true,            // 알파벳 대문자
              num: true,                // 숫자
              special: true             // 특수문자
            },
            value: '',
          },
          {
            name: '비밀번호',
            field: 'password',
            label: '',
            placeholder: '비밀번호 입력',
            format: 'CInput_password',
            validate: {
              required: true,           // 값 필수 여부
              valid_required: true,     // validation 필수 여부
            },
            value: '',
          }
        ];
        this.formData = this.setForm(data);
      },
    login() {
        let result = this.getParamData(this.formData);

        if(result.enable) {
          this.$axios.post(`auth/user/login`, result.params)
          .then(res=>{
            if(res.status===200) {
              this.toast('로그인 되었습니다.');
              this.setUserData(res.data);
              this.setAuthHeader();
              let path = this.$store.getters.previousPath;
              if(!path) {
                path = this.$store.getters.brand.startpage;
              }
              this.$router.replace(path);


            }
          })
          .catch(err=> {
            if(!err.response.data.message)
              this.toast(err.response.data.detail);
            else
              this.toast(err.response.data.message);
          })
        }
      }
  },
  computed: {
    signinStyle() {
      return this.$store.getters.device === 'pc' ? {width: '500px',marginTop:'120px' } : this.pagePadding;
    },
    inputStyle() {
      let deco = this.cloneItem(this.inputCustom);
      deco.border = this.brandBorder.main.border;
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


