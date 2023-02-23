<template>
  <div class="popup">
    <sweet-modal ref="popupModal" overlay-theme="dark" @close="closeModal">
      <div v-if="popup && popup.length===1" :style="[bgCoverStyle(popup[0].url),popupStyle]" @click="clickPopup"></div>
      <div class="full-width" v-if="popup && popup.length>1">
        <image-slider
          :listData="popup" :height="height" :autoplay="true"
          :indicator="true"
          @reRender="$refs.popupModal.open()"></image-slider>
      </div>
      <div class="flex">
        <div class="close-area size-14 unselect"
             :style="brandColor.sub"
             @click="offToday">오늘 그만 보기</div>
        <div class="close-area size-14 unselect"
             :style="brandColor.primary"
             @click="offPopup">닫기</div>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
  import { SweetModal } from 'sweet-modal-vue'

  import ImageSlider from "../List/ImageSlider.vue"
  import BlockMixin from "../../Mixins/BlockMixin";


  export default {
    name: "Popup",
    mixins: [
      BlockMixin
    ],
    components: {
      ImageSlider,
      SweetModal,

    },
    data() {
      return {
        popup: [],
        ratio: 0,
        height: 0,
        usePopup: false,
      }
    },
    created() {
      this.getPopupList();
      this.deviceWidth = this.$store.getters.deviceWidth;
      if (this.$store.getters.device !== 'pc') {
        this.height = 320*4/3;
      } else {
        this.height = 420*4/3;
      }
    },
    methods: {
      getPopupList() {
        this.$axios.get('public/popup').then(res=>{
          this.popup = res.data.data;
          this.ratio = res.data.ratio;
          if (this.$store.getters.brand.plugins.indexOf('popup') !== -1 && this.popup.length !== 0) {
            let today = this.dayjs().format('YY-DD-MM');
            let today2 = this.dayjs().format('YYYY-MM-DD');
            if (today2 < this.popup[0].start_date || today2 > this.popup[0].end_date) {
              this.usePopup = false;
            } else if (this.$store.getters.exposuredPopup !== true) {
              this.usePopup = true;
            } else if (this.$store.getters.exposuredPopup) {
              if(!this.$store.getters.hidePopup || (this.$store.getters.hidePopup !== undefined && this.$store.getters.hidePopup !== today)) {
                this.usePopup = true;
              }
            } else {
              this.usePopup = false;
            }

            if (this.usePopup) {
              this.$refs.popupModal.open();
            }
          }
        })
      },
      clickPopup() {
        let link = this.popup[0].link;
        if(link) {
          if (link.indexOf('http:') > -1 || link.indexOf('https:') > -1) {
            if (link.indexOf(location.origin) > -1) {
              this.routerPush(link.replace(location.origin, ''));
            } else {
              const a = document.createElement("a");
              a.href = link;
              a.setAttribute('target', '_blank');
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              a.parentNode.removeChild(a);
            }
          } else {
            // location.href = link;
            this.routerPush(link);
          }
        }
      },
      offToday() {
        let today = this.dayjs().format('YY-DD-MM');
        this.$store.commit('setHidePopup', today);
        this.$store.commit('setExposuredPopup', true);
        this.$refs.popupModal.close();
      },
      offPopup() {
        this.$store.commit('setExposuredPopup', true);
        this.$refs.popupModal.close();
      },
      closeModal() {
        this.$store.commit('setExposuredPopup', true);
      }
    },
    computed: {
      popupStyle() {
        return {
          height: this.$store.getters.device !== 'pc' ? `${320*4/3}px` : `calc(420px * 4/3)`
        }
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .close-area
    width 50%
    padding 12px
    text-align center
</style>
<style lang="stylus">
  .popup .sweet-modal.is-alert .sweet-content
    padding 0 !important
  .popup .sweet-modal.is-alert
    width 420px !important
  @media screen and (max-width: 600px)
    .popup .sweet-modal.is-alert
      width 320px !important
</style>
