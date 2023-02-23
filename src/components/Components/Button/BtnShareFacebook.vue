<template>
<div>
  <btn v-if="buttonStyle==='bar'"
      :color="brandColor.white"
      :backgroundColor="{backgroundColor: 'rgb(46, 69, 135)'}"
      @clicked="clickShare">
    <div class="btn-txt">페이스북</div>
  </btn>

  <div v-else @click="clickShare" class="unselect">
    <div class="flex-justify">
      <img :class="mc('icon-style', 'icon-style-m')" src="/static/image/icon/ic_circle_facebook.svg">
    </div>
    <div class="size-14 text-center" :style="brandColor.sub2"
      style="margin-top:8px">페이스북</div>
  </div>
</div>
</template>

<script>
  export default {
    name: "BtnShareFacebook",

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

    created() {
      window.fbAsyncInit = () => {
        FB.init({
          appId: this.$store.getters.social_key.facebook.client_id,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v3.1'
        });
      };

      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/ko_KR/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },

    methods: {
      clickShare() {
        FB.ui({
          method: 'share',
          mobile_iframe: true,
          href: this.shareData.link,
        }, function () {});
        if(this.shareData.isProduct)
          this.$axios.post(`public/product/${this.$route.query.id}/share`);
        if(this.shareData.isPartner)
          this.$axios.post(`public/partner/${this.$route.query.id}/share`);
        if(this.shareData.isPost)
          this.$axios.post(`public/board/0/post/${this.$route.query.id}/share`);
        this.$emit('onShare');
      }
    },
    computed: {
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
  }
</script>

<style lang="stylus" scoped>
  .btn-txt
    color rgb(255, 255, 255)
    font-size 14.25px
.icon-style
  width 60px
  height 60px
.icon-style-m
  width 52px
  height 52px
</style>
