import Vue from 'vue'
import Router from 'vue-router'
import cancelTokenSources from '../utils/helper/axios-cancel-helper'
import axios from 'axios'

Vue.use(Router)

const scrollBehavior = function (to, from, savedPosition) {
    if (from.query.tab !== undefined && to.query.tab !== undefined) {
        return;
    }
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
}

const route = [
    {
        path: '/',
        component: () => import('../components/Pages/Main.vue'),
        children: [
            {
                path: 'category',
                component: () => import('../components/Page/Category.vue'),
            },

            {
                path: 'contact',
                component: () => import('../components/Page/Contact.vue'),
            },

            {
                path: 'my_order',
                component: () => import('../components/Page/MyOrder.vue'),
            },

            {
                path: 'product_detail',
                component: () => import('../components/Page/ProductDetail.vue'),
            },

            {
                path: 'product_search',
                component: () => import('../components/Page/ProductSearch.vue'),
            },

            {
                path: 'signup',
                component: () => import('../components/Page/Signup.vue'),
                children: [{
                    path: ':name',
                    component: () => import('../components/Page/Signup.vue')
                }]
            },

            {
                path: 'search',
                component: () => import('../components/Page/Search.vue'),
            },

            {
                path: 'like',
                component: () => import('../components/Page/Like.vue'),
            },

            {
                path: 'service_guide',
                component: () => import('../components/Page/ServiceGuide.vue'),
            },

            {
                path: 'company',
                component: () => import('../components/Page/Company.vue'),
            },

            {
                path: 'splash',
                component: () => import('../components/Page/Splash.vue'),
            },

            {
                path: 'termsofservice',
                component: () => import('../components/Page/Termsofservice.vue'),
            },

            {
                path: 'privacy',
                component: () => import('../components/Page/Privacy.vue'),
            },

            {
                path: 'password',
                component: () => import('../components/Page/Password.vue'),
            },

            {
                path: 'faq',
                component: () => import('../components/Page/Faq.vue'),
            },

            {
                path: 'mypage',
                component: () => import('../components/Page/Mypage.vue'),
            },

            {
                path: 'profile',
                component: () => import('../components/Page/Profile.vue'),
            },

            {
                path: 'signin',
                component: () => import('../components/Page/Signin.vue'),
                children: [{
                    path: ':name',
                    component: () => import('../components/Page/Signin.vue')
                }]
            },

            {
                path: 'contact_reg',
                component: () => import('../components/Page/ContactReg.vue'),
            },

            {
                path: 'partner_search',
                component: () => import('../components/Page/PartnerSearch.vue'),
            },

            {
                path: 'partner_detail',
                component: () => import('../components/Page/PartnerDetail.vue'),
            },

            {
                path: 'map_search',
                component: () => import('../components/Page/MapSearch.vue'),
            },

            {
                path: 'my_inquiry',
                component: () => import('../components/Page/MyInquiry.vue'),
            },

            {
                path: 'review_reg',
                component: () => import('../components/Page/ReviewReg.vue'),
            },

            {
                path: 'product',
                component: () => import('../components/Page/Product.vue'),
            },

            {
                path: 'my_review',
                component: () => import('../components/Page/MyReview.vue'),
            },

            {
                path: 'event_detail',
                component: () => import('../components/Page/EventDetail.vue'),
            },

            {
                path: 'event',
                component: () => import('../components/Page/Event.vue'),
            },

            {
                path: 'notice_detail',
                component: () => import('../components/Page/NoticeDetail.vue'),
            },

            {
                path: 'home',
                component: () => import('../components/Page/Home.vue'),
            },
            {
                path: 'banners',
                component: () => import('../components/Page/Banners.vue'),
            },

            {
                path: 'inquiry_reg',
                component: () => import('../components/Page/InquiryReg.vue'),
            },

            {
                path: 'partner_inquiry_reg',
                component: () => import('../components/Page/PartnerInquiryReg.vue'),
            },

            {
                path: 'partner_signup',
                component: () => import('../components/Page/PartnerSignup.vue'),
            },

            {
                path: 'call_list',
                component: () => import('../components/Page/CallList.vue'),
            },

            {
                path: 'contact_detail',
                component: () => import('../components/Page/ContactDetail.vue'),
            },

            {
                path: 'exhibition_detail',
                component: () => import('../components/Page/ExhibitionDetail.vue'),
            },

            {
                path: 'notice',
                component: () => import('../components/Page/Notice.vue'),
            },

            {
                path: 'partner_center',
                component: () => import('../components/Page/PartnerCenter.vue'),
            },

            {
                path: 'partner_exhibition_detail',
                component: () => import('../components/Page/PartnerExhibitionDetail.vue'),
            },

            {
                path: 'wrong_grade',
                component: () => import('../components/Pages/WrongGrade.vue')
            },
            {
                path: 'wrong_partner_grade',
                component: () => import('../components/Pages/WrongPartnerGrade.vue')
            },
            {
                path: '*',
                component: () => import('../components/Pages/PageNotFound.vue')
            }
        ]
    }
];;
const route_pc = [
    {
        path: '/',
        component: () => import('../components/Pages/MainPC.vue'),
        children: [
            {
                path: 'category',
                component: () => import('../components/PagePc/Category.vue'),
            },

            {
                path: 'contact',
                component: () => import('../components/PagePc/Contact.vue'),
            },

            {
                path: 'my_order',
                component: () => import('../components/PagePc/MyOrder.vue'),
            },

            {
                path: 'product_detail',
                component: () => import('../components/PagePc/ProductDetail.vue'),
            },

            {
                path: 'product_search',
                component: () => import('../components/PagePc/ProductSearch.vue'),
            },

            {
                path: 'signup',
                component: () => import('../components/PagePc/Signup.vue'),
                children: [{
                    path: ':name',
                    component: () => import('../components/PagePc/Signup.vue')
                }]
            },

            {
                path: 'search',
                component: () => import('../components/PagePc/Search.vue'),
            },

            {
                path: 'like',
                component: () => import('../components/PagePc/Like.vue'),
            },

            {
                path: 'service_guide',
                component: () => import('../components/PagePc/ServiceGuide.vue'),
            },

            {
                path: 'company',
                component: () => import('../components/PagePc/Company.vue'),
            },

            {
                path: 'splash',
                component: () => import('../components/PagePc/Splash.vue'),
            },

            {
                path: 'termsofservice',
                component: () => import('../components/PagePc/Termsofservice.vue'),
            },

            {
                path: 'privacy',
                component: () => import('../components/PagePc/Privacy.vue'),
            },

            {
                path: 'password',
                component: () => import('../components/PagePc/Password.vue'),
            },

            {
                path: 'faq',
                component: () => import('../components/PagePc/Faq.vue'),
            },

            {
                path: 'mypage',
                component: () => import('../components/PagePc/Mypage.vue'),
            },

            {
                path: 'profile',
                component: () => import('../components/PagePc/Profile.vue'),
            },

            {
                path: 'signin',
                component: () => import('../components/PagePc/Signin.vue'),
                children: [{
                    path: ':name',
                    component: () => import('../components/PagePc/Signin.vue')
                }]
            },

            {
                path: 'contact_reg',
                component: () => import('../components/PagePc/ContactReg.vue'),
            },

            {
                path: 'partner_search',
                component: () => import('../components/PagePc/PartnerSearch.vue'),
            },

            {
                path: 'partner_detail',
                component: () => import('../components/PagePc/PartnerDetail.vue'),
            },

            {
                path: 'map_search',
                component: () => import('../components/PagePc/MapSearch.vue'),
            },

            {
                path: 'my_inquiry',
                component: () => import('../components/PagePc/MyInquiry.vue'),
            },

            {
                path: 'review_reg',
                component: () => import('../components/PagePc/ReviewReg.vue'),
            },

            {
                path: 'product',
                component: () => import('../components/PagePc/Product.vue'),
            },

            {
                path: 'my_review',
                component: () => import('../components/PagePc/MyReview.vue'),
            },

            {
                path: 'event_detail',
                component: () => import('../components/PagePc/EventDetail.vue'),
            },

            {
                path: 'event',
                component: () => import('../components/PagePc/Event.vue'),
            },

            {
                path: 'notice_detail',
                component: () => import('../components/PagePc/NoticeDetail.vue'),
            },

            {
                path: 'home',
                component: () => import('../components/PagePc/Home.vue'),
            },
            {
                path: 'banners',
                component: () => import('../components/PagePc/Banners.vue'),
            },

            {
                path: 'inquiry_reg',
                component: () => import('../components/PagePc/InquiryReg.vue'),
            },

            {
                path: 'partner_inquiry_reg',
                component: () => import('../components/PagePc/PartnerInquiryReg.vue'),
            },

            {
                path: 'partner_signup',
                component: () => import('../components/PagePc/PartnerSignup.vue'),
            },

            {
                path: 'call_list',
                component: () => import('../components/PagePc/CallList.vue'),
            },

            {
                path: 'contact_detail',
                component: () => import('../components/PagePc/ContactDetail.vue'),
            },

            {
                path: 'exhibition_detail',
                component: () => import('../components/PagePc/ExhibitionDetail.vue'),
            },

            {
                path: 'notice',
                component: () => import('../components/PagePc/Notice.vue'),
            },

            {
                path: 'partner_center',
                component: () => import('../components/PagePc/PartnerCenter.vue'),
            },

            {
                path: 'partner_exhibition_detail',
                component: () => import('../components/PagePc/PartnerExhibitionDetail.vue'),
            },

            {
                path: 'wrong_grade',
                component: () => import('../components/Pages/WrongGrade.vue')
            },
            {
                path: 'wrong_partner_grade',
                component: () => import('../components/Pages/WrongPartnerGrade.vue')
            },
            {
                path: '*',
                component: () => import('../components/Pages/PageNotFound.vue')
            }
        ]
    }
];;

