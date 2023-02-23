<template>
<div :style="[containerStyle, pageHeight, pageBg]">
  <div style="margin-bottom: 100px">
        <!-- 검색된 상품 목록 -->
        <list-vertical :style="pagePadding">

          <!-- 검색창 -->
          <div slot="above-sort" class="position-relative full-width" style="margin: 16px 0 12px;">
            <input :style="inputStyle" type="text" placeholder="검색어를 입력하세요"
                   :value="searchValue" @input="e => searchValue = e.target.value" @keyup.enter="onSearch">
            <i class="material-icons unselect" :style="iconSearchStyle" @click="onSearch">search</i>
          </div>
          
          <div slot="middle-content" style="margin:24px 0;">
            <div class="flex-between size-14 weight-400"
              :style="brandColor.sub">
              <div>전체 파트너 {{ totalCount }}개</div>
              
              <div class="flex-align">
                <div class="unselect flex-align" :style="brandColor.sub"
                  style="margin-right: 12px" @click="routerPush('/map_search')">
                  <i class="material-icons-outlined" style="font-size: 16px">location_on</i>
                  <div class="size-14" style="margin-left: 4px">지도</div>
                </div>
                <!-- 정렬 액션시트 -->
                <dropdown-sort @onSort="onSelectSorted" model="partner"></dropdown-sort>
                
              </div>
            </div>

          </div>
          
          
          <div slot="card" v-if="list" style="min-height: 252px;">
          <transition-group name="fade" tag="div" class="grid-box">
              <vc1-t-card-partner
                v-for="(item,idx) in list"
                class="col-6"
                :style="cardStyle(idx)"
                :key="`card-prod-${item.id}-${idx}`"
                :card="item"
                :cardProps="cardProps"></vc1-t-card-partner>
          </transition-group>
          </div>
          
        </list-vertical>

        <div v-if="list && list.length===0"
            class="empty-view"
            :style="brandColor.sub">검색 결과가 없습니다.</div>
  </div>
