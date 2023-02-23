<template>
<div :style="pageBg" class="position-relative" v-if="detail">
  <div class="flex-between" :style="pagePadding" style="padding-top:24px;padding-bottom:12px">
    <div class="size-18 weight-500 p-main">{{ detail.title }}</div>
    <icon-btn-share :size="18" icon="share" @share="$refs.share.share=true"></icon-btn-share>
  </div>
  <block-exhibition-editor-area v-if="detail.info !== null && detail.info !== ''"
    :detail="detail"></block-exhibition-editor-area>
  <block-exhibition-category-area v-if="detail.category_type && detail.category && detail.category.length > 0"
    :detail="detail" @category="setCategory"></block-exhibition-category-area>
    
  <div :style="pagePadding" style="margin:25px 0">
    <list-vertical>
      <div slot="card-grid" class="full-width">
        <transition-group name="fade" tag="div" class="full-width flex wrap">
          <v1-t-card-product v-for="(item, idx) in list"
                           :style="cardStyle(idx)"
                           :key="'card-prod-'+idx"
                           :idx="idx"
                           :cardProps="cardProps"
                           :card="item"></v1-t-card-product>
        </transition-group>
        <div v-if="list && list.length===0" key="empty-view"
             class="empty-view p-sub">상품 목록이 없습니다.</div>
      </div>
    </list-vertical>
  </div>

  <share ref="share" :shareData="detail"></share>  
</div>
</template>
<script>
import BlockExhibitionProductList from "@/components/Components/Block/BlockExhibitionProductList/BlockExhibitionProductList.vue"
import BlockExhibitionEditorArea from "@/components/Components/Block/BlockExhibitionEditorArea/BlockExhibitionEditorArea.vue"
import BlockExhibitionCategoryArea from "@/components/Components/Block/BlockExhibitionCategoryArea/BlockExhibitionCategoryArea.vue"
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockExhibitionDetail',
  components: {
    BlockExhibitionProductList,
    BlockExhibitionEditorArea,
    BlockExhibitionCategoryArea,
    v1TCardProduct
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "detail": undefined,
      "category": 0,
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
          "ratio": "4:3"
        }
      },
      "exhibition": 0
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      let field = 'id,title,desc,category,info,category_type';
      this.$axios.get(`user/${this.$store.getters.user.user_id}/mapping/exhibition/${this.$route.query.id}?fields=${field}&ordering=exhibition_product_priority`).then(res=>{
        this.detail = res.data;
        this.exhibition = this.detail.id ? this.detail.id : 0;
        if(res.data.category.length>0) {
         this.category = res.data.category[0].id; 
        }
        
        this.getExhibitionProduct();
      });
    },
    setCategory(res) {
      this.category = res;
    },
    getExhibitionProduct() {
      let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
      fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
      fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';
      this.url = `user/${this.user.user_id}/mapping/product${fields}&page_num=1&page_length=12`;
      if(this.category !== 0 && this.detail.category_type) {
        this.url += `&exhibition_category=${this.category}`;
      }
      else {
        this.url += `&exhibition=${this.exhibition}`;
      }
      
      if (this.$store.getters.service.package.indexOf('booking') > -1) {
        if (this.$store.getters.selectedResv) {
          this.url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`
          this.url += `&booking=${this.$store.getters.selectedResv.resv_date},${this.$store.getters.selectedResv.resv_end_date}`;
        }
        if (this.$store.getters.bookingMinimum) {
          this.url += `&booking_minimum=${this.$store.getters.bookingMinimum}`;
        }
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
      let obj = {
        width: '100%',
        marginBottom: `16px`
      };

      return obj;
    }
  },
  computed: {
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    '$route'() {
      this.getExhibitionProduct();
    },
    category() {
      this.getExhibitionProduct();
    }
  }
}
</script>


