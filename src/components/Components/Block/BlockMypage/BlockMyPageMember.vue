<template>
<div :style="[pagePadding]" style="width:100%">
  
    <div class="flex-between" :style="wrapProfile">
      <div class="flex-align">
        <img :src="profile" class="profile-img object-fit-cover radius-half"
          style="margin-right:12px" />
        <div>
          <div class="flex-align margin-bottom-4">
            <div class="size-16 weight-500 p-main"
              style="margin-right:4px">{{ user.name }}</div>
            <template v-if="$store.getters.brand.plugins.indexOf('user_grade')>-1">
              <label-user-grade :grade="user.grade"></label-user-grade>
            </template>
          </div>
          <div class="size-12 p-sub2">{{ user.email }}</div>
        </div>
      </div>
      
      <img class="unselect"
        src="/static/image/icon/settings_24px.svg" @click="clickProfile">
    </div>
    
    <!-- 포인트/쿠폰 플러그인 활성화 된 경우, 보유중인 포인트와 쿠폰 갯수 표시 -->
    <div v-if="$store.getters.brand.plugins.indexOf('point_coupon')>-1"
      class="flex-align p-bg-sub radius-8" style="margin-top: 24px; height: 58px">
      <div class="flex-align p-sub" style="width: 100%; height: 100%; padding: 0 16px">
        <div class="flex-between col-9 unselect" @click="routerPush('/my_point')">
          <div class="size-14 weight-500">포인트</div>
          <div class="size-18 bold p-primary">{{ currencyNum(userPoint) }}P</div>
        </div>
        <div class="size-16 p-sub3" style="padding: 0 12px">|</div>
        <div class="flex-between col-3 unselect" @click="routerPush('/my_coupon')">
          <div class="size-14 weight-500">쿠폰</div>
          <div class="size-18 bold p-primary">{{ currencyNum(couponCount) }}</div>
        </div>
      </div>
    </div>
    
    <div style="padding-top:32px; padding-bottom: 25px" class="flex-between">
      <template v-if="pack.length > 1">
        <div class="col-3 icon-wrap unselect" @click="routerPush('my_order')">
          <div class="flex-justify margin-bottom-8">
            <img src="/static/image/icon/ic_sticky_note.svg">
          </div>
          <div class="size-13 text-center p-sub">주문내역</div>
        </div>
      </template>
      <template v-else-if="pack.indexOf('mart')>-1 || pack.indexOf('delivery')>-1">
        <div class="col-3 icon-wrap unselect" @click="routerPush('my_order')">
          <div class="flex-justify margin-bottom-8">
            <img src="/static/image/icon/shipping.svg">
          </div>
          <div class="size-13 text-center p-sub">주문·배송</div>
        </div>
      </template>
      <template v-else-if="pack.indexOf('call')>-1">
        <div class="col-3 icon-wrap unselect" @click="routerPush('call_list')">
          <div class="flex-justify margin-bottom-8">
            <img src="/static/image/icon/call.svg">
          </div>
          <div class="size-13 text-center p-sub">전화연결내역</div>
        </div>
      </template>
      <template v-else-if="pack.indexOf('reservation')>-1 || pack.indexOf('booking')>-1">
        <div class="col-3 icon-wrap unselect" @click="routerPush('my_order')">
          <div class="flex-justify margin-bottom-8">
            <img src="/static/image/icon/reservation.svg">
          </div>
          <div class="size-13 text-center p-sub">예약내역</div>
        </div>
      </template>
      
      <div class="col-3 icon-wrap unselect" @click="routerPush('my_inquiry')">
        <div class="flex-justify margin-bottom-8">
          <img src="/static/image/icon/textsms.svg">
        </div>
        <div class="size-13 text-center p-sub">내 문의</div>
      </div>
      
      <div class="col-3 icon-wrap unselect" @click="routerPush('my_review')">
        <div class="flex-justify margin-bottom-8">
          <img src="/static/image/icon/ic_review.svg">
        </div>
        <div class="size-13 text-center p-sub">내 리뷰</div>
      </div>
      
      <div class="col-3 icon-wrap position-relative unselect" @click="routerPush('like')">
        <div class="flex-justify margin-bottom-8 position-relative">
          <img src="/static/image/icon/like.svg">
          <div class="position-absolute size-12 weight-700 radius-20 p-white p-bg-primary"
            :style="likedLabelStyle">
            {{ likedCount }}
          </div>
        </div>
        <div class="size-13 text-center p-sub">찜</div>
        
        
      </div>
    </div>
    
  <!--나중에 쓸 수 있어서 일단 주석처리-->
  <!--<btn-pill title="로그아웃" @clicked="logout" bg="sub" color="main"-->
  <!--    style="margin: 0 8px;"></btn-pill>-->
  <!--<div>-->
  <!--  <template v-for="item in menu">-->
  <!--    <a v-if="item.linkType === 'outlink'" :href="item.outlink" target="_blank">-->
  <!--      <div :key="item.link"-->
  <!--        class="size-20 weight-500 menu-item unselect" -->
  <!--        :style="[brandColor.main, {borderBottom: brandBorder.main.border}]"-->
  <!--        >{{item.name}}</div>-->
  <!--    </a>-->
  <!--    <div :key="item.link" v-else-->
  <!--      class="size-20 weight-500 menu-item unselect" -->
  <!--      :style="[brandColor.main, {borderBottom: brandBorder.main.border}]"-->
  <!--      @click="clickMenu(item)">{{item.name}}</div>-->
  <!--  </template>-->
  <!--</div>-->
  
  <!--<sweet-modal ref="logoutModal" overlay-theme="dark">-->
  <!--  <modal @confirm="logout" @cancel="$refs.logoutModal.close()">-->
  <!--    <div slot="header">로그아웃</div>-->
  <!--    <div slot="content">로그아웃하시겠습니까?</div>-->
  <!--  </modal>-->
  <!--</sweet-modal>  -->
  
