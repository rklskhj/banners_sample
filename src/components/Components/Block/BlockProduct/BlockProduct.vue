<template>
<div :style="[containerStyle, pageBg]" class="position-relative">
    <div style="padding-bottom:24px;" :style="{marginTop: marginTop}">

          <!-- 검색된 상품 목록 -->
          <list-vertical :style="pagePadding">
            
            <div slot="middle-content" style="margin:24px 0;">
              <div class="flex-between size-14 weight-400"
                :style="brandColor.sub">
                <div>전체상품 {{ totalCount }}개</div>
                
                <div class="flex-align" style="gap: 0 16px">
                  <!-- 정렬 액션시트 -->
                  <dropdown-sort @onSort="onSelectSorted"></dropdown-sort>
                  
                  <div @click="routerOverlay('FilterOverlay')" class="size-14 weight-400 flex-center unselect"
                    :style="brandColor.sub" style="z-index: 1">
                    <!--<i class="material-icons" style="font-size: 18px; margin-right: 2px">tune</i>-->
                    <img :src="iconImg.filter" 
                      style="width:14px;height:14px;object-fit:contain;margin-right:4px">
                    <div>필터</div>
                  </div>

                </div>
              </div>

            </div>
            
            <div slot="middle-content">
              <product-filter-list v-if="showFilterList" @selectFilter="getData"></product-filter-list>
            </div>

            <div slot="card" v-if="list" style="min-height: 252px; margin-top: 16px">
            <transition-group name="fade" tag="div" class="list-grid">
                <v1-t-card-product
                  v-for="(item,idx) in list"
                  :key="`card-prod-${item.id}-${idx}`"
                  :card="item"
                  :cardProps="cardProps"></v1-t-card-product>
            </transition-group>
            <div v-if="list && list.length===0"
              class="empty-view"
              :style="brandColor.sub">상품 목록이 없습니다.</div>
            </div>
          </list-vertical>

    </div>
    
  </div>
</template>
<script>
import DropdownSort from "@/components/Components/Common/DropdownSort.vue"
import ListHorizontalCategory from "@/components/Components/Common/ListHorizontalCategory.vue"
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"
import ProductFilterList from "@/components/Components/Common/ProductFilterList.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"

export default {
  name: 'BlockProduct',
  components: {
    DropdownSort,
    ListHorizontalCategory,
    v1TCardProduct,
    ProductFilterList
  },
  mixins: [
    PageMixin,
    ListMixin,
    HeaderMixin
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
      "marginTop": "0",
      "cartLength": 0,
      "setAddress": undefined,
      "searchValue": "",
      "sortOptions": undefined,
      "selectedCategory": "",
      "headerCenterStyle": {}
    }
  },
  created() {
    this.pageLoadType = 'infinite';
    this.init();
    //this.setCartLength();
    // 현재 카테고리
    this.setCategoryName();
  },
  
  methods: {
    setListMarginTop(menu) {
      if(menu && menu.length>0) {
        this.marginTop = '101px';
      } else {
        this.marginTop = '0px';
      }
    },
    setCartLength() {
      this.cartLength = this.$store.getters.cart.length;
    },
    init() {
        this.pageLoadType = 'infinite';
        
        this.headerCenterStyle = {
          position: 'static',
          transform: 'none',
          left: 0
        };      

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
            value: this.sorted.replace('-pop_score', '-partner__pop_score')
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
          `user/${this.user.user_id}/mapping/product${fields}` +
          `&search_keyword=` + encodeURI(this.searchValue));
        
        this.url += '&page_num=1&page_length=20';
        this.url += `&location=${location}&hit=false`;

        if(Number(this.$route.query.gnb)) {
          if(this.$route.query.cat) {
            this.url += `&category=${this.$route.query.cat}`;
          } else {
           this.url += `&category=${this.$route.query.gnb}`; 
          }
        }

        this.currentPage = 1;
        this.loading = true;
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
              delivery_method: '',
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
            if(price.is_discount) {
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
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },
    setCategoryName() {
      this.selectedCategory = '상품목록';
      let gnb = this.$route.query.gnb;
      if (gnb && gnb !== '') {
        gnb = Number(gnb);
      }
      for(let cat1 of this.$store.getters.category) {
        if(cat1.value === gnb) {
           this.selectedCategory = cat1.label;
           break;
        } else if (cat1.child && cat1.child.length > 0) {
          for (let cat2 of cat1.child) {
            if (cat2.value === gnb) {
              this.selectedCategory = cat2.label;
              break;
            } else if (cat2.child && cat2.child.length > 0) {
              for (let cat3 of cat2.child) {
                if (cat3.value === gnb) {
                  this.selectedCategory = cat3.label;
                  break;
                }
              }
            }
          }
        }
      }
    },
    onSelectSorted(val) {
        this.sorted = val;
        this.getData();
      },
    onClickTab(item) {
        this.selectedTabId = item;
        this.list = undefined;
        this.getData();
        this.setCategoryName();
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
      obj.paddingBottom = `${gutters * 2}px`;
      
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
    containerStyle() {
      return {
        minHeight: 'calc(100vh - 50px)'
      }
    },
    pageBg() {
      return this.brandBgColor.main;
    },
    notifyStyle() {
      return {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        top: '-4px',
        right: '-4px'
      }
    }
  },
  watch: {
    '$store.getters.filtered'() {
      this.getData();
    },
    '$route.query'(n) {
      this.setCategoryName();
      this.getData();
  }
  }
}
</script>
<style scoped>
.list-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
</style>

