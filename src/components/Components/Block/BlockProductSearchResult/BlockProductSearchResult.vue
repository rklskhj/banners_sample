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
              <div>전체상품 {{ totalCount }}개</div>
              
              <div class="flex-align">
                <!-- 정렬 액션시트 -->
                <dropdown-sort @onSort="onSelectSorted"></dropdown-sort>
                
                <div @click="routerOverlay('FilterOverlay')" class="size-14 weight-400 flex-center unselect"
                  :style="brandColor.sub" style="margin-left: 8px; z-index: 1">
                  <!--<i class="material-icons" style="font-size: 18px; margin-right: 2px">tune</i>-->
                  <img :src="iconImg.filter" 
                    style="width:14px;height:14px;object-fit:contain;margin-right:4px">
                  <div>필터</div>
                </div>

              </div>
            </div>

          </div>
          
          <div slot="middle-content">
            <product-filter-list v-if="showFilterList"
              @selectFilter="getData" style="margin-bottom: 12px"></product-filter-list>
          </div>

          <div slot="card" v-if="list" style="min-height: 252px;">
          <transition-group name="fade" tag="div" class="grid-box">
              <v1-t-card-product
                v-for="(item,idx) in list"
                class="col-6"
                :style="cardStyle(idx)"
                :key="`card-prod-${item.id}-${idx}`"
                :card="item"
                :cardProps="cardProps"></v1-t-card-product>
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
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"
import ProductFilterList from "@/components/Components/Common/ProductFilterList.vue"
import DropdownSort from "@/components/Components/Common/DropdownSort.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockProductSearchResult',
  components: {
    v1TCardProduct,
    ProductFilterList,
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
      "iconImg": {
        "filter": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/42905594_thumb.png",
        "dropdown": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/39128693_thumb.png"
      },
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
            "coupon": false,
            "review": false,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "3:4"
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
    this.setCategoryName();
    this.init();
  },
  updated() {
    // 현재 카테고리
    this.setCategoryName();
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
        
        // 필터 정렬 사용X
        // else {
        //   sorting = this.$store.getters.sorted;
        // }
        
        let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
        fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
        fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';

        this.url = this.urlAppendFilter(this.$store.getters.filtered, sorting,
          `user/${this.user.user_id}/mapping/product?fields=${fields}` +
          `&search_keyword=` + encodeURI(this.searchValue));
        
        this.url += '&page_num=1&page_length=12';
        this.url += `&location=${location}&hit=false`;

        if(Number(this.$route.query.gnb)) {
          this.url += `&category=${this.$route.query.gnb}`;
        }
        else {
          this.url += '&category=';
        }

        this.currentPage = 1;

        this.$axios.get(this.url).then(res => {
          this.totalPages = res.data.total_page;
          this.totalCount = res.data.count;
          this.currentPage = 2;
          this.list = res.data.data;
          this.list.forEach(item => {
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
      let menu = this.$store.getters.brand.menu_set.filter(item => { return item.name === 'GNB' });
      if(menu && menu.length>0 && this.$route.query.gnb) {
        let sel = menu[0].menu.filter(item => { return item.id === Number(this.$route.query.gnb) })[0];
        if (sel) {
          this.selectedCategory = sel.name;
        }
        else this.selectedCategory = '';
      }
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
      this.setCategoryName();
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

