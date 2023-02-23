<template>
<div>
  <btn v-if="buttonStyle==='bar'"
      id="kakao-link"
      :color="brandColor.white"
      :backgroundColor="{backgroundColor: 'rgb(251, 227, 0)'}"
      @clicked="clickShare">
    <div class="btn-txt">카카오톡</div>
  </btn>
  <div id="kakao-link" v-else @click="clickShare" class="unselect">
    <div class="flex-justify">
      <img :class="mc('icon-style', 'icon-style-m')" src="/static/image/icon/ic_circle_kakao.svg">
    </div>
    <div class="size-14 text-center" :style="brandColor.sub2"
      style="margin-top:8px">카카오톡</div>
  </div>
</div>
</template>

<script>
  export default {
    name: "BtnShareKakao",

    props: {
      shareData: {
        type: Object,
        required: false
      },
      buttonStyle: {
        type: String,
        default: 'circle'
      }
    },

    head: {
      script() {
        return [
          {type: 'text/javascript', src: 'https:////developers.kakao.com/sdk/js/kakao.min.js', head: true}
        ];
      }
    },

    mounted() {
      this.$nextTick(() => {
        // 카카오톡 공유버튼 초기화
        if (!Kakao.isInitialized()) {
          Kakao.init(this.$store.getters.social_key.kakao.javascript_key);
        }

        let btn = [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: this.shareData.link,
              webUrl: this.shareData.link
            }
          }
        ];

        if(this.$store.getters.service.android_status) {
          if(!this.isIOS) {
            btn.push({
              title: '앱으로 보기',
              link: {
                mobileWebUrl: `${location.origin}/share_link?path=${location.pathname.substring(1) + location.search.replace('?','&')}`,
                webUrl: this.shareData.link
              }
            });
          }
        }
        if(this.$store.getters.service.ios_status) {
          if(this.isIOS) {
            let dl = this.$store.getters.social_key.google.dynamic_link + `&link=${encodeURIComponent(location.href)}`;
            btn.push({
              title: '앱으로 보기',
              link: {
                mobileWebUrl: dl,
                webUrl: dl
              }
            });
          }
        }

        // 카카오 링크
        Kakao.Link.createDefaultButton({
          container: '#kakao-link',
          objectType: 'feed',
          content: {
            title: this.shareData.name,
            description: this.shareData.desc,
            imageUrl: this.shareData.img,
            link: {
              mobileWebUrl: this.shareData.link,
              webUrl: this.shareData.link
            }
          },
          buttons: btn
          /*social: {
            likeCount: 286,
            commentCount: 45,
            sharedCount: 845
          },*/

        });

      });
    },

    methods: {
      isIOS() {
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) { // ios13 이전 iPhone, iPad, iPod
          return true;
        } else if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) { // iPad (ios13 버전 이상)
          return true;
        } else {
          return false;
        }
      },
      clickShare() {
        if(this.shareData.isProduct)
          this.$axios.post(`public/product/${this.$route.query.id}/share`);
        if(this.shareData.isPartner)
          this.$axios.post(`public/partner/${this.$route.query.id}/share`);
        if(this.shareData.isPost)
          this.$axios.post(`public/board/0/post/${this.$route.query.id}/share`);
        this.$emit('onShare');
      }
    },
    iconStyle() {
      let deco = {
        width: '60px',
        height: '60px'
      }
      if (this.$store.getters.device !== 'pc') {
        deco.width = '52px';
        deco.height = '52px';
      }
      return deco;
    }
  }
</script>

<style lang="stylus" scoped>
  .btn-txt
    color rgb(59,30,30)
    font-size 14.25px
.icon-style
  width 60px
  height 60px
.icon-style-m
  width 52px
  height 52px
</style>
