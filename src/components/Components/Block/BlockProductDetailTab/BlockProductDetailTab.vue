<template>
<div v-if="detail" class="position-relative" style="padding-bottom: 70px">
  <div style="padding: 0px 16px" :style="fixedStyle" ref="tabMenu">
    <div class="flex-align flex-justify">
      <div v-for="(item, idx) in menu" :key="'tab-'+idx"
        class="unselect flex-center" :style="tabMenuStyle(item, idx)"
        @click.stop.prevent="clickMenuItem(item, idx)">
        <div>{{ item.name }}</div>
        <div v-if="item.count>=0" :style="countStyle(item)">{{ item.count }}</div>
      </div>
    </div>
  </div>
  
    <div id="item1" style="margin-top: 32px;">
      <!--정보-->
      <e-editor :html="detail.info" v-if="detail"
        :style="pagePadding"></e-editor>
      <div class="divider" :style="pagePadding"></div>
    </div>
    <div id="item2">
      <div class="size-18 weight-500 p-main" :style="pagePadding">기본정보</div>
      <div v-if="detail.booking_policy" style="margin-bottom: 28px" :style="pagePadding">
        <div class="size-14 weight-500 p-main" style="margin-top: 28px">정책</div>
        <div class="flex p-bg-sub2" style="border-radius: 4px; gap: 0 8px; margin-top: 8px">
          <div class="text-center" style="flex: 1; padding: 12px 16px">
            <div class="size-13 weight-400 p-sub2">체크인</div>
            <div class="size-14 weight-400 p-sub" style="margin-top: 4px">
              {{ detail.booking_policy.check_in !== null ? detail.booking_policy.check_in.substring(0, 5) : '' }}</div>
          </div>
          <div class="divider-policy"></div>
          <div class="text-center" style="flex: 1; padding: 12px 16px">
            <div class="size-13 weight-400 p-sub2">체크아웃</div>
            <div class="size-14 weight-400 p-sub" style="margin-top: 4px">
              {{ detail.booking_policy.check_out !== null ? detail.booking_policy.check_out.substring(0, 5) : '' }}</div>
          </div>
        </div>
        <div class="flex-align p-sub size-14 weight-400" style="margin-top: 8px; gap: 0 4px; align-items: flex-start">
          <div>·</div>
          <div class="flex-align" style="gap: 0 4px; align-items: flex-start">
            <span class="p-sub2">인원</span>
            <div style="flex: 1">{{ detail.booking_policy.minimum }}명 기준 (최대 {{ detail.booking_policy.maximum }}명) 인원 추가 {{ currencyNum(detail.booking_policy.over_price) }}원(현장결제)</div>
          </div>
        </div>
        <div v-if="detail.booking_policy.bed && detail.booking_policy.bed.length > 0"
          class="flex-align size-14 p-sub" style="margin-top: 8px; gap: 0 4px; align-items: flex-start">
          <div>·</div>
          <div class="flex wrap" style="gap: 4px">
            <div v-for="(bed, idx) in detail.booking_policy.bed"
              :key="'bed-'+idx" class="flex-align" style="gap: 0 4px">
              <span class="p-sub2">{{ bed.type }}</span>
              <div>{{ bed.num }}개<span v-if="idx !== detail.booking_policy.bed.length - 1" class="p-sub2">,</span></div>
            </div>
          </div>
        </div> 
        <template v-if="detail.booking_policy.convenience && detail.booking_policy.convenience.length > 0 && detail.booking_policy.convenience.filter(item => item.checked).length > 0">
          <div class="size-14 weight-500 p-main" style="margin-top: 28px">편의시설</div>
          <div style="margin-top: 8px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 12px">
            <div v-for="(convenience, idx) in detail.booking_policy.convenience.filter(item => item.checked)"
              :key="'convenience-'+idx" class="flex-align p-sub" style="gap: 0 8px">
              <div>·</div>
              <div class="size-14 weight-400">{{ convenience.name }}</div>
            </div>
          </div>
        </template>
      </div>
      
      <div v-if="detail.common_info.use_info" :style="pagePadding">
        <div class="size-14 weight-500 p-main" style="margin-bottom: 8px">상품 정보 제공 고시</div>
        <e-editor :html="detail.common_info.use_info"></e-editor>
      </div>
      <div v-if="detail.common_info.delivery_info" style="margin: 28px 0 0" :style="pagePadding">
        <div class="size-14 weight-500 p-main" style="margin-bottom: 8px">배송 안내</div>
        <e-editor :html="detail.common_info.delivery_info"></e-editor>
      </div>
      <div v-if="detail.common_info.refund_info" style="margin: 28px 0 0" :style="pagePadding">
        <div class="size-14 weight-500 p-main" style="margin-bottom: 8px">취소/환불 안내</div>
        <e-editor :html="detail.common_info.refund_info"></e-editor>
      </div>

      <div class="divider" :style="pagePadding"></div>
    </div>
    <div id="item3">
      <!--<card-review-total-reg :product="parentProd" :count="menu[2].count"></card-review-total-reg>-->
      <!--<list-vertical v-if="review_list.length>0">-->
      <!--    <card-review-->
      <!--        slot="card"-->
      <!--        v-for="(item,idx) in review_list"-->
      <!--        :key="'review-'+idx"-->
      <!--        @del="delReview"-->
      <!--        :card="item"-->
      <!--        :style="reviewCardStyle(idx)"></card-review>-->
      <!--  </list-vertical>-->
        
      <!--  <div v-if="review_list.length===0" class="empty-view size-14"-->
      <!--    :style="brandColor.sub">후기가 없습니다.</div>-->
        
      <!--  <pagination-default :pagingData="reviewPagingData" :pageNum="3" :arrowEnd="true"-->
      <!--    @curPaginationNum="(val) => curReviewNum(val)"-->
      <!--    v-if="reviewPagingData"></pagination-default>-->
      <div v-if="detail.order_conversion_type !== 11" :style="pagePadding">
        <list-product-review :order_conversion_type="detail.order_conversion_type"></list-product-review>
      </div>
      <list-product-review-booking v-else></list-product-review-booking>
      <div class="divider"></div>
    </div>
    
    <div id="item4">
      <div :style="pagePadding">
        <card-inquiry-total-reg :product="parentProd"
          :count="menu[3].count"></card-inquiry-total-reg>
        <list-vertical v-if="inquiry_list.length>0">
          <card-inquiry
              slot="card"
              v-for="(item, idx) in inquiry_list"
              :key="'inquiry-'+idx"
              @del="delInquiry"
              :card="item"
              :style="inquiryCardStyle(idx)"></card-inquiry>
        </list-vertical>
          
        <div v-if="inquiry_list.length===0" class="empty-view text-center size-14 p-sub2">문의가 없습니다.</div>
        
        <div v-if="inquiry_list.length > 0 && inquiryPagingData.total_page > 1"
          class="flex-justify" style="margin-top: 24px">
          <div class="unselect show-more-btn p-border-sub size-14 p-sub2"
            @click="showAllInquiry">더보기</div>
        </div>
        <!--<pagination-default :pagingData="inquiryPagingData" :pageNum="3" :arrowEnd="true"-->
        <!--  @curPaginationNum="(val) => curInquiryNum(val)"-->
        <!--  v-if="inquiryPagingData"></pagination-default>-->
      </div>
      <div class="divider"></div>  
    </div>
  
  <div v-if="detail.address" :style="pagePadding" style="padding-bottom: 25px">
    <div class="size-18 weight-500 margin-bottom-16" :style="brandColor.main">위치</div>
    <location-map-block v-if="$store.getters.social_key.naver.map.client_id !== ''"
      :address="detail.address"
      :latitude="detail.location.latitude"
      :longitude="detail.location.longitude"
      :mapStyle="mapStyle"></location-map-block>
    <div class="flex-between" style="margin-top:16px" :style="brandColor.sub">
      <div class="flex-align" style="flex:1">
        <!--<i class="material-icons-outlined" style="font-size:20px">location_on</i>-->
        <div style="padding-right:12px" class="size-12">{{ detail.address }}</div>
      </div>
      <div class="flex-align size-10" @click="clickAddress">
        <!--<i class="material-icons-outlined" style="font-size:13px">content_copy</i>-->
        <div>주소복사</div>
      </div>
    </div>
  </div>
  
  <block-related-product :product="childProduct"
    style="padding: 25px 16px"></block-related-product>
    
  <block-partners-product style="padding: 25px 0"
    :partnerId="detail.partner.id"></block-partners-product>
    
  <updown-scroll v-if="fixedState" :styles="scrollStyle"></updown-scroll>
  <div class="overlay-modal">
    <sweet-modal ref="allInquiryOverlay"
      :enableMobileFullscreen="false">
      <all-inquiry-overlay @closePage="closeInquiryOverlay"></all-inquiry-overlay>
    </sweet-modal>
    
  </div>
