<template>
<div class="p-border-top-sub" style="padding:16px 0">
    <!-- 상품 정보 -->
    <div class="flex-align full-width unselect" @click="clickCard">
      <e-image :isBg="true" :isLazy="false"
        :img="card.img ? card.img : dummyImage.bg" :useThumb="true"
        :width="56" :useRatio="true" :imgRadius="8"
        :imageRates="{ratio:'1:1'}" />
      
      <div style="padding-left:12px;flex:1">
        <div class="size-12 p-sub">{{ card.product_info.partner.name }}</div>
        <div class="size-14 weight-500 p-main">{{ card.product }}</div>
        <div class="size-12 p-sub">{{ card.product_info.simple_desc }}</div>
      </div>
    </div>
    
    <!-- 별점, 작성일, 수정,삭제 버튼 -->
    <div class="flex-between" style="margin:12px 0 4px 0">
      <div class="flex-align">
        <rating :rateSize="14" :value="rate" rateColor="#F8D053" 
        :roundShape="true"></rating>
        <div class="size-12 p-sub2" style="margin-left:12px">{{ dateFormat(card.created_time, 'ago') }}</div>
      </div>
      <div class="flex-align" style="gap: 0 12px">
        <div class="unselect flex-center btn size-14 radius-6 p-border-main p-sub" @click="clickEdit">수정</div>
        <div class="unselect flex-center btn size-14 radius-6 p-border-main p-sub" @click="clickDelete">삭제</div>
      </div>
    </div>
    
    <!-- 작성 내용 -->
    <!-- 이미지 -->
    <div style="margin:16px 0" v-if="card.imgs.length>0">
      <list-horizontal :cardHeight="80">
        <template v-slot:card>
          <div v-for="(img, idx) in card.imgs" :key="'img-'+idx"
            style="display:inline-block;margin-right:4px" @click="clickImg">
            <e-image :isBg="true" :isLazy="false"
              :img="img" :useThumb="true" :width="80" :useRatio="true" :imgRadius="8":imageRates="{ratio:'1:1'}"/>
          </div>
        </template>
      </list-horizontal>
    </div>
    <div class="size-14 weight-500 p-main">{{ card.title }}</div>
    <div class="size-14 p-sub" style="margin-top:2px;line-height:22px">{{ card.content }}</div>
    <!-- 답변 -->
    <div v-if="card.comment_author" class="box-comment radius-8 p-bg-sub2">
      <div class="size-14 weight-500 p-main">답글</div>
      <div class="size-14 p-sub">{{ card.comment }}</div>
      <div class="size-12 p-sub2" style="margin-top:2px">{{ card.comment_author }}<span style="margin:0 8px">|</span>{{ dateFormat(card.comment_date, 'ago') }}</div>
    </div>
    
    <!--<portal to="usable-list-modal">
      <block-review-image-overlay-pc v-if="vImageOverlay" :prop="{card:card}"></block-review-image-overlay-pc>
    </portal>-->
    
    <div class="overlay-modal">
      <sweet-modal ref="allReviewOverlay"
        :enableMobileFullscreen="false">
        <all-review-overlay @closePage="closePage"></all-review-overlay>
      </sweet-modal>
    </div>
    
  </div>
</template>
<script>
import BlockReviewImageOverlayPc from "@/components/Components/Block/BlockReviewImageOverlayPc/BlockReviewImageOverlayPc.vue"
import AllReviewOverlay from "@/components/Components/Pages/AllReviewOverlay/AllReviewOverlay.vue"
import CardMixin from "@/components/Components/Mixins/CardMixin"

export default {
  name: 'CardReviewListPc',
  components: {
    BlockReviewImageOverlayPc,
    AllReviewOverlay
  },
  mixins: [
    CardMixin
  ],
  props: {
    card: {
      type: Object,
    },

  },
  data() {
    return {
      "vImageOverlay": false
    }
  },
  created() {
      
  },
  
  methods: {
    clickEdit() {
      this.routerPush(`review_reg?product_id=${this.card.product_id}&review_id=${this.card.id}`);
    },
    clickDelete() {
      this.$emit('delete');
    },
    clickCard() {
      this.routerPush('product_detail?id=' + this.card.product_id);
    },
    clickImg() {
      this.vImageOverlay = true;
      this.$root.$emit('page_overlay', 'ReviewImageOverlay', {prop: {card: this.card}});
    },
    closePage() {
      this.$store.commit('setReviewId', undefined);
      this.$refs.allReviewOverlay.close();
      this.toBody();
    },
    toBody() {
      setTimeout(()=>{
        let body = document.getElementsByTagName('body')[0];
        if(body === undefined)
          this.toBody();
        else {
          body.removeAttribute('style')
        }
      },50);
    }
  },
  computed: {
    rate() {
      return this.card.rate ? parseInt(this.card.rate) : 0;
    }
  },
  watch: {
    '$store.getters.reviewId'(n) {
      if (n !== undefined) {
        this.$refs.allReviewOverlay.open();
      }
    }
  }
}
</script>
<style scoped>
.btn {
  width: 66px;
  height: 40px;
}
  
.box-comment {
  margin-top:16px;
  padding:16px;
}

.overlay-modal .sweet-modal {
  overflow: hidden;
  height: 100vh;
  max-width: 414px;
  width: 100%;
  overflow-y: hidden;
}

.overlay-modal .sweet-modal.is-alert .sweet-content {
  padding: 0 !important;
  height: 100vh;
}
</style>

