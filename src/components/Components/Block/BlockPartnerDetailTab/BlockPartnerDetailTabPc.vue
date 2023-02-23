<template>
<div v-if="partner"  class="position-relative" 
     :style="[brandBgColor.white, pcMaxWidth]" style="margin:16px 0">
  <div class="flex-center" ref="tabMenu" id="tabMenu"
    :style="[fixedStyle, brandBgColor.white, {borderBottom: brandBorder.main.border}]">
    <div v-for="(item,idx) in menu" :key="'menu-'+idx" class="tab-item unselect"
         :style="tabItemStyle(item)"
         @click="clickMenuItem(item, idx)">{{ item.name }}<span v-if="item.count" style="margin-left:4px">{{ item.count }}</span></div>
  </div>
  
  <div id="item1">
    <div style="padding-top:40px;padding-bottom:40px;">
      <template v-if="partner.phone && partner.phone !== ''">
        <div class="flex-align">
          <i class="material-icons-outlined icon-info p-sub3">call</i>
          <a :href="`tel:${partner.phone}`" style="text-decoration:none">
            <div class="size-14 p-sub">{{ partner.phone }}</div>
          </a>
        </div>
        <div class="divider"></div>
      </template>
      <template v-if="partner.address && partner.address !== ''">
        <div class="flex-align">
          <i class="material-icons-outlined icon-info p-sub3">location_on</i>
          <div class="size-14 p-sub">{{ partner.address }}</div>
          <div class="flex-align" style="margin-left:6px; padding: 0 8px" :style="brandColor.primary" @click="clickAddress">
            <i class="material-icons" style="font-size:16px">content_copy</i>
            <div class="size-14" style="margin-left: 4px">주소복사</div>
          </div>
        </div>
        <div class="divider"></div>
      </template>
      <template v-if="partner.operating_time && partner.operating_time !== ''">
        <div class="flex">
          <i class="material-icons-outlined icon-info p-sub3">access_time</i>
          <div class="size-14 p-sub">영업시간
            <div style="white-space:pre-line">{{ partner.operating_time }}</div>
          </div>
        </div>
        <div class="divider"></div>
      </template>
      <template v-if="partner.homepage && partner.homepage !== ''">
        <div class="flex-align">
          <i class="material-icons-outlined icon-info p-sub3">home</i>
          <a :href="partner.homepage" target="_blank" style="text-decoration:none">
            <div class="size-14" :style="brandColor.primary">{{ partner.homepage }}</div>
          </a>
        </div>
        <div class="divider"></div>
      </template>
      <!-- SNS 문의 전환-->
      <template v-if="$store.getters.brand.plugins.indexOf('sns_inquiry') > -1">
        <div class="flex-align" style="height: 32px">
          <div class="flex-between" style="gap: 0 12px">
            <span style="width: 32px; height: 32px"
              :style="!isHomepageActive ? deactivated : ''">
              <a class="unselect" :href="`${getHomepageHref}`" target="_blank"
                :style="!isHomepageActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click="clickHomepageBtn($event)">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/47403855.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
            <span style="width: 32px; height: 32px"
              :style="!isKakaoActive ? deactivated : ''">
              <a class="unselect" :href="'#'" target="_blank"
                :style="!isKakaoActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click.prevent="clickKakaoBtn">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/04669285.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
            <span style="width: 32px; height: 32px"
              :style="!isInstagramActive ? deactivated : ''">
              <a class="unselect" :href="`${getInstagramHref}`" target="_blank"
                :style="!isInstagramActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click="clickInstagramBtn($event)">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/11063162.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
            <span style="width: 32px; height: 32px"
              :style="!isNaverBlogActive ? deactivated : ''">
              <a class="unselect" :href="`${getNaverBlogHref}`" target="_blank"
                :style="!isNaverBlogActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click="clickNaverBlogBtn($event)">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/17025317.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
          </div>
        </div>
      </template>
    </div>
    <e-editor :html="partner.info" :style="brandBgColor.white"></e-editor>
  </div>
  <div id="item2" style="margin-top:40px">
    <template v-if="list && list.length > 0">
      <div>
        <div class="flex-between size-16 weight-500"
          :style="brandColor.main">
          <div>전체 상품 {{ totalCount }}개</div>
          
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

      </div>
        
      <product-filter-list-pc style="margin-top: 10px"
        v-if="showFilterList"></product-filter-list-pc>
      
      <list-vertical v-if="list && list.length>0"
        style="margin-top: 24px">
        <div slot="card-grid" class="full-width">
          <div class="full-width flex wrap">
            <v1-t-card-product-pc  v-for="(item,idx) in list"
              :style="cardStyle(idx)"
              :key="`card-prod-${item.id}-${idx}`"
              :idx="idx"
              :card="item"
              :cardProps="cardProps"></v1-t-card-product-pc>
          </div>
        </div>
      </list-vertical>
    </template>
  </div>
  <div id="item3" style="padding-top:40px; padding-bottom: 40px">
    <list-product-review-pc :isProd="false" @totalCount="res => setTotalCount('review', res)"></list-product-review-pc>  
  </div>
  
  <div id="item4" style="padding-top:40px">
    <list-product-inquiry-pc :isProd="false" @totalCount="res => setTotalCount('inquiry', res)"></list-product-inquiry-pc>  
  </div>
  
  <div v-if="partner.address" style="margin-top:50px">
    <div class="size-22 weight-700 margin-bottom-24" :style="brandColor.main">위치</div>
    <div class="flex-align margin-bottom-16" :style="brandColor.sub">
      <div class="flex-align"><i class="material-icons-outlined" style="font-size:24px">location_on</i>
      <div style="margin-right:16px" class="size-16">{{ partner.address }}</div></div>
      <div class="flex-align size-10" @click="clickAddress"><i class="material-icons-outlined" style="font-size:13px">content_copy</i>
      <div>주소복사</div></div>
    </div>
    <location-map-block :latitude="partner.location.latitude" :longitude="partner.location.longitude"
      :mapStyle="mapStyle"></location-map-block>
  </div>
  
