<template>
<div>
  
  <list-vertical>
    
    <div slot="middle-content" style="margin:24px 0 16px;">
      <div class="flex-between size-14 weight-400 p-sub">
        <div>전체상품 {{ totalCount }}개</div>
        
        <div class="flex-align">
          <!-- 정렬 액션시트 -->
          <dropdown-sort @onSort="onSelectSorted"></dropdown-sort>
          
          <div @click="routerOverlay('FilterOverlay')"
            class="size-14 weight-400 flex-center unselect p-sub"
            style="margin-left: 8px; z-index: 1">
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
    
    <div slot="card" v-if="list && list.length > 0" style="margin-top: 16px">
      <h12-t-card-product v-for="(item,idx) in list"
        :key="`card-prod-${item.id}-${idx}`"
        :card="item" :style="cardStyle(idx)"
        :cardProps="cardProps"></h12-t-card-product>
      <div v-if="totalPages > 1 && currentPage !== totalPages"
        class="flex-center p-border-main radius-8 unselect size-14 p-sub" @click="showMore"
        style="width: 100%; height: 48px; margin-top: 24px">더보기</div>
    </div>
  </list-vertical>
  <div v-if="list&&list.length===0" class="empty-view p-sub2 size-14">상품이 없습니다.</div>
</div>
</template>
<script>
import h12TCardProduct from "@/components/Components/Card/h12/CardProduct.vue"
import DropdownSort from "@/components/Components/Common/DropdownSort.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'ListPartnerProduct',
  components: {
    h12TCardProduct,
    DropdownSort
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
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
      }
    }
  },
  created() {
    this.currentPage = 1;
    this.init();
  },
  mounted() {

  },
  
  methods: {
    showMore() {
      this.currentPage += 1;
      this.getData();
    },
    init() {
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
      if (typeof(this.sorted)==='object'&&this.sorted.value!==undefined) this.sorted = this.sorted.value;
      let num = 1;
      if (this.currentPage !== 1) {
        num = this.currentPage;
      }
      
      if (this.currentPage > 1 && this.currentPage === this.totalPages) return;
      
      let fields = 'id,name,img,like_count,has_download_coupon,visit,simple_desc,rate,reviews_count,partner.name,price,params,address,tags,soldout';
      fields += ',order_conversion_type,stock,stock_type,possible_booking_resv,possible_reservation_resv'
      let url = `/user/0/mapping/product?partner_id=${this.$route.query.id}&fields=${fields}&page_num=${num}&page_length=5`;
      url += `&ordering=${this.sorted}`
      
      if (this.$store.getters.service.package.indexOf('booking') > -1) {
        if (this.$store.getters.selectedResv) {
          url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`
          url += `&booking=${this.$store.getters.selectedResv.resv_date},${this.$store.getters.selectedResv.resv_end_date}`;
        }
        if (this.$store.getters.bookingMinimum) {
          url += `&booking_minimum=${this.$store.getters.bookingMinimum}`;
        }
      }
      
      url = this.urlAppendFilter(this.$store.getters.filtered, {}, url);
      this.$axios.get(url).then(res => {
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.list = this.list ? this.list.concat(res.data.data) : res.data.data;
      });
    },
    onSelectSorted(val) {
        this.sorted = val;
        this.getData();
      },
    cardStyle(idx) {
      let deco = {
        width: '100%',
        marginBottom: '16px'
      }
      if (idx === this.list.length - 1) {
        deco.marginBottom = '0px'
      }
      return deco;
    }
  },
  computed: {
    showFilterList() {
      return this.$store.getters.filtered.length > 0;
    }
  },
  watch: {
    '$store.getters.filtered'() {
      this.getData();
    }
  }
}
</script>


