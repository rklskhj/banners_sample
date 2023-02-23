<template>
  <div id="app" :style="appStyle">
    <router-view v-if="vRouter && vHeadDone" />
    <toast/>
    <popup v-if="vRouter"/>
    <loading-spinner v-if="vLoading"/>
  </div>
</template>

<script>
  import Toast from "@/components/Components/Common/Toast.vue";
  import Vue from 'vue'
  import VueGtag from 'vue-gtag'
  import router from './router/index'
  import AuthMixin from "./components/Mixins/AuthMixin";
  import LoadingSpinner from "./components/Components/Common/LoadingSpinner.vue";
  import Popup from "./components/Components/Common/Popup.vue";
  import io from 'socket.io-client';

  export default {
    components: {
      Popup,
      LoadingSpinner,
      Toast
    },
    name: 'App',
    mixins: [
      AuthMixin
    ],
    head: {
      link: function () {
        return [
          {
            rel: 'icon',
            href: this.favicon,
            type: 'image/x-icon'
          }
        ];
      },
      meta: function () {
        return [
          { name: 'viewport', content: this.viewportContent }
        ]
      }
    },
    created() {
      // 공식 홈페이지에서 모바일 미리보기로 창 열린 경우에 대한 예외처리
      /*if (window.name === 'previewPopup') {
        if (!window.opener || window.opener === null) {
          window.opener = window.open('', 'preview_parent')
        } else {
          window.opener = window.opener;
        }
      }*/
      this.serviceInit();
      this.setAuthHeader();

      // 토큰 유효한지 체크
      this.validAuth();

      this.sendToNativeApp();
      this.setSocketIO();
    },
    data() {
      return {
        vLoading: false,
        vHeadDone: false,
        backendUrl: 'http://localhost:8000/',
        vRouter: false,
        appStyle: {
          minHeight: '100vh',
          maxWidth: '100%',
          margin: 0,
          paddingLeft: 0,
          paddingRight: 0,
          overflow: 'hidden'
        },
        overlayLink: '',
        viewportContent: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      }
    },
    watch: {
      '$route'(n, o) {
        if (n.path === '/map_search') {
          this.refreshNaverMap();
        }
        if(o.path !== '/') {
          this.validAuth();
        }
      },
      '$store.getters.loadingSpinner'(n) {
        this.vLoading = n;
      }
    },
    methods: {
      async demoLogin() {
        if(this.$route.query.demo_test === this.$store.getters.service.service_key) {
          let res = await this.$axios.post('auth/user/login', {
            username: 'test@test.com',
            password: 'lp1234'
          });
          this.setUserData(res.data);
          this.setAuthHeader();
        } else {
          //토큰 유효한지 체크
          this.validAuth();
        }
      },
      setSocketIO() {
        this.socket = io.connect('https://master-dev.launchpack.co.kr:3000');
        setTimeout(()=> {
          this.socket.on('message',(msg) => {
            if(msg.service_key && msg.code_build) {
              let service_key = msg.service_key.replace('launchpack-', '')
              if(msg.code_build==='COMPLETED' && service_key===this.$store.getters.service.service_key) {
                location.reload();
              }
            }
          });
        },500);
      },
      naverRedirect() {
        if (location.pathname.indexOf('/naver/')>-1) {
          let access_token = location.hash.replace('#access_token=', '').split('&')[0];
          location.replace(`${this.backendUrl}auth/user/signin/naver?access_token=${access_token}`);
        }
      },
      serviceInit() {
        //this.backendUrl = process.env.VUE_APP_BACKEND_URL;
        this.backendUrl = backend_url;
        this.$axios.defaults.baseURL = this.backendUrl;

        // ie cache 방지
        this.$axios.defaults.headers['Pragma'] = 'no-cache';

        // 네이버 로그인 후 진입한 경우 리다이렉트
        this.naverRedirect();

        // 메타 뷰포트 vue-head 설정
        this.setMetaViewport();

        // 브랜드 디자인 가져오기
        this.getBrand();

        // 서비스 정보 가져오기
        this.getServiceInfo();

        // PC Mode 여부 가져오기
        this.getServicePcMode();

        // API Key 가져오기
        this.getAPIKey();

        //기본 공통 스타일 지정
        this.setCommonStyle();
      },

      setMetaViewport() {
        if (navigator.userAgent.match(/Android/i)) {
          this.viewportContent = 'width=device-width,initial-scale=1.0';
        }
        else {
          this.viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        this.$emit('updateHead');
      },

      validAuth() {
        if(this.$store.getters.user.user_id>0) {
          let user = this.$store.getters.user;
          if(!user.refresh_token) {
            this.$axios.get(`user/${this.$store.getters.user.user_id}`,{
              cancelToken: null
            }).then(res => {
              this.setUserData(res.data);
            }).catch(err => {
              if(err.response.status === 401) {
                this.$store.commit('logout');
              }
            });
          } else {
            this.refresh_token();
          }
        }
      },
      refresh_token() {
        if(this.$store.getters.user.user_id>0) {
          this.$axios.post('auth/user/refresh_token',{
            token: this.$store.getters.user.refresh_token
          }, {
            cancelToken: null
          }).then(res => {
            this.user.token = res.data.token;
            this.setUserData(this.user);
            this.setAuthHeader();
          }).catch(err => {
            if(err.response.status === 500) {
              this.$store.commit('logout');
            }
          });
        }
      },

      getServicePcMode() {
        this.$axios.get('public/service/pc_mode', {
          cancelToken: null
        }).then(res => {
          // 공식 홈페이지 모바일 미리보기로 열린 경우, pcMode false로 설정
          if (window.name === 'previewPopup') {
            this.$store.commit('setPcMode', false);
          } else {
            // 경로에 overlay 포함 된 경우 pc mode
            if(this.$route.path.indexOf('_overlay')>-1) {
              this.$store.commit('setPcMode', true);
            }
            else {
              this.$store.commit('setPcMode', res.data.pc_mode);
            }
          }
          // 디바이스 너비 설정
          this.setDevice();
          // 디바이스 리사이즈 처리
          this.$nextTick(() => {
            window.addEventListener('resize', () => {
              this.setDevice();
            });
          })
        });
      },

      getServiceInfo() {
        this.$axios.get('public/service/info', {
          cancelToken: null
        }).then(res => {
          this.$store.commit('setServiceInfo', res.data);
          this.$emit('updateHead');
          setTimeout(() => {
            this.demoLogin();
          }, 300)
        });
      },

      getAPIKey() {
        this.$axios.get('public/service/social_key', {
          cancelToken: null
        }).then(res => {
          let keys = undefined;
          if(res.data.result) {
            let result = res.data.result.split('_!_');
            let token = new fernet.Token({secret: new fernet.Secret(result[1]), token:result[0], ttl:0});
            keys = JSON.parse(token.decode());
          } else {
            keys = res.data.social_key;
          }
          this.$store.commit('setSocialKey', keys);
          // 구글애널리틱스
          let ga = this.$store.getters.social_key.google.ga;
          if (ga) {
            let ids = ga.split(',');
            let gaSetting = {
              config: {id: ids[0]},
              pageTrackerTemplate(to) {
                return {
                  page_path: to.fullPath,
                  page_location: location.origin + to.fullPath
                }
              }
            };
            if (ids.length > 1) {
              gaSetting.includes = ids.slice(1).map(id=>{
                return {
                  id: id
                }
              });
            }
            Vue.use(VueGtag, gaSetting, router);
            // GA에 config 값 반영
            setTimeout(() => {
              let head = document.getElementsByTagName('head')[0];
              let el = document.createElement('script');
              el.setAttribute('type', 'text/javascript');
              el.text = `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());`
              ids.forEach(id => {
                el.text += `gtag('config', '${id}');\n`
              })
              head.appendChild(el);
            }, 1000)
          }

          // 페이플
          const payple = this.$store.getters.social_key.payple;
          if(payple) {
            if(payple.cst_id === 'test') {
              this.addHeadJs('https://democpay.payple.kr/js/cpay.payple.1.0.1.js');
            } else {
              this.addHeadJs('https://cpay.payple.kr/js/cpay.payple.1.0.1.js');
            }
          }

          // 네이버지도
          const naverMap = this.$store.getters.social_key.naver.map.client_id;
          this.addHeadJs(`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMap}&submodules=geocoder`);
          setTimeout(()=>{
            this.addHeadJs('/static/marker_clustering.js');
            this.vHeadDone = true;
          },1000);


          /*if(this.$store.getters.social_key.naver.enable.map) {
            let naverMap = this.$store.getters.social_key.naver.map.client_id;
            this.addHeadJs(`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMap}&submodules=geocoder`);
            setTimeout(()=>{
              this.addHeadJs('/static/marker_clustering.js');
              this.vHeadDone = true;
            },1000);

          } else {
            this.vHeadDone = true;
          }*/
        });
      },

      refreshNaverMap() {
        let naverMap = this.$store.getters.social_key.naver.map.client_id;
        if(naverMap === '') {
          let head = document.getElementsByTagName('head')[0];
          for(let c of head.children) {
            if(c.src && c.src.indexOf('openapi.map.naver')>-1) { head.removeChild(c)}
          }
          this.addHeadJs(`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMap}&submodules=geocoder`);
        }
      },

      addHeadJs(src) {
        let head = document.getElementsByTagName('head')[0];
        let el = document.createElement('script');
        el.setAttribute('type', 'text/javascript');
        el.setAttribute('src', src);
        head.appendChild(el);
      },
      addHeadFavicon() {
        let head = document.getElementsByTagName('head')[0];
        let el = document.createElement('link');
        el.setAttribute('rel', 'icon')
        el.setAttribute('href', this.favicon);
        el.setAttribute('type', 'image/x-icon');
        head.appendChild(el);
      },

      setDevice() {
        // 서비스 PC모드 (서비스 PC device 지원 여부)
        let pc_enable = this.$store.getters.pcMode;
        //console.log('setDevice', navigator.userAgent)

        // 화면 너비
        // 모바일
        if (navigator.userAgent.match(/Android/i)
          || navigator.userAgent.match(/webOS/i)
          || navigator.userAgent.match(/iPhone/i)
          || navigator.userAgent.match(/iPod/i)
          || navigator.userAgent.match(/iPad/i)
          || navigator.userAgent.match(/BlackBerry/i)
          || navigator.userAgent.match(/Windows Phone/i)
        ) {
          //console.log('mobile')
          this.$store.commit('setDevice', 'mobile');
          this.$store.commit('setBrowserType', 'mobile');
          this.$store.commit('setDeviceWidth', window.innerWidth);
          //console.log(this.$store.getters.device)
        }
        // PC
        else {
          //console.log('pc')
          // 공식 홈페이지에서 모바일 미리보기로 열린 경우, device 모바일로 설정
          if (window.name === 'previewPopup') {
            this.$store.commit('setBrowserType', 'mobile');
            this.$store.commit('setDevice', 'mobile');
            this.$store.commit('setDeviceWidth', window.innerWidth);
          } else {
            this.$store.commit('setBrowserType', 'pc');
            // PC모드 지원 서비스
            if (pc_enable) {
              this.$store.commit('setDevice', 'pc');
              this.$store.commit('setDeviceWidth', screen.width);
            }
            // PC모드 지원하지 않는 서비스 (only 모바일)
            else {
              this.$store.commit('setDevice', 'mobile');
              this.$store.commit('setDeviceWidth', 416);

              this.appStyle.maxWidth = '416px';
              this.appStyle.margin = '0 auto';
              this.appStyle.borderLeft = '1px solid #eeeeee';
              this.appStyle.borderRight = '1px solid #eeeeee';
            }
            //console.log(this.$store.getters.device)
          }

        }
      },
      getBrand() {
        this.$axios.get('public/ui/brand/admin', {
          cancelToken: null
        }).then(res => {
          let font = '';
          ['num','alpha'].forEach(key=>{
            if(res.data['font_'+key] && res.data['font_'+key] !== '') {
              if(font!=='') font += ',';
              font += res.data['font_'+key];
            }
          });
          if(font!=='') font += ',';
          font += res.data.font;
          document.getElementsByTagName('html')[0].style.fontFamily = font;

          this.getCommonCss();

          this.$store.commit('setBrand', res.data);

          this.$axios.get('public/service/grade', {
            cancelToken: null
          }).then(res => {
            this.$store.commit('setGrade', res.data);

          });

          this.vRouter = true;
          this.favicon = this.$store.getters.brand.favicon || '';
          this.addHeadFavicon();
          this.$emit('updateHead');
        });
      },
      getCommonCss() {
        this.$axios.get('public/ui/common_css', {
          cancelToken: null
        }).then(res => {
          let head = document.getElementsByTagName('head')[0];
          let el = document.createElement('style');
          el.textContent = res.data.result;
          head.appendChild(el);
        });
      },
      setCommonStyle() {
        this.$store.commit('setCommonStyle', {
          borderRadius: '12px',
          blockMarginBottom: '8px',
          blockMarginBottomPc: '8px'
        });
      },
      sendToNativeApp() {
        if(this.$store.getters.user.user_id > 0) {
          if(window.Android) {
            window.Android.sendMessage(this.$store.getters.user.username, this.$store.getters.user.token, this.$store.getters.user.user_id);
          }

          let params = JSON.stringify({
            username: this.$store.getters.user.username,
            token: this.$store.getters.user.token,
            user_id: this.$store.getters.user.user_id,
          });
          if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(params, '*');
          }
        }
      }
    }
  }
</script>

<style>


  /* ***
    img lazy loading
    *** */

  /* img tag */
  img[lazy='loading'] {
  }
  img[lazy='error'] {
  }
  img[lazy='loaded'] {
    animation-name: imgloaded;
    animation-duration: 1s;
    animation-timing-function: ease-out;
  }
  /* background-image */
  .lazy-background-image[lazy='loading'] {
  }
  .lazy-background-image[lazy='error'] {
  }
  .lazy-background-image[lazy='loaded'] {
    animation-name: imgloaded;
    animation-duration: 1s;
    animation-timing-function: ease-out;
  }
  .lazy-background-image-cover[lazy='loaded'] {
    animation-name: imgloaded;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .lazy-background-image-contain[lazy='loaded'] {
    animation-name: imgloaded;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  /* animation */
  @keyframes imgloaded {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  * {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
</style>
