<template>
<div v-if="product" :style="pcMaxWidth">
  <block-breadcrumb-pc :product="product"></block-breadcrumb-pc>
    <div style="padding:16px 0 32px 0; align-items: flex-start; height: 100%" class="flex-between" ref="test">
      <image-slider v-if="product.imgs.length>0" style="overflow: hidden; border-radius: 8px"
        :style="imageSliderStyle" :listData="product.imgs"
        :height="product.order_conversion_type === 2 ? 550 : 410" 
        :arrow="product.imgs.length > 1 ? true : false" :indicator="product.imgs.length > 1 ? true : false"
        :arrowLeftStyle="arrowLeftStyle"
        :imageRates="imageRates"
        :arrowRightStyle="arrowRightStyle">
        <!-- 숙박예약일때 할인가격 태그 -->
        <div v-if="product.order_conversion_type === 11 && isDiscountProd && productExpiredText === '' && product.price.discount_type===1 && product.price.discount_price > 0"
          slot="inner" :style="[brandBgColor.highlight,brandColor.white]"
          class="size-14 weight-400 position-absolute" 
          style="padding:5px 10px;border-radius:6px;top:12px;left:12px">
          {{ product.price.discount_price * days | currency }} 할인
        </div>
        <!-- 그 외의 경우 -->
        <div v-if="product.order_conversion_type !== 11 && isDiscountProd && product.price.discount_type===1 && product.price.discount_price > 0"
          slot="inner" :style="[brandBgColor.highlight,brandColor.white]"
          class="size-14 weight-400 position-absolute" 
          style="padding:5px 10px;border-radius:6px;top:12px;left:12px">
          {{ product.price.discount_price * days | currency }} 할인
        </div>
      </image-slider>
      <div v-else
        style="overflow:hidden; border-radius: 8px" ref="imageWrapper"
        class="position-relative" :style="{width: `${width}`}">
        <!--<div v-lazy:background-image="product.img" class="lazy-background-image" :style="imgStyle"></div>-->
        <e-image :img="product.img" :width="productImgWidth" :imageRates="imageRates"
          class="lazy-background-image position-relative" :isBg="true">
          <!-- 숙박예약일때 할인가격 태그 -->
          <div v-if="product.order_conversion_type === 11 && isDiscountProd && productExpiredText === '' && product.price.discount_type===1 && product.price.discount_price > 0"
            slot="inner" :style="[brandBgColor.highlight,brandColor.white]"
            class="size-14 weight-400 position-absolute" 
            style="padding:5px 10px;border-radius:6px;top:12px;left:12px">
            {{ product.price.discount_price * days | currency }} 할인
          </div>
          <!-- 그 외의 경우 -->
          <div v-if="product.order_conversion_type !== 11 && isDiscountProd && product.price.discount_type===1 && product.price.discount_price > 0"
            slot="inner" :style="[brandBgColor.highlight,brandColor.white]"
            class="size-14 weight-400 position-absolute" 
            style="padding:5px 10px;border-radius:6px;top:12px;left:12px">
            {{ product.price.discount_price * days | currency }} 할인
          </div>
        </e-image>
        <!--<icon-btn-like class="position-absolute" likeType="product"-->
        <!--               style="top:16px;right:16px;z-index:9"></icon-btn-like>-->
      </div>

      <!--<div :style="fixedState ? fixStyle : staticStyle">-->
      <div :style="{width: `calc(100% - ${width} - 122px)`}">
        <!--상품 정보-->
        <div style="margin-bottom:16px; border-radius: 8px"
          :style="brandBgColor.white">
          
          <div>
            <!--<div class="size-14" :style="brandColor.brand">{{ product.params[product.params.findIndex(item => item.name === '브랜드')].value }}</div>-->
            <div v-if="product.partner" @click="clickPartner"
              class="size-14 weight-500 unselect"
              :style="brandColor.primary">{{ product.partner.name }}</div>
            <div class="flex-between">
              <div class="size-24 bold" :style="brandColor.main">
                {{ product.name }}</div>
              <div class="flex-align">
                <icon-btn-like likeType="product" :id="product.id" :useFullIcon="true"
                  :color="likeBtnColor" activeColor="highlight"
                  style="margin-right: 24px"></icon-btn-like>
                <icon-circle-share @share="$refs.share.share=true" color="sub"
                  :shareContainStyle="{}" :size="24"
                  :shareTextStyle="{fontSize: '12px', marginLeft: '4px', color: brandColor.sub.color, cursor: 'pointer', userSelect: 'none'}"></icon-circle-share>
              </div>
            </div>
            
            <div v-if="product.simple_desc !== ''" class="size-14 p-sub2"
              style="margin-top: 8px; margin-bottom: 16px">{{ product.simple_desc }}</div>
            
            <div class="flex-align size-12 weight-700"
              style="margin-top: 8px">
              <div :style="brandColor.main" style="margin-right:4px"
                ><span class="weight-400">평점 </span> {{ product.rate }}</div>
              <i class="material-icons"
                style="font-size:16px;margin-right:8px;color:#F8D053">star</i>
              <div :style="brandColor.sub2"><span class="weight-400">리뷰 </span>
                {{ product.reviews_count || product.reviews_count===0 ? product.reviews_count : product.review_count }}</div>
            </div>

            <template v-if="product.order_conversion_type === 11">
              <div class="size-14 weight-400 p-sub2"
                style="margin-top: 8px">{{ product.simple_desc }}</div>
              <div class="flex-align" style="margin-top: 16px; gap: 0 4px">
                <i class="material-icons-outlined p-sub" style="font-size: 16px">location_on</i>
                <div class="size-14 weight-400 p-sub">{{ product.address }}</div>
              </div>
              <div class="divider"></div>
              <div class="flex-align size-14 weight-400 p-sub" style="gap: 0 4px">
                <div>{{ product.booking_policy.minimum }}인 기준 (최대 {{ product.booking_policy.maximum }}인)</div>
                <div>·</div>
                <div v-if="product.booking_policy.bed && product.booking_policy.bed.length > 0 && product.booking_policy.bed.filter(item => item.type !== '이불').length > 0">
                  침대 {{ computedBed }}개</div>
              </div>
            </template>
            
            <!-- 숙박예약인 경우 -->
            <!-- 주문 가능 기간이 선택되어있으면서 price_type이 1이 아닌 경우, 1박당 평균 가격 또는 평균 할인 가격으로 표시 -->
            <div v-if="product.order_conversion_type === 11 && product.price.price_type === 0 && isOrderablePeriod"
              style="margin-top: 32px">
              <div v-if="$store.getters.selectedResv && $store.getters.selectedResv.price.is_discount"
                class="p-sub3 size-14" style="text-decoration: line-through">
                {{ currencyNum(($store.getters.selectedResv.price.order_price + $store.getters.selectedResv.price.discount_price) / $store.getters.selectedResv.days) }}<span class="size-12">원</span></div>
              <div v-else-if="$store.getters.selectedResv === undefined && isDiscountProd"
                class="p-sub3 size-14" style="text-decoration: line-through">{{ currencyNum(product.price.price) }}<span class="size-12">원</span></div>
              <div class="flex-align" style="gap: 0 2px">
                <div v-if="$store.getters.selectedResv && $store.getters.selectedResv.price.is_discount"
                  class="size-24 bold p-highlight">
                  {{ $store.getters.selectedResv.price.discount_rate > 0 ? `${$store.getters.selectedResv.price.discount_rate}%` : `-${currency($store.getters.selectedResv.price.discount_price / $store.getters.selectedResv.days)}` }}</div>
                <div class="size-24 bold p-main">{{ $store.getters.selectedResv ? currencyNum($store.getters.selectedResv.price.price_per_day / $store.getters.selectedResv.days) : isDiscountProd ? currencyNum(product.price.sale_price) : currencyNum(product.price.price) }}<span class="size-14 weight-400">원/박</span></div>
              </div>
            </div>
            <!-- sum_price가 0인 경우 -->
            <!-- <template
              v-if="product.order_conversion_type === 11 && product.sum_price === 0 && product.price.price_type === 0 && isOrderablePeriod">
              <div class="flex-align bold margin-bottom-8" ref="productPrice">
                <div v-if="isDiscountProd && productExpiredText === ''"
                  :style="brandColor.sub3" class="size-14"
                  style="text-decoration:line-through">
                  {{ product.price.price * days | currencyNum }}<span class="size-12">원</span>
                </div>
              </div>
              <div class="flex-between">
                <div>
                  <div v-if="isDiscountProd && productExpiredText === ''"
                    class="size-20 bold" :style="brandColor.highlight"
                    style="margin-right: 2px">
                    <div v-if="product.price.discount_type===0">{{ product.price.discount_rate }}%</div>
                  </div>
                  <div v-if="productExpiredText === ''"
                    class="size-20 bold" :style="brandColor.main">
                    {{ isDiscountProd ? computedPrice : product.price.price * days | currencyNum }}
                    <span class="size-14 weight-400">원</span><span
                      v-if="product.price.won_type === 1" class="size-14 weight-400">~</span><span
                      class="size-14 weight-400">/<span
                      class="size-14 bold" :style="brandColor.primary">{{ days }}</span>박</span></div>
                  <div v-else-if="product.is_expired && productExpiredText === '마감'"
                    class="size-20 bold" :style="brandColor.main">{{ productExpiredText }}</div>
                </div>
                <div v-if="product.price.price_type === 0 && couponList && couponList.length !== 0" @click="clickDownloadCoupon"
                  class="unselect flex-justify" :style="brandBgColor.brand1"
                  style="border-radius: 8px; width: 112px; height: 40px">
                  <div class="flex-align" :style="brandColor.primary">
                    <div class="size-14">쿠폰 받기</div>
                    <i class="material-icons" style="margin-left: 8px">save_alt</i>
                  </div>
                </div>
              </div>
            </template> -->
            <!-- sum_price가 0이 아닌 경우 -->
            <!-- <template
              v-if="product.order_conversion_type === 11 && product.sum_price !== 0 && product.price.price_type === 0 && isOrderablePeriod">
              <div class="flex-align bold" ref="productPrice" st>
                <div v-if="isDiscountProd && productExpiredText === ''"
                  :style="brandColor.sub3" class="size-14"
                  style="text-decoration:line-through">
                  {{ product.sum_price | currencyNum }}<span class="size-12">원</span>
                </div>
              </div>
              <div class="flex-between">
                <div :style="brandColor.main" class="size-20 bold flex-align">
                  <div v-if="isDiscountProd && productExpiredText === ''"
                    :style="brandColor.highlight"
                    style="margin-right: 2px">
                    <div v-if="product.price.discount_type===0">{{ product.price.discount_rate }}%</div>
                  </div>
                  <div v-if="productExpiredText === ''">
                    {{ isDiscountProd ? computedPrice : product.sum_price | currencyNum }}<span
                      class="size-14 weight-400">원</span><span
                      v-if="product.price.won_type === 1" class="size-14 weight-400">~</span><span
                      class="size-14 weight-400">/<span
                      class="size-14 bold" :style="brandColor.primary">{{ days }}</span>박</span></div>
                  <div v-else-if="product.is_expired && productExpiredText === '마감'">{{ productExpiredText }}</div>
                </div>
                <div v-if="product.price.price_type === 0 && couponList && couponList.length !== 0" @click="clickDownloadCoupon"
                  class="unselect flex-justify" :style="brandBgColor.brand1"
                  style="border-radius: 8px; width: 112px; height: 40px">
                  <div class="flex-align" :style="brandColor.primary">
                    <div class="size-14">쿠폰 받기</div>
                    <i class="material-icons" style="margin-left: 8px">save_alt</i>
                  </div>
                </div>
              </div>
            </template> -->
            <div v-else-if="product.order_conversion_type === 11 && product.price.price_type === 1 && isOrderablePeriod"
              class="flex-between" style="margin:16px 0">
              <div class="size-16" :style="brandColor.main">{{ product.price.price_text }}</div>
              <div v-if="product.price.price_type === 0 && couponList && couponList.length !== 0" @click="clickDownloadCoupon"
                class="unselect flex-justify" :style="brandBgColor.brand1"
                style="border-radius: 8px; width: 112px; height: 40px">
                <div class="flex-align" :style="brandColor.primary">
                  <div class="size-14">쿠폰 받기</div>
                  <i class="material-icons" style="margin-left: 8px">save_alt</i>
                </div>
              </div>  
                
            </div>
            <div v-else-if="product.order_conversion_type === 11 && !isOrderablePeriod"
              class="flex-between" style="margin: 16px 0">
              <div class="size-16" :style="brandColor.main">
                {{ `최대 ${product.maximum - 1}박 ${product.maximum}일까지 예약 가능합니다.` }}
              </div>
              <div v-if="product.price.price_type === 0 && couponList && couponList.length !== 0" @click="clickDownloadCoupon"
                class="unselect flex-justify" :style="brandBgColor.brand1"
                style="border-radius: 8px; width: 112px; height: 40px">
                <div class="flex-align" :style="brandColor.primary">
                  <div class="size-14">쿠폰 받기</div>
                  <i class="material-icons" style="margin-left: 8px">save_alt</i>
                </div>
              </div>
              
            </div>
            <!-- 그 외의 경우 -->
            <template v-if="product.order_conversion_type !== 11 && product.price.price_type === 0">
              
              <div class="flex-between" style="align-items: flex-end; margin-top: 8px">
                <div>
                  <div class="flex-align bold" ref="productPrice">
                    <div v-if="isDiscountProd" :style="brandColor.sub3" class="size-14"
                      style="text-decoration:line-through">
                      {{ product.price.price | currencyNum }}<span class="size-12">원</span>
                    </div>
                  </div>
                  <div :style="brandColor.main" class="size-20 bold flex-align">
                    <div v-if="isDiscountProd"
                      :style="brandColor.highlight"
                      style="margin-right: 2px">
                      <div v-if="product.price.discount_type===0 && product.price.discount_rate > 0">{{ product.price.discount_rate }}%</div>
                      <!--<div v-if="product.price.discount_type===1">- {{ product.price.discount_price | currency }}</div>-->
                    </div>
                    <div>{{ isDiscountProd ? computedPrice : product.price.price | currencyNum }}<span
                      class="size-14 weight-400">원</span><span v-if="product.price.won_type === 1">~</span></div>
                  </div>
                </div>
                
                <div v-if="product.price.price_type === 0 && couponList && couponList.length !== 0" @click="clickDownloadCoupon"
                  class="unselect flex-justify" :style="brandBgColor.brand1"
                  style="border-radius: 8px; width: 112px; height: 40px">
                  <div class="flex-align" :style="brandColor.primary">
                    <div class="size-14">쿠폰 받기</div>
                    <i class="material-icons" style="margin-left: 8px">save_alt</i>
                  </div>
                </div>
              </div>
            </template>
            <div v-else-if="product.order_conversion_type !== 11 && product.price.price_type === 1"
              class="flex-between" style="margin:16px 0">
              <div class="size-16" :style="brandColor.main">{{ product.price.price_text }}</div>
              
            </div>
            
            
            <button-ordering-pc :product="product" width="180px" :usePopup="true"
              :isDiscount="isDiscountProd"
              @liked="res => toggleLiked(res)" :menuTitle="'마이페이지 > 찜 목록'"></button-ordering-pc>
              
            <!--<button-inquirying-pc v-if="product.order_conversion_type !== 10 && product.order_conversion_type !== 11"-->
            <!--  :product="product" style="margin-top: 16px; height: 48px"></button-inquirying-pc>-->
          </div>
        </div>
        

        <share ref="share" v-if="product" :product="product"></share>

        <!-- 전화연결 팝업 -->
        <!--<sweet-modal ref="callModal" overlay-theme="dark">-->
        <!--  <modal @confirm="clickCall" @cancel="$refs.callModal.close()">-->
        <!--    <div slot="header">전화연결</div>-->
        <!--    <div slot="content">연결 버튼을 누르시면 전화연결이 진행됩니다. 진행하시겠습니까?</div>-->
        <!--  </modal>-->
        <!--</sweet-modal>-->
        
        <!-- 쿠폰 팝업 -->
        <sweet-modal ref="couponModal" overlay-theme="dark" :hide-close-button="true">
          <block-download-coupon-pc :couponList="couponList"
            @getCouponList="getCouponList" @close="$refs.couponModal.close()"></block-download-coupon-pc>
        </sweet-modal>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonInquiryingPc from "@/components/Components/Button/ButtonInquiryingPc.vue"
