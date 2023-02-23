<template>
<div style="padding:25px 0;width:100%;max-width:596px" id="profile-form-wrap">
  <div :style="pagePadding">
    <div v-for="(item,idx) in computedformData" :key="'form-'+idx">
      <div class="flex-between" style="align-items: flex-start" :style="formMarginBottom(item)">
        <div class="size-14 weight-500 col-2" :style="brandColor.main" 
          v-if="item.field!=='profile'">{{ computedLabel(item) }}</div>
        <template v-if="item.value">
          <template v-if="item.field==='address'">
            <div class="size-13 weight-400 col-8" :style="brandColor.sub">{{ item.value.new }} {{ item.value.detail }}</div>
          </template>
          <template v-else-if="item.field==='profile'">
            <div class="full-width flex-justify">
              <div class="position-relative unselect" @click="clickBtn(item)">
                <img :src="profile" class="profile-img object-fit-cover radius-half"
                  style="margin-right:12px" />
                <div class="position-absolute flex-center" :style="brandBgColor.white"
                  style="width: 48px; height: 48px; border-radius: 50%; bottom: -10px; right: 10px">
                  <div class="flex-center" :style="{backgroundColor: brandColor.sub.color}"
                    style="width: 36px; height: 36px; border-radius: 50%">
                    <i class="material-icons" style="font-size: 24px"
                      :style="brandColor.white">camera_alt</i>
                  </div>
                  
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="item.field==='email'">
            <div class="flex-align col-8">
              <template v-if="$store.getters.brand.plugins.indexOf('sns_signin') > -1">
                <template v-if="item.value.indexOf('kakao$')>-1">
                  <img src="/static/image/icon/ic_circle_kakao.svg"
                    style="width:22px;height:22px;object-fit:contain;margin-right:4px">                  
                </template>
                <template v-if="item.value.indexOf('naver$')>-1">
                  <img src="/static/image/icon/ic_circle_naver.svg"
                    style="width:22px;height:22px;object-fit:contain;margin-right:4px">                  
                </template>
                <template v-if="item.value.indexOf('facebook$')>-1">
                  <img src="/static/image/icon/ic_circle_facebook.svg"
                    style="width:22px;height:22px;object-fit:contain;margin-right:4px">                  
                </template>
                <template v-if="item.value.indexOf('apple$')>-1">
                  <img src="/static/image/icon/ic_circle_apple.svg"
                    style="width:22px;height:22px;object-fit:contain;margin-right:4px">                  
                </template>
              </template>
              <div class="size-13 weight-400" :style="brandColor.sub">{{ item.value }}</div>
            </div>
          </template>
          <template v-else-if="item.field==='gender'">
            <div class="size-13 weight-400 col-8" :style="brandColor.sub">{{ item.value==='male' ? '남' : '여' }}</div>
          </template>
          <template v-else>
            <div class="size-13 weight-400 col-8" :style="brandColor.sub">{{ item.value }}</div>
          </template>
          
        </template>
        <template v-else>
          <div class="size-13 weight-400 col-8" :style="brandColor.sub3">{{ item.placeholder }}</div>
        </template>
        <div v-if="item.field!=='profile'"
          class="unselect size-12 weight-400" :style="[brandColor.sub,brandBorder.main,invisibleBtn(item), sBtnStyle]"
          @click="clickBtn(item)">{{ item.value || item.field==='password' ? '수정' : '등록' }}</div>
      </div>
    </div>
    
    <template v-if="$store.getters.brand.plugins.indexOf('sns_signin') > -1">
      <div class="flex-between margin-bottom-24" :style="brandBgColor.sub"
        style="border-radius:8px;padding:18px 16px">
        <div class="size-14 weight-500" :style="brandColor.sub">연동 sns계정</div>
        <div v-if="!user.facebook_id && !user.kakao_id && !user.naver_id && !user.apple_id">
          <div class="size-12 weight-400" :style="brandColor.sub3">연동된 계정이 없습니다.</div>
        </div>
        <div class="flex-align" v-else>
          <template v-if="user.kakao_id">
            <img src="/static/image/icon/ic_circle_kakao.svg"
              style="width:26px;height:26px;object-fit:contain;margin-right:10px">
          </template>
          <template v-if="user.naver_id">
            <img src="/static/image/icon/ic_circle_naver.svg"
              style="width:26px;height:26px;object-fit:contain;margin-right:10px">
          </template>
          <template v-if="user.facebook_id">
            <img src="/static/image/icon/ic_circle_facebook.svg"
              style="width:26px;height:26px;object-fit:contain;margin-right:10px">
          </template>
          <template v-if="user.apple_id">
            <img src="/static/image/icon/ic_circle_apple.svg"
              style="width:26px;height:26px;object-fit:contain">
          </template>
        </div>
      </div>
      
    </template>
    
    <div class="size-12 weight-400" :style="brandColor.sub2"
      >더이상 사용하지 않으십니까? <span class="unselect" :style="brandColor.sub" 
        style="text-decoration:underline" @click="clickLeave">회원탈퇴하기</span></div>
        
    <!--<component :is="form.elType" v-for="(form,idx) in formData" :key="'form-'+idx"-->
    <!--           v-bind="form" :value.sync="form.value"-->
    <!--           :formType="formTypeCustomLabel"-->
    <!--           :containerCustomStyle="form.containerCustom"-->
    <!--           :labelCustomStyle="labelCustom"-->
    <!--           :inputCustomStyle="form.inputCustom"-->
    <!--           :addressInputWrapStyle="{marginTop: '8px'}"-->
    <!--           :buttonCustomStyle="buttonCustom"-->
    <!--           :addressButtonCustomStyle="addressButtonCustom"></component>-->
  
    <!--<div :style="buttonCustom" style="margin: 32px 0 20px;"-->
    <!--  @click="clickConfirm" class="unselect">확인</div>-->
  </div>
