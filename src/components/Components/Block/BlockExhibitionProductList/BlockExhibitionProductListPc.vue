<template>
<div :style="pcMaxWidth" style="margin:25px 0">
  <list-vertical>
    <div slot="card-grid" class="full-width">
      <transition-group name="fade" tag="div" class="full-width flex wrap">
        <v1-t-card-product-pc v-for="(item, idx) in list"
                         :style="cardStyle(idx)"
                         :key="'card-prod-'+idx"
                         :idx="idx"
                         :cardProps="cardProps"
                         :card="item"></v1-t-card-product-pc>
      </transition-group>
      <div v-if="list && list.length===0" key="empty-view"
           class="empty-view p-sub">상품 목록이 없습니다.</div>
    </div>
  </list-vertical>
</div>
</template>
<script>
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockExhibitionProductListPc',
  components: {
    v1TCardProductPc
  },
  mixins: [
    ListMixin
  ],
  props: {
    category: {
      type: Number,
      default: 0,
    },
    exhibition: {
      type: Number,
      default: 0,
    },

  },
  data() {
    return {
      "list": undefined,
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
            "rate": false,
            "tags": false,
            "price": {
              "price": true,
              "org_price": true,
              "discount_price": true
            },
            "coupon": true,
            "review": false,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "4:3"
        }
      },
      "cardColumn": 4
    }
  },
  created() {
      this.getData();
    },
  mounted() {

    },
  
  methods: {
    getData() {
      let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
      fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
      fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';
    
      this.url = `user/${this.user.user_id}/mapping/product${fields}&page_num=1&page_length=12`;
      if(this.category !== 0) {
        this.url += `&exhibition_category=${this.category}`;
      } else {
        this.url += `&exhibition=${this.exhibition}`;
      }
      this.url = this.urlAppendFilter(this.$store.getters.filtered, {}, this.url);

      this.currentPage = 1;

      this.$axios.get(this.url).then(res => {
        this.totalPages = res.data.total_page;
        this.currentPage = 2;
        res.data.data.forEach(item => {
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
        this.list = res.data.data;
      });
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
      let gutters = 24;
      let gutter = gutters * 0.5;
      let width = `${(((this.$store.getters.brand.layout_maxwidth*12/12) - gutters * (this.cardColumn-1)) / this.cardColumn).toFixed(2)}px`;

      let obj = {
        width: width,
        marginBottom: `32px`
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
    exhibition(n) {
      this.getData();
    },
    category(n, o) {
      if (n !== o) {
        this.getData();
      }
    }
  }
}
</script>


