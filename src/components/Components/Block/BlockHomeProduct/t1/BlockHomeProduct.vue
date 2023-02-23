<template>
<div style="min-height:200px;padding:25px 0" :style="containerBg">  
  <div :style="pagePadding" style="padding-bottom:16px">
    <div v-if="type==='exhibition'">
      <div class="full-width flex-between">
        <div class="unselect" 
          :style="menuTitle">
          {{ exhibition.title }}</div>
        <div v-if="!useCategory && list && list.length > 0"
          class="size-14 weight-400 unselect p-primary"
          @click="goExhibition">전체보기</div>
      </div>
      
      <div v-if="exhibition.subtitle !== ''" class="full-width"
        style="margin-top: 6px" :style="menuSubtitle">{{ exhibition.subtitle }}</div>
        
      <div v-if="useCategory && categories && categories.length > 0"
        style="margin-top: 16px; padding: 8px 0"
        class="overflow-hidden full-width"
        v-dragscroll.x="true"
        @dragscrollmove.prevent.self="onDrag">
        <div class="grab-bing flex-align full-width">
          <div v-for="(category, idx) in categories" :key="'category-'+idx"
            class="unselect list-item size-13"
            :class="{
              'p-sub': category.id !== selectedCategory.id,
              'p-bg-white': category.id !== selectedCategory.id,
              'p-white': category.id === selectedCategory.id,
            }"
            style="height: 32px; border-radius: 30px; padding: 6px 16px"
            :style="categoryStyle(category)"
            @click.stop.prevent="clickCat(category, idx)">{{ category.name }}</div>
        </div>
      </div>
    </div>
    
    <div class="full-width" v-else>
      <div class="full-width" :style="menuTitle">
        {{ title }}
      </div>
      <div class="full-width" :style="menuSubtitle">{{ subtitle }}</div>
    </div>
  </div>
  
  <list-horizontal
    v-if="list&&list.length>0">
    <v1-t-card-product v-for="(item,idx) in list" :key="'card'+item.id"
      :card="item" :cardProps="cardProps" ref="card" slot="card"
      :style="cardStyle(idx)"></v1-t-card-product>
  </list-horizontal>
  <div v-else-if="list && list.length === 0"
    class="flex-justify size-14 weight-500 p-sub2"
    style="align-items: center" :style="{height: `${cardHeight}px`}">{{ noListText }}</div>
  
  <div v-if="useCategory && list && list.length > 0" :style="pagePadding" style="margin-top: 20px">
    <div class="flex-justify size-14 weight-400 unselect radius-8 p-border-main p-sub2"
      style="height: 48px; padding: 14px 0" @click="goExhibition">전체보기</div>
  </div>
