import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });
Vue.use(Vuex);


export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
      reducer: state => (
        {
          signupData: state.signupData,
          user: state.user,
          currentPosition: state.currentPosition,
          recentSearch: state.recentSearch,
          recentPostSearch: state.recentPostSearch,
          recentMapSearch: state.recentMapSearch,
          loginTeam: state.loginTeam,
          hidePopup: state.hidePopup,
          exposuredPopup: state.exposuredPopup,
          cart: state.cart,
          selectedResv: state.selectedResv,
          signupType: state.signupType,
          defaultPartner: state.defaultPartner,
          shareModalOrder: state.shareModalOrder,
          verifyInfo: state.verifyInfo,
          recentlyViewProducts: state.recentlyViewProducts,
          defaultAddress: state.defaultAddress,
          reason: state.reason,
          payPriceMerchantId: state.payPriceMerchantId,
          productId: state.productId
        }
      )
    })
  ],
  state: {
    payPriceMerchantId: '',
    reason: {},
    alivePage: [],
    brand: undefined,
    defaultAddress: undefined,
    grade: undefined,               // 등급 스타일
    commonStyle: {
      /*  예시  */
      /* borderRadius: '6px',
      blockMarginBottom: '8px',
      blockMarginBottomPc: '8px',
      dummyImage: {
        bg: 'https://s3.ap-northeast-2.amazonaws.com/launchpack-dessertplace/media/img_dummy.png'
      },
      filter: {
        radio: 'full'   // 'default', 'full'
      } */
    },
    commonFilter: {},               // 필터 ID
    user: { user_id: 0, name: '' },
    signupData: {},
    partner: {
      session:''
    },
    defaultPartner: {},
    selectedDelivery: {},
    recentlyViewProducts: [],
    service: undefined,
    pcMode: true,
    social_key: undefined,
    device: 'mobile',
    browserType: 'mobile',
    deviceWidth: 416,
    distance: {},
    filtered: [],
    sorted: {},
    previousPath: '',              // 로그인 후 돌아갈 페이지
    searchPreviousPath: '',        // 검색 페이지 진입 이전 경로
    
    currentPosition: undefined,
    currentAddress: undefined,

    team: undefined,                // 팀(선택된 팀 정보 저장)
    loginTeam: '',                  // 로그인된 팀 도메인
    teamMyInfo: undefined,          // 팀 내 내 정보
    recentSearch: [],
    recentPostSearch: [],
    recentMapSearch: [],

    dragEnd: false,        // 드래그 끝 (cf.가로형리스트)

    fullImage: [],         // full-image src 배열

    hidePopup: undefined,          // 팝업 숨길 날짜
    exposuredPopup: false,     // 팝업 노출여부 (이미 노출되었으면 숨기기 위함)

    loadingSpinner: false,
    
    category: undefined,
    cart: [],     // 장바구니 cart와 order와 같은 order_product임
    order: [],    // 주문
    shippingInfo: undefined,
    shippingInvoice: '',
    signupType: undefined,
    shareModalOrder: 0,
    reservation: undefined,
    selectedResv: undefined,
    headerHeight: 0,
    verifyInfo: undefined,
    popstate: [],
    modalData: undefined,
    lastTab: undefined,
    essentialOption: [],
    additionalOption: [],
    filterToggle: false,
    showAddrBar: true,
    productId: undefined,
    dropdownUid: undefined
  },
  actions: {
    async setDBCart(context, vm) {
      if(vm.isLogin) {
        const res = await vm.$axios.get(`user/${vm.user.user_id}/cart`);
        let cart = context.state.cart
        res.data.cart.forEach(order_product=>{
          let order_product_option = order_product.order_product_option;
          let index = cart.findIndex(item => [item.product_id].concat(item.order_product_option.filter(i => i.option_type === 0).map(i => i.option_id).sort((a,b) => a - b)).toString() === [order_product.product_id].concat(order_product.order_product_option.filter(i => i.option_type === 0).map(i => i.option_id).sort((a,b) => a - b)).toString());
            
          if (index > -1) {
            let item = cart[index];

            if (order_product_option.length !== 0) {
              order_product_option.forEach(option => {
                let idx = item.order_product_option.findIndex(item => item.option_id === option.option_id);

                if (idx === -1) {
                  cart[index].order_product_option.push(option);
                  
                }
              })
            }
          } else {
            cart.push(order_product);
          }
        });
      }
    },
    async syncCart(context, vm) {
      if(vm.isLogin) {
        try {
          const res = await vm.$axios.get(`user/${vm.user.user_id}/cart`);
          let cart = context.state.cart;
          res.data.cart.forEach(order_product=>{
            let order_product_option = order_product.order_product_option;
            let index = cart.findIndex(item => [item.product_id].concat(item.order_product_option.filter(i => i.option_type === 0).map(i => i.option_id).sort((a,b) => a - b)).toString() === [order_product.product_id].concat(order_product.order_product_option.filter(i => i.option_type === 0).map(i => i.option_id).sort((a,b) => a - b)).toString());
            
            if (index > -1) {
              let item = cart[index];

              if (order_product_option.length !== 0) {
                order_product_option.forEach(option => {
                  let idx = item.order_product_option.findIndex(item => item.option_id === option.option_id);

                  if (idx === -1) {
                    cart[index].order_product_option.push(option);
                    
                  }
                })
              }
            } else {
              cart.push(order_product);
            }
          });

          await vm.$axios.post(`user/${vm.user.user_id}/cart`, context.state.cart);
        } catch {}
      }
    },
    async syncPostCart(context, vm) {
      if(vm.isLogin) {
        try {
          await vm.$axios.post(`user/${vm.user.user_id}/cart`, context.state.cart);
        } catch {}
      }
    }
  },
  mutations: {
    setReason(state, value) {
      state.reason = value;
    },
    setShareModalOrder(state, value) {
      state.shareModalOrder = value;
    },
    setDefaultAddress(state, value) {
      state.defaultAddress = value;
    },
    setAlivePage(state, value) {
      state.alivePage = value.map(item=>{ return 'Page'+item });
    },
    setSelectedDelivery(state, value) {
      state.selectedDelivery = value;
    },
    setBrand(state, value) {
      state.brand = value;
    },
    setDistance(state, value) {
      state.distance = value;
    },
    setDefaultPartner(state, value) {
      state.defaultPartner = value;
    },
    setGrade(state, value) {
      state.grade = value;
    },
    setCommonStyle(state, value) {
      state.commonStyle = value;
    },
    setUserPartner(state, value) {
      state.partner_id = value.partner_id;
      state.partner_grade_id = value.partner_grade_id;
    },
    setUsername(state, value) {
      state.user.username = value;
    },
    setUser(state, value) {
      state.user = value;

      if(state.user.profile === '' || !state.user.profile)
        state.user.profile = 'https://s3.ap-northeast-2.amazonaws.com/launchpack-storage/media/img/default/img_person.png';

      if(value.partner_id && value.partner_id > 0) {
        state.partner = {
          token: value.token,
          id: value.partner_id,
          email: value.email,
          name: value.email,
          partner_id: value.partner_id,
          phone: value.phone,
          profile: value.profile,
          user_id: value.user_id,
          username: value.username
        };
        state.mode = 'partner';
      }

      if(window.Android)
        window.Android.sendMessage(state.user.username, state.user.token, state.user.user_id);

      let params = JSON.stringify({
        username: state.user.username,
        token: state.user.token,
        user_id: state.user.user_id,
      });
      if(window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(params, '*');
      }
    },
    setSignupData(state, value) {
      state.signupData = value;
    },
    setUserParam (state, value) {
      state.user.param = value;
    },
    setUserGrade (state, value) {
      state.user.grade = value;
    },
    logout(state) {
      state.user = { user_id:0, name: '' };
    },
    setPreviousPath(state, value) {
      state.previousPath = value;
    },
    setSearchPreviousPath(state, value) {
      state.searchPreviousPath = value;
    },
    setServiceInfo(state, value) {
      state.service = value;
    },
    setRecentlyViewProducts(state, value) {
      state.recentlyViewProducts = value;
    },
    setPcMode(state, value) {
      state.pcMode = value;
    },
    setSocialKey(state, value) {
      state.social_key = value;
    },
    setDevice(state, value) {
      state.device = value;
    },
    setBrowserType(state, value) {
      state.browserType = value;
    },
    setDeviceWidth(state, value) {
      state.deviceWidth = value;
    },
    clearFilter(state) {
      state.filtered = [];
    },
    setFilter(state, value) {
      let result = [];
      value.forEach(item => {
        let enable = true;
        let type = item.elType;

        // 텍스트
        if(type === 'c-input-text') {
          if(item.set[0].value === '') {
            enable = false;
          }
        }
        // 체크박스 그룹
        else if(type === 'c-input-checkboxGroup' || type === 'c-input-checkbox-full-group') {
          if(item.selectedValue === '') {
            enable = false;
          }
        }
        else if(type === 'c-input-cascadingDropdown' || item.elType === "c-input-regionModal") {
          if(item.selectedValue==='') {
            enable = false;
          }
        }

        //라디오버튼 그룹
        else if(type === 'c-input-radiobuttonGroup' || type === "c-input-radio-full-buttonGroup") {
          let value = item.options.filter(opt=>{ return opt.id === item.set[0].value });
          if(value.length === 0) {
            enable = false;
          }
        }

        else if(item.elType === 'c-input-rangeDual') {
          // 최대, 최소 값인 경우 추가 안함
          let min = Number(item.set[0].value);
          let max = Number(item.set[1].value);
          if(min === Number(item.min) &&
            max === Number(item.max)) {
            enable = false;
          }
        }
        
        else if(item.elType === 'c-input-numberRange') {
          let min = item.min;
          let max = item.max;
          if (Number(item.value[0]) === Number(min) &&
            Number(item.value[1]) === Number(max)) {
              enable = false;
            }
        }
        
        // date-spin
        else if (item.elType === 'c-input-date-spin') {
          if (item.set[0].value === '') {
            enable = false;
          }
        }
        
        // color-filter
        else if (item.elType === 'c-input-colorFilter') {
          if (item.value.length === 0) {
            enable = false;
          }
        }
        
        // date-spin-range
        else if (item.elType === 'c-input-dateSpinRange') {
          if (item.set[0].value === '' && item.set[1].value === '') {
            enable = false;
          }
        }

        if(enable) {
          result.push(item);
        }
      });
      state.filtered = result;
    },
    setSorted(state, value) {
      state.sorted = value;
    },
    setCurrentPosition(state, value) {
      state.currentPosition = value;
    },
    setCurrentAddress(state, value) {
      state.currentAddress = value;
    },
    setLastTab(state, value) {
      state.lastTab = value;
    },
    setTeam(state, value) {
      state.team = value;
    },
    addRecentSearch(state, value) {
      let index = state.recentSearch.findIndex(item => item.keyword === value.keyword);
      if (index > -1) {
        state.recentSearch.remove(index);
      }
      state.recentSearch.splice(0, 0, value);
      state.recentSearch = state.recentSearch.slice(0, 30);
    },
    removeRecentSearchItem(state, value) {
      let index = state.recentSearch.findIndex(item => item.keyword === value.keyword);
      if (index > -1) {
        state.recentSearch.remove(index);
      }
    },
    addRecentPostSearch(state, value) {
      let index = state.recentPostSearch.findIndex(item => item.keyword === value.keyword);
      if (index > -1) {
        state.recentPostSearch.remove(index);
      }
      state.recentPostSearch.splice(0, 0, value);
      state.recentPostSearch = state.recentPostSearch.slice(0, 30);
    },
    removeRecentPostSearchItem(state, value) {
      let index = state.recentPostSearch.findIndex(item => item.keyword === value.keyword);
      if (index > -1) {
        state.recentPostSearch.remove(index);
      }
    },
    addRecentMapSearch(state, value) {
      let index = state.recentMapSearch.findIndex((item)=>{ return item.keyword === value.keyword });
      if(index>-1) {
        state.recentMapSearch.remove(index);
      }
      state.recentMapSearch.splice(0,0,value);
      state.recentMapSearch = state.recentMapSearch.slice(0, 50);
    },
    removeRecentMapSearch(state, value) {
      let index = state.recentMapSearch.findIndex((item)=>{ return item.keyword === value });
      if(index>-1) {
        state.recentMapSearch.remove(index);
      }
    },
    clearRecentMapSearch(state) {
      state.recentMapSearch = [];
    },
    setTeamMyInfo(state, value) {
      state.teamMyInfo = value;
    },
    setLoginTeam(state, value) {
      state.loginTeam = value;
    },
    setDragEnd(state, value) {
      state.dragEnd = value;
    },
    setCommonFilter(state, value) {
      state.commonFilter = value;
    },
    setFullImage(state, value) {
      state.fullImage = value;
    },
    setHidePopup(state, value) {
      state.hidePopup = value;
    },
    setExposuredPopup(state, value) {
      state.exposuredPopup = value;
    },
    setLoadingSpinner(state, value) {
      state.loadingSpinner = value;
    },
    setReservation(state, value) {
      state.reservation = value;
    },
    setSelectedResv(state, value) {
      state.selectedResv = value;
    },
    setCategory(state, value) {
      state.category = value;
    },
    setFiltertoggle(state, value) {
      state.filterToggle = value;
    },
    setCart(state, value) {
      state.cart = value;
    },
    setOrder(state, value) {
      state.order = value;
    },
    removeCart(state, op) {
      let removedIdx = state.cart.findIndex(ct => {
        return ct.uid===op.uid;
      })
      state.cart.remove(removedIdx);
    },
    removeCartMultiple(state, op) {
      op[0].forEach(item => {
        for(let i=0;i<state.cart.length;i++) {
          if(item.uid===state.cart[i].uid) state.cart.remove(i)
        }
      })
    },
    setConcatCart(state, value) {
     if(state.cart) {
        let arr = [];
        arr.push(...value);
        state.cart = arr.concat(state.cart);
      }
      else {
        state.cart = value;
      }
    },
    setShippingInfo(state, value) {
      state.shippingInfo = value;
    },
    setShippingInvoice(state, value) {
      state.shippingInvoice = value;
    },
    setSignupType(state, value) {
      state.signupType = value;
    },
    setHeaderHeight(state, value) {
      state.headerHeight = value;
    },
    setVerifyInfo(state, value) {
      state.verifyInfo = value;
    },
    setModalData(state, value) {
      let key = Object.keys(value)[0];
      if(state.modalData === undefined) {
        state.modalData = {};
      } else {
        delete state.modalData[key];
        if(Object.keys(state.modalData).length === 0) {
          state.modalData = undefined;
          state.modalData = {};
        }
      }
      state.modalData[key] = value[key];
    },
    setPopstate(state, value) {
      if(state.popstate === undefined) {
        state.popstate = [value];
      }
      state.popstate.unshift(value);
    },
    removePopstate(state) {
      if(state.popstate.length>0) {
        state.popstate.shift();
      }
    },
    setEssentialOption(state, value) {
      state.essentialOption = value;
    },
    setAdditionalOption(state, value) {
      state.additionalOption = value;
    },
    setShowAddrBar(state, value) {
      state.showAddrBar = value;
    },
    setPayPriceMerchantId(state, value) {
      state.payPriceMerchantId = value;
    },
    setProductId(state, value) {
      state.productId = value;
    },
    setDropdownUid(state, value) {
      state.dropdownUid = value;
    }
  },
  getters: {
    reason: state => {
      return state.reason;
    },
    alivePage: state => {
      return state.alivePage;
    },
    brand: state => {
      return state.brand;
    },
    defaultAddress: state => {
      return state.defaultAddress;
    },
    grade: state => {
      return state.grade;
    },
    favicon: state => {
      if(state.brand)
        return state.brand.favicon;
    },
    defaultPartner: state => {
      return state.defaultPartner;
    },
    commonStyle: state => {
      return state.commonStyle;
    },
    user: state => {
      return state.user;
    },
    signupData: state => {
      return state.signupData;
    },
    previousPath: state => {
      return state.previousPath;
    },
    searchPreviousPath: state => {
      return state.searchPreviousPath;
    },
    pcMode: state => {
      return state.pcMode;
    },
    recentlyViewProducts: state => {
      return state.recentlyViewProducts;
    },
    selectedDelivery: state => {
      return state.selectedDelivery;
    },
    service: state => {
      return state.service;
    },
    social_key: state => {
      return state.social_key;
    },
    device: state => {
      return state.device;
    },
    browserType: state => {
      return state.browserType;
    },
    deviceWidth: state => {
      return state.deviceWidth;
    },
    filtered: state => {
      return state.filtered;
    },
    sorted: state => {
      return state.sorted;
    },
    distance: state => {
      return state.distance;
    },
    currentPosition: state => {
      return state.currentPosition;
    },
    currentAddress: state => {
      return state.currentAddress;
    },
    team: state => {
      return state.team;
    },
    recentSearch: state => {
      return state.recentSearch;
    },
    recentPostSearch: state => {
      return state.recentPostSearch;
    },
    teamMyInfo: state => {
      return state.teamMyInfo;
    },
    loginTeam: state => {
      return state.loginTeam;
    },
    dragEnd: state => {
      return state.dragEnd;
    },
    commonFilter: state => {
      return state.commonFilter;
    },
    fullImage: state => {
      return state.fullImage;
    },
    hidePopup: state => {
      return state.hidePopup;
    },
    exposuredPopup: state => {
      return state.exposuredPopup;
    },
    loadingSpinner: state => {
      return state.loadingSpinner;
    },
    category: state => {
      return state.category;
    },
    filterToggle: state => {
      return state.filterToggle;
    },
    cart: state => {
      return state.cart;
    },
    order: state => {
      return state.order;
    },
    shippingInfo: state => {
      return state.shippingInfo;
    },
    shippingInvoice: state => {
      return state.shippingInvoice;
    },
    signupType: state => {
      return state.signupType;
    },
    shareModalOrder: state => {
      return state.shareModalOrder;
    },
    reservation: state => {
      return state.reservation;
    },
    selectedResv: state => {
      return state.selectedResv;
    },
    headerHeight: state => {
      return state.headerHeight;
    },
    verifyInfo: state => {
      return state.verifyInfo;
    },
    modalData: state => {
      return state.modalData;
    },
    recentMapSearch: state => {
      return state.recentMapSearch;
    },
    popstate: state => {
      return state.popstate;
    },
    lastTab: state => {
      return state.lastTab;
    },
    essentialOption: state => {
      return state.essentialOption;
    },
    additionalOption: state => {
      return state.additionalOption;
    },
    showAddrBar: state => {
      return state.showAddrBar;
    },
    payPriceMerchantId: state => {
      return state.payPriceMerchantId;
    },
    productId: state => {
      return state.productId;
    },
    dropdownUid: state => {
      return state.dropdownUid;
    }
  }
})
