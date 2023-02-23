<template>
<div :style="pcMaxWidth" style="padding-bottom: 160px">
  <div class="size-16 weight-500" style="margin-top: 32px" :style="brandColor.sub">
    <span v-if="searchKeyword!==''"><span :style="brandColor.primary">{{ searchKeyword }}</span>에 대한 </span>파트너 검색결과 {{ currencyNum(totalPartnerCount) }}개
  </div>
  <div style="margin-top: 24px">
    <div class="flex-between">
      <div class="size-16 weight-500" :style="brandColor.main">
        전체 파트너 {{ currencyNum(totalPartnerCount) }}개</div>
      
      <div class="flex-align">
        <div class="unselect flex-align" :style="brandColor.sub"
          style="margin-right: 24px" @click="routerPush('/map_search')">
          <i class="material-icons-outlined" style="font-size: 16px">location_on</i>
          <div class="size-14" style="margin-left: 4px">지도</div>
        </div>
        <!-- 정렬 드롭다운 -->
        <div class="size-14 position-relative" style="z-index: 1; margin-right: 24px;"
          v-click-outside="closeDropdown">
          <!-- 선택된 값 -->
          <div class="flex-align unselect" style="padding-left: 12px" @click="toggleList">
            <img src="/static/image/icon/ic_compare_arrows.svg" style="width:16px;height:14px;margin-right: 4px">
            <div v-if="dropdown.selected" :style="brandColor.sub">{{ dropdown.selected.label }}</div>
          </div>
          <!-- 리스트 -->
          <ul v-if="dropdown.isOpen" class="dropdown-ul position-absolute" :style="brandBgColor.white">
            <li class="dropdown-item unselect" style="padding: 7px 20px; color: #1e1e1e"
                v-for="(item, idx) in dropdown.options" :key="idx"
                :style="itemStyle(idx)"
                @click.stop.prevent="clickItem(item)"
                @mouseover.stop.prevent="dropdown.mouseOverIndex=idx"
                @mouseleave.stop.prevent="dropdown.mouseOverIndex=-1">
              {{ item.label }}
            </li>
          </ul>
        </div>
        <div class="flex-align">
          <div class="box-filter unselect" @click="clickFilter">
            <template v-if="filtered.length>0">
              <div :style="brandColor.brand">필터</div>
              <div class="filter-count" :style="brandBgColor.brand">{{ filtered.length }}</div>
            </template>
            <template v-else>
              <img src="/static/image/icon/icon_filter.svg" style="width:16px;height:14px;margin-right:4px">
              <div :style="brandColor.sub" style="margin-left:4px">필터</div>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <t1-t-product-filter-list-pc
      v-if="filtered && filtered.length > 0"></t1-t-product-filter-list-pc>
  </div>
  <div v-if="partner_list && partner_list.length > 0">
    <transition-group name="fade" tag="div" class="list-grid" style="margin-top: 24px">
      <v1-t-card-partner-pc
        v-for="(partnerItem, idx) in partner_list"
        :key="'partner_item-'+idx"
        :card="partnerItem"
        :cardProps="cardProps"></v1-t-card-partner-pc>
    </transition-group>
    
    <pagination-default :pagingData="pagingData" :pageNum="pageNum"
      @curPaginationNum="(val) => curNum(val)" :arrow="true"
      v-if="pagingData" style="margin-top: 48px"></pagination-default>
  </div>
  <div v-else-if="partner_list && partner_list.length === 0"
    class="flex-justify" style="margin-top: 84px">
    <div style="text-align: center">
      <i class="material-icons" style="font-size: 40px"
        :style="brandColor.sub3">error_outline</i>
      <div class="size-18" style="margin-top: 16px"
        :style="brandColor.sub2">찾으시는 결과가 없습니다.</div>
    </div>
  </div>
</div>
</template>
<script>
import v1TCardPartnerPc from "@/components/Components/Card/v1/CardPartnerPc.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import t1TProductFilterListPc from "@/components/Components/Common/t1/ProductFilterListPc.vue"

export default {
  name: 'BlockSearchPartnerPc',
  components: {
    v1TCardPartnerPc,
    PaginationDefault,
    t1TProductFilterListPc
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "sorted": "",
      "tab_id": undefined,
      "pageNum": 0,
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
      "pagingData": undefined,
      "partner_list": undefined,
      "searchKeyword": "",
      "curPaginationNum": undefined,
      "partnerCardColumn": 3,
      "totalPartnerCount": 0
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
      if (this.$route.query.search && this.$route.query.search !== '') {
        this.searchKeyword = this.$route.query.search;
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
      let sorting = '';
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
      
      let num = 1;
      if (this.curPaginationNum) {
        num = this.curPaginationNum;
      }
      
      let partner_url = this.urlAppendFilter(this.$store.getters.filtered, sorting,
        `user/${this.user.user_id}/mapping/partner?fields=id,img,name,simple_desc,rate,reviews_count,location,address,distance,phone,tags`);
      if (this.isIE) {
        partner_url += `&search_keyword=` + encodeURI(this.searchKeyword);
      } else {
        partner_url += `&search_keyword=${this.searchKeyword}`;
      }
      partner_url += `&page_num=${num}&page_length=24&location=${location}&hit=false`;
      
      this.$axios.get(partner_url).then(res => {
        this.totalPartnerCount = res.data.count;
        this.partner_list = res.data.data;
        this.pagingData = res.data;
        this.pageNum = res.data.total_page;
      }).catch(() => {
        this.partner_list = [];
      });
    },
    clickItem(item) {
      this.dropdown.selected = item;
      this.dropdown.isOpen = false;
      this.onSelectSorted(item.value);
    },
    onSelectSorted(val) {
      this.sorted = val;
      this.getData();
    },
    closeDropdown() {
      this.dropdown.isOpen = false;
    },
    toggleList() {
      this.dropdown.isOpen = !this.dropdown.isOpen;
    },
    clickFilter() {
      this.routerOverlay('FilterModal');
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getData();
    },
    itemStyle(idx) {
      if (this.dropdown.mouseOverIndex==idx) {
        return {
          backgroundColor: this.brandBgColor.sub.backgroundColor
        }
      }
      else {
        return {
          color: this.brandColor.main.color
        }
      }
    }
  },
  computed: {
    filtered() {
      return this.$store.getters.filtered;
    }
  },
  watch: {
    '$route.query.search'(n) {
      this.searchKeyword = n;
      this.partner_list = undefined;
      this.curPaginationNum = 1;
      this.$router.replace(`/search?tab_id=0&search=${n}`);
      // this.getData();
    },
    '$store.getters.filtered'() {
      this.curPaginationNum = 1;
      this.partner_list = undefined;
      this.getData();
    },
    '$route.query.tab_id'() {
      this.curPaginationNum = 1;
      this.partner_list = undefined;
      this.$store.commit('setFilter', []);
      this.getData();
    }
  }
}
</script>
<style scoped>
.list-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 32px 24px;
}
.dropdown {
    width: 260px;
    height: 40px;
    border: 1px solid #d6d6d6;
    justify-content: space-between;
    padding: 9px 9px 9px 15px;
  }
  .dropdown-ul {
    background-color: white;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
    border: 1px solid #c7c7c7;
    border-radius: 4px;
    top: 26px;
    padding: 7px 0;
    right: 0;
    width: 116px;
  }
  .box-filter {
    display: flex;
    align-items: center;
    border-radius: 6px;
    width: 65px;
    height: 34px;
    justify-content: center;
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