</div>
</template>
<script>
import FormMixin from "@/components/Components/Mixins/FormMixin"
import AuthMixin from "@/components/Components/Mixins/AuthMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"

export default {
  name: 'BlockProfile',
  components: {

  },
  mixins: [
    FormMixin,
    AuthMixin,
    FormCustomMixin,
    PageMixin,
    HeaderMixin
  ],
  props: {

  },
  data() {
    return {
      "check": false,
      "formId": 2,
      "formData": []
    }
  },
  created() {
    console.log('created profile')
      this.getForm();
    },
  
  methods: {
    save() {
        // 소셜로그인 여부
        if (this.isSocialLogin) {
          this.updateInfo();
        }
        // 이메일로그인
        else {
          let password = find(this.formData, 'field', 'password').value;
          if(!password) {
            this.toast('비밀번호를 입력하세요.');
            return;
          }
          // 비밀번호 체크 api
          this.$axios.post('auth/user/login', {
            username: find(this.formData, 'field', 'username').value,
            password: find(this.formData, 'field', 'password').value
          }).then(res=> {
            if(res.status===200) {
              this.updateInfo();
            }
          }).catch(error=> {
            this.toast('잘못된 비밀번호 입니다.');
          });
        }
      },
    updateInfo() {
        let result = this.getParamData(this.formData);
        console.log('result',result)
        if(result.enable) {
          this.$axios.patch(`user/${this.$store.getters.user.user_id}`,
            result.params).then(res=>{
            if(res.status===200) {
              this.toast('내 정보가 변경되었습니다.');
              this.setUserData(res.data);
              this.$router.replace('home');
            }
          }).catch(err=> {
            if(!err.response.data.message)
              this.toast(err.response.data.detail);
            else
              this.toast(err.response.data.message);
          })
        }
      },
    getForm() {
        this.$axios.get(`public/member/formdata/${this.formId}`).then(res=>{
          res.data.forEach(item => {
            let inputStyle = this.cloneItem(this.inputCustom);
            inputStyle.border = this.brandBorder.main.border;
            item.inputCustom = inputStyle;
            item.containerCustom = {
              marginTop: '14px'
            }
          })
          this.formData = this.setForm(res.data);
          
          let profileForm = find(this.formData, 'field', 'profile');
          if (profileForm && profileForm.format==='CImgUploader') {
            profileForm.elType = 'c-input-imgUploader-single'
            profileForm.format = 'CImgUploaderSingle'
          }
          
          let dateForm = find(this.formData, 'elType', 'c-input-date');
          if(dateForm) {
            dateForm.elType = 'c-input-date-spin';
          }

          let result = [];

          this.formData.forEach((item,idx) => {
            // 폼 ID 수정 불가
            if (item.field==='username') {
              item.disabled = true;
              let inputStyle = this.cloneItem(this.inputCustom);
              inputStyle.border = this.brandBorder.main.border;
              inputStyle.color = this.brandColor.help.color;
              item.inputCustom = inputStyle;
              item.containerCustom = {
                marginTop: '24px'
              }
            }
            let user = this.$store.getters.user;
            let value = user[item.field]
            if(value) item.value = value;
            
            if (item.field === '사업자번호') {
              let p = user.param.find(param => param.name === '사업자번호');
              if (p) {
                item.value = p.value
              }
            }
            if (item.field === '사업장명') {
              let p = user.param.find(param => param.name === '사업장명');
              if (p) {
                item.value = p.value;
              }
            }
            
            if (item.field === '사업자등록증') {
              let p = user.param.find(param => param.name === '사업자등록증');
              if (p) {
                item.value = p.value;
              }
            }
            
            let verifyInfo = this.$store.getters.verifyInfo;
            if (this.$store.getters.device === 'pc') {
              if (item.field === 'phone' && verifyInfo && Object.keys(verifyInfo).length > 0) {
                if(verifyInfo.phone.length===10) {
                  item.value = verifyInfo.phone.substr(0,3) + '-' + verifyInfo.phone.substr(3,3) + '-' + verifyInfo.phone.substr(6,4);
                } 
                else if(verifyInfo.phone.length===11) {
                  item.value = verifyInfo.phone.substr(0, 3) + "-" + verifyInfo.phone.substr(3, 4) + "-" + verifyInfo.phone.substr(7,4);
                }
                user.phone = item.value;
                this.$axios.patch(`user/${this.user.user_id}`,
                  user).then(res=>{
                  if(res.status===200) {
                    this.setUserData(res.data);
                    this.$store.commit('setVerifyInfo', undefined)
                  }
                })
              }
            }

            // 소셜로그인 여부
            if (this.isSocialLogin) {
              if (['username','password','password_re'].indexOf(item.field)>-1) {
                item.enable = false;
                item.validate = {
                  required: false,
                  valid_required: false
                };
              }
            }
            // 이메일 로그인
            else if (user.username!==undefined) {
              if (['email','password_re'].indexOf(item.field)>-1) {
                item.enable = false;
                item.validate = {
                  required: false,
                  valid_required: false
                };
              }
            }
            
            result.push(item);
          })
          
          this.formData = result;
          
          if(this.$route.query.mobileno) {
            this.updatePhone();
          }
        })
      },
    updatePhone() {
      console.log('updatePhone',this.$route.query)
      let data = this.formData.find(item => item.field==='phone');
      let mo = this.$route.query.mobileno;
      let num;
      let list = [];
      
      if(this.$route.query.mobileno.length===10) {
        num = mo.substr(0,3) + '-' + mo.substr(3,3) + '-' + mo.substr(6,4);
      } 
      else if(this.$route.query.mobileno.length===11) {
        num = mo.substr(0,3) + '-' + mo.substr(3,4) + '-' + mo.substr(7,4);
      }
      data.value = num;
      
      list.push(data);
        let result = this.getParamData(list);
        console.log('update',this.prop,list,result)
        result.params.username = this.user.username;
        console.log('reslut',result)
        if(result.enable) {
          this.$axios.patch(`user/${this.$store.getters.user.user_id}`,
            result.params).then(res=>{
            if(res.status===200) {
              this.setUserData(res.data);
              this.$router.replace({path: this.$route.path});
            }
          }).catch(err=> {
            if(!err.response.data.message)
              this.toast(err.response.data.detail);
            else
              this.toast(err.response.data.message);
          })
        }
    },
    computedLabel(item) {
      if(item.label.indexOf('*') > -1) {
        return item.label.slice(1)
      }
      else {
        return item.label
      }
    },
    clickBtn(item) {
      if(item.field === 'password') {
        this.$root.$emit('page_overlay', 'NewPasswordOverlay', {prop:item});
      } 
      else if(item.field === 'profile') {
        this.$root.$emit('page_overlay', 'ProfileImgOverlay', {prop:item});
      }
      else {
       this.$root.$emit('page_overlay', 'ProfileOverlay', {prop:item}); 
      }
    },
    clickLeave() {
      this.$root.$emit('page_modal', 'SignoutModal');
    },
    invisibleBtn(item) {
      let deco = {};
      if(item.field==='email') {
        deco.visibility = 'hidden';
      }
      return deco;
    },
    clickConfirm() {
      if(this.$store.getters.previousPath==='/signup') {
        this.routerPush('home');
      }
      else {
        this.clickBack();
      }
    },
    formMarginBottom(item) {
      let deco = {
        marginBottom: '24px'
      }
      if (item.field === 'profile') {
        deco.marginBottom = '56px';
      }
      return deco;
    }
  },
  computed: {
    profile() {
      let user = this.$store.getters.user;
      return this.user.profile ? this.user.profile : this.dummyImage.person;
    },
    user() {
        return this.$store.getters.user;
      },
    computedformData() {
      let result = [];
      this.formData.forEach(item => {
        if (item.field!=='password_re') result.push(item);
      })
      return result;
    },
    addressButtonCustom() {
      let styles = this.cloneItem(this.buttonCustom);
      styles.backgroundColor = this.brandColor.help.color;
      styles.padding = '12px 20px';
      return styles;
    },
    sBtnStyle() {
      let deco = {
        width: '40px',
        height: '32px',
        borderRadius: '6px',
        lineHeight: '32px',
        textAlign: 'center'
      }
      if (this.$store.getters.device === 'pc') {
        deco.width = '66px';
        deco.height = '40px';
        deco.lineHeight = '40px';
      }
      return deco;
    }
  },
  watch: {
    $route() {
      console.log('watch profile')
    }
  }
}
</script>
<style scoped>
#profile-form-wrap {
  user-select: none;
}
.profile-img {
  width: 112px;
  height: 112px;
}
</style>

