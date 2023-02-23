<template>
<div class="app-main position-relative">
    <div id="tap-bar-wrapper">
      <div class="tap-bar" v-if="vTap">
        <div class="flex-align">
          <div style="color:white;margin-right:12px">현재 페이지 바로 편집하고 싶다면</div>
          <button @click="clickBuilder" v-if="$store.getters.service.info && $store.getters.service.info.service_type === 4">
            <img src="https://s3.ap-northeast-2.amazonaws.com/launchpack-storage/media/non-path/u_edit-alt.svg">
            페이지 편집</button>
          <button @click="clickAdmin">
            <img src="https://s3.ap-northeast-2.amazonaws.com/launchpack-storage/media/non-path/u_home-alt.svg">
            관리자</button>
        </div>
        <i class="unselect material-icons btn-close" @click="hideTap">close</i>
      </div>
    </div>

    <div>
      <div>
        <component ref="header" :is="header.name" @currentAddress="val=>address=val" :korName="header.kor_name"
          v-if="header.visible"></component>
      </div>
      <!-- 페이지 타입 : 페이지 -->
      <div id="lp-page" :style="pageStyle">
        <keep-alive :include="$store.getters.alivePage">
          <router-view v-if="vPage" ref="router" :style="routerViewStyle" @componentName="pageStatus"></router-view>
        </keep-alive>
        <component :is="footer.name" v-if="footer.visible && footerDelay"></component>
      </div>
      <!-- 하단 메뉴 -->
      <bottom-menu v-if="visibleMenu"></bottom-menu>
    </div>

    <!-- 포탈 -->
    <!-- share 컴포넌트 포탈 -->
    <portal-target name="share" :multiple="true"></portal-target>
    <!-- BtnCall 컴포넌트 전화연결 포탈 -->
    <portal-target name="btn-call-modal"></portal-target>
    <!--오버레이 위의 오버레이 포탈-->
    <portal-target name="double-layer-modal"></portal-target>

    <!-- 아래 페이지 타입은 삭제할 경우 정상동작 하지 않음 -->
    <!-- Launchpack Page Type -->
    <!-- 페이지 타입 : 오버레이 -->
    <div class="overlay-modal">
      <sweet-modal ref="overlayModal" @close="onCloseModal('page_overlay')" >
        <component @closePage="closeOverlay"
          v-bind="page_overlay_props"
          v-if="page_overlay" :is="page_overlay"></component>
      </sweet-modal>
    </div>
    <!-- 페이지 타입 : 모달 -->
    <div class="page-modal">
      <sweet-modal ref="pageModal" overlay-theme="dark" @close="onCloseModal('page_modal')" :enableMobileFullscreen="false">
        <div style="overflow-y:auto;max-height:70vh;">
          <component @closePage="closeModal"
            v-bind="page_modal_props"
            v-if="page_modal" :is="page_modal"></component>
        </div>
      </sweet-modal>
    </div>
    <!-- 페이지 타입 : 드로워(왼쪽) -->
    <drawer v-if="page_drawer_left" direction="left" :exist="true"
      ref="pageDrawerLeft" @close="onCloseDrawerLeft">
      <div :style="drawerStyles">
        <component @closePage="closeDrawerLeft"
          v-bind="page_drawer_left_props"
          :is="page_drawer_left"></component>
      </div>
    </drawer>
    <!-- 페이지 타입 : 드로워(오른쪽) -->
    <drawer v-if="page_drawer_right" direction="right" :exist="true"
      ref="pageDrawerRight" @close="onCloseDrawerRight">
      <div :style="drawerStyles">
        <component @closePage="closeDrawerRight"
          v-bind="page_drawer_right_props"
          :is="page_drawer_right"></component>
      </div>
    </drawer>
    <!-- 페이지 타입 : 액션시트 -->
    <drawer v-if="page_actionsheet" direction="bottom" :exist="true"
      ref="pageActionsheet" @close="onCloseActionsheet">
      <div :style="actionsheetStyles">
        <component @closePage="closeActionsheet"
          v-bind="page_actionsheet_props"
          :is="page_actionsheet"></component>
      </div>
    </drawer>
    <!-- Launchpack Page Type -->
  </div>
