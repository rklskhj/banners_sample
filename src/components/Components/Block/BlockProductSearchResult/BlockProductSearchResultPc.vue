<template>
<div class="flex-justify position-relative">
    
    <div :style="pcMaxWidth">
      <!-- 검색 -->
      <div class="search-wrapper" style="margin-top:32px">
        <i class="material-icons unselect" @click="onSearch">search</i>
        <input class="size-16" v-model="searchValue" type="text" placeholder="검색어를 입력해 주세요." @keyup.enter="onSearch"/>
      </div>
      
      <div class="flex-between position-relative" style="margin-bottom: 12px; margin-top: 8px">
        
        <!--<bread-crumb-pc :breadcrumb="breadcrumb"></bread-crumb-pc>-->
        
        <!--지정 위치-->
        <!--<location-comp @clicked="showRegion=true"-->
        <!--  :class="{ 'location-comp-fixed' : showRegion, 'location-comp-absolute' : !showRegion }"-->
        <!--  @currentAddress="val=>address=val" -->
        <!--  :currentStatus="currentStatus"-->
        <!--  @currentStatus="currentStatus=false"-->
        <!--  :changePosition="changePosition" -->
        <!--  @changePosition="changePosition=undefined"></location-comp>-->
        <div>
          <!--<div class="size-20 weight-500" :style="brandColor.main">'{{ searchValue }}' 검색 결과</div>-->
          <div v-if="list" class="size-14" :style="brandColor.sub">검색결과 총 {{ list.length }}개</div>
        </div>
        
        <div class="flex-align size-14" :style="brandColor.sub">
          <!-- 정렬 드롭다운 -->
          <div style="min-width:84px;margin-right:24px" v-click-outside="closeDropdown">
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
          
          <div @click="routerOverlay('FilterModal')" class="size-14 weight-400 flex-center unselect"
            :style="brandColor.sub" style="z-index: 1">
            <!--<i class="material-icons" style="font-size: 18px; margin-right: 2px">tune</i>-->
            <img :src="iconImg.filter" 
              style="width:14px;height:14px;object-fit:contain;margin-right:4px">
            <div>필터</div>
          </div>

        </div>
      </div>
      
      <product-filter-list-pc v-if="$store.getters.filtered.length !== 0"
        @selectFilter="getData"></product-filter-list-pc>

      <!-- 검색된 상품 목록 -->
      <list-vertical style="margin-top:16px;">
        <div slot="card-grid" class="full-width">
          <transition-group name="fade" tag="div" class="full-width flex wrap">
            <v1-t-card-product-pc v-for="(item, idx) in list"
              :style="cardStyle(idx)"
              class="col-3"
              :key="'card-prod-'+idx"
              :idx="idx"
              :card="item"
              :cardProps="cardProps"></v1-t-card-product-pc>
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
import t1TButtonFilter from "@/components/Components/Button/t1/ButtonFilter.vue"
import LocationComp from "@/components/Components/Common/LocationComp.vue"
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"
import BlockRegionPc from "@/components/Components/Block/BlockRegionPc.vue"
import BreadCrumbPc from "@/components/Components/Common/BreadCrumbPc.vue"
import ProductFilterListPc from "@/components/Components/Common/ProductFilterListPc.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockProductSearchResultPc',
  components: {
    t1TButtonFilter,
    LocationComp,
    v1TCardProductPc,
    BlockRegionPc,
    BreadCrumbPc,
    ProductFilterListPc
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
        "type": "product",
        "visible": {
          "partner": {
            "name": true,
            "address": false,
            "simple_desc": false
          },
          "product": {
            "cart": false,
            "like": false,
            "name": true,
            "rate": false,
            "tags": false,
            "price": {
              "price": true,
              "org_price": true,
              "discount_price": true
            },
            "coupon": true,
            "review": false,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "3:4"
        }
      },
      "breadcrumb": [],
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
  
  methods: {
    init() {
        this.pageLoadType = 'infinite';
        
        this.headerCenterStyle = {
          position: 'static',
          transform: 'none',
          left: 0
        };      


        this.searchValue = this.$route.query.search ? this.$route.query.search : '';
        // 카테고리
        // this.$axios.get('public/category').then(res=> {
        //   this.category = res.data;
        //   this.category.unshift({id:this.categoryAllId, name:'전체보기'})
          
          this.category = this.$store.getters.category;
          
          this.$axios.get(`public/service/set/filter/${this.filterId}`)
          .then(res =>{
            
            this.sortOptions = res.data.sort;

            // active 필터링            
            this.sortOptions = this.sortOptions.filter(item => item.is_active);
            
            this.sortOptions.forEach(option => {
              if (option.value === '-price__price') {
                option.value = '-price__mixed_price'
              } else if (option.value === 'price__price') {
                option.value = 'price__mixed_price'
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

        // })

      },
    getData() {
        let location = '';
        if (this.$store.getters.currentPosition===undefined) location = '';
        else {
          location = `${this.$store.getters.currentPosition.lng},${this.$store.getters.currentPosition.lat}`;
        }
        
        // let sorting = ''
        // if (typeof(this.sorted)==='string' && this.sorted !== '') {
        //   sorting = {
        //     value: this.sorted.replace('-visit', '-partner__visit').replace('-pop_score', '-partner__pop_score')
        //   }
        // }
        
        if (typeof(this.sorted)==='object'&&this.sorted.value!==undefined) this.sorted = this.sorted.value; 
        
        let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
        fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
        fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';

        this.url = this.urlAppendFilter(this.$store.getters.filtered, sorting,
          `user/${this.user.user_id}/mapping/product?fields=${fields}` +
          `&search_keyword=` + encodeURI(this.searchValue));
        
        this.url += '&page_num=1&page_length=12';
        this.url += `&location=${location}`;
        this.url += `&ordering=${this.sorted}`;
        this.url += `&category=${this.tabId}&hit=false`;
        
        // 카테고리로 브래드크럼 세팅
        // this.setBreadCrumb();
        // 카테고리 한글네임
        this.setCategoryName();
        
        this.currentPage = 1;

        this.$axios.get(this.url).then(res => {
          this.totalPages = res.data.total_page;
          this.totalCount = res.data.count;
          this.currentPage = 2;
          
          res.data.data.forEach(item => {
            item.btnHovered = false;
            item.isMouseover = false;
            
            item.order_product = {
              product_id: item.id,
              name: item.name,
              quantity: 1,
              comm_price: 0,
              point: 0,
              discount_price: 0,
              total_price: 0,
              coupon_price: 0,
              img: item.img,
              delivery_price: item.price.delivery_price,
              order_product_option: [],
              product: this.cloneItem(item),
            }
            
            let comm_price = 0;
            let point_price = 0;
            let discount_price = 0;
            let price = item.price;
            let product_price = price.price;
        
            // 속성 옵션일 경우 상품가격 + 옵션가
            // 0: 비율, 1: 금액
            // 수수료, 포인트, 할인 계산
            if(price.is_point) {
              if(price.point_type===0) point_price = product_price * price.point_rate / 100;
              else point_price = price.point;
            }
            if(this.isDiscount(item)) {
              if(price.discount_type===0) discount_price = product_price * price.discount_rate / 100;
              else discount_price = price.discount_price;
            }
            if(price.is_comm) {
              if(price.comm_type===0) comm_price = product_price * price.comm_rate / 100;
              else comm_price = price.comm_price;
            }
        
            item.order_product.comm_price = comm_price;
            item.order_product.point = point_price;
            item.order_product.discount_price = discount_price;
            item.order_product.product_price = product_price;
            item.order_product.total_price = product_price - discount_price;
          })
          this.list = res.data.data;
        });
      },
    isDiscount(item) {
      if (item.price.is_discount) {
        if (item.price.discount_period_type === false) {
          if (item.price.discount_start !== null && item.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < item.price.discount_start || currentDate > item.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else if (item.price.discount_start !== null && item.price.discount_end === null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < item.price.discount_start) {
              return false;
            } else {
              return true;
            }
          } else if (item.price.discount_start === null && item.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate > item.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    setCategoryName() {
      if (this.category && this.category.length>0) {
        let sel = this.category.filter(item => item.id===this.tabId)[0];
        if (sel) {
          this.selectedCategory = sel.name;
        }
        else this.selectedCategory = '';
      }
    },
    setBreadCrumb() {
      this.breadcrumb = [];
      
      this.breadcrumb.push({
        "link": "home",
        "name": "홈"
      });

      // 카테고리 브래드크럼      
      let catList = [];
      this.category.forEach(cat => {
        let search = this.$route.query.search ? this.$route.query.search : '';
        cat.link = `product?tab=${cat.id}&search=${search}`
        catList.push(cat);
      })
      let currentBread;
      if (this.$route.query.tab===undefined || this.$route.query.tab==='') currentBread = catList[0];
      else currentBread = find(catList, 'id', parseInt(this.$route.query.tab));
      
      this.breadcrumb.push({
        name: currentBread.name,
        link: currentBread.link,
        list: catList
      })
    },
    onSelectSorted(val) {
        this.sorted = val;
        this.getData();
      },
    onClickTab(item) {
        this.selectedTabId = item;
        this.getData();
        this.setCategoryName();
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
        marginBottom: '32px'
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
    },
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
    },
    '$store.getters.defaultPartner'(n) {
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
  top: 30px;
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
.search-wrapper {
  display: flex;
  align-items: center;
  width: 343px;
  border-bottom: 1px solid #C4C4C4;
  color: #222222;
  padding-bottom: 4px;
}
.search-wrapper input {
  border: 0;
  padding-left: 10px;
  width: 100%;
}
</style>

