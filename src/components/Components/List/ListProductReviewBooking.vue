<template>
<div>
  <div class="flex-align" style="gap: 0 8px" :style="pagePadding">
    <div class="size-18 weight-500 p-main">후기</div>
    <div class="flex-align" style="gap: 0 6px">
      <i class="material-icons-round" style="color: #f8d053; font-size: 16px">star</i>
      <div class="size-18 bold p-main">{{ rate }}</div>
    </div>
  </div>
  <!-- <div class="flex-center">
    <rating :rateSize="42" :value="rate" rateColor="#F8D053" defaultColor="#DDDDDD"
     :roundShape="true" :useBorder="false"></rating>
    
    <span class="star-rating">
      <span :style="ratingStyle"></span>
    </span>
    
  </div>
  <div class="size-18 text-center">{{ rate }}<span class="p-sub3"> / 5</span></div>
  <div>
    <div class="size-14 p-sub" style="padding:12px 0">전체 후기 {{ totalCount }}개</div>
  </div> -->
  <list-horizontal v-if="list && list.length > 0" style="margin-top: 16px"
    :wrapCustomStyle="wrapCustom">
    <div slot="card">
      <div class="flex" style="overflow-x: auto">
        <card-review-booking v-for="(item,idx) in list" :card="item" :key="item.id"
          :style="cardStyle(idx)" @delete="onDelete(idx)"></card-review-booking>
      </div>
      <div class="flex-justify" style="margin-top: 24px">
        <div class="unselect show-more-btn p-border-sub size-14 p-sub2"
          @click="showAll">더보기</div>
      </div>
    </div>
  </list-horizontal>
  <div v-if="list&&list.length===0" class="empty-view text-center p-sub2" style="margin-top: 16px">후기가 없습니다.</div>
  <div class="overlay-modal">
    <sweet-modal ref="allReviewOverlay"
      :enableMobileFullscreen="false">
      <all-review-overlay @closePage="closePage"></all-review-overlay>
    </sweet-modal>
    
  </div>
</div>
</template>
<script>
import CardReviewBooking from "@/components/Components/Card/CardReviewBooking.vue"
import AllReviewOverlay from "@/components/Components/Pages/AllReviewOverlay/AllReviewOverlay.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'ListProductReviewBooking',
  components: {
    CardReviewBooking,
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

  },
  data() {
    return {
      "list": undefined,
      "rate": 0,
      "intRate": 0,
      "showReviewOverlay": false
    }
  },
  created() {
    this.pageLoadType = 'infinite';
    this.getRate();
    this.getData();
  },
  mounted() {

  },
  
  methods: {
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
      if(!this.isProd) {
       this.url = `public/partner/${this.$route.query.id}/review?page_num=1&page_length=10`; 
      } else {
        let product_id = this.$route.query.id;
        this.url = `public/product/${product_id}/review?secret=true&page_num=1&page_length=8`;
        if(this.isLogin)
          this.url = `user/${this.user.user_id}/product/${product_id}/review?secret=true&page_num=1&page_length=10`;
      }
      this.currentPage = 1;
      this.$axios.get(this.url).then(res => {
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.$emit('totalCount', this.totalCount);
        console.log(this.totalCount)
        this.currentPage = 2;
        this.list = res.data.data;
      })
    },
    showAll() {
      // this.$root.$emit('page_overlay', 'AllReviewOverlay')
      this.$refs.allReviewOverlay.open();
    },
    cardStyle(idx) {
      let deco = {
        marginRight: '12px'
      }
      if (idx === 0) {
        deco.marginLeft = '16px';
      } else if (idx === this.list.length - 1) {
        deco.marginRight = '16px';
      }
      return deco;
    }
  },
  computed: {
    wrapCustom() {
      let deco = {
        height: 'auto',
        width: '100%'
      }
      return deco;
    },
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
    '$store.getters.reviewId'() {
      this.$refs.allReviewOverlay.open();
    }
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

.empty-view {
  padding: 40px 0;
  font-size: 14px;
}

.show-more-btn {
  width: calc(100% - 32px);
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

