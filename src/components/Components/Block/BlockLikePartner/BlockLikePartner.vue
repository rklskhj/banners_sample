<template>
<div style="padding:16px 0 100px" :style="pagePadding">
  <div style="margin-bottom:16px" v-if="list">전체 파트너 {{ totalCount }}명</div>
  <list-vertical v-if="list">
    <!--<div slot="card">-->
    <div v-for="(item,idx) in list" slot="card"
      :key="`card-partner-${item.id}-${idx}`"
       style="padding:16px 0">
      <h11-t-card-partner :card="item"
        :cardProps="cardProps"></h11-t-card-partner>
    </div>
    <!--</div>-->
  </list-vertical>
  <div v-if="list&&list.length===0"
    class="empty-view p-sub size-16">찜한 파트너가 없습니다.</div>
</div>
</template>
<script>
import h11TCardPartner from "@/components/Components/Card/h11/CardPartner.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockLikePartner',
  components: {
    h11TCardPartner
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
      }
    }
  },
  created() {
    this.pageLoadType = 'infinite';
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
      this.url = `user/${this.user.user_id}/mapping/partner?liked_user=${this.user.user_id}&fields=id,name,img,simple_desc,rate,partner,like_count,visit,reviews_count,price.price,address,product_count,tags,phone,location`
      this.url += '&page_num=1&page_length=10';
      this.currentPage = 1;
      this.loading = true;
      this.$axios.get(this.url)
      .then(res => {
        this.list = res.data.data;
        this.totalPages = res.data.total_page;      // 전체 페이지 수
        this.totalCount = res.data.count;           // 전체 수
        this.currentPage = 2;                       // 현재 페이지 2로 변경
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