</div>
</template>
<script>
import vc1TCardPartner from "@/components/Components/Card/vc1/CardPartner.vue"
import DropdownSort from "@/components/Components/Common/DropdownSort.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockPartnerSearchResult',
  components: {
    vc1TCardPartner,
    DropdownSort
  },
  mixins: [
    PageMixin,
    HeaderMixin,
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "sorted": {
        "value": ""
      },
      "address": undefined,
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
          "rate": false,
          "tags": false,
          "phone": false,
          "review": false,
          "address": false,
          "distance": true,
          "simple_desc": false
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "setAddress": undefined,
      "searchValue": "",
      "sortOptions": undefined,
      "selectedTabId": "",
      "selectedCategory": "",
      "headerCenterStyle": {}
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
  
  methods: {
    onSearch() {
      let query = '';
      let delim = '?';
      let hasSearch = false;

      Object.keys(this.$route.query).forEach(key =>{
        delim = query === '' ? '?' : '&';
        if(key.indexOf('search')>-1) {
          query += `${delim}search=${this.searchValue}`;
          hasSearch = true;
        } else {
          query += `${delim}${key}=${this.$route.query[key]}`;
        }
      });
      if(!hasSearch) {
        delim = query.indexOf('?') === -1 ? '?' : '&';
        query += `${delim}search=${this.searchValue}`;
      }
      this.$router.replace(this.$route.path + query);
      this.getData();
    },
    init() {
        this.pageLoadType = 'infinite';
        
        this.headerCenterStyle = {
          position: 'static',
          transform: 'none',
          left: 0
        };      

        if(this.$route.query.search) {
          this.searchValue = this.$route.query.search;
          console.log(this.$route.query.search)
        }
        
        this.$axios.get(`public/service/set/filter/${this.filterId}`)
        .then(res =>{
          
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
            this.dropdown.selected = this.dropdown.options[0];
          }         

          this.getData();
        });


        if(this.$route.query.search_tag) {
          this.searchValue = this.$route.query.search_tag;
        }

      },
    getData() {
        let location = '';
        if (this.$store.getters.currentPosition===undefined) location = '';
        else {
          location = `${this.$store.getters.currentPosition.lng},${this.$store.getters.currentPosition.lat}`;
        }

        let sorting = ''
        if (typeof(this.sorted)==='string' && this.sorted !== '') {
          sorting = {
            value: this.sorted
          }
        }
        
        if (sorting.value === 'distance') {
          sorting.value = 'distance,-pop_score'
        }
        
        // 필터 정렬 사용X
        // else {
        //   sorting = this.$store.getters.sorted;
        // }

        this.url = this.urlAppendFilter([], sorting,
          `user/${this.user.user_id}/mapping/partner?fields=id,name,img,like_count,shared_count,visit,simple_desc,rate,reviews_count,min_price,location,address,phone,tags` +
          `&search_keyword=` + encodeURI(this.searchValue));
        
        this.url += '&page_num=1&page_length=12&hit=false';
        if(location!=='')
          this.url += `&location=${location}`;
        this.currentPage = 1;

        this.$axios.get(this.url).then(res => {
          this.totalPages = res.data.total_page;
          this.totalCount = res.data.count;
          this.currentPage = 2;
          this.list = res.data.data;
          });
      },
    onSelectSorted(val) {
        this.sorted = val;
        this.getData();
      },
    updatePosition() {
        this.getData();
      },
    onVMap(value) {
        if (value) {
          this.headerCenterStyle = {
            position: 'absolute',
            transform: 'none',
            left: 0
          };
        }
        else {
          this.headerCenterStyle = {
            position: 'static',
            transform: 'none',
            left: 0
          };
        }
      },
    // 정렬 옵션 드롭다운
    toggleList() {
      this.dropdown.isOpen = !this.dropdown.isOpen;
    },
    closeDropdown() {
      this.dropdown.isOpen = false;
    },
    clickItem(item) {
      this.dropdown.selected = item;
      this.dropdown.isOpen = false;
      // this.$emit('selectSorted', item.value);
      this.onSelectSorted(item.value);
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
    cardStyle(idx) {
      let obj = {}
      
      let gutters = this.$store.getters.brand.layout_gutters;
      obj.paddingLeft = `${gutters/2}px`;
      obj.paddingRight = `${gutters/2}px`;
      obj.paddingBottom = `${gutters}px`;
      
      if(idx%2===0) obj.paddingLeft = 0;
      else if(idx%2===1) obj.paddingRight = 0;
      
      return obj;
    }
  },
  computed: {
    showFilterList() {
      return this.$store.getters.filtered.length > 0;
    },
    filterBtnColor() {
      return this.brandColor[this.showFilterList ? 'primary' : 'main'].color;
    },
    currentAddress() {
      // 현재 주소
      let add = this.address;
      if (add && add.sido && add.sigungu) {
        return `${add.sido} ${add.sigungu}`;
      }
      else return '';
    },
    containerStyle() {
        return {
          minHeight: 'calc(100vh - 50px)'
        }
      },
    filtered() {
        return this.$store.getters.filtered.length > 0;
      },
    inputStyle() {
        return {
          border: 'none',
          width: '100%',
          height: '48px',
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          padding: '12px 40px 12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: '8px',
          fontSize: '14px'
        }
      },
    iconSearchStyle() {
        return {
          position: 'absolute',
          top: '12px',
          right: '16px'
        }
      },
    btnStyles() {
        return {
          container: {
            // backgroundColor: 'white',
            // color: this.brandColor.primary.color,
            color: '#fff',
            fontWeight: 400
          }
        }
      },
    unsetCenter() {
        return {
          position: 'static',
          transform: 'none',
          left: 0
        }
      },
    selectedTabStyle() {
        return {
          padding: '12px 16px 11px',
          textAlign: 'center',
          fontSize: '14px',
          borderTop: this.brandBorder.main.border,
          borderBottom: `2px solid ${this.brandColor.primary.color}`,
          backgroundColor: '#fff',
          color: this.brandColor.primary.color
        }
      },
    unselectedTabStyle() {
        return {
          padding: '12px 16px',
          textAlign: 'center',
          fontSize: '14px',
          color: this.brandColor.main.color,
          backgroundColor: '#fff',
          borderTop: this.brandBorder.main.border,
        }
      },
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    '$route.query.gnb'(n) {
      this.getData();
    }
  }
}
</script>
<style scoped>
.dropdown {
    border-radius: 4px;
    justify-content: space-between;
    padding: 6px 10px;
  }
  
  .dropdown-ul {
    background-color: white;
    top: 40px;
    width: 96px;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
    border-radius: 4px;
    right: 0;
    padding: 10px 0;
  }
</style>

