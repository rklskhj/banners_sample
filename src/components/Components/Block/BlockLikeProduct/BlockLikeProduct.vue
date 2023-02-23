<template>
<div style="padding:16px 0 100px" :style="pagePadding">
  <div class="flex-between" style="margin-bottom:16px" v-if="list">
    <div>전체상품 {{ totalCount }}개</div>
    <div class="col-8 flex-end">
      <category-filter @selected="onSelected"></category-filter>
    </div>
  </div>
  <div>
    <list-vertical v-if="list && list.length>0">
      <transition-group name="fade" slot="card" tag="div" class="list-grid">
        <v1-t-card-product
          v-for="(item,idx) in list"
          @toggleLiked="getData"
          :key="`card-prod-${item.id}-${idx}`"
          :card="item"
          :cardProps="cardProps"></v1-t-card-product>
      </transition-group>
    </list-vertical>
    
    <div v-if="list&&list.length===0"
      class="empty-view p-sub size-16">찜한 상품이 없습니다.</div>
  </div>
</div>
</template>
<script>
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"
import CategoryFilter from "@/components/Components/Common/CategoryFilter.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockLikeProduct',
  components: {
    v1TCardProduct,
    CategoryFilter
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
      }
    }
  },
  created() {
    this.pageLoadType = 'infinite';
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.pageLoadType = 'infinite';
      this.url = `user/${this.user.user_id}/mapping/product?liked_user=${this.user.user_id}`
      this.url += `&fields=id,name,img,simple_desc,rate,partner,enable_option,enable_prod,address,tags,soldout,possible_booking_resv,possible_reservation_resv`
      this.url += `,has_download_coupon,like_count,visit,reviews_count,price,discount_time,is_like,params,stock,stock_type&hit=false`
      this.url += '&page_num=1&page_length=10';
      if(this.category){
        this.url += `&category=${this.category.id}`;
      }
      this.currentPage = 1;
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
        this.currentPage = 2;                       // 현재 페이지 2로 변경
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
      obj.paddingBottom = `${gutters + 4}px`;
      
      if(idx%2===0) obj.paddingLeft = 0;
      else if(idx%2===1) obj.paddingRight = 0;
      
      return obj;
    },
    onSelected(res) {
      this.category = res;
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
<style scoped>
.list-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
</style>

