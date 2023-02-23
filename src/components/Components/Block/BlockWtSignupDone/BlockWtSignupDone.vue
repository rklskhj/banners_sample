<template>
<div :style="containerStyle">
    <div style="margin-top: 50%">
      <div class="text-center" v-if="vDone">
        <div class="flex-center full-width">
          <div class="flex-center"
               :style="[brandBgColor.brand,brandColor.white]"
               style="border-radius: 100%;text-align: center;width:64px;height:64px;">
            <i class="material-icons" style="font-size:41px">check</i>
          </div>
        </div>
        <div class="size-24 weight-700" style="margin-top:24px" :style="brandColor.main">{{ isPartner ? `${partnerName} 가입 ${isPartnerReq ? '신청 ' : ''}완료` : '가입완료!' }}</div>
        <div :style="brandColor.sub2" class="size-14" style="margin-top:8px">
          <span v-if="isPartner && isPartnerReq">마이페이지에서 {{ partnerName }} 가입 신청 결과를 확인 할 수 있습니다.</span>
          <template v-else>
            {{ serviceName }} 가입이 완료되었습니다.<br><span v-if="!isPartner">프로필을 등록해주세요.</span>  
          </template>
        </div>
        
        <template v-if="isPartner">
          <div :style="[brandBgColor.brand, brandColor.white]" class="unselect"
               style="margin-top:56px;width:100%;height:48px;line-height:48px;padding:0 12px;border-radius: 10px" 
               @click="clicked(`${isPartnerReq ? '/mypage' : '/partner_center'}`)">{{ isPartnerReq ? '마이페이지' : '로그인 하러가기' }}</div>
       </template>
        <div v-else class="grid-box" style="margin-top:56px">
          <div class="col-6" style="padding-right:5px">
            <div :style="[brandBorder.brand, brandColor.brand]" class="unselect"
                 style="height:48px;line-height:48px;padding:0 12px;border-radius: 10px" @click="clickNext">다음에
            </div>
          </div>
          <div class="col-6" style="padding-left:5px">
            <div :style="[brandBgColor.brand, brandColor.white]" class="unselect"
                 style="height:48px;line-height:48px;padding:0 12px;border-radius: 10px" @click="clicked('profile')">프로필
              등록
            </div>
          </div>
        </div>
      </div>

      <div class="text-center" v-else-if="vAdd">
        <div class="flex-center full-width">
          <div class="flex-center"
               :style="brandColor.white"
               style="background-color:#37C793;border-radius: 100%;text-align: center;width:64px;height:64px;">
            <i class="material-icons" style="font-size:41px">add_link</i>
          </div>
        </div>
        <div class="size-24 weight-700" style="margin-top:24px" :style="brandColor.main">{{ isPartner ? `${partnerName} 가입 ${isPartnerReq ? '신청 ' : ''}완료` : '가입완료!' }}</div>
        <div :style="brandColor.sub2" class="size-14" style="margin-top:8px">기존에 가입하신 계정과 연동되었습니다.<br><span v-if="!isPartner">프로필을 수정하시겠습니까?</span></div>

        <div v-if="isPartner" :style="[brandBgColor.brand, brandColor.white]" class="unselect"
             style="margin-top:56px;width:100%;height:48px;line-height:48px;padding:0 12px;border-radius: 10px" @click="clicked('partner_center')">로그인 하러가기</div>
        <div v-else class="grid-box" style="margin-top:56px">
          <div class="col-6" style="padding-right:5px">
            <div :style="[brandBorder.brand, brandColor.brand]"  class="unselect"
                 style="height:48px;line-height:48px;padding:0 12px;border-radius: 10px" @click="clickNext">홈으로
            </div>
          </div>
          <div class="col-6" style="padding-left:5px">
            <div :style="[brandBgColor.brand, brandColor.white]" class="unselect"
                 style="height:48px;line-height:48px;padding:0 12px;border-radius: 10px" @click="clicked('profile')">프로필
              수정
            </div>
          </div>
        </div>
      </div>

      <div class="text-center" v-else-if="vErr">
        <div class="flex-center full-width">
          <div class="flex-center"
               :style="[brandBgColor.highlight,brandColor.white]"
               style="border-radius: 100%;text-align: center;width:64px;height:64px;">
            <i class="material-icons" style="font-size:41px">priority_high</i>
          </div>
        </div>
        <div class="size-24 weight-700" style="margin-top:24px" :style="brandColor.main"><span v-if="isPartner">{{ partnerName }}</span> 회원가입 실패</div>
        <div :style="brandColor.sub2" class="size-14" style="margin-top:8px">회원가입에 실패하였습니다.<br>{{ errMsg }}</div>

        <div class="grid-box" style="margin-top:56px;gap:10px">
          <div style="flex:1">
            <div :style="[brandBorder.brand, brandColor.brand]" class="unselect"
                 style="height:48px;line-height:48px;padding:0 12px;border-radius: 10px"
                 @click="clicked('contact_reg')">문의하기
            </div>
          </div>
          <div style="flex:1">
            <div :style="[brandBgColor.brand, brandColor.white]" class="unselect"
                 style="height:48px;line-height:48px;padding:0 12px;border-radius: 10px" @click="clicked('home')">홈으로
              돌아가기
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import AuthMixin from "@/components/Components/Mixins/AuthMixin"

