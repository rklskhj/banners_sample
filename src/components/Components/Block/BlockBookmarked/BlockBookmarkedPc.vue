<template>
<div v-if="list && list.length > 0" style="padding:40px 0" :style="pcMaxWidth">
  <div class="flex-between margin-bottom-24">
    <div class="size-22 weight-700 p-main">찜한 상품</div>
    <div v-if="totalCount > 4" class="size-16 weight-500 unselect p-primary"
      @click="routerPush('like')">전체보기</div>
  </div>
  
  <div class="list-grid" v-if="list&&list.length>0">
    <v1-t-card-product-pc :card="item"
          v-for="(item,idx) in list"
          :key="`card-prod-${item.id}-${idx}`"
          :cardProps="cardProps"></v1-t-card-product-pc>
  </div>
    
  <div v-if="list&&list.length===0" class="empty-view size-16 p-sub">
    찜한 상품이 없습니다.</div>
</div>
</template>
<script>
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockBookmarkedPc',
  components: {
    v1TCardProductPc
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "cardProps": {
        "type": "product",
        "visible": {
          "partner": {
            "name": true,
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
            "coupon": true,
            "review": true,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "cardColumn": 4,
      "visibleNum": 4
    }
  },
  created() {
    if (this.isLogin) {
      this.getData();
    }
  },
  mounted() {

  },
  
  methods: {
    getData() {
      let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
      fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
      fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';
      
      let url = `user/${this.user.user_id}/mapping/product${fields}&liked_user=${this.user.user_id}`;
      this.currentPage = 1;
      this.loading = true;
      this.$axios.get(url)
      .then(res => {
        this.list = res.data.data.slice(0, 4);
        this.totalPages = res.data.total_page;      // 전체 페이지 수
        this.totalCount = res.data.count;           // 전체 수
        this.currentPage = 2;                       // 현재 페이지 2로 변경
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    cardStyle(idx) {
      let gutters = 24;
      let gutter = gutters * 0.5;
      let width = `${(((this.$store.getters.brand.layout_maxwidth*12/12) - gutters * (this.cardColumn-1)) / this.cardColumn).toFixed(2)}px`;

      let obj = {
        width: width,
        marginBottom: `${gutters}px`
      };
      if(idx % this.cardColumn === 0 || idx % this.cardColumn === this.cardColumn - 1) {
        if(idx % this.cardColumn === 0) {
          obj.marginLeft = 0;
          obj.marginRight = `${gutter}px`;
        } else {
          obj.marginRight = 0;
          obj.marginLeft = `${gutter}px`;
        }
      } else {
        obj.marginLeft = `${gutter}px`;
        obj.marginRight = obj.marginLeft;
      }

      return obj;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.list-grid {
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 24px;
    grid-row-gap: 32px;
  }
</style>

