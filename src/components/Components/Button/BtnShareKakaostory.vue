<template>
<div>
  <btn v-if="buttonStyle==='bar'"
      id="kakaostory-share"
      :backgroundColor="{backgroundColor: 'rgb(251, 227, 0)'}"
      @clicked="clickShare">
    <div class="btn-txt">카카오스토리</div>
  </btn>
  <div id="kakaostory-share" v-else @click="clickShare" class="unselect">
    <div class="flex-justify">
      <img class="img-circle" :class="mc('icon-style', 'icon-style-m')" src="/static/image/icon/ic_circle_kakaostory.svg">
    </div>
    <div class="size-14 text-center" :style="brandColor.sub2"
      style="margin-top:8px">카카오스토리</div>
  </div>
</div>
</template>

<script>
  export default {
    name: "BtnShareKakaostory",

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

    mounted() {
      this.$nextTick(() => {
        // 카카오스토리
        Kakao.Story.createShareButton({
          container: '#kakaostory-share',
          url: this.shareData.link,
          text: this.shareData.name + '\n\n'
        });
      });
    },

    methods: {
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
    color rgb(59,30,30)
    font-size 14.25px
  .icon-style
    width 60px
    height 60px
  .icon-style-m
    width 52px
    height 52px
</style>

<style lang="stylus">
  #kakaostory-share img
    display none !important
  #kakaostory-share img.img-circle
    display block !important
  #kakaostory-share
    position relative
  #kakaostory-share a
    position absolute
    width 100%
    height 100%
    top 0
    left 0

</style>
