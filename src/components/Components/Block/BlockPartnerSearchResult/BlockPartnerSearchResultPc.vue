<template>
<div class="flex-justify position-relative">
    
    <div :style="pcMaxWidth">

      <div :class="{'flex-end': !searchValue, 'flex-between': searchValue}" class="position-relative" style="margin-bottom: 12px; margin-top: 32px">
        
        <div v-if="searchValue">
          <div class="size-20 weight-500" :style="brandColor.main">'{{ searchValue }}' 검색 결과</div>
          <div class="size-14" :style="brandColor.sub">총 {{ list.length }}개</div>
        </div>
        
        <div class="flex-align size-14" :style="brandColor.sub">
          <div class="unselect flex-align" :style="brandColor.sub"
            style="margin-right: 24px" @click="routerPush('/map_search')">
            <i class="material-icons-outlined" style="font-size: 18px">location_on</i>
            <div class="size-14" style="margin-left: 4px">지도</div>
          </div>
          <!-- 정렬 드롭다운 -->
          <div style="min-width:84px" v-click-outside="closeDropdown">
            <div class="flex-center unselect position-relative" :style="brandBgColor.white" style="z-index:1"
              @click.stop.prevent="toggleList">
              
              <!--선택된 값-->
              <img :src="iconImg.dropdown" 
                style="width:18px;height:18px;object-fit:contain;margin-right:4px">
              <div v-if="dropdown.selected" style="margin-right:2px"
                :style="{color: dropdown.isOpen ? brandColor.sub.color : brandColor.sub.color}"
                >{{ dropdown.selected.label }}</div>
              <!--<i class="material-icons" style="font-size: 20px; margin-right:2px;"-->
              <!--  >{{ dropdown.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>-->
                
              <!--리스트-->
              <ul v-if="dropdown.isOpen" class="dropdown-ul position-absolute" :style="brandBgColor.white">
                <li class="dropdown-item" style="padding: 8px 12px;"
                    v-for="(item, idx) in dropdown.options" :key="idx"
                    :style="itemStyle(idx)"
                    @click.stop.prevent="clickItem(item)"
                    @mouseover.stop.prevent="dropdown.mouseOverIndex=idx"
                    @mouseleave.stop.prevent="dropdown.mouseOverIndex=-1">
                  {{ item.label }}
                </li>
              </ul>
              
            </div>
          </div>
        </div>
      </div>
      
      <!-- 검색된 상품 목록 -->
      <list-vertical style="margin-top:16px;">
        <div slot="card-grid" class="full-width">
          <transition-group name="fade" tag="div" class="full-width flex wrap"
            style="gap: 32px 0">
            <vc1-t-card-partner-pc v-for="(item, idx) in list"
              :style="cardStyle(idx)"
              :key="'card-prod-'+idx"
              :idx="idx"
              :card="item"
              :cardProps="cardProps"></vc1-t-card-partner-pc>
          </transition-group>
          <div v-if="list && list.length===0" key="empty-view"
              class="empty-view"
              :style="brandColor.sub">검색 결과가 없습니다.</div>  
              
        </div>
      </list-vertical>
  
    </div>
    
  </div>
</template>
<script>
import vc1TCardPartnerPc from "@/components/Components/Card/vc1/CardPartnerPc.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockPartnerSearchResultPc',
  components: {
    vc1TCardPartnerPc
  },
  mixins: [
    PageMixin,
    HeaderMixin,
    BlockMixin
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
      "iconImg": {
        "filter": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/42905594_thumb.png",
        "dropdown": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/39128693_thumb.png"
      },
      "category": undefined,
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
          "ratio": "1:1"
        }
      },
      "cardColumn": 4,
      "setAddress": undefined,
      "showRegion": false,
      "searchValue": "",
      "sortOptions": undefined,
      "categoryAllId": "",
      "currentStatus": false,
      "selectedTabId": "",
      "changePosition": undefined,
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
    init() {
        this.pageLoadType = 'infinite';
        
        this.headerCenterStyle = {
          position: 'static',
          transform: 'none',
          left: 0
        };      

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
            this.dropdown.selected =this.dropdown.options[0];
          }         

          this.getData();
        });

    },
    getData() {
        let location = '';
        if (this.$store.getters.currentPosition===undefined) location = '';
        else {
          location = `${this.$store.getters.currentPosition.lng},${this.$store.getters.currentPosition.lat}`;
        }
        
        if(this.$route.query.search) {
          this.searchValue = this.$route.query.search;
        }
        else this.searchValue = '';
        
        if (typeof(this.sorted)==='object' && this.sorted.value!==undefined) {
          this.sorted = this.sorted.value; 
        }
        if (this.sorted === 'distance') {
          this.sorted = this.sorted + ',-pop_score'
        }
        this.url = this.urlAppendFilter([], {},
          `user/${this.user.user_id}/mapping/partner?fields=id,name,img,like_count,shared_count,visit,simple_desc,rate,reviews_count,min_price,location,address,tags,phone` +
          `&search_keyword=` + encodeURI(this.searchValue));
        this.url += '&page_num=1&page_length=12&hit=false';
        if(location!=='')
          this.url += `&location=${location}`;
        this.url += `&ordering=${this.sorted}`;
        
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
            backgroundColor: this.brandBgColor.sub.backgroundColor
          }
        }
        else {
          return {
            color: this.brandColor.main.color
          }
        }
      },
    cardStyle(idx) {
      let gutters = this.$store.getters.brand.layout_gutters;
      let gutter = gutters * 0.5;
      let width = `${(((this.$store.getters.brand.layout_maxwidth*12/12) - gutters * (this.cardColumn-1)) / this.cardColumn).toFixed(2)}px`;

      let obj = {
        width: width,
        marginBottom: `${gutters}px`
      };
      if(idx % this.cardColumn === 0 || idx % this.cardColumn === this.cardColumn - 1) {
        if(idx % this.cardColumn === 0) {
          obj.marginLeft = 0;
          obj.marginRight = `${gutter}px`;
        } else {
          obj.marginRight = 0;
          obj.marginLeft = `${gutter}px`;
        }
      } else {
        obj.marginLeft = `${gutter}px`;
        obj.marginRight = obj.marginLeft;
      }

      return obj;
    }
  },
  computed: {
    filterBtnColor() {
      return this.$store.getters.filtered.length !== 0 ? this.brandColor.primary.color : this.brandColor.main.color;
    },
    tabId() {
      let tab = "";
      if (this.$route.query.tab===undefined || this.$route.query.tab==="") tab = "";
      else tab = parseInt(this.$route.query.tab);
      return tab;
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
          marginTop: '50px',
          minHeight: 'calc(100vh - 50px)',
          paddingBottom: '20px'
        }
      },
    headerStyles() {
        return {
          container: {
            // backgroundColor: 'white',
            color: '#fff',
            // fontWeight: 400
          }
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
          backgroundColor: 'white',
          padding: '12px 40px 12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: '12px',
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
    $route(n) {
      this.list = undefined;
      this.getData();
    },
    address(n) {
      if (n) this.getData();
    },
    '$store.getters.filtered'(n) {
      this.getData();
    }
  }
}
</script>
<style scoped>
.dropdown {
  border-radius: 8px;
  justify-content: space-between;
  padding: 14px;  
}
.dropdown-ul {
  background-color: white;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
  border: 1px solid #c7c7c7;
  border-radius: 4px;
  padding: 7px 0;
  top: 32px;
  right: 0;
  width: 116px;
}

.location-comp-absolute {
  position: absolute;
  left: calc(50% - 128px);
  background-color: #fff;
}

.location-comp-fixed {
  position: fixed;
  z-index: 101;
  background-color: #fff;  
  top: calc(((((100% - 64px - 540px) / 2) - 48px) / 2) + 64px); 
  left: calc(50% - 128px);
}

.region-modal-bg {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 64px);
  background: rgba(0,0,0,0.5);
  z-index: 100;
}
.region-modal {
  padding: 32px;
  width: 860px;
  height: 540px;
  background: #fff;
  border-radius: 8px;
  /*overflow-y: auto;*/
}
</style>

