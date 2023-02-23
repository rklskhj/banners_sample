<template>
<div class="app-main">
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
    <component ref="header" :is="header.name" @currentAddress="val=>address=val"
          v-show="header.visible" @headerChange="val => headerChange(val)"></component>
    <router-view v-if="vPage" ref="router" :style="pageStyle" @componentName="pageStatus"></router-view>
    <component v-show="footer.visible" :is="footer.name"></component>
    
    
    <!-- 포탈 -->
    <!-- share 컴포넌트 포탈 -->
    <portal-target name="share" :multiple="true"></portal-target>
    <!-- BtnCall 컴포넌트 전화연결 포탈 -->
    <portal-target name="btn-call-modal"></portal-target>
    <!-- 쿠폰 사용 가능한 대상 포탈 -->
    <portal-target name="usable-list-modal" multiple></portal-target>
    <!-- 아래 페이지 타입은 삭제할 경우 정상동작 하지 않음 -->
    <!-- Launchpack Page Type -->
    <!-- 페이지 타입 : 오버레이 -->
    <div class="overlay-modal">
      <sweet-modal ref="overlayModal" overlay-theme="dark" @close="onCloseModal">
        <component @closePage="$refs.overlayModal.close()"
          v-bind="page_overlay_props"
          v-if="page_overlay" :is="page_overlay"></component>
      </sweet-modal>
    </div>
    <!-- 페이지 타입 : 모달 -->
    <div class="page-modal">
      <sweet-modal ref="pageModal"
        overlay-theme="dark" @close="onCloseModal">
        <div id="modal-wrap" style="overflow-y:auto;max-height:70vh;">
          <component @closePage="closeModal"
            v-bind="page_modal_props"
            v-if="page_modal" :is="page_modal"></component>
        </div>
      </sweet-modal>
    </div>
    <!-- 페이지 타입 : 드로워(왼쪽) -->
    <drawer v-if="page_drawer_left" direction="left" :exist="true" ref="pageDrawerLeft">
      <div :style="drawerStyles">
        <component @closePage="$refs.pageDrawerLeft.close()"
          v-bind="page_drawer_left_props"
          :is="page_drawer_left"></component>
      </div>
    </drawer>
    <!-- 페이지 타입 : 드로워(오른쪽) -->
    <drawer v-if="page_drawer_right" direction="right" :exist="true" ref="pageDrawerRight">
      <div :style="drawerStyles">
        <component @closePage="$refs.pageDrawerRight.close()"
          v-bind="page_drawer_right_props"
          :is="page_drawer_right"></component>
      </div>
    </drawer>
    <!-- 페이지 타입 : 액션시트 -->
    <drawer v-if="page_actionsheet" direction="bottom" :exist="true" ref="pageActionsheet">
      <div :style="actionsheetStyles">
        <component @closePage="$refs.pageActionsheet.close()"
          v-bind="page_actionsheet_props"
          :is="page_actionsheet"></component>
      </div>
    </drawer>
    <!-- Launchpack Page Type -->
  </div>
