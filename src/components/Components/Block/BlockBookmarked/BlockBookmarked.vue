<template>
<div v-if="list && list.length > 0" style="padding:25px 0" :style="pagePadding">
  <div class="flex-between margin-bottom-16">
    <div class="size-18 weight-500 p-main">찜한 상품</div>
    <div v-if="totalCount > 6" class="size-14 p-primary"
      @click="routerPush('like?tab_id=0')">전체보기</div>
  </div>
    
    <list-vertical v-if="list&&list.length>0">
      <div slot="card" class="list-grid">
        <v1-t-card-product :card="item"
          v-for="(item,idx) in list"
          :cardProps="cardProps"
          :key="`card-prod-${item.id}-${idx}`"></v1-t-card-product>
      </div>
    </list-vertical>
    
    <div v-if="list&&list.length===0" class="empty-view size-16 p-sub">
      찜한 상품이 없습니다.</div>
</div>
</template>
<script>
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockBookmarked',
  components: {
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
      "cardProps": {
        "type": "product",
        "visible": {
          "partner": {
            "name": true,
            "address": false,
            "simple_desc": false
          },
          "product": {
            "cart": true,
            "like": true,
            "name": true,
            "rate": true,
            "tags": true,
            "price": {
              "price": true,
              "org_price": true,
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
        },
        "visibleNum": 6
      }
    }
  },
  created() {
    if (this.isLogin) {
      this.getData();
    }
  },
  mounted() {
    if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
      navigator.geolocation.getCurrentPosition(position => {
        console.log('location', position)
        let add = {};
        add.latitude = position.coords.latitude;
        add.longitude = position.coords.longitude;
        
        let location = {lat: add.latitude, lng: add.longitude};
        this.$store.commit('setCurrentPosition', location);
        this.$store.commit('setCurrentAddress', add);

        // 다시 호출해서 좌표 업데이트하는 방식 - recursive
        // this.getAddress(location);
      }, error => {}, {
        enableHighAccuracy: false,
        maximumAge:Infinity,
        timeout: 10000
      });
    } 
    else {
      console.log('GPS를 지원하지 않습니다');
    }
  },
  
  methods: {
    getData() {
      let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
      fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
      fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';
      
      let url = `user/${this.user.user_id}/mapping/product${fields}&liked_user=${this.user.user_id}`;
      url += `&page_num=1&page_length=4`
      this.currentPage = 1;
      this.loading = true;
      this.$axios.get(url)
      .then(res => {
        this.list = res.data.data.slice(0, 6);
        this.totalPages = res.data.total_page;      // 전체 페이지 수
        this.totalCount = res.data.count;           // 전체 수
        this.currentPage = 2;                       // 현재 페이지 2로 변경
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    cardStyle(idx) {
      let obj = {
        marginBottom: '16px'
      }
      
      if(idx%2===0) obj.paddingRight = '8px';
      else if(idx%2===1) obj.paddingLeft = '8px';
      
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
</style>

