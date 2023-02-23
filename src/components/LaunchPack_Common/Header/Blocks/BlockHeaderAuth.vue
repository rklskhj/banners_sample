<template>
<div class="position-relative" v-click-outside="closeMenu">
  <div v-if="isLogin" class="unselect flex-align" @click.stop.prevent="vMenu=!vMenu">
    <img class="profile-img" :src="user.profile!=='' ? user.profile : dummyImage.person">
    <div class="size-14" :style="brandColor.main">{{ user.name }}</div>
    <i class="material-icons" style="padding-left: 8px">keyboard_arrow_{{ vMenu ? 'up' : 'down' }}</i>
  </div>
  <div v-else class="unselect">
    <span @click="routerPush('signin')">로그인</span>
    <span style="margin-left:16px" @click="routerPush('signup')">회원가입</span>
  </div>
  <div class="menu" v-if="vMenu" :style="[brandBorder.sub, brandColor.sub]">
    <div class="item-menu unselect" @click="routerPush('mypage');vMenu=false">마이페이지</div>
    <div class="item-menu unselect" @click="clickOrder">{{ orderName }}</div>
    <div class="item-menu unselect" @click="$refs.logoutModal.open();vMenu=false">로그아웃</div>
  </div>
  <!-- 로그아웃 -->
  <sweet-modal ref="logoutModal" overlay-theme="dark">
    <modal @confirm="logout" @cancel="$refs.logoutModal.close()">
      <div slot="header">로그아웃</div>
      <div slot="content">로그아웃하시겠습니까?</div>
    </modal>
  </sweet-modal>
</div>
</template>
<script>

export default {
  name: 'BlockHeaderAuth',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "vMenu": false
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    clickOrder() {
      this.routerPush(this.isCall ? 'call_list' : 'my_order');
      this.vMenu = false;
    },
    closeMenu() {
      this.vMenu = false;
    },
    logout() {
        // 로그아웃 api 호출
        let token = this.$store.getters.user.token;
        this.$axios.post(`auth/user/logout`, {
          token: token
        }).then(res=> {
          if(res.status===200) {
            this.toast('로그아웃 되었습니다.');
            this.$refs.logoutModal.close()
            this.$store.commit('logout');
            this.$router.replace('/home')
          }
        })
      }
  },
  computed: {
    isCall() {
      return this.$store.getters.service.package.every(i => i === 'call')
    },
    orderName() {
      return this.isCall ? '전화연결내역' : '주문내역';
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.profile-img {
    width: 36px;
    height: 36px;
    border-radius: 36px;
    border: 1px solid #f5f5f5;
    margin: 0 8px;
  }
  .menu {
    position: absolute;
    top: 50px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    background-color: white;
    min-width: 150px;
    padding: 8px;
    z-index: 1;
  }
  .item-menu {
    padding: 8px 16px;
  }
  .item-menu:hover {
    background-color: #f8f8f8;
  }
</style>

