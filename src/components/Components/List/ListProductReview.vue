<template>
<div>
  <div class="flex-between" style="margin-bottom:16px">
    <div class="size-16 weight-500">구매후기</div>
    <div v-if="order_conversion_type === 1"
        :style="brandColor.primary" class="size-14" @click="clickReg">후기작성</div>
  </div>
  <div class="flex-center">
    <rating :value="rate"
      :rateSize="42" :isNew="true"
      :roundShape="true"
      :useBorder="false"
      rateColor="#F8D053"
      defaultColor="#DDDDDD"></rating>
    
    <!--<span class="star-rating">-->
    <!--  <span :style="ratingStyle"></span>-->
    <!--</span>-->
    
  </div>
  <div class="size-18 text-center">{{ rate }}<span class="p-sub3"> / 5</span></div>
  <div v-if="list && list.length > 0">
    <div class="size-14 p-sub" style="padding:12px 0">전체 후기 {{ totalCount }}개</div>
  </div>
  <template v-if="list && list.length > 0">
    <list-vertical>
      <card-review slot="card" v-for="(item,idx) in list" :card="item" :key="item.id"
                  @delete="onDelete(idx)"></card-review>
    </list-vertical>
    <div v-if="totalCount > 3" class="flex-justify" style="margin-top: 24px">
      <div class="unselect show-more-btn p-border-sub size-14 p-sub2"
        @click="showAll">더보기</div>
    </div>
  </template>
  <div v-if="list&&list.length===0" class="empty-view p-sub2 size-14">후기가 없습니다.</div>
  <div class="overlay-modal">
    <sweet-modal ref="allReviewOverlay"
      :enableMobileFullscreen="false">
      <all-review-overlay @closePage="closePage"></all-review-overlay>
    </sweet-modal>
    
  </div>        
</div>
</template>
<script>
import CardReview from "@/components/Components/Card/CardReview.vue"
import AllReviewOverlay from "@/components/Components/Pages/AllReviewOverlay/AllReviewOverlay.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'ListProductReview',
  components: {
    CardReview,
    AllReviewOverlay
  },
  mixins: [
    ListMixin
  ],
  props: {
    isProd: {
      type: Boolean,
      default: true,
    },
    order_conversion_type: {
      type: Number,
    },

  },
  data() {
    return {
      "list": undefined,
      "rate": 0,
      "intRate": 0
    }
  },
  created() {
    this.getRate();
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    showAll() {
      this.$refs.allReviewOverlay.open();
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
    },
    clickReg() {
      if (this.isLogin) {
      this.routerPush(`review_reg?product_id=${this.$route.query.id}`)
      } else {
        this.toast('로그인 후 후기 작성이 가능합니다.');
        this.routerPush('/signin');
      }
    },
    onDelete(idx) {
      let res = confirm('상품평을 삭제하시면 재작성이 불가능합니다. 삭제하시겠습니까?');
      if(res) {
        this.$axios.delete(`user/${this.user.user_id}/product/${this.list[idx].product_id}/review/${this.list[idx].id}`).then(res=>{
          this.list.remove(idx);
        });
      }
    },
    getRate() {
      let id = this.$route.query.id;
      let key = 'product';
      if(this.$route.path.indexOf('partner_detail')>-1) {
        key = 'partner';
      }
      
      this.$axios.get(`user/0/mapping/${key}/${id}?fields=rate`).then(res=>{
        this.rate = res.data.rate;
        this.intRate = parseInt(this.rate);
      });
    },
    getData() {
      let url = '';
      if(!this.isProd) {
        url = `public/partner/${this.$route.query.id}/review?page_num=1&page_length=3`; 
      } else {
        let product_id = this.$route.query.id;
        url = `public/product/${product_id}/review?secret=true&page_num=1&page_length=3`;
        if(this.isLogin)
          url = `user/${this.user.user_id}/product/${product_id}/review?secret=true&page_num=1&page_length=3`;
      }
      this.currentPage = 1;
      this.$axios.get(url).then(res => {
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.$emit('totalCount', this.totalCount);
        this.list = res.data.data;
      })
    }
  },
  computed: {
    ratingStyle() {
      let deco = {}
      let splitedNum = [];
      if (this.rate) {
        splitedNum = String(this.rate).split('.');
        if (splitedNum.length !== 1) {
          deco.width = Number(splitedNum[0] * 20) + Number(String(parseFloat('0.' + splitedNum[1])).split('.')[1] * 2) + '%';
        } else {
          deco.width = Number(splitedNum[0] * 20) + '%'
        }
      } else {
        deco.width = '0%'
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.star-rating {
  width:240px;
}

.star-rating,.star-rating span {
  display:inline-block;
  height:38px;
  overflow:hidden;
  background:url('https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/15831993.png') no-repeat;
} 

.star-rating span {
  background-position:left bottom;
  line-height:0;
  vertical-align:top;
}

.show-more-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
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

