<template>
<div class="position-relative scroller" style="overflow-y: auto;overflow-x: hidden;height:100vh">
    <e-image :img="partner.imgs.length>0 ? partner.imgs[0] : partner.img" :imageRates="{ratio: '4:3'}" :width="432"></e-image>
    <div class="card-detail">
      <div @click="clickImg">
        <e-image :img="partner.img" :width="80" :imageRates="{ratio: '1:1'}"
                 class="card-img"></e-image>
      </div>
      <div class="partner-name">{{ partner.name }}</div>

      <div class="flex-center size-14 weight-700 margin-bottom-4">
        <i class="material-icons-outlined"
           style="font-size:14px;margin-right:4px;color:#F8D053;">star</i>

        <div :style="brandColor.main"
        >{{ partner.rate }}</div>

        <div style="margin:0 8px" :style="brandColor.sub2">·</div>

        <div :style="brandColor.main"><span class="weight-400">리뷰 </span> {{ partner.reviews_count | currencyNum }}</div>
      </div>

      <div class="grid-box text-center" :style="brandColor.sub" style="margin-top:20px">
        <div class="col-3 flex unselect" :style="`border-right:${brandBorder.sub.border}`">
          <a :href="`tel:${partner.phone}`" :style="brandColor.sub" style="width:100%;height:100%">
            <i class="material-icons-outlined">call</i>
            <div>전화</div>
          </a>
          <div :style="`height:100%;border-right${brandBorder.sub.border}`"></div>
        </div>
        <div class="col-3 unselect" :style="`border-right:${brandBorder.sub.border}`">
          <icon-btn-like likeType="partner" :id="partner.id" active-color="highlight"></icon-btn-like>
          <div style="margin-top:5px">찜</div>
        </div>
        <div class="col-3 unselect" :style="`border-right:${brandBorder.sub.border}`" @click="clickShare">
          <i class="material-icons-outlined">share</i>
          <div>공유</div>
        </div>
        <div class="col-3 flex">
          <a :href="`partner_detail?id=${partner.id}`" target="_blank"  style="width:100%;height:100%"
             :style="brandColor.sub" class="unselect">
            <i class="material-icons-outlined">info</i>
            <div>상세보기</div>
          </a>
        </div>
      </div>
    </div>
    <div style="padding-top:160px;" v-if="list && list.length>0">
      <div class="flex-between" :style="[pagePadding, brandColor.sub]" style="margin-bottom:16px">
        <div>전체 상품 {{ list.length }}개</div>
      </div>
      <list-vertical style="padding-bottom: 100px" :style="pagePadding">
        <template v-slot:card>
          <div v-for="(card,idx) in list" :key="'card-product-'+idx"
               style="margin-bottom:16px">
            <h12-t-card-product :idx="idx" :card="card"
              :cardProps="cardProps"></h12-t-card-product>
          </div>
        </template>
      </list-vertical>
    </div>
    <share ref="share" :shareData="partner"></share>
    <portal to="usable-list-modal" :disabled="!vImg">
      <transition name="fade">
        <div class="overlay-img" v-if="vImg" @click="closeImg">
          <div class="overlay-img-wrapper unselect">
            <img :src="partner.img">
            <i class="material-icons">close</i>
          </div>
        </div>
      </transition>
    </portal>
  </div>
</template>
<script>
import h12TCardProduct from "@/components/Components/Card/h12/CardProduct.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockPartnerSearchMapDetail',
  components: {
    h12TCardProduct
  },
  mixins: [
    ListMixin
  ],
  props: {
    partner: {
      type: Object,
    },

  },
  data() {
    return {
      "list": undefined,
      "vImg": false,
      "cardProps": {
        "type": "product",
        "visible": {
          "partner": {
            "name": false,
            "address": false,
            "simple_desc": false
          },
          "product": {
            "cart": false,
            "like": true,
            "name": true,
            "rate": true,
            "tags": false,
            "price": {
              "price": true,
              "org_price": false,
              "discount_price": true
            },
            "coupon": false,
            "review": true,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "1:1"
        }
      }
    }
  },
  created() {
      this.partner.link = `${location.origin}/partner_detail?id=${this.partner.id}`;
      this.getData();
    },
  mounted() {
      window.addEventListener('popstate', this.popState);
    },
  beforeDestroy() {
      window.removeEventListener('popstate', this.popState);
    },
  
  methods: {
    popState() {
        this.vImg = false;
      },
    closeImg() {
        this.$router.back();
      },
    getData() {
        // let fields = 'id,name,img,has_download_coupon,,simple_desc,rate,reviews_count,price';
        this.url = `user/${this.user.user_id}/mapping/product?partner_id=${this.partner.id}`;

        this.$axios.get(this.url, {
          cancelToken: null
        }).then(res => {
          this.totalPages = res.data.total_page;
          this.totalCount = res.data.count;
          this.currentPage = 2;
          this.list = res.data.data;
          document.getElementsByClassName('scroller')[0].scrollTo(0,0);
        });
      },
    clickShare() {
        this.$refs.share.share = true;
      },
    clickImg() {
        this.vImg = true;
        history.pushState('partnerImg','');
      }
  },
  computed: {
    
  },
  watch: {
    partner() {
        this.getData();
      }
  }
}
</script>
<style scoped>
.card-detail {
    position: absolute;
    top: 240px;
    width: calc(100% - 32px);
    background: white;
    left: 16px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
    padding: 20px;
  }
  .card-img {
    width: 80px;
    height: 80px;
    min-height: 80px;
    overflow: hidden;
    border-radius: 100%;
    border: 3px solid rgb(255, 255, 255);
    position: absolute;
    top: -40px;
    left: calc(50% - 40px);
  }
  .partner-name {
    margin-top: 36px;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
  }
  .overlay-img {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background-color: rgba(0,0,0,0.7);
  }
  .overlay-img-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .overlay-img-wrapper img {
    max-height: 70vh;
  }
  .overlay-img-wrapper i {
    color: white;
    position: absolute;
    top: 0;
    right: -32px;

  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .scroller::-webkit-scrollbar {
    width: 6px;
  }
  .scroller::-webkit-scrollbar-track {
    background-color: transparent;
  }
  .scroller::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #dddddd;
  }
  .scroller::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
</style>

