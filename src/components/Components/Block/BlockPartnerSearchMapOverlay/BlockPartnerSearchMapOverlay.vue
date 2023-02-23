<template>
<div :style="[containerStyle]" class="position-relative">
    <!-- 검색된 상품 목록 -->
    <list-vertical :style="pagePadding">

      <!-- 검색창 -->
      <div slot="above-sort" class="position-relative full-width" style="margin: 16px 0 12px;">
        <input class="search-box" :style="brandBorder.main"
               type="text" maxlength="30" v-model.lazy="searchValue" @keyup="e => searchValue = e.target.value"
               @keyup.enter="onSearch" @focus="$emit('onFocus', searchValue)"
               placeholder="검색어를 입력하세요"/>
        <i class="material-icons icon-back unselect" @click="clickBack">keyboard_arrow_left</i>
        <i class="material-icons icon-cancel unselect" v-if="searchValue!==''" :style="brandColor.sub3" @click="clickCancel">cancel</i>
      </div>

      <div slot="middle-content" class="flex-between" style="align-items: center">

        <div class="flex-between full-width margin-bottom-12">
          <div class="size-14" :style="brandColor.main">{{ prop.address }}</div>
          <dropdown-sort :isPc="isPc" @onSort="onSort"
            model='partner'></dropdown-sort>
        </div>
      </div>

      <div slot="card" v-if="list" style="max-height:calc(100vh - 180px);overflow:auto;padding-bottom:100px">
        <component :is="cardName"
          v-for="(item,idx) in list" :idx="idx"
          :style="`border-top:${brandBorder.sub.border};padding-top:16px;padding-bottom: 16px`"
          :key="`card-prod-${item.id}-${idx}`"
          :card="item" @clickCard="clickCard(item)"
          :cardProps="cardProps"></component>
      </div>

    </list-vertical>

    <div v-if="list && list.length===0"
         class="empty-view"
         :style="brandColor.sub">검색 결과가 없습니다.</div>
         
    <div class="button-all" :style="[brandBgColor.brand3, brandColor.white]" @click="$router.back()">
        <i class="material-icons-outlined" style="font-size:17px;margin-right: 4px;vertical-align: bottom">map</i><span>지도</span>
      </div>
  </div>
</template>
<script>
import DropdownSort from "@/components/Components/Common/DropdownSort.vue"
import h11TCardPartner from "@/components/Components/Card/h11/CardPartner.vue"
import h11TCardPartnerPc from "@/components/Components/Card/h11/CardPartnerPc.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockPartnerSearchMapOverlay',
  components: {
    DropdownSort,
    h11TCardPartner,
    h11TCardPartnerPc
  },
  mixins: [
    PageMixin,
    HeaderMixin,
    ListMixin
  ],
  props: {
    isPc: {
      type: Boolean,
      default: false,
    },
    prop: {
      type: Object,
    },

  },
  data() {
    return {
      "list": undefined,
      "sort": "-created_time",
      "height": 0,
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
          "like": false,
          "name": true,
          "rate": true,
          "tags": true,
          "phone": true,
          "review": true,
          "address": false,
          "distance": false,
          "simple_desc": false
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "setAddress": undefined,
      "searchValue": "",
      "selectedTabId": "",
      "selectedCategory": "",
      "headerCenterStyle": {}
    }
  },
  created() {
    if (!this.isPc) {
      this.height = window.innerHeight;
    }
    this.init();
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.isPc) {
        window.addEventListener('resize', () => {
          this.height = window.innerHeight;
        })
      }
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
    clickCard(item) {
      if(!this.isPc) {
        this.$emit('closePage');
        setTimeout(()=>{
          this.routerPush(`partner_detail?id=${item.id}`);
        },300);
      } else {
        this.$emit('clickCard', item);
      }
    },
    clickBack() {
      this.$emit('closePage');
    },
    clickCancel() {
      this.searchValue = '';
      this.list = [];
      this.$emit('cancel');
    },
    onSort(res) {
      this.sort = res;
      this.getData();
    },
    onSearch() {
      let query = '';
      let delim = '?';
      let hasSearch = false;

      Object.keys(this.$route.query).forEach(key =>{
        delim = query === '' ? '?' : '&';
        if(key.indexOf('search')>-1) {
          if(this.searchValue!=='') {
            query += `${delim}search=${this.searchValue}`;
          }
          hasSearch = true;
        } else {
          query += `${delim}${key}=${this.$route.query[key]}`;
        }
      });
      if(!hasSearch) {
        delim = query.indexOf('?') === -1 ? '?' : '&';
        if(this.searchValue!=='') {
          query += `${delim}search=${this.searchValue}`;
        }
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
      }

      this.sort = this.prop.sort;
      this.rad = this.prop.rad;
    },
    getData() {
      let location = this.prop.location;

      this.url = `user/${this.user.user_id}/mapping/partner?fields=id,name,img,imgs,like_count,shared_count,visit,simple_desc,rate,reviews_count,min_price,phone,address,tags` +
        `&search_keyword=` + encodeURI(this.searchValue);

      this.url += '&page_num=1&page_length=12&hit=false';
      if(location!=='')
        this.url += `&location=${location}`;
      this.url += `&ordering=${this.sort}`
      this.currentPage = 1;

      this.$axios.get(this.url, {
        cancelToken: null
      }).then(res => {
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
    clickFilter(type) {
      this.filter = type;
      this.getData();
    }
  },
  computed: {
    cardName() {
      return this.isPc ? 'h11-t-card-partner-pc' : 'h11-t-card-partner';
    },
    containerStyle() {
      if(this.isPc) {
        return {};
      } else {
        let deco = {
          minHeight: '100vh',
          margin: '25px 0'
        }
        if (this.$store.getters.showAddrBar) {
          if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
            if (navigator.userAgent.split('iPhone OS ')[1].substring(0,2) >= 15) {
              deco.minHeight = `${this.height}px`
            } else {
              deco.minHeight = 'calc(100vh - 120px)'
            }
          } else if (this.$store.getters.browserType !== 'pc') {
            if (navigator.userAgent.indexOf('SamsungBrowser') > -1) {
              if (navigator.userAgent.split('SamsungBrowser/')[1].substring(0,2) >= 16) {
                deco.height = `${this.height}px`;
              } else {
                deco.height = 'calc(100vh - 50px)'
              }
            } else {
              deco.height = 'calc(100vh - 50px)'
            }
          }
        }
        return deco;
      }
    },
    filtered() {
      return this.$store.getters.filtered.length > 0;
    },
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    $route() {
      if(this.$route.query.search) {
        this.searchValue = this.$route.query.search;
      }
    }
  }
}
</script>
<style scoped>
.search-box {
    background: #FFFFFF;
    border-radius: 8px;
    width: 100%;
    height: 56px;
    line-height: 56px;
    padding: 0 12px 0 38px;
    font-size: 16px;
  }
  .icon-back {
    position: absolute;
    left: 0;
    top: 5px;
    padding: 8px 2px 8px 4px;
    font-size: 30px;
  }
  .icon-cancel {
    position: absolute;
    right: 4px;
    top: 8px;
    padding: 8px 4px;
    font-size: 24px;
  }
  .button-all {
    position: absolute;
    bottom: 70px;
    left: calc(50% - 50px);
    font-size: 12px;
    padding: 12px 16px;
    width: 100px;
    text-align: center;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 6px;
  }
</style>

