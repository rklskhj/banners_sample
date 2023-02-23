<template>
<div v-if="list && list.length > 0" :style="pcMaxWidth">
  <div class="flex-between full-width">
    <div class="size-22 bold" :style="brandColor.main">
      파트너의 다른 상품</div>
    <div v-if="originList && originList.length > 6" class="size-16 weight-500 unselect"
      :style="brandColor.primary"
      @click="routerPush(`/partner_detail?id=${partnerId}&tab=1`)">전체보기</div>
  </div>
  <div class="list-grid" v-if="list&&list.length>0"
    style="margin:24px 0">
    <v1-t-card-product-pc v-for="(item, idx) in list"
      :key="'card-prod-'+idx"
      :card="item"
      :cardProps="cardProps"></v1-t-card-product-pc>
  </div>
  <div v-if="list && list.length===0" key="empty-view"
    class="empty-view"
    :style="brandColor.sub">상품 목록이 없습니다.</div>
</div>
</template>
<script>
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"

export default {
  name: 'BlockPartnersProductPc',
  components: {
    v1TCardProductPc
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
              "org_price": true,
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
      // ${this.partnerId}
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
          if (item.id !== Number(this.$route.query.id)) {
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
      let deco = {
        margin: '0 12px'
      }
      if (idx === 0) {
        deco.marginLeft = '0px';
      } else if (idx === this.list.length - 1) {
        deco.marginRight = '0px';
      }
      return deco;
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
    grid-template-columns: repeat(6, 1fr);
    grid-column-gap: 24px;
  }
</style>