</template>
<script>
import c2ca1TPageHeaderPc from "@/components/Components/Block/Header/c2ca1/PageHeaderPc.vue"
import c2ca2TPageHeaderPc from "@/components/Components/Block/Header/c2ca2/PageHeaderPc.vue"
import c2ca3TPageHeaderPc from "@/components/Components/Block/Header/c2ca3/PageHeaderPc.vue"
import c2ca4TPageHeaderPc from "@/components/Components/Block/Header/c2ca4/PageHeaderPc.vue"
import t1TPageHeaderPc from "@/components/Components/Block/Header/t1/PageHeaderPc.vue"
import t2TPageHeaderPc from "@/components/Components/Block/Header/t2/PageHeaderPc.vue"
import t3TPageHeaderPc from "@/components/Components/Block/Header/t3/PageHeaderPc.vue"
import t4TPageHeaderPc from "@/components/Components/Block/Header/t4/PageHeaderPc.vue"
import t5TPageHeaderPc from "@/components/Components/Block/Header/t5/PageHeaderPc.vue"
import t6TPageHeaderPc from "@/components/Components/Block/Header/t6/PageHeaderPc.vue"
import t7TPageHeaderPc from "@/components/Components/Block/Header/t7/PageHeaderPc.vue"
import t8TPageHeaderPc from "@/components/Components/Block/Header/t8/PageHeaderPc.vue"
import t9TPageHeaderPc from "@/components/Components/Block/Header/t9/PageHeaderPc.vue"
import t10TPageHeaderPc from "@/components/Components/Block/Header/t10/PageHeaderPc.vue"
import t11TPageHeaderPc from "@/components/Components/Block/Header/t11/PageHeaderPc.vue"
import t1TFooterPc from "@/components/Components/Footer/t1/FooterPc.vue"
import t2TFooterPc from "@/components/Components/Footer/t2/FooterPc.vue"
import t3TFooterPc from "@/components/Components/Footer/t3/FooterPc.vue"
import t4TFooterPc from "@/components/Components/Footer/t4/FooterPc.vue"
import t5TFooterPc from "@/components/Components/Footer/t5/FooterPc.vue"
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
  name: 'MainPC',
  components: {
    c2ca1TPageHeaderPc,
    c2ca2TPageHeaderPc,
    c2ca3TPageHeaderPc,
    c2ca4TPageHeaderPc,
    t1TPageHeaderPc,
    t2TPageHeaderPc,
    t3TPageHeaderPc,
    t4TPageHeaderPc,
    t5TPageHeaderPc,
    t6TPageHeaderPc,
    t7TPageHeaderPc,
    t8TPageHeaderPc,
    t9TPageHeaderPc,
    t10TPageHeaderPc,
    t11TPageHeaderPc,
    t1TFooterPc,
    t2TFooterPc,
    t3TFooterPc,
    t4TFooterPc,
    t5TFooterPc,
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

  },
  data() {
    return {
      "vTap": false,
      "vPage": false,
      "footer": {
        "name": "",
        "visible": false
      },
      "header": {
        "name": "",
        "visible": false,
        "relative": false
      },
      "enableTap": true,
      "showModal": undefined,
      "pageStates": [
        "default,c2ca1,t1",
        "LpCustomTestPc,c2ca1,false,테스트",
        "MyOrderCallPc,c2ca1,t1,내 예약 내역",
        "MyOrderMemberTab,t15,t1,내 주문 내역",
        "CallListMemberPc,c2ca1,t1,내 전화연결 내역",
        "WtAgreementPc,false,false,회원가입",
        "WtSignupPc,false,false,회원가입",
        "WtVerifyPc,false,false,회원가입",
        "WtPasswordPc,false,false,회원가입",
        "WtPutNamePc,false,false,회원가입",
        "WtPutEmailPc,false,false,회원가입",
        "WtSignupDonePc,false,false,회원가입",
        "WtPartnerAgreementPc,false,false,회원가입",
        "WtPartnerSignupPc,false,false,회원가입",
        "WtPartnerVerifyPc,false,false,회원가입",
        "WtPartnerPasswordPc,false,false,회원가입",
        "WtPartnerPutNamePc,false,false,회원가입",
        "WtPartnerPutEmailPc,false,false,회원가입",
        "WtPartnerSignupDonePc,false,false,회원가입",
        "SearchTotalPc,t10,false,전체",
        "SearchProductPc,t10,false,상품",
        "SearchPartnerPc,t10,false,파트너",
        "SearchBoardPc,t10,false,게시판",
        "SearchTab,t10,false,통합검색",
        "LikePostPc,c2ca1,t1,게시판",
        "LikePartnerPc,c2ca1,t1,파트너",
        "LikeProductPc,c2ca1,t1,상품",
        "LikeTab,t1,t1,찜 목록",
        "MyCouponExpiredPc,false,false,만료된 쿠폰",
        "MyCouponUsablePc,false,false,사용 가능한 쿠폰",
        "MyCouponMemberTab,t1,false,쿠폰함",
        "NoticePc,c2ca1,t1,공지사항",
        "CompanyPc,c2ca1,t1,회사소개",
        "TermsofservicePc,false,false,false,이용약관",
        "PrivacyPc,false,false,false,개인정보처리방침",
        "PasswordPc,c2ca1,t1,비밀번호 변경",
        "FaqPc,c2ca1,t1,자주 묻는 질문",
        "MyPageMemberPc,c2ca1,t1,마이페이지",
        "MyPageGuestPc,c2ca1,t1,마이페이지",
        "ProfilePc,c2ca1,t1,내 정보 수정",
        "NiceVerify,false,false,본인인증팝업",
        "SigninPc,c2ca1,t1,로그인",
        "ContactDetailMemberPc,c2ca1,t1,1:1문의 상세",
        "ContactRegGuestPc,c2ca1,t1,1:1문의 등록",
        "ContactRegMemberPc,c2ca1,t1,1:1문의 등록",
        "ContactGuestPc,c2ca1,t1,1:1문의 목록",
        "ContactMemberPc,c2ca1,t1,1:1문의 목록",
        "PartnerSearchPc,c2ca1,t1,파트너검색",
        "PartnerExhibitionDetailPc,c2ca1,t1,파트너 기획전 상세",
        "PartnerDetailPc,c2ca1,t1,파트너 상세",
        "ProductSearchPc,c2ca1,t1,상품검색",
        "ProductDetailPc,c2ca1,t1,상품상세",
        "MapSearchPc,t11,false,상품/파트너 지도뷰",
        "MyInquiryPc,c2ca1,t1,내 문의 목록",
        "ExhibitionDetailPc,c2ca1,t1,기획전 상세",
        "ReviewRegPc,c2ca1,t1,상품 후기 등록",
        "ProductPc,c2ca1,t1,상품목록",
        "MyReviewPc,c2ca1,t1,내 후기 목록",
        "EventDetailPc,c2ca1,t1,이벤트 상세",
        "EventPc,c2ca1,t1,이벤트",
        "NoticeDetailPc,c2ca1,t1,공지사항 상세",
        "MyPointMemberPc,c2ca1,t1,내 적립금",
        "HomePc,c2ca1,t1,홈",
        "InquiryRegPc,c2ca1,t1,상품 문의 등록",
        "PartnerCenterPc,c2ca4,t1,파트너센터",
        "PartnerInquiryRegPc,c2ca4,t1,파트너 입점문의"
      ],
      "page_modal": undefined,
      "overlayLink": "",
      "headerHeight": 0,
      "page_overlay": undefined,
      "page_actionsheet": undefined,
      "page_drawer_left": undefined,
      "page_modal_props": undefined,
      "page_drawer_right": undefined,
      "page_overlay_props": undefined,
      "page_actionsheet_props": undefined,
      "page_drawer_left_props": undefined,
      "page_drawer_right_props": undefined,
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
      ]
    }
  },
  created() {
    this.$store.commit('setAlivePage', ['Home','Category','Product','Search','BoardCat','Like','Notice', 'PartnerDetail']);

    this.$store.commit('setCommonStyle', {
      borderRadius: '6px',
      blockMarginBottom: '8px',
      blockMarginBottomPc: '8px',
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
    })
  },
  
  methods: {
    headerChange(val) {
      this.header.relative = val;
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
      this.openLink(`developers/ui/builder?front_path=${this.$route.path.replace('/','')}&device=pc`)
    },
    getCookie(name) {
      let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return value? unescape(value[2]) : null;
    },
    hideTap() {
      this.vTap = false;
      let header = document.getElementsByClassName('page-header');
      let header_r = document.getElementsByClassName('page-header-relative');
      if(header.length === 0) {
        if(document.getElementsByClassName('tap-bar')[0].nextElementSibling) {
          document.getElementsByClassName('tap-bar')[0].nextElementSibling.style.marginTop = ''; 
        }
      } else {
        header[0].style.top = '0';
        header[0].nextElementSibling.style.marginTop = `${this.$refs.header.$el.clientHeight}px`; 
      }
      if(header_r.length>0) {
        header_r[0].style.marginTop = '0px';
      }
    },
    setTap() {
      if(!this.enableTap) {
        return;
      } else if (window.name === 'previewPc') {
        this.vTap = false;
        return;
      } else if (this.$route.path === '/map_search') {
        this.vTap = false;
        return;
      }
      let header = document.getElementsByClassName('page-header');
      let header_r = document.getElementsByClassName('page-header-relative');
      let tapHeight = 56;

      let vuex = this.getCookie('vuex');
      if(vuex !== null) {
        vuex = JSON.parse(vuex);
        if(vuex.auth.admin.token && vuex.auth.admin.token !== '') {
          this.vTap = true;
          this.$nextTick(()=>{
            if(header.length === 0) {
              if(document.getElementsByClassName('tap-bar')[0].nextElementSibling) {
                document.getElementsByClassName('tap-bar')[0].nextElementSibling.style.marginTop = `${tapHeight}px`; 
              }
            } else {
              header[0].style.top = `${tapHeight}px`;
              header[0].nextElementSibling.style.marginTop = `${this.$refs.header.$el.clientHeight + tapHeight}px`; 
            }
            if(header_r.length>0) {
              header_r[0].style.marginTop = `${tapHeight}px`;
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
        if(this.header.relative) {
          this.headerHeight = 0;
        }
        else {
          let ob = new this.ResizeObserver((e) => {
            this.headerHeight = e[0].contentRect.height;
            this.$store.commit('setHeaderHeight', this.headerHeight);
          });
          ob.observe(this.$refs.header.$el); 
        }
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
        //console.log(err);
      })
    },
    onCloseModal() {
      let body = document.getElementsByTagName('body')[0];
      body.removeAttribute('style')
      this.page_modal = undefined;
      this.page_overlay = undefined;
    },
    closeModal() {
      this.page_modal = undefined;
      this.$refs.pageModal.close();
    },
    getPageName(prop) {
      let boards = this.boards.filter(item => { return item.name === prop })[0].components;
      
      //console.log(boards, 'boards')
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
      //console.log('usergrade', boards, grade)
      let board = boards.filter(item=>{ 
        if(!item.grade)  {
          return item.login_required;
        }
        else {
          return item.login_required === true && item.grade === grade
        }
      });
      return board.length === 0 ? '' : this.getName(board[0]);
    },
    setPageTypeOn() {
      this.$root.$on('page_overlay', (res, props) => {
        this.page_overlay = this.getPageName(res);
        this.page_overlay_props = props;
        this.$refs.overlayModal.open();
      });
      this.$root.$on('page_modal', (res, props) => {
        //console.log('res', res)
        this.page_modal = this.getPageName(res);
        this.page_modal_props = props;
        this.$refs.pageModal.open();
      });
      this.$root.$on('page_drawer_left', (res, props) => {
        this.page_drawer_left = this.getPageName(res);
        this.page_drawer_left_props = props;
        setTimeout(() => {
          this.$refs.pageDrawerLeft.open();
        }, 200);
      });
      this.$root.$on('page_drawer_right', (res, props) => {
        this.page_drawer_right = this.getPageName(res);
        this.page_drawer_right_props = props;
        setTimeout(() => {
          this.$refs.pageDrawerRight.open();
        }, 200);
      });
      this.$root.$on('page_actionsheet', (res, props) => {
        this.page_actionsheet = this.getPageName(res);
        this.page_actionsheet_props = props;
        setTimeout(() => {
          this.$refs.pageActionsheet.open();
        }, 200);
      });
    },
    pageStatus() {
      // 현재 페이지보드 헤더,GNB,푸터 노출 상태 및 해당 템플릿명 적용하기
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
        this.header.name = this.getCommonComponent('t1',status[1],'page-header-pc');
      }
      if(status[2] === 'false')
        this.footer.visible = false;
      else {
        this.footer.visible = true;
        this.footer.name = this.getCommonComponent('t1',status[2],'footer-pc');
      }
      
      if(this.footer.visible) {
        this.$nextTick(()=>{
          if(this.$refs.router.$el.children.length>0) {
           Array.from(this.$refs.router.$el.children).slice(-1)[0].style.paddingBottom = '50px'; 
          }
        })
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
    }
  },
  computed: {
    drawerStyles() {
      return {
        width: `375px`,
        height: '100vh',
        background: 'white',
        overflowY: 'auto'
      }
    },
    actionsheetStyles() {
      return {
        width: `375px`,
        height: '150px',
        background: 'white',
        overflowY: 'auto'
      }
    },
    pageStyle() {
      let deco = {
        minHeight: '100vh'
      };
      
      if (this.header.visible) {
        if(!this.header.relative) {
          if (this.$route.path === '/map_search') {
            deco = {
              paddingTop: this.headerHeight + 'px',
              height: 'auto',
              minHeight: '100vh',
            }
          } else {
            deco = {
              marginTop: this.headerHeight + 'px',
              minHeight: 'calc(100vh - 64px)',
            };
          }
        }
      }
      
      return deco;
    },
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    $route(n, o) {
      this.setDBCart();
      this.$nextTick(()=>{
        this.pageStatus();
      })
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
        if (o && o.path) {
          this.$store.commit('setSearchPreviousPath', o.fullPath);
        }
      }
      
      // 상품 목록, 검색, 파트너 검색에서 상세 외 다른 페이지 이동시 필터 초기화
      if(n.path !== o.path && ['product','product_search','partner_search', 'search'].indexOf(o.path.replace('/',''))>-1 &&
        ['product_detail','partner_detail'].indexOf(n.path.replace('/','')) === -1) {
        this.$store.commit('setFilter', []);
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
.modal-pc {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  width: 100vw;
  height: calc(100vh - 64px);
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.fade-enter-active {
  transition: opacity .5s;
}
.fade-enter {
  opacity: 0;
}

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
.page-modal .sweet-modal {
  color: #999;
  display: block !important;
}

.custom-page .sweet-modal {
  width: 300px;
}

.overlay-modal .sweet-modal {
  overflow: hidden;
  height: auto;
  max-width: 600px;
}

.page-modal .sweet-modal.is-alert .sweet-content {
  padding: 0 !important;
  max-height: 80vh;
}
.sweet-modal.is-mobile-fullscreen {
    width: 100%;
    left: 50%;
    top: 50%;
    overflow-x: hidden;
    max-height: 80vh;
  }
</style>
