<template>
<div :style="[pageHeight, pageBottom, pagePadding]">
  
  <div class="flex-justify wrap" style="padding:32px 0">
    <div class="flex-center full-width" style="margin-bottom:8px"
      v-if="$store.getters.brand.plugins.indexOf('user_grade')>-1">
      <label-user-grade :grade="user.grade"></label-user-grade>
    </div>
    <img :src="profile" class="profile-img object-fit-cover radius-half" />
    <div class="size-16 weight-500 full-width text-center" style="padding-top:8px;">{{ user.name }}</div>
    <div class="full-width flex-center" style="padding-top:16px;">
      <btn-pill title="내 정보 수정" @clicked="clickProfile" bg="main" color="main"
        style="margin: 0 8px;"></btn-pill>
      <btn-pill title="로그아웃" @clicked="logout" bg="main" color="main"
        style="margin: 0 8px;"></btn-pill>
    </div>
  </div>
  
  <div style="margin-bottom: 32px;">
    <template v-for="myitem in mymenu">
      <a v-if="myitem.linkType === 'outlink'" :href="myitem.outlink" target="_blank">
        <div :key="myitem.link"
          class="flex-between size-20 weight-500 menu-item unselect" 
          :style="[brandColor.main, {borderBottom: brandBorder.main.border}]"
          >
          <div>{{myitem.name}}</div>
          <i class="material-icons">{{myitem.icon}}</i>
        </div>
      </a>
      <div :key="myitem.link" v-else
        class="flex-between size-20 weight-500 menu-item unselect" 
        :style="[brandColor.main, {borderBottom: brandBorder.main.border}]"
        @click="clickMyMenu(myitem)">
        <div>{{myitem.name}}</div>
        <i class="material-icons">{{myitem.icon}}</i>
      </div>
    </template>
  </div>
  
  <div>
    <template v-for="item in menu">
      <a v-if="item.linkType === 'outlink'" :href="item.outlink" target="_blank">
        <div :key="item.link"
          class="size-20 weight-500 menu-item unselect" 
          :style="[brandColor.main, {borderBottom: brandBorder.main.border}]"
          >{{item.name}}</div>
      </a>
      <div :key="item.link" v-else
        class="size-20 weight-500 menu-item unselect" 
        :style="[brandColor.main, {borderBottom: brandBorder.main.border}]"
        @click="clickMenu(item)">{{item.name}}</div>
    </template>
  </div>
  
  <sweet-modal ref="logoutModal" overlay-theme="dark">
    <modal @confirm="logout" @cancel="$refs.logoutModal.close()">
      <div slot="header">로그아웃</div>
      <div slot="content">로그아웃하시겠습니까?</div>
    </modal>
  </sweet-modal>  
  
</div>
</template>
<script>
import BtnPill from "@/components/LaunchPack_Common/Button/BtnPill.vue"
import LabelUserGrade from "@/components/LaunchPack_Common/Common/LabelUserGrade.vue"
import PageMixin from "@/components/Mixins/PageMixin"

export default {
  name: 'BlockDrawerLogin',
  components: {
    BtnPill,
    LabelUserGrade
  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "menu": [
        {
          "link": "notice",
          "name": "공지사항"
        },
        {
          "link": "event",
          "name": "이벤트"
        },
        {
          "link": "TermsofserviceModal",
          "name": "이용약관",
          "linkType": "modal"
        },
        {
          "link": "PrivacyModal",
          "name": "개인정보 보호방침",
          "linkType": "modal"
        },
        {
          "link": "contact",
          "name": "1:1 문의"
        }
      ],
      "mymenu": [
        {
          "icon": "phone",
          "link": "call_list",
          "name": "전화연결 내역"
        },
        {
          "icon": "favorite",
          "link": "like",
          "name": "찜 목록"
        }
      ]
    }
  },
  created() {
    let menuSet = this.$store.getters.brand.menu_set.filter(item=>{
      return item.device === 'mobile' && item.style === 'hamburger';
    });
    if(menuSet.length>0) {
      this.menu = menuSet[0].menu;
    }
    
    // 유저 메뉴
    let userMenuSet = this.$store.getters.brand.menu_set.filter(item=>{
      return item.style === 'mypage_user';
    });
    if(userMenuSet.length>0) {
      this.mymenu = userMenuSet[0].menu;
    }
    
  },
  mounted() {

  },
  
  methods: {
    clickProfile() {
      this.$emit('closePage');
      this.routerPush('profile');
    },
    clickMyMenu(myitem) {
      this.$emit('closePage');
      if (myitem.linkType && myitem.linkType !== 'link') {
        this.$root.$emit('page_'+myitem.linkType, myitem.link);
      }
      else {
        this.routerPush(myitem.link);
      }
    },
    clickMenu(item) {
      this.$emit('closePage');
      
      if (item.linkType && item.linkType !== 'link') {
        this.$root.$emit('page_'+item.linkType, item.link);
      }
      else {
        this.routerPush(item.link);
      }
    },
    logout() {
      this.$emit('closePage');
      
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
    profile() {
      let user = this.$store.getters.user;
      return this.user.profile ? this.user.profile : this.dummyImage.person;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.profile-img {
  width: 64px;
  height: 64px;
}
.menu-item {
  padding: 20px 16px;
}
</style>

