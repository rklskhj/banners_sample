<template>
<div :style="pagePadding" style="padding:25px 0">
  <div class="flex-between margin-bottom-16">
    <div class="size-18 weight-500 p-main" lp-text>내 주변 파트너</div>
    <div class="flex-align">
      <div class="unselect flex-align p-primary"
        style="margin-right: 12px" @click="routerPush('/map_search')">
        <i class="material-icons-outlined" style="font-size: 16px">location_on</i>
        <div class="size-14" style="margin-left: 4px">지도</div>
      </div>
      <div class="size-14 unselect p-primary"
        @click="routerPush(`partner_search`)">전체보기</div>
    </div>
  </div>
  <template v-if="list && list.length>0">
    <v1-t-card-partner
      v-for="(item,idx) in list"
      :key="`card-${item.id}`"
      :card="item" :cardProps="cardProps"
      class="full-width margin-bottom-16"></v1-t-card-partner>
  </template> 
</div>
</template>
<script>
import v1TCardPartner from "@/components/Components/Card/v1/CardPartner.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockHomePartnerNearMe',
  components: {
    v1TCardPartner
  },
  mixins: [
    ListMixin
  ],
  props: {
    address: {
      type: Object,
    },

  },
  data() {
    return {
      "list": [],
      "cardProps": {
        "type": "partner",
        "visible": {
          "like": true,
          "name": true,
          "rate": true,
          "tags": false,
          "phone": false,
          "review": true,
          "address": true,
          "distance": true,
          "simple_desc": false
        },
        "imageRates": {
          "ratio": "4:3"
        }
      },
      "visibleNum": 2
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
    getUrl() {
      let sorting = ''
      sorting = {
        value: 'distance'
      }

      let location = '';
      let fields = `?fields=id,img,name,simple_desc,min_price,distance,rate,reviews_count,address,location,tags,phone`;
      if(this.$store.getters.currentPosition===undefined) location = '';
      else location = `&location=${this.$store.getters.currentPosition.lng},${this.$store.getters.currentPosition.lat}`;

      this.url = this.urlAppendFilter(this.$store.getters.filtered, sorting,
        `user/${this.user.user_id}/mapping/partner` + fields + location);
        
      
        
      // this.$axios.get(this.url)
      // .then(res => {
      //   this.list = res.data.data;
      // })
    },
    getData() {
      this.getUrl();
      this.$axios.get(this.url).then(res => {
        this.list = res.data.data.slice(0,this.visibleNum);
      });
    }
  },
  computed: {
    currentAddress() {
      // 현재 주소
      let add = this.address;
      if (add && add.sido && add.sigungu) {
        return `${add.sido} ${add.sigungu}`;
      }
      else return '';
    }
  },
  watch: {
    
  }
}
</script>


