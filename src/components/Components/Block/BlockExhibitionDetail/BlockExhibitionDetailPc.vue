<template>
<div :style="pcMaxWidth" v-if="detail">
  <div class="flex-between" style="padding-top:56px;padding-bottom:24px">
    <div class="size-24 weight-500 p-main">{{ detail.title }}</div>
    <icon-btn-share :size="26" icon="share" @share="$refs.share.share=true"></icon-btn-share>
  </div>
  <block-exhibition-editor-area-pc v-if="detail.info !== null && detail.info !== ''"
    :detail="detail"></block-exhibition-editor-area-pc>
  <block-exhibition-category-area-pc v-if="detail.category_type && detail.category && detail.category.length > 0"
    :detail="detail" @category="setCategory"></block-exhibition-category-area-pc>

  <div :style="pcMaxWidth" style="margin:25px 0">
    <list-vertical>
      <div slot="card-grid" class="full-width">
        <transition-group name="fade" tag="div" class="full-width flex wrap">
          <v1-t-card-product-pc v-for="(item, idx) in list"
                           :style="cardStyle(idx)"
                           :key="'card-prod-'+idx"
                           :cardProps="cardProps"
                           :card="item"></v1-t-card-product-pc>
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
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"
import BlockExhibitionProductListPc from "@/components/Components/Block/BlockExhibitionProductList/BlockExhibitionProductListPc.vue"
import BlockExhibitionEditorAreaPc from "@/components/Components/Block/BlockExhibitionEditorArea/BlockExhibitionEditorAreaPc.vue"
import BlockExhibitionCategoryAreaPc from "@/components/Components/Block/BlockExhibitionCategoryArea/BlockExhibitionCategoryAreaPc.vue"
import ExhibitionListCustomMixin from "@/components/Components/Mixin/ExhibitionListCustomMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockExhibitionDetailPc',
  components: {
    v1TCardProductPc,
    BlockExhibitionProductListPc,
    BlockExhibitionEditorAreaPc,
    BlockExhibitionCategoryAreaPc
  },
  mixins: [
    ExhibitionListCustomMixin,
    BlockMixin,
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
            "coupon": false,
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
      "exhibition": 0,
      "cardComponent": {
        "templateName": "t1",
        "componentName": "CardProductPc"
      }
    }
  },
  created() {
    this.getData();
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
        } else {
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
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    '$route.query.id'(n) {
      this.getData();
    },
    exhibition(n) {
      this.getExhibitionProduct();
    },
    category(n, o) {
      if (n !== o) {
        this.getExhibitionProduct();
      }
    }
  }
}
</script>