</div>
</template>
<script>
import v1TCardProduct from "@/components/Components/Card/v1/CardProduct.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockHomeProduct',
  components: {
    v1TCardProduct
  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "type": "exhibition",
      "title": "오늘의 추천 상품 목록",
      "bgColor": "brandBgColor.main",
      "visible": true,
      "cumWidth": undefined,
      "dragging": false,
      "filtered": {
        "price": {
          "max": 0,
          "min": 0
        },
        "address": [],
        "category": [],
        "ordering": {
          "label": "",
          "value": ""
        }
      },
      "subtitle": "오늘의 추천 상품이에요",
      "cardProps": {
        "type": "product",
        "visible": {
          "partner": {
            "name": false,
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
              "price": false,
              "org_price": false,
              "discount_price": false
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
      "isShowing": false,
      "cardHeight": 303,
      "categories": [],
      "exhibition": {
        "id": 1,
        "title": "",
        "subtitle": ""
      },
      "titleStyle": {
        "size": 18,
        "align": "left",
        "color": "brandColor.main",
        "weight": "500"
      },
      "useCategory": false,
      "subtitleStyle": {
        "size": 13,
        "align": "left",
        "color": "brandColor.sub2",
        "weight": "normal"
      },
      "selectedCategory": undefined
    }
  },
  created() {
    if(!this.list || this.list.length===0) {
      this.init();
    }
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
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    },
    clickCat(item, idx) {
      // 드래그앤드 시 클릭방지
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedCategory = item;
      }
    },
    init() {
      this.getData();
    },
    getData() {
      if(this.type==='exhibition') {
        this.getExhibition()
      }
      else {
       this.getProducts(); 
      }
    },
    getExhibition() {
      let field = '&fields=title,start_date,end_date,display_type,desc,img,id,'
      field += 'products.id,products.name,products.img,products.simple_desc,products.discount_time,products.rate,products.review_count,products.reviews_count,'
      field += 'products.is_like,products.address,products.price,products.partner.name,products.partners,products.location,products.has_download_coupon,products.tags,'
      field += 'products.order_conversion_type,products.possible_reservation_resv,products.possible_booking_resv,products.soldout,'
      field += 'products.stock_type,products.stock,category_type,category'
      this.$axios.get(`user/${this.user.user_id}/mapping/exhibition/${this.exhibition.id}?ordering=id${field}`)
      .then(res => {
        this.useCategory = res.data.category_type;
        // 기획전 노출여부 노출안함일때
        if (res.data.display_type === 2) {
          this.isShowing = false;
        } else if (res.data.display_type === 1) { // 기획전 노출여부 기간노출일때
          let date = new Date().getTime();
          let start_date = new Date(res.data.start_date).getTime();
          let end_date = new Date(res.data.end_date).getTime();
          
          if (date > start_date && date < end_date) {
            this.isShowing = true;
          }else{
            this.isShowing = false;
          }
        } else { // 기획전 노출여부 노출일때
          this.isShowing = true;
        }
        if (this.isShowing) {
          if (res.data.category_type) {
            this.categories = res.data.category;
            this.selectedCategory = this.categories[0];
            this.getCategoryProductList(this.selectedCategory);
          } else {
            let arr = [];
            res.data.products.forEach(item => {
              if(item.hasOwnProperty('partners')) {
                item.partner = item.partners;
                delete item.partners;
              }
              if (item.order_conversion_type !== 10 && item.order_conversion_type !== 11 && (item.stock_type !== 0 || item.stock !== 0)) {
                arr.push(item);
              } else if (item.order_conversion_type === 10 && item.possible_reservation_resv) {
                arr.push(item);
              } else if (item.order_conversion_type === 11 && item.possible_booking_resv) {
                arr.push(item);
              }
            })
            if (arr.length > 10) {
              this.list = arr.slice(0, 10);
            } else {
              this.list = arr;
            }
          }
        } else {
          this.list = [];
        }
        this.exhibition.title = res.data.title;
        if(res.data.desc) {
          this.exhibition.subtitle = res.data.desc;
        }
      })
    },
    getCategoryProductList(category) {
      let arr = [];
      category.product_list.forEach(item => {
        if (item.order_conversion_type !== 10 && item.order_conversion_type !== 11 && (item.stock_type !== 0 || item.stock !== 0)) {
          arr.push(item);
        } else if (item.order_conversion_type === 10 && item.possible_reservation_resv) {
          arr.push(item);
        } else if (item.order_conversion_type === 11 && item.possible_booking_resv) {
          arr.push(item);
        }
      })
      this.list = arr;
    },
    getProducts() {
      let fields = '?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags';
      fields += ',order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout';
      fields += ',partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon';
      
      let url = `user/${this.user.user_id}/mapping/product${fields}&page_num=1&page_length=10`;
      let category = this.filtered.category;
      let price = this.filtered.price;
      let address = this.filtered.address;
      let ordering = this.filtered.ordering;
      
      if(category&&category.length>0) {
        let str = '';
        for(let i=0;i<category.length;i++) {
          if(i===0) {
            str = category[i].value;
          }
          else {
            str += ',' + category[i].value;            
          }
        }
        
        url += '&category=' + str;
      }
      
      if(price.min>0) {
        url += '&min_sale_price=' + price.min;
      }
      if(price.max>0) {
        url += '&max_sale_price=' + price.max;
      }
      
      if(address&&address.length>0) {
        let str = '';
        for(let i=0;i<address.length;i++) {
          if(i===0) {
            str = address[i].value;
          }
          else {
            str += ',' + address[i].value;            
          }
        }
        url += '&able_address=' + str;
      }
      
      if(ordering.value) {
        url += '&ordering=' + ordering.value;
      }
      
      // let sorting = '';
      // if(this.filtered.length>0) {
      //   url = this.urlAppendFilter(this.filtered, sorting, url)
      // }
      console.log('getData',url)
      
      this.$axios.get(url)
      .then(res => {
        let arr = [];
        res.data.data.forEach(item => {
          if (item.order_conversion_type !== 10 && item.order_conversion_type !== 11 && (item.stock_type !== 0 || item.stock !== 0)) {
            arr.push(item);
          } else if (item.order_conversion_type === 10 && item.possible_reservation_resv) {
            arr.push(item);
          } else if (item.order_conversion_type === 11 && item.possible_booking_resv) {
            arr.push(item);
          }
        })
        this.list = arr;
        
      })
    },
    cardStyle(idx) {
      let obj = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '220px',
        marginRight: '16px'
      };
      
      if(idx===0) {
        obj.marginLeft = this.pagePaddingAll.padding;
      } else if (idx === this.list.length - 1) {
        obj.marginRight = this.pagePaddingAll.padding;
      }
      
      return obj;
    },
    goExhibition() {
      this.routerPush(`exhibition_detail?id=${this.exhibition.id}`);
    },
    categoryStyle(item) {
      let deco = {};
      if (item.id === this.selectedCategory.id) {
        deco.backgroundColor = this.brandColor.main.color;
      }
      return deco;
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor)
      }
    },
    noListText() {
      if (this.type==='exhibition') {
        return '기획전 기간이 종료되었거나, 기획전 상품 목록이 없습니다.';
      } else {
        return '상품 목록이 없습니다.';
      }
    },
    menuTitle() {
      return {
        fontSize: this.titleStyle.size + 'px',
        fontWeight: this.titleStyle.weight,
        color: this.parseColor(this.titleStyle.color),
        textAlign: this.titleStyle.align,
        wordBreak: 'keep-all',
        flex: 1
      } 
    },
    menuSubtitle() {
      return {
        fontSize: this.subtitleStyle.size + 'px',
        fontWeight: this.subtitleStyle.weight,
        color: this.parseColor(this.subtitleStyle.color),
        textAlign: this.subtitleStyle.align,
      } 
    }
  },
  watch: {
    selectedCategory(n) {
      this.getCategoryProductList(n);
    }
  }
}
</script>
<style scoped>
.grab-bing {
  white-space: nowrap;
  position: relative;
}
.list-item {
  display: inline-block;
}
</style>

