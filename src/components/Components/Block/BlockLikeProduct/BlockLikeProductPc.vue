<template>
<div style="padding:32px 0 100px" :style="pcMaxWidth" class="position-relative">
  <div class="flex-between" style="margin-bottom:16px" v-if="list">
    <div class="col-2">전체상품 {{ totalCount  }}개</div>
    <div class="col-10">
      <category-filter @selected="onSelected" class="full-width"></category-filter>
    </div>
  </div>
  <div>
    <list-vertical v-if="list && list.length>0">
      <transition-group name="fade" slot="card" tag="div" class="grid-box" :style="`margin:0 -${$store.getters.brand.layout_gutters/2}px`">
        <div class="col-3" v-for="(item,idx) in list"
          :style="cardStyle(idx)" :key="`card-prod-${item.id}-${idx}`">
          <v1-t-card-product-pc
          @toggleLiked="getData"
          :card="item"
          :cardProps="cardProps"/>
        </div>
      </transition-group>
    </list-vertical>
    
    <div v-if="list&&list.length===0"
      class="empty-view p-sub size-16">찜한 상품이 없습니다.</div>
        
    <pagination-default :pagingData="pagingData" :pageNum="5" :arrowEnd="true"
      @curPaginationNum="(val) => curNum(val)"
      v-if="pagingData"></pagination-default>
  </div>
</div>
</template>
<script>
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"
import CategoryFilter from "@/components/Components/Common/CategoryFilter.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockLikeProductPc',
  components: {
    v1TCardProductPc,
    CategoryFilter,
    PaginationDefault
  },
  mixins: [
    ListMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "category": undefined,
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
      "pagingData": undefined,
      "curPaginationNum": 1
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.url = `user/${this.user.user_id}/mapping/product?liked_user=${this.user.user_id}`
      this.url += `&fields=id,name,img,simple_desc,rate,partner,enable_option,enable_prod,address,tags,soldout,possible_booking_resv,possible_reservation_resv`
      this.url += `,has_download_coupon,like_count,visit,reviews_count,price,discount_time,is_like,params,stock,stock_type&hit=false`
      if(this.category){
        this.url += `&category=${this.category.id}`;
      }
      this.url += `&page_num=${this.curPaginationNum}&page_length=12`;
      this.loading = true;
      this.$axios.get(this.url)
      .then(res => {
        this.list = res.data.data;
        this.list.forEach(item => {
          item.order_product = {
            product_id: item.id,
            name: item.name,
            quantity: 1,
            comm_price: 0,
            point: 0,
            discount_price: 0,
            total_price: 0,
            coupon_price: 0,
            img: item.img,
            delivery_price: item.price.delivery_price,
            order_product_option: [],
            product: this.cloneItem(item),
          }
          
          let comm_price = 0;
          let point_price = 0;
          let discount_price = 0;
          let price = item.price;
          let product_price = price.price;
      
          // 속성 옵션일 경우 상품가격 + 옵션가
          // 0: 비율, 1: 금액
          // 수수료, 포인트, 할인 계산
          if(price.is_point) {
            if(price.point_type===0) point_price = product_price * price.point_rate / 100;
            else point_price = price.point;
          }
          if(this.isDiscount(item)) {
            if(price.discount_type===0) discount_price = product_price * price.discount_rate / 100;
            else discount_price = price.discount_price;
          }
          if(price.is_comm) {
            if(price.comm_type===0) comm_price = product_price * price.comm_rate / 100;
            else comm_price = price.comm_price;
          }
      
          item.order_product.comm_price = comm_price;
          item.order_product.point = point_price;
          item.order_product.discount_price = discount_price;
          item.order_product.product_price = product_price;
          item.order_product.total_price = product_price - discount_price;
        })
        this.totalPages = res.data.total_page;      // 전체 페이지 수
        this.totalCount = res.data.count;           // 전체 수
        this.pagingData = res.data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    isDiscount(item) {
      if (item.price.is_discount) {
        if (item.price.discount_period_type === false) {
          if (item.price.discount_start !== null && item.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < item.price.discount_start || currentDate > item.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else if (item.price.discount_start !== null && item.price.discount_end === null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < item.price.discount_start) {
              return false;
            } else {
              return true;
            }
          } else if (item.price.discount_start === null && item.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate > item.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    cardStyle(idx) {
      let obj = {}
      
      let gutters = this.$store.getters.brand.layout_gutters;
      obj.paddingLeft = `${gutters/2}px`;
      obj.paddingRight = `${gutters/2}px`;
      obj.paddingBottom = `${gutters*3 - 4}px`;
      return obj;
    },
    onSelected(res) {
      this.category = res;
      this.getData();
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getData();
    }
  },
  computed: {
    
  },
  watch: {
    '$route'() {
      this.getData();
    }
  }
}
</script>