import ButtonOrderingPc from "@/components/Components/Button/ButtonOrderingPc.vue"
import BtnPc from "@/components/Components/Button/BtnPc.vue"
import BlockDownloadCouponPc from "@/components/Components/Block/BlockDownloadCoupon/BlockDownloadCouponPc.vue"
import BlockBreadcrumbPc from "@/components/Components/Block/BlockBreadcrumb/BlockBreadcrumbPc.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import OrderMixin from "@/components/Components/Mixins/OrderMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockProductDetailCardPc',
  components: {
    ButtonInquiryingPc,
    ButtonOrderingPc,
    BtnPc,
    BlockDownloadCouponPc,
    BlockBreadcrumbPc
  },
  mixins: [
    BlockMixin,
    OrderMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "rate": undefined,
      "visit": undefined,
      "width": "50%",
      "product": undefined,
      "productId": undefined,
      "breadcrumb": [],
      "couponList": undefined,
      "fixedState": true,
      "imageRates": {},
      "like_count": undefined,
      "layoutWidth": undefined,
      "sliderWidth": undefined,
      "order_product": undefined,
      "priceInfoWidth": 0,
      "selectorStocks": [],
      "deliveryMethodArr": [],
      "selectedDeliveryMethod": ""
    }
  },
  created() {
      this.getMaxWidth();
      // this.getChildren();
      this.getData();
      this.getCouponList();
      this.$store.getters.brand.image_rates_field.forEach(item => {
        if (item.type === 'product_detail_slider') {
          this.imageRates = item;
          switch(this.imageRates.ratio) {
            case '4:3':
              this.width = '66%';
              break;
            case '3:4':
              this.width = '40%';
              break;
            case '1:1':
              this.width = '50%';
              break;
            default:
              this.width = '50%';
          }
        }
      })
      this.detectClientHeight();

    },
  
  methods: {
    clickPartner() {
      this.routerPush(`partner_detail?id=${this.product.partner.id}`);
    },
    clickInquiry() {
      location.href = `tel:${this.product.partner.phone}`;
    },
    getCouponList() {
      this.$axios.get(`/user/${this.user.user_id}/product/${this.$route.query.id}/download_coupon`).then(res => {
        this.couponList = res.data;
      })
    },
    toggleLiked(res) {
      if (res) {
        this.product.like_count += 1;
      } else {
        this.product.like_count -= 1;
      }
    },
    getMaxWidth() {
        this.$axios.get('public/ui/brand/admin').then(res => {
          this.layoutWidth = res.data.layout_maxwidth;
        })
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
          this.productId = Number(this.$route.query.id);
        }
        this.getData();
      })
    },
    getData() {
      
      let getChildrenUrl = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}`
      getChildrenUrl += `?fields=children,visit,rate,like_count&hit=false`
      this.$axios.get(getChildrenUrl).then(res => {
        let children = res.data.children;
        let index = children.findIndex(item => item.partner_id === this.$store.getters.defaultPartner.id);
        this.visit = res.data.visit;
        this.rate = res.data.rate;
        this.like_count = res.data.like_count;
        if (index !== -1) {
          this.productId = children[index].id;
        } else {
          this.productId = Number(this.$route.query.id);
        }
        
        let url = `/user/${this.user.user_id}/mapping/product/${this.productId}`
        url += `?fields=id,parent,img,name,common_info,enable_option,enable_prod,simple_desc,tags,partner,form,order_conversion_type,inquiry_conversion_type,`
        url += `category1,category2,category3,rate,stock,stock_type,input,like_count,reviews_count,visit,price,discount_time,selectors,sum_price,stock_infinite,is_expired,enable_day_price,`
        url += `minimum,maximum,address,dong,distance,params,imgs,info,operating_time,phone,params,location,`
        url += `booking_policy,reserve_policy,payment_type,possible_booking_resv,possible_reservation_resv,soldout`
        if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.resv_date && this.$store.getters.selectedResv.resv_end_date) {
          url += `&resv_start=${this.$store.getters.selectedResv.resv_date}&resv_end=${this.$store.getters.selectedResv.resv_end_date}`;
          if (this.$store.getters.service.package.indexOf('booking') > -1) {
            url += `&booking=${this.$store.getters.selectedResv.resv_date},${this.$store.getters.selectedResv.resv_end_date}`
          }
        }
        url += `&hit=false`
        this.$axios.get(url).then(res => {
          if (this.productId === Number(this.$route.query.id)) {
            res.data.isOrderable = false;
          } else {
            res.data.isOrderable = true;
          }
          this.product = res.data;
          this.product_params = this.cloneItem(this.product.params);
  
          this.order_product = {
            "product_id": this.product.id,
            "name": this.product.name,
            "quantity": 1,
            "comm_price": 0,
            "point": 0,
            "discount_price": 0,
            "total_price": 0,
            "img": this.product.img,
            "delivery_price": this.product.price.delivery_price,
            "order_product_option": [],
            "product": this.product,
          }
          // 옵션 사용할 경우
          if (this.product.enable_option) this.getSelectorStocks();
          // 자체 상품일 경우
          else this.selectProduct();
  
          this.initializeDeliveryMethod();
          
          let recentlyViewProducts = this.$store.getters.recentlyViewProducts ? this.$store.getters.recentlyViewProducts : [];
          let itemToFind = recentlyViewProducts.find(item => item.id === this.product.id)
          let idx = recentlyViewProducts.indexOf(itemToFind)
          if (idx > -1) recentlyViewProducts.splice(idx, 1)
          this.product.date = this.dayjs().format('YYYY-MM-DD');
          recentlyViewProducts.unshift(this.product);
          this.$store.commit('setRecentlyViewProducts', recentlyViewProducts);
        });
      })
    },
    detectClientHeight() {
        this.$nextTick(function () {
          if (this.$refs.cardHeight) {
            if (document.documentElement.scrollTop > this.$refs.cardHeight.clientHeight) {
              this.fixedState = true;
              this.$emit('fixedState', true);
            }
            else {
              this.fixedState = false;
              this.$emit('fixedState', false);
            }
          }
        })
      },
    clickCall() {
        let user_id = this.$store.getters.user.user_id;
        let url = `user/${user_id}/product/${this.$route.query.id}/call&hit=false`;
        this.$axios.get(url).then(res => {
          location.href = `tel:${res.data.call}`;
          this.$refs.callModal.close();
        })
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
    // 배송유형이 있을 경우 초기화 작업
      initializeDeliveryMethod() {
        let names = [
          {label: 'parcel', value: '택배'},
          {label: 'post', value: '등기 / 소포'},
          {label: 'cargo', value: '화물배송'},
          {label: 'visit', value: '방문수령'},
          {label: 'quick', value: '퀵배송'}
        ]
        // 배송 유형
        if (this.product.price.delivery_price) {
          let items = this.product.price.delivery_price.delivery_method;
          if (items.length > 1) {
            let arr = [];
            items.forEach(item => {
              arr.push({label: find(names, 'label', item).value, value: item})
            })
            this.deliveryMethodArr = arr;
          }
          else {
            if (items.length === 1) {
              this.deliveryMethodArr = [
                {label: find(names, 'label', items[0]).value, value: items[0]}
              ]
            }
          }
          if (items.length > 0) this.selectedDeliveryMethod = items[0]
        }
      },
    // 옵션 가져오기
      getSelectorStocks() {
        if (this.product.id) {
          this.$axios.post(`public/product/${this.product.id}/selector_stocks`)
            .then(res => {
              this.selectorStocks = res.data.stocks;
              this.order_product.selectorStocks = res.data.stocks;
            });
        }
      },
    //상품 선택
      selectProduct() {
        let comm_price = 0;
        let point_price = 0;
        let discount_price = 0;
        let price = this.product.price;
        let product_price = price.price;

        // 속성 옵션일 경우 상품가격 + 옵션가
        // 0: 비율, 1: 금액
        // 수수료, 포인트, 할인 계산
        if (price.is_point) {
          if (price.point_type === 0) point_price = product_price * price.point_rate / 100;
          else point_price = price.point;
        }
        if (this.isDiscountProd) {
          if (price.discount_type === 0) discount_price = product_price * price.discount_rate / 100;
          else discount_price = price.discount_price;
        }
        if (price.is_comm) {
          if (price.comm_type === 0) comm_price = product_price * price.comm_rate / 100;
          else comm_price = price.comm_price;
        }

        this.order_product.comm_price = comm_price;
        this.order_product.point = point_price;
        this.order_product.discount_price = discount_price;
        this.order_product.product_price = product_price;
        console.log('product_price', product_price)
        this.order_product.total_price = product_price - discount_price;
      },
    // 상품옵션 선택
      selectOption(value) {
        // order_product 중복 체크 후(option id체크) 있을 경우 종료
        let op = find(this.order_product.order_product_option, 'option_id', value);
        if (op) return;

        let total_price = 0;
        let comm_price = 0;
        let point_price = 0;
        let discount_price = 0;
        let price = this.product.price;

        this.selectorStocks.forEach(selector => {
          if (selector.id === value) {
            // console.log('옵션가',selector.price);
            // console.log('상품가',price.price);
            // 속성 옵션일 경우 상품가격 + 옵션가
            if (selector.option_type === 0) total_price = selector.price + price.price;
            else total_price = selector.price;
            // 0: 비율, 1: 금액
            // 수수료, 포인트, 할인 계산
            if (price.point_type === 0) point_price = total_price * price.point_rate / 100;
            else point_price = price.point;
            if (price.discount_type === 0) discount_price = total_price * price.discount_rate / 100;
            else discount_price = price.discount_price;
            if (price.comm_type === 0) comm_price = total_price * price.comm_rate / 100;
            else comm_price = price.comm_price;

            let order_product_option = {
              option_id: selector.id,
              quantity: 1
            }

            this.order_product.order_product_option.push(order_product_option);
            // console.log('확인', this.order_product);
          }
        })

      },
    // 장바구니 넣기
      clickCart() {
        if (this.product.enable_option) {
          if (this.order_product.order_product_option.length === 0) {
            this.toast('옵션을 선택하세요');
            return;
          }
        }
        let order_product = this.cloneItem(this.order_product);
        // 선택된 배송유형
        order_product.delivery_method = this.selectedDeliveryMethod;
        let cart = order_product;
        cart.uid = this.uuidv4();
        this.$store.commit('setConcatCart', [cart]);
        this.toast('장바구니에 담았습니다.');
        this.$router.push('cart');
      },
    // 주문하기
      clickOrder() {
        // 회원정보 유무 체크
        let user = this.$store.getters.user;
        //console.log('회원유무', user)
        // if(user.user_id===0) {
        //   this.toast('로그인후 결제하시기 바랍니다.');
        //   return;
        // }
        // 속성옵션 필수값 체크
        if (this.product.enable_option) {
          if (this.order_product.order_product_option.length === 0) {
            this.toast('주문할 상품을 선택해주세요.');
            return;
          }

          let isOptionType0 = false;
          this.order_product.order_product_option.some(op => {
            let ss = find(this.selectorStocks, 'id', op.option_id);
            // 속성옵션 0, 추가옵션 1
            if (ss.option_type === 0) isOptionType0 = true;
            return (ss.option_type === 0)
          })
          if (!isOptionType0) {
            this.toast('상품 속성 옵션을 선택해주세요.');
            return;
          }
        }

        // 선택된 배송유형
        let order_product = this.cloneItem(this.order_product);
        order_product.delivery_method = this.selectedDeliveryMethod;
        let order = order_product;
        order.uid = this.uuidv4();
        this.$store.commit('setOrder', [order]);
        this.$router.push('order');
      },
    deleteOrderProduct(idx) {
        console.log('delete')
        this.order_product.order_product_option.remove(idx);
      },
    clickDownloadCoupon() {
      this.$refs.couponModal.open();
    }
  },
  computed: {
    computedBed() {
      let beds = this.product.booking_policy.bed.filter(item => item.type !== '이불');
      if (beds.length > 1) {  
        return beds.reduce((acc, cur) => Number(acc.num) + Number(cur.num))
      } else if (beds.length === 1) {
        return Number(beds[0].num);
      } else {
        return 0;
      }
    },
    productExpiredText() {
      if (this.$store.getters.selectedResv) {
        return '마감';
      } else if (this.$store.getters.selectedResv === undefined) {
        return '';
      }
    },
    likeBtnColor() {
      return this.rgba2hex(this.brandBorder.sub.border.split('1px solid ')[1]).hex
    },
    days() {
      if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.days) {
        return this.$store.getters.selectedResv.days;
      } else {
        return 1;
      }
    },
    isOrderablePeriod() {
      if (this.$store.getters.selectedResv && this.$store.getters.selectedResv.days + 1 > this.product.maximum) {
        return false;
      } else {
        return true;
      }
    },
    maximumCouponDiscountPrice() {
      if (this.couponList.length !== 0) {
        let discountPriceArray = [];
        this.couponList.forEach(coupon => {
          if (coupon.benefits_type === 0) { // 혜택 유형이 상품 금액할인인 경우
            if (coupon.discount_type === 0) {
              if (this.product.price.sale_price !== 0) {
                discountPriceArray.push(this.product.price.sale_price * (coupon.discount_rate / 100))
              } else {
                discountPriceArray.push(this.product.price.price * (coupon.discount_rate / 100))
              }
            } else {
              discountPriceArray.push(coupon.discount_price)
            }
          } else if (coupon.benefits_type === 1) { // 주문 금액할인인 경우
            if (coupon.discount_type === 0) {
              if (this.product.price.sale_price !== 0) {
                discountPriceArray.push(this.product.price.sale_price * (coupon.discount_rate / 100))
              } else {
                discountPriceArray.push(this.product.price.price * (coupon.discount_rate / 100))
              }
            } else {
              discountPriceArray.push(coupon.discount_price)
            }
          } else { // 배송료 할인인 경우
            discountPriceArray.push(coupon.discount_price);
          }
        })
        return Math.max.apply(null, discountPriceArray);
      }
    },
    isDiscountProd() {
      if (this.product.price.is_discount) {
        if (this.product.price.discount_period_type === false) {
          if (this.product.price.discount_start !== null && this.product.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.product.price.discount_start || currentDate > this.product.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else if (this.product.price.discount_start !== null && this.product.price.discount_end === null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.product.price.discount_start) {
              return false;
            } else {
              return true;
            }
          } else if (this.product.price.discount_start === null && this.product.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate > this.product.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          let resv = this.$store.getters.selectedResv;
          if (resv) {
            if (!resv.period) {
              if (!resv.all_time) {
                let index = this.product.discount_time.findIndex(item => {
                  return item.start_time === resv.start_time && item.end_time === resv.end_time
                })
                if (index > -1) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }            
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    },
    imageSliderStyle() {
      let deco = {};
      let ratio = this.imageRates.ratio.split(':').reverse().join('/');
      switch(this.imageRates.ratio) {
        case '4:3':
          deco.width = '66%';
          this.width = deco.width;
          break;
        case '3:4':
          deco.width = '40%';
          this.width = deco.width;
          break;
        case '1:1':
          deco.width = '50%';
          this.width = deco.width;
          break;
        default:
          deco.width = '50%';
          this.width = deco.width;
      }
      return deco;  
      
    },
    productImgWidth() {
      let width = this.width.split('%')[0];
      return parseInt(this.pcMaxWidth.width, 10) * width/100;
    },
    quanStyle() {
        return {
          borderBottom: `1px solid ${this.getColor('기본 테두리선 색상')}`
        }
      },
    optionDropdownStyle() {
        return {
          container: {
            margin: '0 0 8px 0'
          },
          dropdown: {
            backgroundColor: this.brandBgColor.main.backgroundColor,
            color: this.brandColor.main.color,
            height: '32px',
            padding: '12px',
            fontSize: '12px',
            borderRadius: '4px'
          }
        }
      },
    optionQuantityStyle() {
        return {
          input: {
            width: '48px',
            height: '24px',
            backgroundColor: '#fff',
            border: 'none',
            textAlign: 'center',
            fontSize: '14px',
            color: this.brandColor.main.color,
            fontWeight: '700',
            fontFamily: 'Noto Sans CJK KR'
          },
          btn: {
            backgroundColor: this.brandBgColor.main.backgroundColor,
            color: this.brandColor.main.color,
            borderRadius: '4px',
            width: '24px',
            height: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px'
          }
        }
      },
    staticStyle() {
        return {
          width: '320px'
        }
      },
    fixStyle() {
        return {
          width: '320px',
          position: 'fixed',
          top: '96px',
          left: `calc(50% + ${this.layoutWidth * 16 / 100}px + 16px)`,
        }
      },
    fixStyles() {
        return {
          width: '320px',
          top: 'calc(85%)',
          left: `calc(50% + ${this.layoutWidth * 16 / 100}px + 16px)`
        }
      },
    imgStyle() {
        return {
          width: '100%',
          height: '320px',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          // backgroundImage: `url("${this.product.img}")`,
          borderRadius: '8px',
        }
      },
    partnerImg() {
        return {
          width: '48px',
          height: '48px',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url("${this.product.partner.img}")`,
          borderRadius: '50%'
        }
      },
    categories() {
        return this.$store.getters.category;
      },
    iconWrapStyle() {
        return {
          width: '32px',
          height: '32px',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)'
        }
      },
    computedPrice() {
      if (this.product.order_conversion_type !== 11) {
        if (this.product.price.discount_type === 1) {
          return this.product.price.price - this.product.price.discount_price;
        }
        else if (this.product.price.discount_type === 0) {
          return Math.round(this.product.price.price * (1 - (this.product.price.discount_rate / 100)));
        }
      } else {
        if (this.product.sum_price === 0) {
          if (this.product.price.discount_type === 1) {
            return (this.product.price.price - this.product.price.discount_price) * this.days;
          } else if (this.product.price.discount_type === 0) {
            return Math.round((this.product.price.price * (1 - (this.product.price.discount_rate / 100))) * this.days);
          }
        } else if (this.product.sum_price !== 0) {
          if (this.product.price.discount_type === 1) {
            return this.product.sum_price - (this.product.price.discount_price * this.days);
          } else if (this.product.price.discount_type === 0) {
            return Math.round(this.product.sum_price * (1 - (this.product.price.discount_rate / 100)));
          }
        }
      }
    },
    // 속성 옵션
      optionArr1() {
        let options = this.selectorStocks.filter(item => {
          return item.option_type === 0;
        })
        return options;
      },
    // 속성 옵션
      optionArr2() {
        let options = this.selectorStocks.filter(item => {
          return item.option_type === 1;
        })
        return options;
      },
    totalPrice() {
        // console.log('전체 ',this.order_product)
        let totalPrice = 0;
        if (!this.order_product) return 0
        if (this.product.enable_option) {
          this.order_product.order_product_option.forEach(item => {
            let op = find(this.selectorStocks, 'id', item.option_id);
            if (op !== undefined) {
              // 속성 옵션
              if (op.option_type === 0) {
                totalPrice += (this.discountedPrice + op.price) * parseInt(item.quantity)
              }
              else totalPrice += op.price * parseInt(item.quantity)
            }
          })
        }
        else {
          totalPrice = this.discountedPrice * this.order_product.quantity;
        }
        return totalPrice;
      },
    discountedPrice() {
        if (this.product.price.discount_rate !== 0 && this.product.price.discount_type === 0) {
          let discountedPrice = this.product.price.price * (1 - (this.product.price.discount_rate / 100))
          return discountedPrice;
        }
        else if (this.product.price.discount_price !== 0 && this.product.price.discount_type === 1) {
          return this.product.price.price - this.product.price.discount_price;
        }
        else return this.product.price.price;
      },
    scrollStyle() {
        return {
          maxHeight: '280px',
          overflowY: 'auto',
        }
      },
    arrowLeftStyle() {
      return {
        color: this.brandColor.sub2.color,
        backgroundColor: this.brandBgColor.white.backgroundColor,
        left: '20px',
        top: 'calc(50% - 12px)',
        fontSize: '28px',
        padding: '10px',
        borderRadius: '50%'
      }
    },
    arrowRightStyle() {
      return {
        color: this.brandColor.sub2.color,
        backgroundColor: this.brandBgColor.white.backgroundColor,
        right: '20px',
        top: 'calc(50% - 12px)',
        fontSize: '28px',
        padding: '10px',
        borderRadius: '50%'
      }
    }
  },
  watch: {
    $route(n) {
      this.getData();
    },
    '$store.getters.defaultPartner'(n) {
      this.getData();
    },
    '$store.getters.selectedResv'(n) {
      this.getData();
    }
  }
}
</script>
<style scoped>
html {
    scroll-behavior: smooth;
  }

  .option-delete-icon {
    border-radius: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
  }

  .divider {
    margin: 12px 0;
    border-top: 1px solid #e3e3e3;
  }
</style>

