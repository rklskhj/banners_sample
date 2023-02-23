<template>
  <div :style="headerFixedStyle" class="page-header">
    <div class="flex-align position-relative" :style="[headerStyle, pagePadding]">
      <div class="header-left unselect" v-if="!full">
        <slot name="left"></slot>
      </div>
      <div class="page-header-center"
           :class="{'header-center-ie':isIE}"
           :style="centerStyle"
           v-if="!full">
        <slot name="center"></slot>
      </div>
      <div class="header-right" v-if="!full">
        <slot name="right"></slot>
      </div>
      <div class="header-full" v-if="full">
        <slot name="full"></slot>
      </div>
    </div>
    <slot name="gnb"></slot>
  </div>
</template>

<script>
  export default {
    name: "PageHeader",
    props: {
      full: {
        type: Boolean,
        default: false
      },
      styles: {
        type: Object,
        required: false,
        default: function() {
          return {
            container: {
              backgroundColor: '',
              color: '',
            }
          }
        }
      },
      // 기존 .header-center 클래스 에서 커스텀 가능
      centerStyle: {
        type: Object,
        required: false
      },
      topMargin: {
        type: String,
        required: false
      }
    },
    computed: {
      theme() {
        if(this.$store.getters.brand)
          return this.$store.getters.brand.header_type;
        else
          return 'dark';
      },
      headerFixedStyle() {
        let backgroundColor = '';
        if(this.styles.container.backgroundColor) backgroundColor = this.styles.container.backgroundColor;

        let deco = {
          backgroundColor: backgroundColor
        }
        if(this.$store.getters.device === 'mobile') {
          let top = 0;

          if(this.topMargin) top = this.topMargin;
          // 발행 전 미리보기
          /*if(this.$store.getters.builderEditService) {
            top = '50px';
          }*/
          if(this.$route.path !== '/ui/builder') {
            Object.assign(deco, {
              position: 'fixed',
              transform: 'translate3d(0,0,0)',
              top: top,
              width: this.$store.getters.deviceWidth+'px',
              zIndex: 10
            });
          }
        }
        else {
          deco.width = this.maxWidth;
          deco.margin = '0 auto';
        }
        return deco;
      },
      headerStyle() {
        let sub = 0;
        if(this.$store.getters.device === 'mobile' && this.$store.getters.browserType === 'pc')
          sub = 4;

        let deco = {
          width: (this.$store.getters.deviceWidth - sub) + 'px',
          justifyContent: 'space-between',
          zIndex: 10
        };

        // theme
        /*if (this.theme) {
          if (this.theme==='light') {
            // deco.backgroundColor = '#fff';
            // deco.color = this.getColor('Primary Color');
            deco.color = '#000';
          }
          else if (this.theme==='dark') {
            // deco.backgroundColor = this.getColor('Primary Color');
            deco.color = this.brandColor.white.color;
          }

        }*/



        // 헤더 기본 폰트 설정
        deco.fontWeight = 'bold';
        if(this.styles.container.fontWeight) deco.fontWeight = this.styles.container.fontWeight;
        deco.fontSize = '16px';
        if(this.styles.container.fontSize) deco.fontSize = this.styles.container.fontSize;

        // styles 설정
        if(this.styles.container.height) deco.height = this.styles.container.height;

        return deco;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .header
    position fixed
    width 414px
    height 50px
    top 0
    z-index 10

  .page-header
    position relative

  .header-left
  .header-right
    /*min-width 50px*/
    text-align center
    height 50px
    line-height 50px
    display flex
    align-items center
    justify-content center

  .page-header-center
    position absolute
    left 50%
    transform translateX(-50%)
    flex 1
    text-align center
    display flex
    justify-content center

  .header-full
    width 100%
    text-align center

  .page-header-center-ie
    top 28%

  // slot으로 들어온 요소 full로 차도록
  .header-left > .material-icons
  .header-left > i
  .header-left > div
  .header-left > span
  .header-left > img
  .page-header-center > .material-icons
  .page-header-center > i
  .page-header-center > div
  .page-header-center > span
  .page-header-center > img
  .header-right > .material-icons
  .header-right > i
  .header-right > div
  .header-right > span
  .header-right > img
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
  .header-left > .material-icons
  .page-header-center > .material-icons
  .header-right > .material-icons
    line-height 50px

  .header-left > i
  .page-header-center > i
  .header-right > i
    font-size 26px

  .page-header-center > .ellipsis
    display inline-block !important

</style>
