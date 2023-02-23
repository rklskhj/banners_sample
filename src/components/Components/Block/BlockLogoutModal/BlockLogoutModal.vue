<template>
<modal style="width:100%" @confirm="logout" @cancel="$emit('closePage')">
    <div slot="header">로그아웃</div>
    <div slot="content">로그아웃하시겠습니까?</div>
  </modal>
</template>
<script>

export default {
  name: 'BlockLogoutModal',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

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
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