</div>
</template>
<script>
import ListPartnerProduct from "@/components/Components/List/ListPartnerProduct.vue"
import ListProductReviewPc from "@/components/Components/List/ListProductReviewPc.vue"
import ListProductInquiryPc from "@/components/Components/List/ListProductInquiryPc.vue"
import LocationMapBlock from "@/components/Components/Common/LocationMapBlock.vue"
import ProductFilterListPc from "@/components/Components/Common/ProductFilterListPc.vue"
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue"

export default {
  name: 'BlockPartnerDetailTabPc',
  components: {
    ListPartnerProduct,
    ListProductReviewPc,
    ListProductInquiryPc,
    LocationMapBlock,
    ProductFilterListPc,
    v1TCardProductPc
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "top": 0,
      "list": [],
      "menu": [
        {
          "id": 0,
          "name": "소개",
          "value": "introduce"
        },
        {
          "id": 1,
          "name": "전체상품",
          "value": "product"
        },
        {
          "id": 2,
          "name": "후기",
          "count": 0,
          "value": "review"
        },
        {
          "id": 3,
          "name": "문의",
          "count": 0,
          "value": "inquiry"
        }
      ],
      "sorted": {
        "value": ""
      },
      "iconImg": {
        "filter": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/42905594_thumb.png",
        "dropdown": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/39128693_thumb.png"
      },
      "partner": undefined,
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
      "mapStyle": {
        "width": "100%",
        "height": "480px"
      },
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
            "rate": true,
            "tags": false,
            "price": {
              "price": true,
              "org_price": false,
              "discount_price": true
            },
            "coupon": false,
            "review": true,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "cardColumn": 3,
      "fixedState": false,
      "totalCount": 0,
      "review_list": undefined,
      "selectedTab": 0,
      "inquiryCount": undefined,
      "inquiry_list": undefined
    }
  },
  created() {
    this.init();
    
  },
  mounted() {
    let ob = new this.ResizeObserver((e) => {
      this.top = e[0].contentRect.height + this.$store.getters.headerHeight;
    })
    ob.observe(document.getElementById('tap-bar-wrapper'));
    if (document.getElementsByClassName('header-container')[0] !== undefined) {
      let ob2 = new this.ResizeObserver((e) => {
        this.top = e[0].contentRect.height + this.$store.getters.headerHeight;
      })
      ob2.observe(document.getElementsByClassName('header-container')[0]);
    }
    this.$nextTick(() => {
      if (this.$route.query.tab && Number(this.$route.query.tab) === 1) {
        setTimeout(()=>{
          this.clickMenuItem(this.menu[Number(this.$route.query.tab)], Number(this.$route.query.tab))
        }, 1000);
      }
    })
    document.addEventListener('scroll', this.detectClientHeight);
  },
  activated() {
      return {
        opacity: '0.2',
        cursor: 'not-allowed',
      }
    },
  deactivated() {
      return {
        opacity: '0.2',
        cursor: 'not-allowed',
      }
    },
  beforeDestroy() {
    document.removeEventListener('scroll', this.detectClientHeight);
  },
  
  methods: {
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
            this.getPartner();
          });
    },
    clickMenuItem(item, idx) {
      this.selectedTab = item.id;
      let element = document.getElementById(`item${idx+1}`)
      // let tabHeight = ((!this.fixedState && idx === 0) || idx === 0) ? 204 : 312;
      let offset = window.pageYOffset + element.getBoundingClientRect().top - 70;
      if(!this.fixedState) {
        offset -= 90 + this.$refs.tabMenu.clientHeight;
      } else {
        offset -= 90;
      }
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    },
    detectClientHeight() {
      this.$nextTick(()=> {
        if(this.$refs.tabMenu) {
          let height = document.getElementById('partner-detail-card').clientHeight + 44;
          if (document.documentElement.scrollTop >= height) {
            this.fixedState = true;
          } else {
            this.fixedState = false;
          }
        }
      })
    },
    getPartner() {
      this.$api.PartnerDetail(this).then(res => {
        this.partner = res;
        this.getPartnerProduct();
      })
    },
    getPartnerProduct() {
      if (typeof(this.sorted)==='object'&&this.sorted.value!==undefined) this.sorted = this.sorted.value;
      
      let fields = 'tags,id,img,name,simple_desc,rate,like_count,price,visit,partner.name,params,files,reviews_count,shared_count,purchase_count,category1';
      fields += ',sum_price,stock_infinite,stock,stock_type,is_expired,enable_day_price,minimum,maximum,address,has_download_coupon,order_conversion_type,soldout'
      fields += ',possible_booking_resv,possible_reservation_resv'
      let url = `/user/${this.user.user_id}/mapping/product?partner_id=${this.partner.id}&fields=${fields}`
      if (this.$store.getters.service.package.indexOf('booking') > -1) {
        if (this.$store.getters.selectedResv) {
          url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`
          url += `&booking=${this.$store.getters.selectedResv.resv_date},${this.$store.getters.selectedResv.resv_end_date}`;
        }
        if (this.$store.getters.bookingMinimum) {
          url += `&booking_minimum=${this.$store.getters.bookingMinimum}`;
        }
      }
      url += '&page_num=1&page_length=50';
      url += `&ordering=${this.sorted}`
      this.url = url;
      this.url = this.urlAppendFilter(this.$store.getters.filtered, {}, this.url);
      this.currentPage = 1;
      this.$axios.get(this.url)
      .then(res => {
          this.totalPages = res.data.total_page;
          this.totalCount = res.data.count;
          this.currentPage = 2;
          this.list = res.data.data;
        });
      },
    clickAddress() {
      this.$copyText(this.partner.address).then(e => {
        this.toast('주소가 복사되었습니다.')
      }, e => {
        this.toast('주소복사에 실패했습니다.')
      })
    },
    tabItemStyle(item) {
      let deco = {
        color: this.brandColor.main.color,
        width: '25%',
        padding: '0 24px',
        height: '60px',
        lineHeight: '60px',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: '400',
        borderBottom: '2px solid transparent'
      };
      if(this.selectedTab === item.id) {
        deco.fontWeight = '700';
        deco.color = this.brandColor.primary.color;
        deco.borderBottom = this.brandBorder.primary.border.replace('1px', '2px');
      }
      return deco;
    },
    setTotalCount(key, count) {
      count = count > 99 ? '99+' : count;
      this.menu.filter(item=>{ return item.value === key })[0].count = count;
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
            backgroundColor: this.brandBgColor.sub.backgroundColor
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
        this.getPartnerProduct();
      },
    cardStyle(idx) {
      let gutters = 24;
      let gutter = gutters * 0.5;
      let width = `${(((this.$store.getters.brand.layout_maxwidth*12/12) - gutters * (this.cardColumn-1)) / this.cardColumn).toFixed(2)}px`;

      let obj = {
        width: width,
        marginBottom: `40px`
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
    clickNaverBlogBtn(e) {
      if (this.isNaverBlogActive) {
        this.setGa('네이버 블로그 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/naver`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    },
    clickKakaoBtn() {
      if (this.partner.kakao !== '' && this.partner.kakao !== null) {
        if (this.partner.kakao.indexOf('pf.kakao.com/') !== -1) {
          const a = document.createElement("a");
          a.style.display = 'none';
          a.onclick = this.clickLink(this.partner.kakao);
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
        } else {
          Kakao.Channel.chat({
            channelPublicId: this.partner.kakao
          });
        }
        this.setGa('카카오톡 채널 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/kakao`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    },
    clickLink(href) {
      window.open(href, '', 'width=440,height=768');
      return false;
    },
    clickInstagramBtn(e) {
      if (this.isInstagramActive) {
        this.setGa('인스타그램 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/instagram`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    },
    clickHomepageBtn(e) {
      if (this.isHomepageActive) {
        this.setGa('홈페이지 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/homepage`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    }
  },
  computed: {
    fixedStyle() {
      let deco = {}
      if (this.fixedState) {
        deco = {
          width: this.pcMaxWidth.width,
          position: 'fixed',
          top: `${this.top}px`,
          zIndex: 2
        }
      }
      return deco;
    },
    showFilterList() {
      return this.$store.getters.filtered.length > 0;
    },
    isNaverBlogActive() {
      if (this.partner.enable_naver) {
        if (this.partner.naver !== '' && this.partner.naver !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isKakaoActive() {
      if (this.partner.enable_kakao) {
        if (this.partner.kakao !== '' && this.partner.kakao !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isInstagramActive() {
      if (this.partner.enable_instagram) {
        if (this.partner.instagram !== '' && this.partner.instagram !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isHomepageActive() {
      if (this.partner.enable_homepage) {
        if (this.partner.homepage !== '' && this.partner.homepage !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    getNaverBlogHref() {
      return this.partner.naver;
    },
    getInstagramHref() {
      return this.partner.instagram;
    },
    getHomepageHref() {
      return this.partner.homepage;
    },
    deactivated() {
      return {
        opacity: '0.2',
        cursor: 'not-allowed',
      }
    },
    deactivatedLink() {
      return {
        pointerEvents: 'none',
        
      }
    }
  },
  watch: {
    '$route'() {
        this.$store.commit('setFilter', [])
        this.init();
      },
    '$store.getters.filtered'(n) {
      this.getPartnerProduct();
    }
  }
}
</script>
<style scoped>
html {
  scroll-behavior: smooth;
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
    top: 24px;
    padding: 7px 0;
    right: 0;
    width: 116px;
  }
  
  .divider {
    height: 1px;
    background-color: #f5f5f5;
    margin: 12px 0;
  }

.icon-info {
  font-size: 20px;
  margin-right: 6px;
}
</style>
<style>
#item1 .sun-editor-editable {
    padding: 0 !important;
  }
</style>