export default {
  name: 'BlockWtSignupDone',
  components: {

  },
  mixins: [
    AuthMixin
  ],
  props: {
    value: {
      type: Object,
    },

  },
  data() {
    return {
      "vAdd": false,
      "vErr": false,
      "isDev": false,
      "vDone": false,
      "errMsg": "다시 진행하시거나 관리자에게 문의를 남겨주세요.",
      "partnerName": "파트너",
      "isPartnerReq": false
    }
  },
  created() {
    this.$axios.get('public/partner/setting').then(res => {
        this.partnerName = res.data.partner_name;
        this.isPartnerReq = res.data.signup_type === 1;
        
        if (Object.keys(this.$store.getters.signupData).length > 0) {
        this.signup();
        } else {
          let signupType = this.$store.getters.signupType;
          if (this.isDev) {
            signupType = 'email';
          }
          if (signupType && signupType === 'add_sns') {
            this.vAdd = true;
          } else if (signupType && signupType === 'email') {
            this.vDone = true;
          } else {
            this.vErr = true;
          }
        }
          this.$store.commit('setVerifyInfo', undefined);
      });
  },
  
  methods: {
    signup() {
        this.$store.commit('setLoadingSpinner', true);
        let signupData = this.$store.getters.signupData;
        
        Object.keys(signupData).forEach(key => {
          if (key !== 'id') {
            this.value[key] = signupData[key];
          }
        })
        if(this.isPartner) {
          let params = {
            partner: this.value,
            users: [
              this.value
            ]
          };
         let url = `user/${this.user.user_id}/partner${this.isPartnerReq === true ? '' : '/base'}`;
         this.$axios.post(url, params).then(res => {
           this.$store.commit('setLoadingSpinner', false);
           if(res.status === 200) {
             this.vDone = true;
             this.setUserData(res.data);
           }
         }).catch((err)=>{
          this.$store.commit('setLoadingSpinner', false);
          
          this.errMsg = err.response.data.message ? err.response.data.message : '다시 진행하시거나 관리자에게 문의를 남겨주세요.';
          this.vErr = true; 
         });
        }
        else {
          this.$axios.post('auth/user/signup', this.value).then(res=>{
          this.$store.commit('setLoadingSpinner', false);
          if(res.status === 200) {
            if(res.data.signup_type === 'add_sns') {
              this.vAdd = true;
              this.$store.commit('setSignupType', 'add_sns');
            } else {
              this.vDone = true;
              this.$store.commit('setSignupType', 'email');
            }
            this.setUserData(res.data);
            this.setAuthHeader();
            this.$store.commit('setSignupData', {})
          } else {
            this.vErr = true;
          }
        }).catch((err)=>{
          this.$store.commit('setLoadingSpinner', false);
          
          this.errMsg = err.response.data.message ? err.response.data.message : '다시 진행하시거나 관리자에게 문의를 남겨주세요.';
          this.vErr = true;
        });
        }
      },
    clicked(key) {
        this.routerPush(key);
      },
    clickNext() {
        if (this.vDone && this.$store.getters.brand.plugins.indexOf('guide') !== -1) {
          this.routerPush('/service_guide');
        } else {
          this.routerPush('/home');
        }
      }
  },
  computed: {
    isPartner() {
      return this.$route.path.indexOf('partner_signup') > -1;
    },
    containerStyle() {
      return this.$store.getters.device === 'mobile' ? this.pagePadding : {width: '500px'};
    },
    serviceName() {
      return this.$store.getters.service.title;
    }
  },
  watch: {
    
  }
}
</script>


