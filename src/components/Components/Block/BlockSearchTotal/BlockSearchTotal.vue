<template>
<div :style="pagePadding">
  <div style="margin-top: 32px; padding-bottom: 120px">
    <!-- 상품 -->
    <div v-if="product_list && product_list.length > 0" style="margin-top: 20px">
      <div class="flex-between">
        <div class="size-14 weight-500"
          :style="brandColor.sub">상품 {{ currencyNum(totalCount.product) }}개</div>
      </div>
      <transition-group name="fade" tag="div" class="list-grid"
        style="margin-top: 16px">
        <v1-t-card-product
          v-for="(item,idx) in product_list"
          :key="'item-'+idx"
          :card="item"
          :cardProps="cardProps[0]"></v1-t-card-product>
      </transition-group>
      
      <div v-if="product_list && product_list.length > 0" style="margin-top: 16px; padding-top: 12px">
        <div class="size-14 flex-center unselect"
          style="height: 48px; border-radius: 8px"
          :style="[brandBorder.main, brandColor.sub2]"
          @click="showMoreProduct">상품 더보기</div>
      </div>
    </div>
    
    <div v-if="product_list && product_list.length > 0 && partner_list && partner_list.length > 0" class="divider"></div>
    
    <!-- 파트너 -->
    <div v-if="partner_list && partner_list.length > 0" style="margin-top:20px">
      <div class="flex-between">
        <div class="size-14 weight-500"
          :style="brandColor.sub">파트너 {{ currencyNum(totalCount.partner) }}개</div>
      </div>
      <transition-group name="fade" tag="div" class="grid-box" style="margin-top: 16px">
        <v1-t-card-partner
          v-for="(partnerItem,idx) in partner_list"
          class="col-12"
          :style="partnerCardStyle(idx)"
          :key="'partner_item-'+idx"
          :card="partnerItem"
          :cardProps="cardProps[1]"></v1-t-card-partner>
      </transition-group>
      
      <div v-if="partner_list && partner_list.length > 0" style="margin-top: 16px; padding-top: 12px">
        <div class="size-14 flex-center unselect"
          style="height: 48px; border-radius: 8px"
          :style="[brandBorder.main, brandColor.sub2]"
          @click="showMorePartner">파트너 더보기</div>
      </div>
    </div>
    
    <template v-if="$store.getters.brand.plugins.indexOf('board') > -1">
      <div v-if="partner_list && partner_list.length > 0 && board_list && board_list.length > 0" class="divider"></div>
       <!--게시판 -->
      <div v-if="board_list && board_list.length > 0" style="margin-top: 24px; padding-bottom: 56px">
        <div class="flex-between">
          <div class="size-14 weight-500" :style="brandColor.main">
            게시물 {{ currencyNum(totalCount.board) }}개</div>
        </div>
        <transition-group name="fade" tag="div">
          <card-post
            v-for="(postItem, idx) in board_list"
            :key="'post-item-'+idx"
            :card="postItem"></card-post>
        </transition-group>
        
        <div v-if="board_list && board_list.length > 0" style="margin-top: 16px; padding-top: 12px">
          <div class="size-14 flex-center unselect"
            style="height: 48px; border-radius: 8px"
            :style="[brandBorder.main, brandColor.sub2]"
            @click="showMoreBoard">더보기</div>
        </div>
      </div>
      <div v-if="product_list && product_list.length === 0 && partner_list && partner_list.length === 0 && board_list && board_list.length === 0"
        class="flex-justify" style="margin-top:20px">
        <div style="text-align: center">
          <i class="material-icons" style="font-size: 40px"
            :style="brandColor.sub3">error_outline</i>
          <div class="size-14" style="margin-top: 16px"
            :style="brandColor.sub2">찾으시는 결과가 없습니다.</div>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="product_list && product_list.length === 0 && partner_list && partner_list.length === 0" class="flex-justify" style="margin-top:20px">
        <div style="text-align: center">
          <i class="material-icons" style="font-size: 40px"
            :style="brandColor.sub3">error_outline</i>
          <div class="size-14" style="margin-top: 16px"
            :style="brandColor.sub2">찾으시는 결과가 없습니다.</div>
        </div>
      </div>
    </template>
  </div>
</div>
</template>
<script>
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"
import v1TCardPartner from "@/components/Components/Card/v1/CardPartner.vue"
import CardPost from "@/components/Components/Card/CardPost.vue"

