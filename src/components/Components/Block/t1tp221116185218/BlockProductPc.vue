<template>
<div :style="pcMaxWidth" class="grid-box" style="padding-top:40px">
    <div class="col-4">
      <aside-category
        @category1="e => category1 = e"
        @category2="e => category2 = e"
        @category3="e => category3 = e"
        ></aside-category>
    </div>
    <div class="col-8">
      <!-- Bread Crumb -->
      <div class="flex-align" :style="brandColor.sub">
        <div class="unselect size-13" @click="routerPush('home')">홈</div>
        <i class="material-icons" style="user-select: none; font-size: 20px">chevron_right</i>
        <div v-if="category1" @click="routerPush(`/product?gnb=${category1.id}`)"
          class="unselect size-13">{{ category1.name }}</div>
        <i v-if="category2" class="material-icons" style="user-select: none; font-size: 20px">chevron_right</i>
        <div v-if="category2" @click="routerPush(`/product?gnb=${category2.id}`)"
          class="unselect size-13">{{ category2.name }}</div>
        <i v-if="category3" class="material-icons" style="user-select: none; font-size: 20px">chevron_right</i>
        <div v-if="category3" @click="routerPush(`/product?gnb=${category3.id}`)"
          class="unselect size-13">{{ category3.name }}</div>
      </div>
      <div class="flex-between position-relative" style="margin-bottom: 16px; margin-top: 28px">
        <!-- 선택된 카테고리 명 -->
        <div class="size-13" :style="brandColor.main">총 {{ list && list.length !== 0 ? list.length : 0 }}개</div>
  
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
      
      <!-- 선택된 필터 목록 -->
      <product-filter-list-pc style="margin-top: 10px"></product-filter-list-pc>
      
      <!-- 검색된 상품 목록 -->
      <list-vertical style="margin-top:30px;">
        <div slot="card-grid" class="full-width">
          <transition-group name="fade" tag="div" class="full-width grid-wrap"
            :style="gridWrapStyle">
            <v2-t-card-product-pc v-for="(item, idx) in list"
               :key="'card-prod-'+idx"
               :idx="idx"
               :card="item"
               :cardProps="cardProps"></v2-t-card-product-pc>
          </transition-group>
          <div v-if="list && list.length===0" key="empty-view"
               class="empty-view"
               :style="brandColor.sub">상품 목록이 없습니다.</div>
  
        </div>
      </list-vertical>
    </div>
  </div>
</template>
<script>
import v2TCardProductPc from "@/components/Components/Card/v2/CardProductPc.vue"
import DropdownCategory from "@/components/Components/Common/DropdownCategory.vue"
import AsideCategory from "@/components/Components/Common/AsideCategory.vue"
import ProductFilterListPc from "@/components/Components/Common/ProductFilterListPc.vue"
import ButtonFilter from "@/components/Components/Button/ButtonFilter.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockProductPc',
  components: {
    v2TCardProductPc,
    DropdownCategory,
    AsideCategory,
    ProductFilterListPc,
    ButtonFilter
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "title": "",
      "sorted": {
        "value": ""
      },
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
          "ratio": "1:1"
        }
      },
      "category1": {},
      "category2": undefined,
      "category3": undefined,
      "cardColumn": 3,
      "sortOptions": undefined,
      "cardComponent": {
        "templateName": "a1",
        "componentName": "CardProductPc"
      }
    }
  },
  created() {
      this.init();
    },
  mounted() {

    },
  
  methods: {
    init() {
        this.pageLoadType = 'infinite';
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

      },
    getData() {
        let location = '';
        if (this.$store.getters.currentPosition===undefined) location = '';
        else {
          location = `${this.$store.getters.currentPosition.lng},${this.$store.getters.currentPosition.lat}`;
        }
        if (typeof(this.sorted)==='object'&&this.sorted.value!==undefined) this.sorted = this.sorted.value;
        
        let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
        fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
        fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';
        
        this.url = `user/${this.user.user_id}/mapping/product${fields}`;
        this.url += '&page_num=1&page_length=12';
        this.url += `&location=${location}`;
        this.url += `&ordering=${this.sorted}`;
        this.url += `&category=${this.gnb}&hit=false`;
        this.url = this.urlAppendFilter(this.$store.getters.filtered, {}, this.url);


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
    closeDropdown() {
        this.dropdown.isOpen = false;
      },
    toggleList() {
        this.dropdown.isOpen = !this.dropdown.isOpen;
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
    clickItem(item) {
        this.dropdown.selected = item;
        this.dropdown.isOpen = false;
        this.onSelectSorted(item.value);
      },
    onSelectSorted(val) {
        this.sorted = val;
        this.getData();
      },
    cardStyle(idx) {
        let gutters = this.$store.getters.brand.layout_gutters;
        let gutter = gutters * 0.5;
        let width = `${(((this.$store.getters.brand.layout_maxwidth*8/12) - gutters * (this.cardColumn-1)) / this.cardColumn).toFixed(2)}px`;

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
    gridWrapStyle() {
      return {
        gridTemplateColumns: `repeat(${this.cardColumn}, 1fr)`
      }
    },
    gnb() {
      let gnb = "";
      if (this.$route.query.gnb===undefined || this.$route.query.gnb==="" || this.$route.query.gnb==="0") gnb = "";
      else gnb = parseInt(this.$route.query.gnb);
      return gnb;
    }
  },
  watch: {
    '$route'() {
        this.getData();
      },
    '$store.getters.filtered'(n) {
      this.getData();
    }
  }
}
</script>
<style scoped>
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
    top: 42px;
    padding: 7px 0;
    right: 0;
    width: 116px;
  }

  .category-ul {
    background-color: white;
    border: 1px solid #e3e3e3;
    padding: 6px 0px;
    top: 39px;
    left: -1px;
    width: 260px;
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
  .grid-wrap {
    display: grid;
    gap: 24px;
  }
</style>

