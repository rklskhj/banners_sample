<template>
<div :style="pcMaxWidth" style="padding-bottom: 160px">
  <div class="size-16 weight-500" style="margin-top: 32px" :style="brandColor.sub">
    <span v-if="searchKeyword && searchKeyword!==''"><span :style="brandColor.primary">{{ searchKeyword }}</span>에 대한 </span>통합 검색결과 {{ currencyNum(totalCount.all) }}개
  </div>
  <!-- 상품 -->
  <div v-if="product_list && product_list.length > 0" style="margin-top: 24px; padding-bottom: 56px"
    :style="{borderBottom: brandBorder.sub.border}">
    <div class="flex-between">
      <div class="size-16 weight-500" :style="brandColor.main">
        전체 상품 {{ currencyNum(totalCount.product) }}개</div>
      <div class="size-16 weight-500 unselect"
        :style="brandColor.primary" @click="showMoreProduct">전체보기</div>
    </div>
    <transition-group name="fade" tag="div" class="product-list-grid" style="margin-top: 12px">
      <v1-t-card-product-pc
        v-for="(item, idx) in product_list"
        :key="'item-'+idx"
        :card="item"
        :cardProps="cardProps[0]"></v1-t-card-product-pc>
    </transition-group>
  </div>
  <!-- 파트너 -->
  <div v-if="partner_list && partner_list.length > 0" style="margin-top: 24px; padding-bottom: 56px">
    <div class="flex-between">
      <div class="size-16 weight-500" :style="brandColor.main">
        전체 파트너 {{ currencyNum(totalCount.partner) }}개</div>
      <div class="size-16 weight-500 unselect"
        :style="brandColor.primary" @click="showMorePartner">전체보기</div>
    </div>
    <transition-group name="fade" tag="div" class="partner-list-grid" style="margin-top: 16px">
      <v1-t-card-partner-pc
        v-for="(partnerItem, idx) in partner_list"
        :key="'partner_item-'+idx"
        :card="partnerItem"
        :cardProps="cardProps[1]"></v1-t-card-partner-pc>
    </transition-group>
  </div>
  <template v-if="$store.getters.brand.plugins.indexOf('board') > -1">
    <!-- 게시판 -->
    <div v-if="board_list && board_list.length > 0" style="margin-top: 24px; padding-top: 24px; padding-bottom: 56px"
        :style="{borderTop: brandBorder.sub.border}">
      <div class="flex-between">
        <div class="size-16 weight-500" :style="brandColor.main">
          게시물 {{ currencyNum(totalCount.board) }}개</div>
        <div class="size-16 weight-500 unselect"
          :style="brandColor.primary" @click="showMoreBoard">전체보기</div>
      </div>
      <transition-group name="fade" tag="div" style="margin-top: 16px">
        <card-post-pc
          v-for="(postItem, idx) in board_list"
          :key="'post-item-'+idx"
          :card="postItem"></card-post-pc>
      </transition-group>
    </div>
    <div v-if="product_list && product_list.length === 0 && partner_list && partner_list.length === 0 && board_list && board_list.length === 0"
      class="flex-justify" style="margin-top: 84px">
      <div style="text-align: center">
        <i class="material-icons" style="font-size: 40px"
          :style="brandColor.sub3">error_outline</i>
        <div class="size-18" style="margin-top: 16px"
          :style="brandColor.sub2">찾으시는 결과가 없습니다.</div>
      </div>
    </div>
  </template>
  <template v-else>
    <div v-if="product_list && product_list.length === 0 && partner_list && partner_list.length === 0"
      class="flex-justify" style="margin-top: 84px">
      <div style="text-align: center">
        <i class="material-icons" style="font-size: 40px"
          :style="brandColor.sub3">error_outline</i>
        <div class="size-18" style="margin-top: 16px"
          :style="brandColor.sub2">찾으시는 결과가 없습니다.</div>
      </div>
    </div>
  </template>
</div>
</template>
<script>
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"
import v1TCardPartnerPc from "@/components/Components/Card/v1/CardPartnerPc.vue"
import CardPostPc from "@/components/Components/Card/CardPostPc.vue"

export default {
  name: 'BlockSearchTotalPc',
  components: {
    v1TCardProductPc,
    v1TCardPartnerPc,
    CardPostPc
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
      "totalCount": {
        "all": 0,
        "board": 0,
        "partner": 0,
        "product": 0
      },
      "partner_list": undefined,
      "product_list": undefined,
      "searchKeyword": "",
      "prodCardColumn": 4,
      "partnerCardColumn": 3
    }
  },
  created() {
    if (this.$route.query.search && this.$route.query.search !== '') {
      this.searchKeyword = this.$route.query.search;
    }
    this.tab_id = this.$route.query.tab_id;
    this.getData();
  },
  mounted() {
    if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
      navigator.geolocation.getCurrentPosition(position => {
        let add = {};
        add.latitude = position.coords.latitude;
        add.longitude = position.coords.longitude;
        
        let location = {lat: add.latitude, lng: add.longitude};
        this.$store.commit('setCurrentPosition', location);
        this.$store.commit('setCurrentAddress', add);

      }, error => {
        console.log('err', error.code)
      }, {
        enableHighAccuracy: false,
        maximumAge:Infinity,
        timeout: 10000
      });
    } 
    else {
      console.log('GPS를 지원하지 않습니다');
    }
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
        if (this.searchKeyword !== undefined) {
          product_url += `&search_keyword=` + encodeURI(this.searchKeyword);
        }
        
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
        partner_url += `?fields=id,img,name,simple_desc,rate,reviews_count,location,address,distance,phone,tags`;
        if (this.searchKeyword !== undefined) {
          partner_url += `&search_keyword=` + encodeURI(this.searchKeyword);
        }
        partner_url += `&page_num=1&page_length=3&hit=false`;
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
          if (this.searchKeyword !== undefined) {
            board_url += `?search_keyword=` + encodeURI(this.searchKeyword);
            board_url += `&page_num=1&page_length=3`;
          } else {
            board_url += `?page_num=1&page_length=3`;
          }
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
      this.searchKeyword = n;
      this.product_list = undefined;
      this.partner_list = undefined;
      this.$store.commit('clearFilter');
      this.getData();
    },
    '$route.query.tab_id'() {
      console.log('changed')
      this.product_list = undefined;
      this.partner_list = undefined;
      this.$store.commit('clearFilter');
      this.getData();
    },
    '$store.getters.bookingMinimum'() {
      this.product_list = undefined;
      this.partner_list = undefined;
      this.$store.commit('clearFilter');
      this.getData();
    },
    '$store.getters.selectedResv'() {
      this.product_list = undefined;
      this.partner_list = undefined;
      this.$store.commit('clearFilter');
      this.getData();
    }
  }
}
</script>
<style scoped>
.product-list-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 32px 24px;
  }
  .partner-list-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 32px 24px;
  }
</style>

