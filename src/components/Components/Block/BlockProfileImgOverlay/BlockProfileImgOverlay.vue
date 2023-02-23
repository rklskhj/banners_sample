<template>
<div :style="brandBgColor.white" style="width:100%">
  <page-header v-if="$store.getters.device==='mobile'">
    <div slot="left">
      <i class="material-icons" @click="clickClose">keyboard_arrow_left</i>
    </div>
    <span class="size-16 weight-500" slot="center">프로필 사진</span>
  </page-header>
  <div v-else class="size-16 weight-500 flex-center">프로필 사진</div>
  <div style="margin-top: 50px; padding-top: 10px;text-align:left" :style="pagePadding">
    <component :is="prop.elType"
       v-bind="prop" :value.sync="prop.value"
       :formType="formTypeCustomLabel"
       :containerCustomStyle="prop.containerCustom"
       :labelCustomStyle="labelCustom"
       :inputCustomStyle="prop.inputCustom"
       :addressInputWrapStyle="{marginTop: '8px'}"
       :buttonCustomStyle="buttonCustom"
       :onlyBtn="true"
       :addBtnCustom="addBtnCustom"
       :removeBtnCustom="removeBtnCustom"
       @update:value="updateImg"
       @delImg="delImg"></component>
  </div>
</div>
</template>
<script>
import CVerifyBtnNice from "@/components/Components/Button/CVerifyBtnNice.vue"
import FormMixin from "@/components/Components/Mixins/FormMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import AuthMixin from "@/components/Components/Mixins/AuthMixin"

export default {
  name: 'BlockProfileImgOverlay',
  components: {
    CVerifyBtnNice
  },
  mixins: [
    FormMixin,
    FormCustomMixin,
    AuthMixin
  ],
  props: {
    prop: {
      type: Object,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('click', function(e) {
        let el = document.getElementById('layer')
        let el2 = document.getElementById('cinput-address-content')
        let el3 = document.getElementById('overlay-update-btn')
        if(el) {
          el2.style.visibility = 'hidden';
          el3.style.visibility = 'hidden';
          document.getElementsByTagName('iframe')[0].style.zIndex = '9999';
          // document.getElementsByTagName('iframe')[0].style.marginTop = '50px';
        }
        else {
          if (el2 && el3) {
            el2.style.visibility = 'visible';
            el3.style.visibility = 'visible';
          }
        }
      });
    });
  },
  
  methods: {
    clickClose() {
      this.$emit('closePage');
    },
    updateImg() {
      setTimeout(() => {
        this.$emit('closePage');
        this.updateInfo();
      },500);
    },
    delImg() {
      this.prop.value = '';
      setTimeout(() => {
        this.$emit('closePage');
        this.updateInfo();
      },500);
    },
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
      let list = [];
      list.push(this.prop);
        let result = this.getParamData(list);
        console.log('update',this.prop,list,result)
        result.params.username = this.user.username;
        console.log('reslut',result)
        if(result.enable) {
          this.$axios.patch(`user/${this.$store.getters.user.user_id}`,
            result.params).then(res=>{
            if(res.status===200) {
              this.toast('내 정보가 변경되었습니다.');
              this.setUserData(res.data);
            }
          }).catch(err=> {
            if(!err.response.data.message)
              this.toast(err.response.data.detail);
            else
              this.toast(err.response.data.message);
          })
        }
      }
  },
  computed: {
    addBtnCustom() {
      return {
        width: '152px',
        height: '48px',
        lineHieght: '48px',
        textAlign: 'center',
        color: 'white',
        borderRadius: '8px',
        backgroundColor: this.brandBgColor.primary.backgroundColor,
        fontSize: '14px'
      }
    },
    removeBtnCustom() {
      return {
        width: '152px',
        height: '48px',
        lineHieght: '48px',
        textAlign: 'center',
        color: '#828282',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: this.brandBorder.main.border,
        fontSize: '14px',
        marginLeft: '12px'
      }
    }
  },
  watch: {
    
  }
}
</script>