</div>
</template>
<script>
import LabelUserGrade from "@/components/Components/Common/LabelUserGrade.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockMyPageMember',
  components: {
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
      "menuId": 6,
      "userPoint": 0,
      "likedCount": 0,
      "couponCount": 0
    }
  },
  created() {
    this.$axios.get(`public/ui/menuset/${this.menuId}`).then(res=>{
      this.menu = res.data.menu;
    });
    
    this.$axios.get(`user/${this.user.user_id}/liked`).then(res => {
      this.likedCount = res.data.count;
    })
    
    if (this.$store.getters.brand.plugins.indexOf('point_coupon')>-1) {
      this.getCouponCount();
      this.getUserPoint();
    }
  },
  mounted() {

  },
  
  methods: {
    getUserPoint() {
      this.$axios.get(`/user/${this.user.user_id}/my/point`).then(res => {
        this.userPoint = res.data;
      })
    },
    getCouponCount() {
      this.$axios.get(`/user/${this.user.user_id}/counter`).then(res => {
        this.couponCount = res.data.coupon;
      })
    },
    clickProfile() {
      this.$emit('closePage');
      this.routerPush('profile');
    },
    clickMenu(item) {
      this.$emit('closePage');
      
      if (item.linkType && item.linkType !== 'link') {
        this.$root.$emit('page_'+item.linkType, item.link);
      }
      else {
        this.routerPush(item.link);
      }
    }
  },
  computed: {
    profile() {
      let user = this.$store.getters.user;
      return this.user.profile ? this.user.profile : this.dummyImage.person;
    },
    wrapProfile() {
      return {
        padding: '32px 0',
        borderBottom: `1px solid ${this.getColor('보조 배경 색상')}`
      }
    },
    pack() {
      return this.$store.getters.service.package;
    },
    isPc() {
      return this.$store.getters.device === 'pc';
    },
    likedLabelStyle() {
      let deco = {
        top: '-12px',
        right: '0px',
        padding: '1px 10px'
      }
      if (this.isPc) {
        deco.right = '20px'
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.profile-img {
  width: 60px;
  height: 60px;
}
.menu-item {
  padding: 20px 16px;
}
.icon-wrap {
  height: 62px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>