let routes = isPC ? route_pc : route;

// 모바일인 경우 routes 변경
let isMobile = false;
if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
) {
    routes = route;
    isMobile = true;
} else {
    // 공식 홈페이지 모바일 미리보기로 열린 경우에 mobile routes 사용
    if (window.name === 'previewPopup') {
        routes = route;
        isMobile = true;
    }
}

const index = new Router({
    mode: 'history',
    //base: process.env.BASE_URL,
    base: '/',
    scrollBehavior,
    routes: routes
})

index.afterEach((to) => {
    for (const [cancelToken, cancel] of cancelTokenSources) {
        cancel(cancelToken);
    }
    let auth = Vue.prototype.$axios.defaults.headers.common['Authorization'];
    Vue.prototype.$axios = axios;
    Vue.prototype.$axios.defaults.headers.common['Authorization'] = auth;
    if ((to.path === '' || to.path === '/') && to.params.id === undefined) {
        if (isMobile) {
            index.replace(`/${import.meta.env.VITE_APP_SPLASH_PAGE}`);
        } else {
            index.replace(`/${import.meta.env.VITE_APP_START_PAGE}`);
        }
    }
})

index.beforeEach((to, from, next) => {
    window.previousPath = from.path;
    if (from.meta.clickPush) {
        to.meta.isRefresh = true;
        from.meta.clickPush = false;
    } else {
        to.meta.isRefresh = false;
    }
    next()
})

export default index
