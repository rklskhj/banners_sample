import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import objectFitImages from 'object-fit-images'


import './assets/css/common.styl'
import './assets/css/lp_fonts.styl'
import './assets/css/grid.styl'
import './assets/css/slick.styl'
import './assets/css/suneditor.min.css'
import "vue-scroll-picker/dist/style.css"


import 'string-format-js'

Vue.config.productionTip = false

//==============
// 외부 라이브러리
//==============

/* lp replace code */
import ResizeObserver from 'resize-observer-polyfill';
Vue.prototype.ResizeObserver = ResizeObserver;

import StickySidebar from 'sticky-sidebar'
Vue.prototype.StickySidebar = StickySidebar;

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

import axios from 'axios'
Vue.prototype.$axios = axios;

import api from './api/api_all'

Vue.prototype.$api = api;

import VueHead from 'vue-head'
Vue.use(VueHead)

import josa from "josa-js";
Vue.prototype.josa = josa;

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
import 'dayjs/locale/ko'
dayjs.locale('ko')  // dayjs 한국어 설정

Vue.prototype.dayjs = dayjs

import Slick from 'vue-slick';

Vue.component('Slick', Slick);
import {SweetModal} from 'sweet-modal-vue';

Vue.component('SweetModal', SweetModal);

import uuidv4 from 'uuid/v4'

Vue.prototype.uuidv4 = uuidv4;

import {dragscroll} from 'vue-dragscroll'

Vue.directive('dragscroll', dragscroll);

// import VueLazyload from 'vue-lazyload'
//
// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   error: 'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/img/non-path/06356515.jpeg',
//   loading: 'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/img/non-path/06356515.jpeg',
//   attempt: 1,
//   listenEvents: ['scroll']
// })

import PortalVue from 'portal-vue'

Vue.use(PortalVue);

import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton);

import sanitizeHtml from 'sanitize-html'
Vue.prototype.sanitizeHtml = sanitizeHtml;

//==============
// 내부 라이브러리
//==============
import {currency, currencyNum, currencyKor} from "./utils/helper/format-helper";

Vue.filter('currency', currency)
Vue.filter('currencyNum', currencyNum)
Vue.filter('currencyKor', currencyKor)

import {formValidate, isValid} from '@/utils/helper/form-helper'

import SocialSharing from 'vue-social-sharing';
Vue.prototype.formValidate = formValidate;
Vue.prototype.isValid = isValid;
Vue.use(SocialSharing);

import lpPlugin from './lp_plugin'

Vue.use(lpPlugin)

const eventBus = new Vue();
Vue.prototype.eventBus = eventBus;

/*
  공통으로 사용되는 컴포넌트
 */

Vue.component('PageHeader', () => import('@/components/Components/Slot/PageHeader.vue'))
Vue.component('Tab', () => import('@/components/Components/Slot/Tab.vue'))
Vue.component('ListVertical', () => import('@/components/Components/Slot/ListVertical.vue'))
Vue.component('PinchImage', () => import('@/components/Components/Common/PinchImage.vue'))
Vue.component('Drawer', () => import('@/components/Components/Common/Drawer.vue'))
Vue.component('ActionSheet', () => import('@/components/Components/Common/ActionSheet.vue'))


