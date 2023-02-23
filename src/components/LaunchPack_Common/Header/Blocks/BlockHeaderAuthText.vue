<template>
<div class="container" :style="`grid-template-columns: repeat(${menuLength}, auto)`">
  <div class="menu-item unselect weight-500" :style="itemStyle" v-if="isLogin">{{ user.name }}님</div>
  <div v-for="(item,idx) in list" :key="'menu-item-'+idx"
    class="menu-item unselect" :style="itemStyle" @click="clickMenu(item)">{{ item.name }}</div>
    
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
  name: 'BlockHeaderAuthText',
  components: {

  },
  mixins: [

  ],
  props: {
    vCart: {
      type: Boolean,
      default: false,
    },
    vMypage: {
      type: Boolean,
      default: false,
    },
    vSignup: {
      type: Boolean,
      default: false,
    },

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
    clickMenu(item) {
      if(item.link === 'logout') {
        this.$refs.logoutModal.open();
      } else {
        this.routerPush(item.link); 
      }
    },
    logout() {
      this.$axios.post('auth/user/logout', {
        token: this.$store.getters.user.token
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
    menuLength() {
      let length = this.list.length;
      if(this.isLogin) {
        length++;
      }
      return length;
    },
    list() {
      let menu = [];
      
      if(this.isLogin) {
        menu = [
          {
            name: '로그아웃',
            link: 'logout'
          }
        ];
        if(this.vMypage) {
          menu.push({
            name: '마이페이지',
            link: 'mypage'
          });
        }
        let pack = this.$store.getters.service.package;
        if(this.vCart && (pack.indexOf('delivery')>-1 || pack.indexOf('mart')>-1)) {
          menu.push({
            name: '장바구니',
            link: 'cart?tab_id=0'
          });
        }
      } else {
        menu = [
          {
            name: '로그인',
            link: 'signin'
          }
        ];
        if(this.vSignup) {
          menu.push({
            name: '회원가입',
            link: 'signup'
          });
        }
      }
      
      return menu;
    },
    itemStyle() {
      return {
        fontSize: '12px',
        color: this.brandColor.sub.color,
        padding: '8px 0'
      };
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.container {
    display: grid;
    grid-column-gap: 24px;
    
  }
</style>

