<template>
<div style="width:100%;max-width:500px" :style="pagePadding">
  <div class="size-20" style="text-align:center;margin:40px 0">비밀번호 변경</div>
    <c-input-password :inputCustomStyle="inputStyle" :value.sync="value.password" placeholder="현재 비밀번호"></c-input-password>
    <c-input-password :inputCustomStyle="inputStyle" :value.sync="value.new_password" placeholder="새 비밀번호변경"></c-input-password>
    <c-input-password :inputCustomStyle="inputStyle" :value.sync="value.new_password_re" placeholder="새 비밀번호변경 확인"></c-input-password>
    <div style="margin-top: 24px">
      <btn class="p-bg-brand p-white"
        @clicked="modify">비밀번호 변경하기</btn>
    </div>
    <div class="unselect size-12" @click="routerModal('PasswordEmailModal')"
        style="margin-top:40px;text-align:center;text-decoration:underline">비밀번호가 기억나지 않으세요?</div>
  </div>
</template>
<script>
import AuthMixin from "@/components/Components/Mixins/AuthMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"

export default {
  name: 'BlockChangePassword',
  components: {

  },
  mixins: [
    AuthMixin,
    FormCustomMixin
  ],
  props: {

  },
  data() {
    return {
      "check": false,
      "value": {
        "password": "",
        "new_password": "",
        "new_password_re": ""
      }
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    modify() {
        let err = '';
        if(!this.value.password) err = '비밀번호를 입력하세요.';
        else if(!this.value.new_password) err = '새 비밀번호를 입력하세요.';
        else if(!this.value.new_password_re) err = '새 비밀번호 확인을 입력하세요.';
        else if(this.value.new_password !== this.value.new_password_re) err = '새 비밀번호가 다릅니다.';
        if(err) {
          this.toast(err);
          return;
        }
        // 비밀번호 체크 api
        this.$axios.post('auth/user/login', {
          username: this.$store.getters.user.username,
          password: this.value.password
        }).then(res=> {
          if(res.status===200) {
            this.check = true;
            if(this.check) this.updateInfo();
          }
        }).catch(error=> {
          this.toast('잘못된 비밀번호 입니다.');

        })
      },
    // 내 정보 수정 api
      updateInfo() {
        let params = {
          username: this.$store.getters.user.username,
          password: this.value.new_password
        }
        this.$axios.patch(`user/${this.$store.getters.user.user_id}`,
          params).then(res=>{
          if(res.status===200) {
            this.toast('비밀번호가 변경되었습니다.');
            this.setUserData(res.data);
            this.$router.replace('mypage');
          }
        }).catch(err=> {
          if(!err.response.data.message)
            this.toast(err.response.data.detail);
          else
            this.toast(err.response.data.message);
        })
      }
  },
  computed: {
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


