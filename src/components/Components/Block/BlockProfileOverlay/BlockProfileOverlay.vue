<template>
<div :style="brandBgColor.white" style="width:100%">
  <page-header v-if="$store.getters.device==='mobile'">
    <div slot="left">
      <i class="material-icons" @click="clickClose">keyboard_arrow_left</i>
    </div>
    <span class="size-16 weight-500" slot="center">내 정보 수정</span>
  </page-header>
  <div v-else class="position-relative">
    <div class="size-16 weight-500 flex-center">내 정보 수정</div>
    <i class="material-icons unselect flex-end position-absolute"
      style="font-size: 24px; right: 0; top: 0"
      :style="brandColor.main" @click="clickClose">close</i>
  </div>
  <div style="margin-top: 50px; padding-top: 10px;text-align:left" :style="pagePadding">
    <template v-if="prop.field==='phone' && $store.getters.brand.plugins.indexOf('nice_identity_verify') > -1">
      <div>
        <c-verify-btn-nice redirectUrl="profile"></c-verify-btn-nice>
      </div>
    </template>
    <template v-else>
    <component :is="prop.elType"
       v-bind="prop" :value.sync="prop.value"
       :formType="formTypeCustomLabel"
       :containerCustomStyle="prop.containerCustom"
       :labelCustomStyle="labelCustom"
       :inputCustomStyle="prop.inputCustom"
       :addressInputWrapStyle="{marginTop: '8px'}"
       :buttonCustomStyle="buttonCustom"
       :addressButtonCustomStyle="addressButtonCustom"></component>
    
       
    <div class="unselect" :style="[buttonCustom,btnMargin]"
      @click="updateInfo" id="overlay-update-btn">변경</div>
    </template>
  </div>
</div>
</template>
<script>
import CVerifyBtnNice from "@/components/Components/Button/CVerifyBtnNice.vue"
import FormMixin from "@/components/Components/Mixins/FormMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import AuthMixin from "@/components/Components/Mixins/AuthMixin"

export default {
  name: 'BlockProfileOverlay',
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
      for(let el of document.getElementsByClassName('sweet-box-actions')) {
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
      if (this.prop.label.indexOf('*') > -1) {
        this.prop.label = this.prop.label.replace('*', '')
      }
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
              this.clickClose();
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
    addressButtonCustom() {
      let styles = this.cloneItem(this.buttonCustom);
      styles.color = this.brandColor.primary.color;
      styles.fontSize = '16px';
      styles.fontWeight = 'normal';
      styles.backgroundColor = this.brandBgColor.white.backgroundColor;
      styles.border = this.brandBorder.primary.border;
      styles.borderRadius = '8px'
      styles.padding = '16px 54px';
      return styles;
    },
    btnMargin() {
      if(this.$store.getters.device==='pc' && this.prop.field==='birth') {
        return {
          margin: '240px 0 20px'
        }
      }
      else {
        return {
          margin: '56px 0 20px'
        }
      }
    }
  },
  watch: {
    
  }
}
</script>