</div>
</template>
<script>
import CardReviewTotalReg from "@/components/Components/Card/CardReviewTotalReg.vue"
import CardReview from "@/components/Components/Card/CardReview.vue"
import CardInquiryTotalReg from "@/components/Components/Card/CardInquiryTotalReg.vue"
import CardInquiry from "@/components/Components/Card/CardInquiry.vue"
import UpdownScroll from "@/components/Components/Button/UpdownScroll.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import BlockRelatedProduct from "@/components/Components/Block/BlockRelatedProduct/BlockRelatedProduct.vue"
import BlockPartnersProduct from "@/components/Components/Block/BlockPartnersProduct/BlockPartnersProduct.vue"
import LocationMapBlock from "@/components/Components/Common/LocationMapBlock.vue"
import ListProductReview from "@/components/Components/List/ListProductReview.vue"
import ListProductReviewBooking from "@/components/Components/List/ListProductReviewBooking.vue"
import AllInquiryOverlay from "@/components/Components/Pages/AllInquiryOverlay/AllInquiryOverlay.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockProductDetailTab',
  components: {
    CardReviewTotalReg,
    CardReview,
    CardInquiryTotalReg,
    CardInquiry,
    UpdownScroll,
    PaginationDefault,
    BlockRelatedProduct,
    BlockPartnersProduct,
    LocationMapBlock,
    ListProductReview,
    ListProductReviewBooking,
    AllInquiryOverlay
  },
  mixins: [
    PageMixin
  ],
  props: {
    fixedState: {
      type: Boolean,
      required: false,
    },

  },
  data() {
    return {
      "top": 50,
      "menu": [
        {
          "id": 0,
          "name": "소개"
        },
        {
          "id": 1,
          "name": "기본정보"
        },
        {
          "id": 2,
          "name": "후기",
          "count": 0
        },
        {
          "id": 3,
          "name": "문의",
          "count": 0
        }
      ],
      "type": "order",
      "detail": undefined,
      "dragging": false,
      "mapStyle": {
        "width": "100%",
        "height": "200px"
      },
      "tabFixed": false,
      "productId": undefined,
      "imageRates": undefined,
      "parentProd": undefined,
      "showOption": false,
      "review_list": [],
      "selectedTab": 0,
      "childProduct": [],
      "inquiry_list": [],
      "selectedIndex": undefined,
      "reviewPagingData": undefined,
      "inquiryPagingData": undefined,
      "curReviewPaginationNum": undefined,
      "curInquiryPaginationNum": undefined
    }
  },
  created() {
    if(this.isIE) {
      setTimeout(() => {
        dragscroll.reset();
      },1000);
    }
    // this.getChildren();
    this.getData();
    this.getProductReview();
    this.getProductInquiry();
    this.setUid();
  },
  mounted() {
    let ob = new this.ResizeObserver((e) => {
      this.top = e[0].contentRect.height + document.getElementsByClassName('page-header')[0].getBoundingClientRect().height;
    })
    ob.observe(document.getElementById('tap-bar-wrapper'));
    if (document.getElementsByClassName('header-container')[0] !== undefined) {
      let ob2 = new this.ResizeObserver((e) => {
        this.top = e[0].contentRect.height + document.getElementsByClassName('page-header')[0].getBoundingClientRect().height;
      })
      ob2.observe(document.getElementsByClassName('header-container')[0])
    }
    document.addEventListener('scroll', this.detectClientHeight);
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.detectClientHeight);
    this.unlock(document.querySelector('html'));
    this.unlock(document.querySelector('body'));
    this.showOption = false;
  },
  
  methods: {
    showAllInquiry() {
      this.$refs.allInquiryOverlay.open();
    },
    detectClientHeight() {
      let scrollTop = document.documentElement.scrollTop
      this.$nextTick(() => {
        if(this.$refs.tabMenu) {
          if (scrollTop > 500) {
            this.tabFixed = true;
          }
          else {
            this.tabFixed = false;
          }
        }
        let item1 = document.getElementById('item1').getBoundingClientRect().top + window.pageYOffset;
        let item2 = document.getElementById('item2').getBoundingClientRect().top + window.pageYOffset;
        let item3 = document.getElementById('item3').getBoundingClientRect().top + window.pageYOffset;
        let item4 = document.getElementById('item4').getBoundingClientRect().top + window.pageYOffset;
        if (this.tabFixed && this.$refs.tabMenu) {
          item1 -= this.$refs.tabMenu.clientHeight;
          item2 -= this.$refs.tabMenu.clientHeight + 50;
          item3 -= this.$refs.tabMenu.clientHeight + 50;
          item4 -= this.$refs.tabMenu.clientHeight + 50;
        }
        if (scrollTop > item1) {
          this.selectedTab = 0
        }
        if (scrollTop > item2) {
          this.selectedTab = 1
        }
        if (scrollTop > item3) {
          this.selectedTab = 2
        }
        if (scrollTop > item4) {
          this.selectedTab = 3
        }
      })
    },
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    },
    clickUp() {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    clickDown() {
      document.documentElement.scrollTop = document.body.scrollHeight;
    },
    getChildren() {
      let url = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}`
      url += `?fields=children&hit=false`
      this.$axios.get(url).then(res => {
        let children = res.data.children;
        let index = children.findIndex(item => item.partner_id === this.$store.getters.defaultPartner.id);
        
        if (index !== -1) {
          this.productId = children[index].id;
        } else {
          this.productId = this.$route.query.id;
        }
        // this.getData();
      })
    },
    getData() {
       let url = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}`
        url += `?fields=id,parent,img,name,simple_desc,tags,form,order_conversion_type,category1,category2,category3`
        url += `,location,rate,stock,stock_type,input,like_count,reviews_count,visit,price,related_products,selectors`
        url += `,minimum,maximum,partner,address,dong,distance,params,imgs,common_info,info,operating_time,phone,params,location,enable_option,enable_prod,booking_policy&hit=false`
        this.$axios.get(url).then(res => {
          res.data.info = res.data.info.replace(/<img /gi, '<img style="margin:0 -16px;max-width:100vw" ');
          res.data.isOrderable = true;
          this.detail = res.data;
          this.parentProd = {
            id: res.data.id,
            rate: res.data.rate
          }
          
          this.$store.getters.brand.image_rates_field.forEach(rate => {
            if (rate.type === 'product_card') {
              this.imageRates = rate;
            }
          });
          
          this.$nextTick(() => {
            let totalWidth = 0;
            // 스크롤아이템 width 저장
            for (let i=0; i<this.detail.length; i++) {
              if (this.$refs[`tabItem${i}`]&&this.$refs[`tabItem${i}`][0]) {
                // console.log('refs', this.$refs[`tabItem${i}`])
                let width = this.$refs[`tabItem${i}`][0].offsetWidth;
                this.scrollArray.push({
                  id : this.menu[i].id,
                  name : this.menu[i].name,
                  width: width,                        // 본인 너비
                  accumulatedWidth: totalWidth+width   // 본인 누적너비
                });
                totalWidth += width;                   // 총 너비
              }
              // 현재 선택된 탭 index 저장
              if (this.filterData[i].id === this.selectedTab) {
                this.selectedIndex = i;
              }
            }
            // 스크롤 중앙 정렬
            // this.setScroll(this.selectedIndex);
          })
        });
    },
    childStyle(idx) {
      let deco = {};
      if(idx===0) deco.paddingRight = '4px';
      else if(idx=== this.childProduct.length - 1) deco.paddingLeft = '4px';
      else deco.padding = '0 4px';
      return deco;
    },
    childImgStyle(img) {
      let deco = {
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '180px'
      }
      return deco;
    },
    getChildProduct() {
      let id = this.detail.related_products;
      let array = []
      // for(let i=0;i<id.length;i++) {
        
      //   this.$axios.get(`user/${this.user.user_id}/mapping/product/${id[i]}?fields=id,img,name,price&hit=false`)
      //   .then(res => {
      //     array.push(res.data);
      //   })
      // }
      id.forEach(item => {
        this.$axios.get(`user/${this.user.user_id}/mapping/product/${item}?fields=id,img,name,price,discount_time,partner&hit=false`).then(res => {
          array.push(res.data)
        })
      })
      this.childProduct = array;
      
    },
    clickProduct(item) {
      if (this.dragging) {
        this.dragging = false;
      } else {
        this.routerPush(`product_detail?id=${item.id}`)
      }
    },
    getProductReview() {
      this.review_list = [];
      let product_id = this.$route.query.id;
      let num = 1;
      if (this.curReviewPaginationNum) {
        num = this.curReviewPaginationNum;
      }
      this.url = `public/product/${product_id}/review?secret=true&page_num=${num}&page_length=8`;
      if(this.isLogin)
        this.url = `user/${this.user.user_id}/product/${product_id}/review?secret=true&page_num=${num}&page_length=8`;
      this.$axios.get(this.url).then(res => {
        res.data.data.forEach(item => {
          if(Number(item.author_id) === this.user.user_id) {
            item.self = true;
          }
          item.isOpen = false;
        })
        this.review_list = res.data.data;
        this.reviewPagingData = res.data;
        this.menu[2].count = res.data.count;
        
      })
    },
    getProductInquiry() {
      this.inquiry_list = [];
      let product_id = this.$route.query.id;
      let num = 1;
      if (this.curInquiryPaginationNum) {
        num = this.curInquiryPaginationNum;
      }
      this.url = `public/product/${product_id}/inquiry?secret=true&page_num=${num}&page_length=5`;
      if(this.isLogin)
        this.url = `user/${this.user.user_id}/product/${product_id}/inquiry?secret=true&page_num=${num}&page_length=5`;
      this.$axios.get(this.url).then(res => {
        res.data.data.forEach(item => {
          if(Number(item.author_id) === this.user.user_id) {
            item.self = true;
          }
          item.isOpen = false;
        })
        this.inquiry_list = res.data.data;
        this.inquiryPagingData = res.data;
        this.menu[3].count = res.data.count;
      })
    },
    delReview() {
      this.getProductReview();
    },
    delInquiry() {
      this.getProductInquiry();
    },
    initialUid() {
      if (this.$route.query.tab===1) {
        this.setUid(this.review_list_self);
        this.setUid(this.review_list_other);
      }
      else if (this.$route.query.tab===2) {
        this.setUid(this.inquiry_list_self);
        this.setUid(this.inquiry_list_other);
      }
    },
    setUid() {
      let self_list = [];
      let other_list = [];
      if (this.$route.query.tab===2) {
        this.review_list_self.forEach(item => {
          item.uid = this.uuidv4();
          self_list.push(item);
        })
        this.review_list_other.forEach(item => {
          item.uid = this.uuidv4();
          other_list.push(item);
        })
        this.review_list_self = self_list;
        this.review_list_other = other_list;
      }
      else if (this.$route.query.tab===3) {
        this.inquiry_list_self.forEach(item => {
          item.uid = this.uuidv4();
          self_list.push(item);
        })
        this.inquiry_list_other.forEach(item => {
          item.uid = this.uuidv4();
          other_list.push(item);
        })
        this.inquiry_list_self = self_list;
        this.inquiry_list_other = other_list;
      }
    },
    buyProduct() {
      // this.$root.$emit('page_actionsheet', 'ProductOptionSheet', {product: this.detail});
      this.showOption = true;
      this.type = 'order';
      this.lock(document.querySelector('html'));
      this.lock(document.querySelector('body'));
    },
    computedPrice(item) {
      if(item.price.discount_type===1) {
        return item.price.price - item.price.discount_price;
      }
      else if(item.price.discount_type===0) {
        return item.price.price * (1 - (item.price.discount_rate / 100));
      }
    },
    curReviewNum(num) {
      this.curReviewPaginationNum = num;
      this.getProductReview();
    },
    curInquiryNum(num) {
      this.curInquiryPaginationNum = num;
      this.getProductInquiry();
    },
    reviewCardStyle(idx) {
      let deco = {
        borderTop: this.brandBorder.sub.border
      }
      if (idx === this.review_list.length - 1) {
        deco.borderBottom = this.brandBorder.sub.border;
      }
      return deco;
    },
    inquiryCardStyle(idx) {
      if (idx === this.inquiry_list.length - 1) {
        return {
          borderBottom: '0px !important'
        }
      }
    },
    clickMenuItem(item, idx) {
      this.selectedTab = item.id;
      let element = document.getElementById(`item${idx+1}`)
      let offset = window.pageYOffset + element.getBoundingClientRect().top - 40
      if (!this.tabFixed) {
        offset -= this.top + this.$refs.tabMenu.clientHeight;
      } else {
        offset -= this.top;
      }
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    },
    clickAddress() {
      this.$copyText(this.detail.address).then(e => {
        this.toast('주소가 복사되었습니다.')
      }, e => {
        this.toast('주소복사에 실패했습니다.')
      })
    },
    tabMenuStyle(item) {
      let deco = {
        padding: '12px 8px',
        textAlign: 'center',
        fontSize: '14px'
      }
      if(this.$store.getters.device === 'pc') {
        deco.padding = '20px';
        deco.fontSize = '15px';
      }
      
      if (this.selectedTab === item.id) {
        if (this.selectedTabStyle !== undefined) {
          deco = this.selectedTabStyle;
        }
        deco.borderBottom = `2px solid ${this.brandColor.primary.color}`;
      } else {
        deco.color = this.getColor('기본 내용 색상');
        if (this.unselectedTabStyle !== undefined) {
          deco = this.unselectedTabStyle;
        }
      }
      
      return deco;
    },
    countStyle(item) {
      let deco = {};
      if (this.unselectedCountStyle) {
        deco = this.unselectedCountStyle;
      } else {
        deco = {
          fontSize: '12px',
          color: `${this.getColor('Primary Color')}`,
        }
      }
      deco.marginLeft = '6px'
      
      if (this.selectedTab === item.id) {
        if (this.selectedCountStyle) {
          deco = this.selectedCountStyle;
        }
      }
      
      return deco;
    },
    isDiscountChild(item) {
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
    lock(element) {
      element.style.overflow = 'hidden';
      element.style.touchAction = 'none';
    },
    unlock(element) {
      element.style.removeProperty('overflow');
      element.style.removeProperty('touch-action');
    },
    closeInquiryOverlay() {
      this.$refs.allInquiryOverlay.close();
    },
    closePage() {
      this.showOption = false;
      this.unlock(document.querySelector('html'));
      this.unlock(document.querySelector('body'));
    }
  },
  computed: {
    scrollStyle() {
      return {
        bottom: '148px',
        right: '24px'
      }
    },
    marginStyle() {
      return {
        padding: '16px 0 0',
      }
    },
    normalStyle() {
      return {
        padding: '16px 0 0'
      }
    },
    fixedStyle() {
      let deco = {};
      if (this.tabFixed && !this.$route.query.device_type) {
        deco = {
          width: `${this.$store.getters.deviceWidth}px`,
          backgroundColor: 'white',
          position: 'fixed',
          zIndex: 2,
          top: `${this.top}px`
        }
      }
      return deco;
    },
    selectedTabStyle() {
      return {
        color: `${this.getColor('Primary Color')}`,
        width: '114px',
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        backgroundColor: 'white',
      }
    },
    unselectedTabStyle() {
      return {
        color: `${this.getColor('기본 내용 색상')}`,
        width: '114px',
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        backgroundColor: 'white',
      }
    },
    iconWrapStyle() {
      return {
        width: '32px',
        height: '32px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.24)'
      }
    },
    isIE() {
      if (navigator.userAgent.indexOf('Trident') > -1) return true;
      else return false;
    },
    isDiscount() {
      if (this.detail.price.is_discount) {
        if (this.detail.price.discount_period_type === false) {
          if (this.detail.price.discount_start !== null && this.detail.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.detail.price.discount_start || currentDate > this.detail.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else if (this.detail.price.discount_start !== null && this.detail.price.discount_end === null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.detail.price.discount_start) {
              return false;
            } else {
              return true;
            }
          } else if (this.detail.price.discount_start === null && this.detail.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate > this.detail.price.discount_end) {
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
    }
  },
  watch: {
    $route() {
      this.getData();
      this.getProductReview();
      this.getProductInquiry();
      this.setUid();
    },
    detail() {
      this.childProduct = [];
      this.getChildProduct();
    },
    '$store.getters.defaultPartner'() {
      this.getData();
    }
  }
}
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}

.grab-bing {
  white-space: nowrap;
  position: relative;
}

.helpBtn {
  border-radius: 8px;
  height: 48px;
  color: white;
  justify-content: center;
  align-items: center;
}
.parBtnDiv {
  position:fixed;
  bottom: 0;
  padding: 10px 16px;
  width: 100%;
  height: 68px;
  background-color: white;
  z-index: 1;
}

.divider-policy {
  width: 0.5px;
  background-color: #e3e3e3;
}

.divider {
  margin: 25px 0;
  border-top: 1px solid #e3e3e3;
}

.empty-view {
  padding: 40px 0;
  font-size: 14px;
}

.overlay-modal .sweet-modal {
  overflow: hidden;
  height: 100vh;
  max-width: 414px;
  width: 100%;
  overflow-y: hidden;
}

.overlay-modal .sweet-modal.is-alert .sweet-content {
  padding: 0 !important;
  height: 100vh;
}
.show-more-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
</style>

