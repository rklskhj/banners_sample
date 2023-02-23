<template>
<portal to="share" :disabled="disabled" :order="order">
  <sweet-modal ref="shareModal" :hide-close-button="true" :enableMobileFullscreen="false"
    overlay-theme="dark" @close="share=false">
    <div class="flex-align" :style="titleStyle">
      <div class="full-width text-center p-modal-title size-18 weight-500">{{ title }}</div>
      <i @click="share=false" class="position-absolute unselect material-icons"
        style="font-size: 24px; right: 24px">close</i>
    </div>
    <div :style="containStyle" class="position-relative">
      <div class="grid-box">
        <template v-if="buttonStyle==='bar'">
          <div class="col-6">
            <div style="padding:6px">
              <btn-share-kakao :shareData="sharedData" @onShare="$refs.shareModal.close()"></btn-share-kakao>
            </div>
          </div>
          <div class="col-6">
            <div style="padding:6px">
              <btn-share-kakaostory :shareData="sharedData" @onShare="$refs.shareModal.close()"></btn-share-kakaostory>
            </div>
          </div>
          <div class="col-6">
            <div style="padding:6px">
              <btn-share-facebook :shareData="sharedData" @onShare="$refs.shareModal.close()"></btn-share-facebook>
            </div>
          </div>
          <div class="col-6">
            <div style="padding:6px">
              <btn-share-line :shareData="sharedData" @onShare="$refs.shareModal.close()"></btn-share-line>
            </div>
          </div>
        </template>
        <template v-else-if="buttonStyle==='circle'">
          <div class="grid-list-wrap full-width" :style="circleGroup">
            <btn-share-kakao v-if="$store.getters.social_key.kakao.javascript_key && $store.getters.social_key.kakao.javascript_key !== ''"
              :shareData="sharedData" @onShare="$refs.shareModal.close()"
              :buttonStyle="buttonStyle"></btn-share-kakao>
            <btn-share-kakaostory v-if="$store.getters.social_key.kakao.javascript_key && $store.getters.social_key.kakao.javascript_key !== ''"
              :shareData="sharedData" @onShare="$refs.shareModal.close()"
              :buttonStyle="buttonStyle"></btn-share-kakaostory>
            <btn-share-band :shareData="sharedData" @onShare="$refs.shareModal.close()"
              :buttonStyle="buttonStyle"></btn-share-band>
            <btn-share-facebook v-if="$store.getters.social_key.facebook.client_id && $store.getters.social_key.facebook.client_id !== ''"
              :shareData="sharedData" @onShare="$refs.shareModal.close()"
              :buttonStyle="buttonStyle"></btn-share-facebook>
          </div>
        </template>
        <div class="col-12" style="margin-top:28px">
          <btn-url-copy :url="sharedData.link" @onShare="$refs.shareModal.close()"></btn-url-copy>
        </div>
      </div>
    </div>
  </sweet-modal>
</portal>
</template>

<script>
  import { SweetModal } from 'sweet-modal-vue';
  import BtnShareKakao from "../Button/BtnShareKakao.vue";
  import BtnShareKakaostory from "../Button/BtnShareKakaostory.vue";
  import BtnShareFacebook from "../Button/BtnShareFacebook.vue";
  import BtnShareLine from "../Button/BtnShareLine.vue";
  import BtnShareBand from "../Button/BtnShareBand.vue";
  import BtnUrlCopy from "../Button/BtnUrlCopy.vue";
  export default {
    name: "Share",
    components: {
      BtnUrlCopy,
      BtnShareLine,
      BtnShareFacebook,
      BtnShareKakaostory,
      BtnShareKakao,
      BtnShareBand,
      SweetModal
    },
    props: {
      buttonStyle: {
        type: String,
        default: 'circle'
      },
      title: {
        type: String,
        default: '공유하기'
      },
      product: {
        type: Object,
        required: false
      },
      shareData: {
        type: Object,
        default: function() {
          return {
            name: '',
            desc: '',
            img: '',
            link: '',
            isProduct: false,
            isPartner: false
          }
        }
      }
    },
    created() {
      if(this.product) {
        let img = this.product.img;
        if(img === undefined && this.product.imgs && this.product.imgs.length>0) {
          img = this.product.imgs[0];
        }
        this.sharedData = {
          name: this.product.name,
          desc: this.product.simple_desc,
          img: img,
          link: location.href,
          isProduct: true
        };
      } else {
        this.sharedData = this.shareData;
        this.sharedData.desc = this.shareData.simple_desc;
        this.sharedData.link = location.href;
        this.sharedData.isPartner = true;
      }
    },
    data() {
      return {
        share: false,
        sharedData: {
          name: '',
          desc: '',
          img: '',
          link: ''
        },
        disabled: true,
        order: undefined
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.order = this.$store.getters.shareModalOrder;
        this.order += 1;
        this.disabled = false;

        for(let el of document.getElementsByClassName('sweet-box-actions')) {
          if(el.offsetHeight>0) {
            el.style.display = 'none'
          }
        }
      })
    },
    computed: {
      containStyle() {
        if(this.$store.getters.device==='pc') {
          return {
            padding: '0 20px 20px 20px'
          }
        }
      },
      circleGroup() {
        if(this.$store.getters.device==='pc') {
          return {
            padding: '0 48px'
          }
        }
      },
      titleStyle() {
        let deco = {
          marginBottom: '40px'
        }
        if (this.$store.getters.device!=='pc') {
          deco.marginBottom = '24px'
        }
        return deco;
      }
    },
    watch: {
      share(n) {
        if(n) {
          this.$refs.shareModal.open();
        } else {
          this.$refs.shareModal.close();
          this.$store.commit('setShareModalOrder', this.order);
        }
      }
    }
  }
</script>

<style scoped>
  .grid-list-wrap {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0 8px;
  }
</style>
