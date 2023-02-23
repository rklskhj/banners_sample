<template>
<div class="full-width" :style="pagePadding" style="padding-bottom:25px">
  <template v-if="pluginBoard">
    <div class="p-bg-sub divider"></div>
    
    <div class="flex-align unselect" style="padding:16px 0" @click="routerPush('my_post')">
      <i class="material-icons-outlined" style="margin-right:12px">post_add</i>
      <div>내 게시글</div>
    </div>
  </template>
  
  <div class="p-bg-sub divider"></div>
  
  <div v-for="(item,idx) in menu" :key="'menu-'+idx">
    <div class="flex-align unselect" style="padding:16px 0" @click="clickMenu(item)">
      <i v-if="item.img_type==='icon'" class="material-icons-outlined" style="margin-right:12px">{{ item.icon }}</i>
      <img v-else :src="item.img ? item.img : item.img_before" style="margin-right:12px;height:16px">
      <div class="size-16 p-main">{{ item.name }}</div>
    </div>
  </div>
  
  <div v-if="isLogin" class="p-bg-sub divider"></div>
  
  <div v-if="isLogin" class="size-14 unselect p-sub" style="margin-top:20px"
    @click="$refs.logoutModal.open()">로그아웃</div>
    
  <!-- 로그아웃 -->
  <sweet-modal ref="logoutModal" overlay-theme="dark" :enableMobileFullscreen="false">
    <modal @confirm="logout" @cancel="$refs.logoutModal.close()">
      <div slot="header">로그아웃</div>
      <div slot="content">로그아웃하시겠습니까?</div>
    </modal>
  </sweet-modal>
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockMyPageMenu',
  components: {

  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "key": "mypage_guest",
      "menu": [],
      "menusSetId": 5
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.$axios.get(`public/ui/menuset/style/${this.key}?activated=true`).then(res=>{
        let list = [];
        res.data[0].menu.forEach(menu => {
          if(menu.is_category) {
            this.$store.getters.category.forEach(cat => {
              list.push({
                link: `product?gnb=${cat.id}`,
                linkType: 'link',
                name: cat.name,
                id: cat.id,
                img_before: cat.img_before ? cat.img_before : this.img_before
              });
            });
          }
          else {
            if(menu.img_type === 'icon' && menu.icon === '') {
              menu.img_type = 'img';
              menu.img_before = this.img_before;
            }
            
            if(!menu.img || !menu.img_before) {
              menu.img_before = this.img_before;
            }
            list.push(menu);
          }
        });
        this.menu = list;
      });
    },
    clickMenu(item) {
      console.log(item)
      if(item.linkType==='overlay') {
        this.routerOverlay(item.link);
      } else if(item.linkType==='modal') {
        this.routerModal(item.link);
      } else {
        this.routerPush(item.link); 
      }
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
    pluginBoard() {
      return this.$store.getters.brand.plugins.indexOf('board')>-1;
    },
    menuStyle() {
        return {
          padding: '16px',
          borderTop: `1px solid ${this.getColor('기본 테두리선 색상')}`,
          cursor: 'pointer',
          fontSize: '15px'
        }
      }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.divider {
  width:100%;
  height:1px
}
.menu:first-child {
  border-top: none !important;
}
</style>