export default {
  name: 'BlockSearchTotal',
  components: {
    v1TCardProduct,
    v1TCardPartner,
    CardPost
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "sorted": "-created_time",
      "tab_id": undefined,
      "cardProps": [
        {
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
        {
          "type": "partner",
          "visible": {
            "cart": false,
            "like": true,
            "name": true,
            "rate": true,
            "tags": false,
            "phone": false,
            "review": true,
            "address": false,
            "distance": true,
            "simple_desc": false
          },
          "imageRates": {
            "ratio": "4:3"
          }
        }
      ],
      "board_list": undefined,
      "searchData": {
        "keyword": ""
      },
      "totalCount": {
        "all": 0,
        "board": 0,
        "partner": 0,
        "product": 0
      },
      "partner_list": undefined,
      "product_list": undefined
    }
  },
  created() {
    
    if (Object.keys(this.$route.query).length === 0) {
      this.$router.replace('/search?tab_id=0');
    }
    if (this.$route.query.search && this.$route.query.search !== '') {
      this.searchData.keyword = this.$route.query.search;
    } else {
      this.$root.$emit('page_overlay', 'SearchOverlay');
    }
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
        navigator.geolocation.getCurrentPosition(position => {
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
      
    })
  },
  beforeDestroy() {
    if (this.$route.query.tab_id !== undefined && this.tab_id !== this.$route.query.tab_id) {
      this.$store.commit('clearFilter');
    }
  },
  
  methods: {
    async getData() {
      try {
        // 상품 목록 불러오기
        let sorting = '';
        if (typeof(this.sorted)==='string' && this.sorted !== '') {
          sorting = {
            value: this.sorted.replace('-pop_score', '-partner__pop_score')
          }
        }
        let product_url = `user/${this.user.user_id}/mapping/product`;
        product_url += `?fields=id,img,name,partner,rate,reviews_count,price,discount_time,simple_desc,address,tags,has_download_coupon,order_conversion_type,stock,stock_type,possible_booking_resv,possible_reservation_resv,soldout`;
        product_url += `&search_keyword=` + encodeURI(this.searchData.keyword);
        product_url += `&page_num=1&page_length=4&hit=false`;

        if (this.$store.getters.service.package.indexOf('booking') > -1) {
          if (this.$store.getters.selectedResv) {
            product_url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`
            product_url += `&booking=${this.$store.getters.selectedResv.resv_date},${this.$store.getters.selectedResv.resv_end_date}`;
          }
          if (this.$store.getters.bookingMinimum) {
            product_url += `&booking_minimum=${this.$store.getters.bookingMinimum}`;
          }
        }
        
        product_url = this.urlAppendFilter({}, sorting, product_url);
        
        let productRes = await this.$axios.get(product_url);
        this.totalCount.product = productRes.data.count;
        this.product_list = productRes.data.data;
      } catch(err) {
        this.product_list = [];  
      }
      
      try {
        // 파트너 목록 불러오기
        let sorting = '';
        if (typeof(this.sorted)==='string' && this.sorted !== '') {
          sorting = {
            value: this.sorted.replace('-pop_score', '-partner__pop_score')
          }
        }
        let partner_url = `user/${this.user.user_id}/mapping/partner`;
        partner_url += `?fields=id,img,name,simple_desc,rate,reviews_count,location,address,distance,tags,phone`;
        partner_url += `&search_keyword=` + encodeURI(this.searchData.keyword);
        partner_url += `&page_num=1&page_length=2&hit=false`;
        
        partner_url = this.urlAppendFilter({}, sorting, partner_url);
        
        let partnerRes = await this.$axios.get(partner_url);
        this.totalCount.partner = partnerRes.data.count;
        this.partner_list = partnerRes.data.data;
      } catch(err) {
        this.partner_list = [];
      }
      
      if (this.$store.getters.brand.plugins.indexOf('board') > -1) {
        try {
          // 게시물 목록 불러오기
          let board_url = 'public/board/post';
          board_url += `?search_keyword=` + encodeURI(this.searchData.keyword);
          board_url += `&page_num=1&page_length=3`;
          let boardRes = await this.$axios.get(board_url);
          this.totalCount.board = boardRes.data.count;
          this.board_list =  this.htmlToText(boardRes.data.data);
        } catch(err) {
          this.board_list = [];
        }
      }
      
      // 전체 검색 결과 count 계산
      if (this.$store.getters.brand.plugins.indexOf('board') > -1) {
        this.totalCount.all = this.totalCount.product + this.totalCount.partner + this.totalCount.board;
      } else {
        this.totalCount.all = this.totalCount.product + this.totalCount.partner;
      }
    },
    showMoreProduct() {
      if (this.$route.query.search !== undefined) {
        this.$router.replace(`/search?tab_id=1&search=${this.$route.query.search}`);
      } else {
        this.$router.replace(`/search?tab_id=1`);
      }
    },
    showMorePartner() {
      if (this.$route.query.search !== undefined) {
        this.$router.replace(`/search?tab_id=2&search=${this.$route.query.search}`);
      } else {
        this.$router.replace(`/search?tab_id=2`);
      }
    },
    showMoreBoard() {
      if (this.$route.query.search !== undefined) {
        this.$router.replace(`/search?tab_id=3&search=${this.$route.query.search}`);
      } else {
        this.$router.replace(`/search?tab_id=3`);
      }
    },
    partnerCardStyle(idx) {
      let obj = {}
      
      obj.paddingBottom = `16px`;
      
      return obj;
    },
    htmlToText(list) {
      if(list && list.length>0) {
        let el = document.createElement('div');
        list.forEach(card=>{
          el.innerHTML = card.content;
          card.content = el.innerText;   
        });
        el.remove(); 
      }
      return list;
    }
  },
  computed: {
    
  },
  watch: {
    '$route.query.search'(n) {
      this.searchData.keyword = n;
      this.product_list = undefined;
      this.partner_list = undefined;
      this.getData();
    },
    '$route.query.tab_id'() {
      this.product_list = undefined;
      this.partner_list = undefined;
      this.$store.commit('setFilter', []);
      this.getData();
    },
    '$store.getters.selectedResv': {
      deep: true,
      handler() {
        this.product_list = undefined;
        this.getData();
      }
    },
    '$store.getters.bookingMinimum'() {
      this.product_list = undefined;
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
.divider {
  margin: 32px 0;
  height: 1px;
  background: #e3e3e3;
}
</style>

