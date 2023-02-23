<template>
<div v-if="list && list.length > 0" :style="pagePadding" style="padding: 25px 0">
  <div class="size-18 weight-500"
    :style="brandColor.main">파트너의 다른 상품</div>
      <div class="list-grid" v-if="list&&list.length>0"
        style="width: 100%; margin:16px 0">
        <v1-t-card-product
          v-for="(item,idx) in list"
          :key="`card-prod-${item.id}-${idx}`"
          :cardProps="cardProps"
          :card="item"></v1-t-card-product>
      </div>
      <div v-if="list && list.length===0"
        class="empty-view"
        :style="brandColor.sub">상품 목록이 없습니다.</div>
    <div v-if="originList && originList.length > 6" slot="more"
      @click="routerPush(`/partner_detail?id=${partnerId}&tab=1`)"
      class="flex-center size-14 unselect full-width"
      :style="[brandColor.sub2, brandBorder.main]"
      style="border-radius: 8px; height: 48px">더보기</div>
</div>
</template>
<script>
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"

export default {
  name: 'BlockPartnersProduct',
  components: {
    v1TCardProduct
  },
  mixins: [

  ],
  props: {
    partnerId: {
      type: Number,
      required: true,
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
              "org_price": false,
              "discount_price": true
            },
            "coupon": false,
            "review": false,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "originList": undefined
    }
  },
  created() {

  },
  mounted() {
    this.getData();
  },
  
  methods: {
    getData() {
      let fields = 'tags,id,img,name,simple_desc,rate,like_count,price,visit,partner.name,params,files,reviews_count,shared_count,purchase_count,category1,soldout';
      fields += ',sum_price,stock_infinite,stock,is_expired,enable_day_price,minimum,maximum,order_conversion_type,possible_booking_resv,possible_reservation_resv'
      let url = `/user/${this.user.user_id}/mapping/product?partner_id=${this.partnerId}&fields=${fields}`
      if (this.$store.getters.selectedResv !== undefined && this.$store.getters.selectedResv.resv_date && this.$store.getters.selectedResv.resv_end_date) {
        url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`;
        if (this.$store.getters.service.package.indexOf('booking') > -1) {
          url += `&booking=${this.$store.getters.selectedResv.resv_date},${this.$store.getters.selectedResv.resv_end_date}`
        }
      }
      url += '&page_num=1&page_length=12&hit=false';
      this.$axios.get(url)
      .then(res => {
        let list = [];
        res.data.data.forEach(item => {
          if (Number(item.id) !== Number(this.$route.query.id)) {
            list.push(item);
          }
        })
        this.originList = list;
        if (list.length > 6) {
          this.list = list.slice(0, 6);
        } else {
          this.list = list;
          
        }
      });
    },
    cardStyle(idx) {
      let obj = {}
      
      let gutters = this.$store.getters.brand.layout_gutters;
      obj.paddingLeft = `${gutters/3}px`;
      obj.paddingRight = `${gutters/3}px`;
      obj.paddingBottom = `16px`;
      
      if(idx%3===0) obj.paddingLeft = 0;
      else if(idx%3===2) obj.paddingRight = 0;
      
      return obj;
    }
  },
  computed: {
    
  },
  watch: {
    '$route.query.id'(n) {
      this.originList = [];
      this.list = [];
      this.getData();
    }
  }
}
</script>
<style scoped>
.list-grid {
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 12px;
    grid-row-gap: 18px;
  }
</style>

