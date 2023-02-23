<template>
<div style="padding:32px 0 100px" :style="pcMaxWidth" class="position-relative">
  <div style="margin-bottom:16px" v-if="list">전체 파트너 {{ totalCount }}명</div>
  <list-vertical v-if="list">
    <transition-group name="fade" slot="card" tag="div">
    <div v-for="(item,idx) in list"
      :key="`card-partner-${item.id}-${idx}`"
       style="padding:16px 0">
      <h11-t-card-partner-pc :card="item"
        :cardProps="cardProps"></h11-t-card-partner-pc>
    </div>
    </transition-group>
  </list-vertical>
  <div v-if="list&&list.length===0"
    class="empty-view p-sub size-16">찜한 파트너가 없습니다.</div>
  
  <pagination-default :pagingData="pagingData" :pageNum="5" :arrowEnd="true"
    @curPaginationNum="(val) => curNum(val)"
    v-if="pagingData"></pagination-default>
</div>
</template>
<script>
import h11TCardPartnerPc from "@/components/Components/Card/h11/CardPartnerPc.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockLikePartnerPc',
  components: {
    h11TCardPartnerPc,
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
      "menu": [
        {
          "id": 0,
          "name": "상품"
        },
        {
          "id": 1,
          "name": "파트너"
        }
      ],
      "product": undefined,
      "cardProps": {
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
          "distance": false,
          "simple_desc": false
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
  
  methods: {
    getData() {
      this.pageLoadType = 'infinite';
      let url = `user/${this.user.user_id}/mapping/partner?liked_user=${this.user.user_id}&fields=id,name,img,simple_desc,rate,partner,like_count,visit,reviews_count,price.price,address,product_count,location,phone,tags`
      url += `&page_num=${this.curPaginationNum}&page_length=10`;
      this.loading = true;
      this.$axios.get(url)
      .then(res => {
        this.list = res.data.data;
        this.totalPages = res.data.total_page;      // 전체 페이지 수
        this.totalCount = res.data.count;           // 전체 수
        this.pagingData = res.data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getData();
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