</template>
<script>
import t1TPageHeaderMobile from "@/components/Components/Block/Header/t1/PageHeaderMobile.vue"
import t2TPageHeaderMobile from "@/components/Components/Block/Header/t2/PageHeaderMobile.vue"
import t3TPageHeaderMobile from "@/components/Components/Block/Header/t3/PageHeaderMobile.vue"
import t5TPageHeaderMobile from "@/components/Components/Block/Header/t5/PageHeaderMobile.vue"
import t6TPageHeaderMobile from "@/components/Components/Block/Header/t6/PageHeaderMobile.vue"
import t7TPageHeaderMobile from "@/components/Components/Block/Header/t7/PageHeaderMobile.vue"
import t8TPageHeaderMobile from "@/components/Components/Block/Header/t8/PageHeaderMobile.vue"
import t9TPageHeaderMobile from "@/components/Components/Block/Header/t9/PageHeaderMobile.vue"
import t10TPageHeaderMobile from "@/components/Components/Block/Header/t10/PageHeaderMobile.vue"
import t13TPageHeaderMobile from "@/components/Components/Block/Header/t13/PageHeaderMobile.vue"
import t14TPageHeaderMobile from "@/components/Components/Block/Header/t14/PageHeaderMobile.vue"
import t15TPageHeaderMobile from "@/components/Components/Block/Header/t15/PageHeaderMobile.vue"
import t16TPageHeaderMobile from "@/components/Components/Block/Header/t16/PageHeaderMobile.vue"
import t17TPageHeaderMobile from "@/components/Components/Block/Header/t17/PageHeaderMobile.vue"
import t18TPageHeaderMobile from "@/components/Components/Block/Header/t18/PageHeaderMobile.vue"
import t19TPageHeaderMobile from "@/components/Components/Block/Header/t19/PageHeaderMobile.vue"
import BottomMenu from "@/components/Components/Common/BottomMenu.vue"
import t1TFooterMobile from "@/components/Components/Footer/t1/FooterMobile.vue"
import t2TFooterMobile from "@/components/Components/Footer/t2/FooterMobile.vue"
import MyPage from "@/components/LaunchPack_Common/Pages/MyPage/MyPage.vue"
import PrivacyOverlay from "@/components/Components/Pages/PrivacyOverlay/PrivacyOverlay.vue"
import NewPasswordOverlay from "@/components/Components/Pages/NewPasswordOverlay/NewPasswordOverlay.vue"
import CategoryOverlay from "@/components/Components/Pages/CategoryOverlay/CategoryOverlay.vue"
import FilterOverlay from "@/components/Components/Pages/FilterOverlay/FilterOverlay.vue"
import TermsofserviceOverlay from "@/components/Components/Pages/TermsofserviceOverlay/TermsofserviceOverlay.vue"
import ProfileImgOverlay from "@/components/Components/Pages/ProfileImgOverlay/ProfileImgOverlay.vue"
import LocationMapOverlay from "@/components/Components/Pages/LocationMapOverlay/LocationMapOverlay.vue"
import SearchOverlay from "@/components/Components/Pages/SearchOverlay/SearchOverlay.vue"
import PartnerSearchMapOverlay from "@/components/Components/Pages/PartnerSearchMapOverlay/PartnerSearchMapOverlay.vue"
import TermsofserviceModal from "@/components/Components/Pages/TermsofserviceModal/TermsofserviceModal.vue"
import FilterModal from "@/components/Components/Pages/FilterModal/FilterModal.vue"
import InquiryRegModal from "@/components/Components/Pages/InquiryRegModal/InquiryRegModal.vue"
import ReviewRegModal from "@/components/Components/Pages/ReviewRegModal/ReviewRegModal.vue"
import SignoutModal from "@/components/Components/Pages/SignoutModal/SignoutModal.vue"
import PasswordEmailModal from "@/components/Components/Pages/PasswordEmailModal/PasswordEmailModal.vue"
import LogoutModal from "@/components/Components/Pages/LogoutModal/LogoutModal.vue"
import PrivacyModal from "@/components/Components/Pages/PrivacyModal/PrivacyModal.vue"
import ReviewImageOverlay from "@/components/Components/Pages/ReviewImageOverlay/ReviewImageOverlay.vue"
import ProfileOverlay from "@/components/Components/Pages/ProfileOverlay/ProfileOverlay.vue"
import AllReviewOverlay from "@/components/Components/Pages/AllReviewOverlay/AllReviewOverlay.vue"
import ReviewRegOverlay from "@/components/Components/Pages/ReviewRegOverlay/ReviewRegOverlay.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'Main',
  components: {
    t1TPageHeaderMobile,
    t2TPageHeaderMobile,
    t3TPageHeaderMobile,
    t5TPageHeaderMobile,
    t6TPageHeaderMobile,
    t7TPageHeaderMobile,
    t8TPageHeaderMobile,
    t9TPageHeaderMobile,
    t10TPageHeaderMobile,
    t13TPageHeaderMobile,
    t14TPageHeaderMobile,
    t15TPageHeaderMobile,
    t16TPageHeaderMobile,
    t17TPageHeaderMobile,
    t18TPageHeaderMobile,
    t19TPageHeaderMobile,
    BottomMenu,
    t1TFooterMobile,
    t2TFooterMobile,
    MyPage,
    PrivacyOverlay,
    NewPasswordOverlay,
    CategoryOverlay,
    FilterOverlay,
    TermsofserviceOverlay,
    ProfileImgOverlay,
    LocationMapOverlay,
    SearchOverlay,
    PartnerSearchMapOverlay,
    TermsofserviceModal,
    FilterModal,
    InquiryRegModal,
    ReviewRegModal,
    SignoutModal,
    PasswordEmailModal,
    LogoutModal,
    PrivacyModal,
    ReviewImageOverlay,
    ProfileOverlay,
    AllReviewOverlay,
    ReviewRegOverlay
  },
  mixins: [
    PageMixin
  ],
  props: {
    isNew: {
      type: Boolean,
      default: false,
    },

  },
  data() {
    return {
      "vTap": false,
      "vPage": false,
      "boards": [
        {
          "name": "AllReviewOverlay",
          "components": [
            {
              "template_name": "",
              "name": "AllReviewOverlay",
              "folder__name": "AllReviewOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "CategoryOverlay",
          "components": [
            {
              "template_name": "",
              "name": "CategoryOverlay",
              "folder__name": "CategoryOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "FilterModal",
          "components": [
            {
              "template_name": "",
              "name": "FilterModal",
              "folder__name": "FilterModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "FilterOverlay",
          "components": [
            {
              "template_name": "",
              "name": "FilterOverlay",
              "folder__name": "FilterOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "InquiryRegModal",
          "components": [
            {
              "template_name": "",
              "name": "InquiryRegModal",
              "folder__name": "InquiryRegModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "LocationMapOverlay",
          "components": [
            {
              "template_name": "",
              "name": "LocationMapOverlay",
              "folder__name": "LocationMapOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "LogoutModal",
          "components": [
            {
              "template_name": "",
              "name": "LogoutModal",
              "folder__name": "LogoutModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "NewPasswordOverlay",
          "components": [
            {
              "template_name": "",
              "name": "NewPasswordOverlay",
              "folder__name": "NewPasswordOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "PartnerSearchMapOverlay",
          "components": [
            {
              "template_name": "",
              "name": "PartnerSearchMapOverlay",
              "folder__name": "PartnerSearchMapOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "PasswordEmailModal",
          "components": [
            {
              "template_name": "",
              "name": "PasswordEmailModal",
              "folder__name": "PasswordEmailModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "PrivacyModal",
          "components": [
            {
              "template_name": "",
              "name": "PrivacyModal",
              "folder__name": "PrivacyModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "PrivacyOverlay",
          "components": [
            {
              "template_name": "",
              "name": "PrivacyOverlay",
              "folder__name": "PrivacyOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "ProfileImgOverlay",
          "components": [
            {
              "template_name": "",
              "name": "ProfileImgOverlay",
              "folder__name": "ProfileImgOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "ProfileOverlay",
          "components": [
            {
              "template_name": "",
              "name": "ProfileOverlay",
              "folder__name": "ProfileOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "ReviewImageOverlay",
          "components": [
            {
              "template_name": "",
              "name": "ReviewImageOverlay",
              "folder__name": "ReviewImageOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "ReviewRegModal",
          "components": [
            {
              "template_name": "",
              "name": "ReviewRegModal",
              "folder__name": "ReviewRegModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "ReviewRegOverlay",
          "components": [
            {
              "template_name": "",
              "name": "ReviewRegOverlay",
              "folder__name": "ReviewRegOverlay",
              "login_required": true,
              "grade": 1,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "SearchOverlay",
          "components": [
            {
              "template_name": "",
              "name": "SearchOverlay",
              "folder__name": "SearchOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "SignoutModal",
          "components": [
            {
              "template_name": "",
              "name": "SignoutModal",
              "folder__name": "SignoutModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "TermsofserviceModal",
          "components": [
            {
              "template_name": "",
              "name": "TermsofserviceModal",
              "folder__name": "TermsofserviceModal",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        },
        {
          "name": "TermsofserviceOverlay",
          "components": [
            {
              "template_name": "",
              "name": "TermsofserviceOverlay",
              "folder__name": "TermsofserviceOverlay",
              "login_required": false,
              "grade": null,
              "partner_grade": null
            }
          ]
        }
      ],
      "footer": {
        "name": "",
        "visible": false
      },
      "header": {
        "name": "",
        "visible": false,
        "kor_name": ""
      },
      "address": {},
      "footerTo": undefined,
      "enableTap": true,
      "pageStates": [
        "default,t1,false,t1",
        "MyOrderCall,t13,false,t1,내 예약 내역",
        "MyOrderMemberTab,t15,false,t1,내 주문 내역",
        "CallListMember,t13,false,t1,내 전화연결 내역",
        "WtSignup,false,false,false,회원가입",
        "WtAgreement,false,false,false,회원가입",
        "WtPutName,false,false,false,회원가입",
        "WtPutEmail,false,false,false,회원가입",
        "WtVerify,false,false,false,회원가입",
        "WtPassword,false,false,false,회원가입",
        "WtSignupDone,false,false,false,회원가입",
        "WtPartnerSignup,false,false,false,회원가입",
        "WtPartnerAgreement,false,false,false,회원가입",
        "WtPartnerPutName,false,false,false,회원가입",
        "WtPartnerPutEmail,false,false,false,회원가입",
        "WtPartnerVerify,false,false,false,회원가입",
        "WtPartnerPassword,false,false,false,회원가입",
        "WtPartnerSignupDone,false,false,false,회원가입",
        "SearchTotal,t17,false,false,전체",
        "SearchProduct,t17,false,false,상품",
        "SearchPartner,t17,false,false,파트너",
        "SearchBoard,t17,false,false,게시판",
        "SearchTab,t16,false,false,통합검색",
        "LikePost,t13,false,t1,게시판",
        "LikePartner,t13,false,t1,파트너",
        "LikeProduct,t13,false,t1,상품",
        "LikeTab,t13,false,t1,찜 목록",
        "MyCouponExpired,false,false,false,만료된 쿠폰",
        "MyCouponUsable,false,false,false,사용 가능한 쿠폰",
        "MyCouponMemberTab,t13,false,t1,쿠폰함",
        "Notice,t13,false,t1,공지사항",
        "ServiceGuide,false,false,false,서비스 가이드",
        "Company,t13,false,t1,회사소개",
        "Splash,false,false,false,스플래시",
        "Termsofservice,false,false,false,이용약관",
        "Privacy,false,false,false,개인정보처리방침",
        "Password,t13,false,t1,비밀번호 변경",
        "Faq,t13,false,t1,자주 묻는 질문",
        "MyPageMember,t13,false,false,마이페이지",
        "MyPageGuest,t13,false,false,마이페이지",
        "Profile,t13,false,false,내 정보 수정",
        "Signin,false,false,false,로그인",
        "ContactDetailMember,t13,false,t1,1:1문의 상세",
        "ContactRegGuest,t13,false,false,1:1문의 등록",
        "ContactRegMember,t13,false,false,1:1문의 등록",
        "ContactGuest,t13,false,t1,1:1문의 목록",
        "ContactMember,t13,false,t1,1:1문의 목록",
        "PartnerSearch,t13,false,t1,파트너검색",
        "PartnerExhibitionDetail,t13,false,t1,파트너 기획전 상세",
        "PartnerDetail,t13,false,t1,파트너 상세",
        "ProductSearch,t13,false,t1,상품검색",
        "ProductDetail,t13,false,false,상품상세",
        "MapSearch,false,false,false,상품/파트너 지도뷰",
        "MyInquiry,t13,false,t1,내 문의 목록",
        "ExhibitionDetail,t13,false,t1,기획전 상세",
        "ReviewReg,t15,false,false,상품 후기 등록",
        "Product,t18,false,false,상품목록",
        "MyReview,t13,false,t1,내 후기 목록",
        "EventDetail,t13,false,false,이벤트 상세",
        "Event,t13,false,t1,이벤트",
        "NoticeDetail,t13,false,t1,공지사항 상세",
        "MyPointMember,t13,false,t1,내 적립금",
        "Home,t1,false,t1,홈",
        "InquiryReg,t15,false,false,상품 문의 등록",
        "Category,t13,false,false,카테고리",
        "PartnerCenter,t13,false,t1,파트너센터",
        "PartnerInquiryReg,t13,false,false,파트너 입점문의"
      ],
      "page_modal": undefined,
      "footerDelay": false,
      "innerHeight": 0,
      "headerHeight": 0,
      "page_overlay": undefined,
      "pageBottomMenu": [
        "home",
        "event",
        "search",
        "mypage",
        "board_category",
        "category"
      ],
      "page_actionsheet": undefined,
      "page_drawer_left": undefined,
      "page_modal_props": undefined,
      "page_drawer_right": undefined,
      "page_overlay_props": undefined,
      "page_actionsheet_props": undefined,
      "page_drawer_left_props": undefined,
      "page_drawer_right_props": undefined
    }
  },
  created() {
    this.$axios.get('public/ui/menuset/style/bottom_menu?activate=true', { cancelToken: null }).then(res => {
      this.pageBottomMenu = res.data.menu.map(i => {return i.name});
    })
    
    this.$axios.get('public/ui/brand/admin', { cancelToken: null }).then(res => {
        this.menu = res.data.menu;
    });
    
    this.innerHeight = window.innerHeight;
    this.$store.commit('setAlivePage', ['Home','Search','Like','Notice','Event','MapSearch']);

    this.$store.commit('setCommonStyle', {
      borderRadius: '6px',
      blockMarginBottom: '8px',
      blockMarginBottomPc: '8px',
      dummyImage: {
        bg: 'https://s3.ap-northeast-2.amazonaws.com/launchpack-dessertplace/media/img_dummy.png',
        person: 'https://s3.ap-northeast-2.amazonaws.com/launchpack-storage/media/img/default/img_person.png'
      },
      filter: {
        radio: 'full',   // default, full
        checkbox: 'full'   // default, full
      }
    });      

    // 필터 ID 세팅
    this.$store.commit('setCommonFilter', {
      productFilter: 1
    })
    
    this.setPageTypeOn();
    
    this.footerDelay=false;
    setTimeout(()=>{
      this.footerDelay=true;
    },500);
    
    this.$axios.get('/public/category?depth=3&all=true', { cancelToken: null })
    .then(res => {
      let list = res.data;
      list.shift(0);    // 전체 제거
      this.$store.commit('setCategory', list);
      this.vPage = true;
    });
    this.setDBCart();
    if (navigator.geolocation === undefined || navigator.geolocation === null) {
      this.getDefaultAddress();
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.pageStatus();
      window.addEventListener('popstate', () => {
        //console.log('main pop')
        if(this.$store.getters.popstate[0]==='page_overlay' && this.$refs.overlayModal.visible) {
          this.$store.commit('removePopstate');
          this.$refs.overlayModal.close();
        }
        
        else if(this.$store.getters.popstate[0]==='page_modal' && this.$refs.pageModal.visible) {
          this.$store.commit('removePopstate');
          this.$refs.pageModal.close()
        }
        
        else if(this.$store.getters.popstate[0]==='page_drawer_left' && this.$refs.pageDrawerLeft.active) {
          this.$store.commit('removePopstate');
          this.$refs.pageDrawerLeft.close()
        }
        
        else if(this.$store.getters.popstate[0]==='page_drawer_right' && this.$refs.pageDrawerRight.active) {
          this.$store.commit('removePopstate');
          this.$refs.pageDrawerRight.close()
        }
        
        else if(this.$store.getters.popstate[0]==='page_actionsheet' && this.$refs.pageActionsheet.active) {
          this.$store.commit('removePopstate');
          this.$refs.pageActionsheet.close()
        }
      })
    })
    window.addEventListener('resize', () => {
      // if(window.innerWidth < 500) {
      //   this.enableTap = false;
      //   this.vTap = false;
      // }
      this.setTap();
      this.getInnerHeight();
    })
  },
  
  methods: {
    setKeepAlive(key) {
      let items = this.$store.getters.alivePage;
      if(items.indexOf(key)===-1) {
        items.push(key);
        this.$store.commit('setAlivePage', items);
      }
    },
    removeKeepAlive(key) {
      let items = this.$store.getters.alivePage.filter(i => key !== i);
      this.$store.commit('setAlivePage', items);
    },
    openLink(path) {
      let el = document.createElement('a');
      el.href = path;
      el.target = '_blank';
      el.style.display = 'none';
      document.body.appendChild(el);
      el.click();
      el.parentNode.removeChild(el);
    },
    clickAdmin() {
      let front_id = '';
      if(this.$route.query.id) {
        front_id = `&front_id=${this.$route.query.id}`;
      }
      this.openLink(`office/admin?front_path=${this.$route.path.replace('/','')}${front_id}`)
    },
    clickBuilder() {
      this.openLink(`developers/ui/builder?front_path=${this.$route.path.replace('/','')}&device=mobile`)
    },
    getCookie(name) {
      let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return value? unescape(value[2]) : null;
    },
    hideTap() {
      this.enableTap = false;
      this.vTap = false;
      document.getElementById('lp-page').style.marginTop = '';
      let header = document.getElementsByClassName('page-header');
      if(header.length > 0) {
        header[0].style.top = '0';
      }
      document.getElementsByClassName('tap-bar')[0].nextElementSibling.style.marginTop = '';
    },
    setTap() {
      if(!this.enableTap) {
        return;
      } else if (window.name === 'previewPopup') {
        this.vTap = false;
        return;
      }
      let header = document.getElementsByClassName('page-header');
      let tapHeight = 0;

      let vuex = this.getCookie('vuex');
      if(vuex !== null) {
        vuex = JSON.parse(vuex);
        if(vuex.auth.admin.token && vuex.auth.admin.token !== '') {
          if (window.innerWidth > 500) {
            tapHeight = 56;
            this.vTap = true;
          }

          this.$nextTick(()=>{
            if (window.innerWidth > 500) {
              header[0].style.top = `${tapHeight}px`;
              if(header.length === 0) {
                document.getElementById('lp-page').style.marginTop = `${tapHeight}px`;
                document.getElementsByClassName('tap-bar')[0].nextElementSibling.style.marginTop = '50px';
              } else {
                document.getElementById('lp-page').style.marginTop = `${tapHeight}px`;
                document.getElementsByClassName('tap-bar')[0].nextElementSibling.style.marginTop = '56px';
              }
            } else {
              if (this.vTap) {
                header[0].style.top = `${tapHeight}px`;
                if(header.length === 0) {
                  document.getElementById('lp-page').style.marginTop = `${tapHeight}px`;
                  document.getElementsByClassName('tap-bar')[0].nextElementSibling.style.marginTop = '0px';
                } else {
                  document.getElementById('lp-page').style.marginTop = `${tapHeight}px`;
                  document.getElementsByClassName('tap-bar')[0].nextElementSibling.style.marginTop = '50px';
                }
              }
              this.enableTap = false;
              this.vTap = false;
            }
          });
        }
      }
    },
    toHeader() {
      setTimeout(()=>{
        if(!this.$refs.header)
          this.toHeader();
        else {
          this.detectHeader();
        }
      },50);
    },
    detectHeader() {
      //console.log('header', this.$refs.header, this.header.visible)
      if(this.header.visible) {
        let ob = new this.ResizeObserver((e) => {
          this.headerHeight = e[0].contentRect.height;
          this.$store.commit('setHeaderHeight', this.headerHeight);
        });
        ob.observe(this.$refs.header.$el);
      }
    },
    getDefaultAddress() {
      this.$axios.get(`public/service/geocode/default`, { cancelToken: null }).then(res => {
        if (res.status === 200) {
          if (res.data.address) {
            this.$store.commit('setDefaultAddress', res.data.address);
            let location = {lat: res.data.address.latitude, lng: res.data.address.longitude};
            this.$store.commit('setCurrentPosition', location);
          }
        }
      }).catch(err => {
        console.log(err);
      })
    },
    closeActionsheet() {
      this.$store.commit('removePopstate');
      history.back();
      this.$refs.pageActionsheet.close()
    },
    closeDrawerLeft() {
      this.$store.commit('removePopstate');
      history.back();
      this.$refs.pageDrawerLeft.close()
    },
    closeDrawerRight() {
      this.$store.commit('removePopstate');
      history.back();
      this.$refs.pageDrawerRight.close()
    },
    closeOverlay() {
      this.$refs.overlayModal.close()
    },
    onCloseModal(type) {
      //console.log('ontype',type)
      let body = document.getElementsByTagName('body')[0];
      body.removeAttribute('style')
      if(type==='page_overlay') {
        this.page_overlay = undefined;
        if(this.$store.getters.popstate[0]==='page_overlay') {
          this.$store.commit('removePopstate');
          history.back();   
        }
      }
      else if(type==='page_modal') {
        this.page_modal = undefined;
        if(this.$store.getters.popstate[0]==='page_modal') {
          this.$store.commit('removePopstate');
          history.back();   
        }
      }
    },
    onCloseDrawerLeft() {
      this.page_drawer_left = undefined;
      this.$store.commit('removePopstate');
      history.back();
    },
    onCloseDrawerRight() {
      this.page_drawer_right = undefined;
      this.$store.commit('removePopstate');
      history.back();
    },
    onCloseActionsheet() {
      this.page_actionsheet = undefined;
      this.$store.commit('removePopstate');
      history.back();
    },
    closeModal() {
      this.page_modal = undefined;
      this.$refs.pageModal.close();
    },
    getPageName(prop) {
      let boards = this.boards.filter(item => { return item.name === prop })[0].components;
      if(this.isLogin) {
        let name = '';
        if(this.user.grade) {
          for(let i=this.user.grade.order; i>=1; i--) {
            name = this.getBoardsUserGrade(boards, i);
            if(name!=='') {
              break;
            }
          }
        }
        else {
          name = this.getBoardsUserLogin(boards);
        }

        if(name === '') {
          name = this.getBoardsGuest(boards);
        }
        return name;
      }
      else {
        return this.getBoardsGuest(boards);
      }
    },
    getName(board) {
      if(board.template_name !== '') {
        return this.dashToPascal(`${board.template_name}${board.name}`);
      } else {
        return board.name;
      }
    },
    dashToPascal(value) {
      let camel = value.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
          .replace('-', '')
          .replace('_', '');
      });
      return camel[0].toUpperCase() + camel.substring(1);
    },
    getBoardsGuest(boards) {
      let board = boards.filter(item=>{ return item.login_required === false });
      return board.length === 0 ? '' : this.getName(board[0]);
    },
    getBoardsUserLogin(boards) {
      let board = boards.filter(item=>{ return item.login_required === true && (item.grade === 1 || !item.grade) });
      return board.length === 0 ? '' : this.getName(board[0]);
    },
    getBoardsUserGrade(boards, grade) {
      let board = boards.filter(item=>{ return item.login_required === true && item.grade === grade });
      return board.length === 0 ? '' : this.getName(board[0]);
    },
    setPageTypeOn() {
      this.$root.$on('page_overlay', (res, props) => {
        history.pushState('page_overlay','page_overlay');
        this.$store.commit('setPopstate', 'page_overlay');
        this.page_overlay = this.getPageName(res);
        this.page_overlay_props = props;
        this.$refs.overlayModal.open();
      });
      this.$root.$on('page_modal', (res, props) => {
        history.pushState('page_modal','page_modal');
        this.$store.commit('setPopstate', 'page_modal');
        this.page_modal = this.getPageName(res);
        this.page_modal_props = props;
        this.$refs.pageModal.open();
      });
      this.$root.$on('page_drawer_left', (res, props) => {
        history.pushState('page_drawer_left','page_drawer_left');
        this.$store.commit('setPopstate', 'page_drawer_left');
        this.page_drawer_left = this.getPageName(res);
        this.page_drawer_left_props = props;
        setTimeout(() => {
          this.$refs.pageDrawerLeft.open();
        }, 200);
      });
      this.$root.$on('page_drawer_right', (res, props) => {
        history.pushState('page_drawer_right','page_drawer_right');
        this.$store.commit('setPopstate', 'page_drawer_right');
        this.page_drawer_right = this.getPageName(res);
        this.page_drawer_right_props = props;
        setTimeout(() => {
          this.$refs.pageDrawerRight.open();
        }, 200);
      });
      this.$root.$on('page_actionsheet', (res, props) => {
        history.pushState('page_actionsheet','page_actionsheet');
        this.$store.commit('setPopstate', 'page_actionsheet');
        this.page_actionsheet = this.getPageName(res);
        this.page_actionsheet_props = props;
        setTimeout(() => {
          this.$refs.pageActionsheet.open();
        }, 200);
      });
    },
    pageStatus() {
      // 현재 페이지보드 헤더,푸터 노출 상태 및 해당 템플릿명 적용하기
      let name = 'default';
      if(this.$refs.router) {
        if(this.$refs.router.componentName) {
         name = this.$refs.router.componentName; 
        }
        else if(this.$refs.router.name) {
         name = this.$refs.router.name.name;
         if(this.$refs.router.name.template_name !== '') {
           name = this.$refs.router.name.template_name + name;
         }
        }
      }
      let states = this.pageStates.filter(item => { return item.split(',')[0] === name });
      if(states.length === 0) {
        states = this.pageStates.filter(item => { return item.split(',')[0] === 'default' })
      }
      
      let status = states[0].split(',');
      
      if(status[1] === 'false')
        this.header.visible = false;
      else {
        this.header.visible = true;
        this.header.name = this.getCommonComponent('t1',status[1],'page-header-mobile');
        if(status[4]) {
          this.header.kor_name = status[4];  
        }
      }
      if(status[3] === 'false')
        this.footer.visible = false;
      else {
        this.footer.visible = true;
        this.footer.name = this.getCommonComponent('t1',status[3],'footer-mobile');
      }
      this.toHeader();
      setTimeout(()=>{
        this.setTap();
      }, 500);
    },
    getCommonComponent(default_name, tp, cp) {
      let template_name = default_name;
      if(tp !== 'false' && tp !== 't0') {
        template_name = tp;
      }
      return template_name === '' ? cp : `${template_name}-t-${cp}`;
    },
    async setDBCart() {
      if(this.$store.getters.service.package.indexOf('delivery') >-1 ||
      this.$store.getters.service.package.indexOf('mart') >-1) {
       await this.$store.dispatch('setDBCart', this); 
      }
    },
    async getUserCart() {
      if(this.$store.getters.service.package.indexOf('delivery') >-1 ||
      this.$store.getters.service.package.indexOf('mart') >-1) {
       this.vPage = false;
       await this.$store.dispatch('syncCart', this);
       this.vPage = true; 
      }
    },
    getInnerHeight() {
      let innerHeight = window.innerHeight;
      if (this.innerHeight < innerHeight) {
        this.$store.commit('setShowAddrBar', false)
      } else {
        this.$store.commit('setShowAddrBar', true)
      }
    }
  },
  computed: {
    drawerStyles() {
      return {
        width: `${this.$store.getters.deviceWidth}px`,
        height: '100vh',
        background: 'white',
        overflowY: 'auto'
      }
    },
    actionsheetStyles() {
      return {
        width: `${this.$store.getters.deviceWidth}px`,
        height: '150px',
        background: 'white',
        overflowY: 'auto'
      }
    },
    pageStyle() {
      let top = 0;
      let bottom = 0;
      if(this.header.visible) {
        top = this.headerHeight;
      }
      if(this.visibleMenu) {
        bottom = 50;
      }
      
      return {
        minHeight: `calc(100vh - ${top+bottom}px)`,
        paddingTop: top + 'px',
        paddingBottom: bottom + 'px'
      };
    },
    routerViewStyle() {
      return this.visibleFooter ? { paddingBottom: '50px' } : {};
    },
    visibleMenu() {
      return this.pageBottomMenu.filter(item=> { return item === this.$route.path.replace('/','') }).length > 0;
    },
    footerStyle() {
      return this.visibleMenu ? { paddingBottom: '50px' } : {};
    }
  },
  watch: {
    $route(n, o) {
      this.setDBCart();
      this.$nextTick(()=>{
        this.pageStatus();
      })
      
      //console.log('route',n,o)
      if(n.path === '/signin') {
        if(o && o.path) {
          this.$store.commit('setPreviousPath', o.fullPath);
        }
      }
      
      if(n.path === '/profile') {
        if(o && o.path) {
          this.$store.commit('setPreviousPath', o.fullPath);
        }
      }
      
      if (n.path === '/search') {
        if (o && o.path && o.path !== '/search') {
          this.$store.commit('setSearchPreviousPath', o.fullPath);
        }
      }
      
      // 상품 목록, 검색, 파트너 검색에서 상세 외 다른 페이지 이동시 필터 초기화
      if(n.path !== o.path && ['product','product_search','partner_search','search'].indexOf(o.path.replace('/',''))>-1 &&
        ['product_detail','partner_detail'].indexOf(n.path.replace('/','')) === -1) {
        this.$store.commit('setFilter', []);
        this.removeKeepAlive('Search');
      } else {
        this.setKeepAlive('Search')
      }
      
      if(this.$refs.drawer && this.$refs.drawer.active) {
        this.$refs.drawer.close();
      }
      if(this.footerTo) {
        clearTimeout(this.footerTo);
      }
      this.footerDelay=false;
      this.footerTo = setTimeout(()=>{
        this.footerDelay=true;
      },500);
    },
    user() {
      this.getUserCart();
    }
  }
}
</script>
<style scoped>
#tap-bar-wrapper {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
}
.tap-bar {
  height: 56px;
  background-color: #1e1e1e;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
}
.tap-bar .btn-close {
  position:absolute;
  top:8px;
  right:16px;
  color:white;
  padding:8px 0 8px 16px;
}
.tap-bar button {
  color: #242428;
  font-weight: 500;
  font-size: 14px;
  width: 120px;
  height: 32px;
  background-color: white;
  border-radius: 4px;
  border: 0;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tap-bar button img {
  margin-right: 8px;
  width: 18px;
  height: 16px;
}
</style>
<style>
.app-main .sweet-modal {
  overflow: hidden;
}

.app-main .sweet-modal .sweet-box-actions {
  top: 4px;
  right: 8px;
  z-index: 1000;
}
.app-main .sweet-modal .sweet-box-actions .sweet-action-close {
  color: #fff;
  display: none;
}
.app-main .sweet-modal .sweet-box-actions .sweet-action-close:hover {
  background: transparent !important;
}
.app-main .sweet-modal .sweet-content {
/*padding 0 !important*/
  text-align: left !important;
}

@media screen and (min-width: 601px) {
  .overlay-modal .sweet-modal {
    left: 50% !important;
    top: 50% !important;
  }
}

@media screen and (max-width: 600px) {
  .app-main .sweet-modal.is-mobile-fullscreen {
    height: unset;
    position: relative;
  }
  .app-main .page-modal .sweet-modal.is-mobile-fullscreen {
    height: unset;
    position: relative;
    width: 90%;
  }
  .app-main .overlay-modal .sweet-modal.is-mobile-fullscreen {
    height: unset;
    position: relative;
    width: 100%;
  }
  .app-main .sweet-modal-overlay {
    align-items: center;
    justify-content: center;
    display: flex;
  }
}

.modal-mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border: 0;
  background: rgba(0,0,0,0.5);
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-modal .sweet-modal {
  overflow: hidden;
  height: 100vh;
  max-width: 414px;
  width: 100%;
  overflow-y: hidden;
}

.overlay-modal .sweet-modal.is-alert .sweet-content {
  padding: 0 !important;
  height: 100vh;
}

.page-modal .sweet-modal {
  color: #999;
  display: block !important;
}

.custom-page .sweet-modal {
  width: 300px;
}

.page-modal .sweet-modal.is-alert .sweet-content {
  padding: 0 !important;
  max-height: 70vh;
}

/* transition */
.fade-enter-active {
  transition: opacity .5s ease-in-out;
}
.fade-enter {
  opacity: 0;
}
.sweet-modal.is-mobile-fullscreen {
    width: 100%;
    left: 0;
    top: 0;
    overflow-x: hidden;
    max-height: 100vh;
  }
</style>
