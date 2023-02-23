<template>
<div style="padding:16px;width:100%">
      <template v-if="status===1">
        <div class="margin-bottom-24">
          <div class="size-18 weight-500 margin-bottom-4" :style="brandColor.main">정말 탈퇴하시겠어요?</div> 
          <div class="size-14 weight-400" :style="brandColor.sub2">탈퇴하실 경우, 더 이상 서비스 이용이 어렵습니다.</div>
        </div>
        
        <div class="size-14 weight-400">
          <div class="unselect modal-btn margin-bottom-12" :style="[brandColor.white,brandBgColor.primary]"
            @click="confirm">회원탈퇴</div>
          <div class="unselect modal-btn" :style="[brandBorder.main,brandColor.sub2,brandBgColor.white]"
            @click="$emit('closePage')">취소</div>
        </div>
      </template>
      
      <template v-if="status===2">
        <div class="margin-bottom-24 full-width">
          <div class="size-18 weight-500 margin-bottom-4" :style="brandColor.main">탈퇴완료</div> 
          <div class="size-14 weight-400" :style="brandColor.sub2">탈퇴처리가 성공적으로 완료되었습니다.</div>
        </div>
      
        <div class="size-14 weight-400">
          <div class="unselect modal-btn margin-bottom-12" :style="[brandColor.white,brandBgColor.primary]"
            @click="clickExit">확인</div>
        </div>
      </template>
    </div>
</template>
<script>

export default {
  name: 'BlockSignoutModal',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "status": 1
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
    })
  },
  
  methods: {
    logout() {
      this.$emit('closePage');
      // 로그아웃 api 호출
      let token = this.$store.getters.user.token;
      this.$axios.post(`auth/user/logout`, {
        token: token
      }).then(res=> {
        if(res.status===200) {
          this.toast('로그아웃 되었습니다.');
          this.$store.commit('logout');
          this.$router.replace('/home')
        }
      })
    },
    confirm() {
      if (this.$store.getters.user.username === 'test@test.com') {
        this.toast('탈퇴할 수 없는 계정입니다.');
        return;
      }
      this.$axios.post(`auth/user/signout/${this.$store.getters.user.user_id}`)
        .then(res => {
          if(res.status===200) {
            this.status = 2;
          }
        })
    },
    clickExit() {
      this.$emit('closePage');
      this.$store.commit('logout');
      this.$store.commit('removePopstate');
      this.$router.replace('/home')
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.modal-btn {
  padding: 16px 32px;
  border-radius: 8px;
  text-align: center;
}
</style>

