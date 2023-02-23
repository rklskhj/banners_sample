<template>
<div>
  <div style="margin-top: 32px; padding-bottom: 120px">
    <div :style="pagePadding">
      <div class="flex-between">
        <div class="size-14"
          :style="brandColor.sub">전체 파트너 {{ currencyNum(totalCount) }}개</div>
        <div class="flex-align">
          <div class="unselect flex-align" :style="brandColor.sub"
            style="margin-right: 16px" @click="routerPush('/map_search')">
            <i class="material-icons-outlined" style="font-size: 16px">location_on</i>
            <div class="size-14" style="margin-left: 4px">지도</div>
          </div>
          <dropdown-sort @onSort="onSelectSorted"></dropdown-sort>
          <div @click="routerOverlay('FilterOverlay')" class="size-14 flex-center unselect"
            :style="[{color: `${filterBtnColor}`}]" style="z-index: 1; margin-left: 12px">
            <!--<i class="material-icons" style="font-size: 20px; margin-right: 2px">tune</i>-->
            <template v-if="filtered.length > 0">
              <div>필터</div>
              <div class="filter-count" :style="brandBgColor.brand">
                {{ filtered.length }}</div>
            </template>
            <template v-else>
              <img src="/static/image/icon/icon_filter.svg" style="margin-right:4px">
              <div>필터</div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <product-filter-list v-if="showFilterList"
      @selectFilter="getData" style="margin-top: 8px"></product-filter-list>
    <div v-if="list && list.length > 0" :style="pagePadding">
      <transition-group name="fade" tag="div" class="grid-box" style="margin-top: 16px">
        <v1-t-card-partner
          v-for="(item,idx) in list"
          class="col-12"
          :style="partnerCardStyle(idx)"
          :key="'item-'+idx"
          :card="item"
          :cardProps="cardProps"></v1-t-card-partner>
      </transition-group>
    </div>
    <div v-else-if="list && list.length === 0" 
      :style="pagePadding" style="margin-top: 36px">
      <div style="text-align: center">
        <i class="material-icons" style="font-size: 40px"
          :style="brandColor.sub3">error_outline</i>
        <div class="size-14" style="margin-top: 16px"
          :style="brandColor.sub2">찾으시는 결과가 없습니다.</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import v1TCardPartner from "@/components/Components/Card/v1/CardPartner.vue"
import DropdownSort from "@/components/Components/Common/DropdownSort.vue"
import ProductFilterList from "@/components/Components/Common/ProductFilterList.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockSearchPartner',
  components: {
    v1TCardPartner,
    DropdownSort,
    ProductFilterList
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "tab_id": undefined,
      "dropdown": {
        "isOpen": false,
        "options": [],
        "selected": {
          "label": "",
          "value": ""
        },
        "mouseOverIndex": -1
      },
      "filterId": 1,
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
          "distance": true,
          "simple_desc": false
        },
        "imageRates": {
          "ratio": "4:3"
        }
      },
      "searchData": {
        "keyword": ""
      }
    }
  },
  created() {
    this.init();
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
    init() {
      this.pageLoadType = 'infinite'
      if (this.$route.query.search && this.$route.query.search !== '') {
        this.searchData.keyword = this.$route.query.search;
      }
      this.$axios.get(`public/service/set/filter/${this.filterId}`).then(res => {
        this.sortOptions = res.data.sort_partner;
        
        // active 필터링
        this.sortOptions = this.sortOptions.filter(item => item.is_active);
        
        // 가격 관련 정렬옵션 목록에서 제거
        this.sortOptions = this.sortOptions.filter(item => item.value.indexOf('price') === -1);
        
        this.sortOptions.forEach(option => {
          if (option.value === 'rate_avg') {
            option.value = '-rate'
          }
        })
        
        this.sorted = '-created_time';
        
        // '거리순' 초기값 설정
        let distance = find(this.sortOptions, 'value', 'distance');
        if (distance) {
          let rmIdx = this.sortOptions.indexOf(distance);
          this.sortOptions.splice(rmIdx,1);
          this.sortOptions.unshift(distance);
          this.sorted = 'distance'
        }
        
        // 정렬옵션 initialize
        if(this.sortOptions && this.sortOptions.length>0) {
          this.dropdown.options = this.sortOptions;
          // 최신등록 순으로 초기값 설정
          this.dropdown.options.forEach(option => {
            if (option.value === '-created_time') {
              this.dropdown.selected = option;
              this.sorted = option.value;
            }
          })
        } 
        this.getData();
      })
      
    },
    getData() {
      let sorting = ''
      if (typeof(this.sorted)==='string' && this.sorted !== '') {
        sorting = {
          value: this.sorted
        }
      }
      
      let location = '';
      if (this.$store.getters.currentPosition === undefined) {
        location = '';
      } else {
        location = `${this.$store.getters.currentPosition.lng},${this.$store.getters.currentPosition.lat}`;
      }
      
      this.url = this.urlAppendFilter(this.$store.getters.filtered, sorting,
        `user/${this.user.user_id}/mapping/partner?fields=id,img,name,simple_desc,rate,reviews_count,location,address,distance,tags,phone`);
      if (this.isIE) {
        this.url += `&search_keyword=` + encodeURI(this.searchData.keyword);
      } else {
        this.url += `&search_keyword=${this.searchData.keyword}`;
      }
      this.url += `&page_num=1&page_length=12&location=${location}&hit=false`;
      this.currentPage = 1;
      this.$axios.get(this.url).then(res => {
        this.totalCount = res.data.count;
        this.totalPages = res.data.total_page;
        this.currentPage = 2;
        this.list = res.data.data;
      }).catch(() => {
        this.list = [];
      })
    },
    toggleList() {
      this.dropdown.isOpen = !this.dropdown.isOpen;
    },
    closeDropdown() {
      this.dropdown.isOpen = false;
    },
    onSelectSorted(val) {
      this.sorted = val;
      this.getData();
    },
    itemStyle(idx) {
      if (this.dropdown.mouseOverIndex==idx) {
        return {
          color: this.brandColor.primary.color
        }
      }
      else {
        return {
          color: this.brandColor.main.color
        }
      }
    },
    partnerCardStyle(idx) {
      let obj = {}
      
      obj.paddingBottom = `16px`;
      
      return obj;
    }
  },
  computed: {
    filtered() {
      return this.$store.getters.filtered;
    },
    showFilterList() {
      return this.$store.getters.filtered.length > 0;
    },
    filterBtnColor() {
      return this.brandColor[this.showFilterList ? 'primary' : 'main'].color;
    }
  },
  watch: {
    '$route.query.search'(n) {
      this.searchData.keyword = n;
      this.list = undefined;
      this.$router.replace(`/search?tab_id=0&search=${n}`);
      // this.getData();
    },
    '$store.getters.filtered'() {
      this.getData();
    },
    '$route.query.tab_id'() {
      this.list = undefined;
      this.$store.commit('setFilter', []);
      this.getData();
    }
  }
}
</script>
<style scoped>
.dropdown-ul {
    background-color: white;
    top: 30px;
    width: 96px;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
    border-radius: 4px;
    right: 0;
    padding: 10px 0;
    z-index: 10;
  }
  .filter-count {
    border-radius: 100%;
    color: white;
    font-size: 10px;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    margin-left: 4px;
  }
</style>