function importComponents(components) {
  Object.keys(components).forEach(filename => {
    Vue.component(filename.replace(/^.+\//, '').replace(/\.\w+$/, ''), components[filename]);
  });
}

// 폴더 단위 import
// Form
const forms = import.meta.glob('@/components/Components/Form/*.vue')
importComponents(forms);
// Button
const buttons = import.meta.glob('@/components/Components/Button/*.vue')
importComponents(buttons);
// Common
const commons = import.meta.glob('@/components/Components/Common/*.vue')
importComponents(commons);
// List
const lists = import.meta.glob('@/components/Components/List/*.vue')
importComponents(lists);
// Slots
const slots = import.meta.glob('@/components/Components/Slot/*.vue')
importComponents(slots);


import ClickOutside from 'vue-click-outside'

Vue.mixin({
  directives: {
    ClickOutside
  },
  activated() {
    let path = '';
    this.$route.path.split('/').forEach(item => {
      if (path === '' && item !== '') {
        path = item;
      }
    });

    let alivePages = [];
    this.$store.getters.alivePage.forEach(item => {
      item = item.replace('Page', '');
      alivePages.push(item.toLowerCase());              // lower case
      alivePages.push(this.camelToUnderscore(item));    // underscore case
    });

    // 이전 페이지에서 push로 들어온 경우, 현재 경로가 alivePage 목록에 있는 경우 getData, init 함수 호출
    if (this.$route.meta.isRefresh
      && alivePages.indexOf(path) > -1) {
      if (this.init) {
        this.init();
      }
      if (this.getData) {
        this.getData();
      }
    }
  },
  mounted() {
    objectFitImages()
  },
  data() {
    return {
      // 브랜드 컬러 간소화
      // 글씨, 아이콘
      brandColor: {
        primary: { color: this.getColor('Primary Color') },
        primaryHalf: { color: this.getColor('Primary Color 50%') },
        brand: { color: this.getColor('브랜드 강조 색상') },
        main: { color: this.getColor('기본 내용 색상') },
        sub: { color: this.getColor('보조 내용 색상') },
        sub2: { color: this.getColor('보조 내용 색상 02') },
        sub3: { color: this.getColor('보조 내용 색상 03') },
        subLine: { color: this.getColor('보조 테두리선 색상') },
        help: { color: this.getColor('도움말 및 비활성내용 색상') },
        white: { color: 'white' },
        reverse: { color: this.getColor('반전 내용 색상') },
        highlight: { color: this.getColor('강조 색상') },
        deco: { color: this.getColor('꾸밈 색상') },
        approval: { color: this.getColor('승인 색상') },
        brand1: { color: this.getColor('브랜드 꾸밈 색상 01') },
        brand2: { color: this.getColor('브랜드 꾸밈 색상 02') },
        brand3: { color: this.getColor('브랜드 꾸밈 색상 03') },
      },
      // 배경
      brandBgColor: {
        primary: { backgroundColor: this.getColor('Primary Color') },
        primaryHalf: { backgroundColor: this.getColor('Primary Color 50%') },
        brand: { backgroundColor: this.getColor('브랜드 강조 색상') },
        main: { backgroundColor: this.getColor('기본 배경 색상') },
        sub: { backgroundColor: this.getColor('보조 배경 색상') },
        sub2: { backgroundColor: this.getColor('보조 배경 색상 02') },
        reverse: { backgroundColor: this.getColor('반전 배경 색상') },
        alert: { backgroundColor: '#FF5D5D' },
        white: { backgroundColor: 'white' },
        highlight: { backgroundColor: this.getColor('강조 색상') },
        deco: { backgroundColor: this.getColor('꾸밈 색상') },
        approval: { backgroundColor: this.getColor('승인 색상') },
        brand1: { backgroundColor: this.getColor('브랜드 꾸밈 색상 01') },
        brand2: { backgroundColor: this.getColor('브랜드 꾸밈 색상 02') },
        brand3: { backgroundColor: this.getColor('브랜드 꾸밈 색상 03') },
        input: { backgroundColor: this.getColor('텍스트 입력창 색상') }
      },
      // 버튼색 (배경,테두리)
      brandBtn: {
        border: {
          gray: { border: `1px solid ${this.getColor('회색 버튼 색상')}` }
        },
        bg: {
          gray: { backgroundColor: this.getColor('회색 버튼 색상') }
        }
      },
      // 테두리선
      brandBorder: {
        primary: { border: `1px solid ${this.getColor('Primary Color')}` },
        primaryHalf: { border: `1px solid ${this.getColor('Primary Color 50%')}` },
        brand: { border: `1px solid ${this.getColor('브랜드 강조 색상')}` },
        main: { border: `1px solid ${this.getColor('기본 테두리선 색상')}` },
        sub: { border: `1px solid ${this.getColor('보조 테두리선 색상')}` },
        highlight: { border: `1px solid ${this.getColor('강조 색상')}` },
        deco: { border: `1px solid ${this.getColor('꾸밈 색상')}` },
        approval: { border: `1px solid ${this.getColor('승인 색상')}` },
        brand1: { border: `1px solid ${this.getColor('브랜드 꾸밈 색상 01')}` },
        brand2: { border: `1px solid ${this.getColor('브랜드 꾸밈 색상 02')}` },
        brand3: { border: `1px solid ${this.getColor('브랜드 꾸밈 색상 03')}` },
        input: { border: `1px solid ${this.getColor('텍스트 입력창 색상')}` }
      }
    }
  },
  methods: {
    mc(pc, mobile) {
      return this.$store.getters.device === 'mobile' ? mobile : pc;
    },
    routerPush(path) {
      if (this.$route.meta) {
        this.$route.meta.clickPush = true;
      }

      this.$router.push(path);
    },
    routerOverlay(path) {
      this.$root.$emit('page_overlay', path);
    },
    routerModal(path) {
      this.$root.$emit('page_modal', path);
    },
    routerDrawerLeft(path) {
      this.$root.$emit('page_drawer_left', path);
    },
    routerDrawerRight(path) {
      this.$root.$emit('page_drawer_right', path);
    },
    routerActionsheet(path) {
      this.$root.$emit('page_actionsheet', path);
    },
    parseColor(val) {
      if(typeof(val) === 'string') {
        if(val.indexOf('.')>-1) {
          let value = val.split('.');   // ex> brandColor.main
          if(value[0] === 'brandColor') {
            return this.brandColor[value[1]].color;
          } else if(value[0] === 'brandBgColor') {
            return this.brandBgColor[value[1]].backgroundColor;
          } else if(value[0] === 'brandBorder') {
            return this.brandBorder[value[1]].border.replace('1px solid ','');
          }
        } else {
          return val;
        }

      } else if(typeof(val) === 'object'){
        val = val.color;
        return typeof(val) === 'object' ? `rgba(${val.r},${val.g},${val.b},${val.a})` : val;
      } else {
        return val;
      }
    },
    parseColorStr2Obj(n) {
      let c = n.replace('rgba(', '').replace(')', '').split(',');
      return {r: c[0], g: c[1], b: c[2], a: c[3]};
    },
    getColor(val) {
      if (!this.$store || !this.$store.getters.brand) return '';
      let lpColor = find(this.$store.getters.brand.color_theme.data, 'name', val).color;
      return `rgba(${lpColor.r},${lpColor.g},${lpColor.b},${lpColor.a})`;
    },
    rgba2hex(rgbaStr) {
      let a,
        rgb = rgbaStr.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
          (rgb[1] | 1 << 8).toString(16).slice(1) +
          (rgb[2] | 1 << 8).toString(16).slice(1) +
          (rgb[3] | 1 << 8).toString(16).slice(1) : rgbaStr;

      if (alpha !== "") { a = alpha; }
      else { a = '01' }

      return {
        hex: hex,
        alpha: a
      };
    },
    toast(msg) {
      this.$root.$emit('toast', msg);
    },
    setAuthHeader() {
      //this.$axios.defaults.headers.common['Authorization'] = 'Token 8144965aed93722f9f2a56573054ed5357a2bee4';
      this.$axios.defaults.headers.common['Authorization'] = 'Token ' + this.$store.getters.user.token;
    },
    image(img) {
      if (!img) return '';
      if (img.search('http') === -1 && img.search('base64,') === -1)
        return this.backendUrl + img;
      else
        return img;
    },
    bgCoverStyle(url) {
      return {
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    },
    bgContainStyle(url) {
      return {
        backgroundImage: `url(${url})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    },
    bgDimStyle(url, dimColor) {
      let dim = 'rgba(0,0,0,0.5)';
      if (dimColor) dim = dimColor;

      return {
        backgroundImage: `linear-gradient(${dim}, ${dim}), url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    },
    dateFormat(dt, type) {
      if (!dt) return '';

      if (type === 'ago') {
        return dayjs(dt).fromNow();
      }

      let format = '';
      switch (type) {
        case 'date_time_1':
          format = 'YY년 MM월 DD일(dd) HH시 mm분'
          break;
        case 'date_time_2':
          format = 'YYYY-MM-DD HH:mm'
          break;
        case 'date_time_3':
          format = 'YY/MM/DD HH:mm'
          break;
        case 'date_time_4':
          format = 'YY.MM.DD HH:mm'
          break;
        case 'date_time_5':
          format = 'YYYY.MM.DD HH:mm:ss'
          break;
        case 'date_time_6':
          format = 'YY.MM.DD HH:mm:ss'
          break;
        case 'date_time_7':
          format = 'YYYY.MM.DD HH:mm'
          break;
        case 'date_time_8':
          format = 'MM.DD(dd) A hh:mm'
          break;
        case 'date_1':
          format = 'YY년 MM월 DD일(dd)'
          break;
        case 'date_2':
          format = 'YY년 MM월 DD일'
          break;
        case 'date_3':
          format = 'YYYY.MM.DD'
          break;
        case 'date_4':
          format = 'YYYY-MM-DD'
          break;
        case 'date_5':
          format = 'MM월 DD일(dd)'
          break;
        case 'date_6':
          format = 'MM.DD(dd)'
          break;
        case 'date_7':
          format = 'MM월 DD일'
          break;
        case 'date_8':
          format = 'YYYY년 MM월 DD일(ddd)'
          break;
        case 'date_9':
          format = 'YYYY년 MM월 DD일 dddd'
          break;
        case 'date_10':
          format = 'YY.MM.DD'
          break;
        case 'date_11':
          format = 'M.D'
          break;
        case 'date_12':
          format = 'MM-DD(dd)'
          break;
        case 'date_13':
          format = 'YYYY.MM.DD (dd)'
          break;
        case 'time_1':
          format = 'HH시 mm분'
          break;
        case 'year_1':
          format = 'YYYY'
          break;
        case 'month_1':
          format = 'MM'
          break;
        case 'day_1':
          format = 'DD'
          break;
        case 'day_2':
          format = 'dd'
          break;
      }
      return dayjs(dt).format(format);
    },
    // Google Analytics
    setGa(param1, param2, param3, param4) {
      if (this.$gtag) {
        this.$gtag.event(param2, {
          'event_category': param1,
          'event_label': param3,
          'value': param4
        })
      }
    },
    // 카멜케이스를 언더스코어로 변환
    // productDetail -> product_detail
    camelToUnderscore(value) {
      return value.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    },
    getScrollbarWidth() {
      // Creating invisible container
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll'; // forcing scrollbar to appear
      outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
      document.body.appendChild(outer);

      // Creating inner element and placing it in the container
      const inner = document.createElement('div');
      outer.appendChild(inner);

      // Calculating difference between container's full width and the child width
      const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

      // Removing temporary elements from the DOM
      outer.parentNode.removeChild(outer);

      return scrollbarWidth;
    }
  },
  computed: {
    pcMaxWidth() {
      return {
        width: this.maxWidth,
      }
    },
    isIE() {
      return navigator.userAgent.indexOf('Trident') > -1;
    },
    user() {
      return this.$store.getters.user;
    },
    pagePadding() {
      let padding = this.$store.getters.brand.layout_padding + 'px';
      return {
        paddingLeft: padding,
        paddingRight: padding
      }
    },
    pagePaddingAll() {    // 모든 방향 동일하게 줄 경우
      let padding = this.$store.getters.brand.layout_padding + 'px';
      return {
        padding: padding
      }
    },
    pageGutter() {
      return this.$store.getters.brand.layout_gutters + 'px';
    },
    maxWidth() {
      return this.$store.getters.brand.layout_maxwidth + 'px';
    },
    radius() {
      let radius = '0px';
      if (this.$store && this.$store.getters.commonStyle)
        radius = this.$store.getters.commonStyle.borderRadius;
      return {
        borderRadius: radius
      }
    },
    // 로그인 여부
    isLogin() {
      return this.$store.getters.user.user_id > 0;
    },
    // 팀(그룹 관련 기능 사용시)
    team() {
      return this.$store.getters.team ? this.$store.getters.team : undefined;
    },
    // 더미이미지
    dummyImage() {
      if (this.$store.getters.commonStyle.dummyImage) {
        return this.$store.getters.commonStyle.dummyImage
      } else {
        return {
          person: 'https://s3.ap-northeast-2.amazonaws.com/launchpack-storage/media/img/default/img_person.png',
          bg: 'https://s3.ap-northeast-2.amazonaws.com/launchpack-storage/media/img/default/img_dummy.png',
        }
      }
    },
    // 소셜 로그인 여부
    isSocialLogin() {
      let username = this.$store.getters.user.username;
      if (!username) return undefined;
      if (username.indexOf('naver$') > -1 ||
        username.indexOf('kakao$') > -1 ||
        username.indexOf('facebook$') > -1
      ) {
        return true;
      }
      return false;
    },
    // 공지사항 팝업 노출 여부
    showNoticePopup() {
      let today = dayjs().format('YY-DD-MM');
      let hideDate = this.$store.getters.hidePopup;
      let exposure = this.$store.getters.exposuredPopup;
      // 오늘 숨김 했을 경우 or 이미 노출된 경우
      if (today === hideDate || exposure) {
        return false;
      }
      // 숨김 날짜 설정하지 않았거나, 이미 지난 날짜일 경우 or 이미 노출된 겨우
      else if (hideDate === undefined || today !== hideDate || !exposure) {
        return true;
      }
      return false;
    },
    logo() {
      return this.$store.getters.brand.logo;
    },
    isPcMode() {
      let browserType = this.$store.getters.browserType;
      let device = this.$store.getters.device;

      if (browserType === 'pc' && device === 'mobile') {
        return true;
      } else return false;
    },
    pcModeStyle() {
      return {
        minHeight: '100vh',
        maxWidth: '416px',
        margin: '0px auto',
        paddingLeft: '0px',
        paddingRight: '0px',
        overflow: 'hidden'
      }
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
