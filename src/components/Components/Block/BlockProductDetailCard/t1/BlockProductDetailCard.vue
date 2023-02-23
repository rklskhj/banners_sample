<template>
<div ref="cardHeight">
  <div v-if="card">
    <!--<block-breadcrumb :product="card" style="padding: 0 16px" />-->
    <div style="min-height:256px" ref="imgwrap">
      <image-slider :listData="card.imgs" v-if="card.imgs.length>0"
        :arrow="true" :indicator="true"
        :useRatio="true"
        :width="imgWidth"
        :imageRates="{ratio: '3:4'}"
        :arrowLeftStyle="arrowLeftStyle"
        :arrowRightStyle="arrowRightStyle"></image-slider>
      <!--<div v-else-->
      <!--  v-lazy:background-image="card.img" class="lazy-background-image-cover" :style="imgStyle"></div>-->
      <e-image v-else :img="card.img" :width="imgWidth" :imageRates="{ratio: '3:4'}"
                    class="lazy-background-image" :isBg="true" :isLazy="true"></e-image>
    </div>
    
    <div>
      <div :style="[staticStyle]" style="padding:16px 0px 0px">
        
        <div :style="pagePadding">
          <div class="flex-between margin-bottom-12">
            <div class="flex-align">
              <!-- 별점 표시 일시적 비활성화 -->
              <!--<div class="flex-align" style="border-radius:4px;padding:4px 6px;margin-right:8px" :style="brandBgColor.sub">-->
              <!--  <i class="material-icons" style="color:#ffc351;font-size:18px;margin-right:6px">star</i>-->
              <!--  <div class="size-12 weight-500" :style="brandColor.main">{{ rate }}</div>-->
              <!--</div>-->
              <div class="flex-align" style="border-radius:4px;padding:4px 6px;margin-right:8px" :style="brandBgColor.sub">
                <i class="material-icons" style="font-size:18px;margin-right:6px"
                  :style="brandColor.brand">favorite</i>
                <div class="size-12 weight-400" :style="brandColor.main">{{ card.like_count }}</div>
              </div>
              <div class="flex-align" style="border-radius:4px;padding:4px 6px;" :style="brandBgColor.sub">
                <i class="material-icons" style="color:#ffc351;font-size:18px;margin-right:6px"
                  :style="brandColor.sub">visibility</i>
                <div class="size-12 weight-400" :style="brandColor.main">{{ card.visit }}</div>
              </div>
            </div>
            <div class="flex-align">
              <icon-btn-share icon="share" @share="$refs.share.share=true" style="margin-right: 16px"></icon-btn-share>
              <icon-btn-like likeType="product" @liked="res => toggleLiked(res)" :menuTitle="'마이페이지 > 찜 목록'"></icon-btn-like>
            </div>
          </div>

          <div class="size-14 weight-400 unselect" :style="brandColor.primary" v-if="card.partner"
            @click="clickPartner">{{ card.partner.name }}</div>
          <div class="size-20 weight-400" :style="brandColor.main">{{ card.name }}</div>
          <div class="margin-bottom-8 size-12" :style="brandColor.sub">{{ card.simple_desc }}</div>
          
          <div class="flex">  
            <div class="flex-align bold" style="justify-content:flex-end">
              <div v-if="isDiscountProd" :style="brandColor.sub" class="size-14 weight-400"
                style="text-decoration:line-through">{{ card.price.price | currency }}</div>
            </div>
          </div>
          
          <div :style="brandColor.main" class="size-20 bold flex-align margin-bottom-16">
            <div>{{ isDiscountProd ? computedPrice : card.price.price | currency }}<span v-if="card.price.won_type === 1">~</span></div>
            <div v-if="isDiscountProd"
              style="margin-left:8px; color: #eb5757" class="size-20">
              <div v-if="card.price.discount_type===0 && card.price.discount_rate > 0">{{ card.price.discount_rate }}%</div>
              <div v-if="card.price.discount_type===1 && card.price.discount_price > 0">- {{ card.price.discount_price | currency }}</div>
            </div>
          </div>
          
          <div v-if="card.price.price_type === 0 && couponList.length > 0" @click="clickDownloadCoupon" class="unselect flex-justify" :style="[brandBgColor.sub, brandBorder.main]"
            style="margin-bottom: 20px; border-radius: 4px; height: 32px; width: 100%">
            <div class="flex-align" :style="brandColor.brand">
              <i class="material-icons" style="margin-right: 4px">save_alt</i>
              <div class="size-14">최대 {{ currency(maximumCouponDiscountPrice) }} 쿠폰 받기</div>
            </div>
          </div>
          
          
          
        </div>
        <div v-if="card.order_conversion_type === 3" class="full-width p-border-top-sub"
          style="padding: 16px 0 24px" :style="pagePadding">
          <div class="flex" style="align-items: flex-start; gap: 0 16px">
            <div class="size-13 weight-400 p-sub" style="width: 70px">배송정보</div>
            <div class="flex-1">
              <div class="size-14 weight-500 p-primary" v-html="deliveryCharge"
                style="word-break: break-all"></div>
              <div id="delivery-info-text">
                <e-editor :html="card.common_info.delivery_info" v-if="card.common_info.delivery_info"></e-editor>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <block-download-coupon v-if="showCouponList"
      @closePage="closePage" @getCouponList="getCouponList"
      :couponList="couponList"></block-download-coupon>
    <share ref="share" v-if="card" :product="card"></share>
  </div>
  
</div>
</template>
<script>
import ButtonOrdering from "@/components/Components/Button/ButtonOrdering.vue"
import BlockDownloadCoupon from "@/components/Components/Block/BlockDownloadCoupon/BlockDownloadCoupon.vue"
import BtnPc from "@/components/Components/Button/BtnPc.vue"
import OrderMixin from "@/components/Components/Mixins/OrderMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockProductDetailCard',
  components: {
    ButtonOrdering,
    BlockDownloadCoupon,
    BtnPc
  },
  mixins: [
    OrderMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "card": undefined,
      "imgWidth": 0,
      "couponList": [],
      "fixedState": false,
      "showOption": false,
      "selectedImg": undefined,
      "order_product": undefined,
      "selectorStocks": [],
      "showCouponList": false,
      "deliveryMethodArr": [],
      "selectedDeliveryMethod": ""
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      this.imgWidth = this.$refs.imgwrap.clientWidth;
      window.addEventListener('scroll', this.detectClientHeight);
    });
  },
  updated() {
    this.detectClientHeight();
  },
  beforeDestroy() {
    this.unlock(document.querySelector('html'));
    this.unlock(document.querySelector('body'));
    this.showCouponList = false;
  },
  
  methods: {
    clickPartner() {
      this.routerPush(`partner_detail?id=${this.card.partner.id}`);
    },
    getData() {
      let url = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}`
        url += `?fields=id,parent,img,name,simple_desc,tags,form,order_conversion_type,category1,category2,category3`
        url += `,rate,stock,stock_type,input,like_count,reviews_count,visit,price,discount_time,related_products,selectors`
        url += `,minimum,maximum,partner,address,dong,distance,params,imgs,common_info,info,operating_time,phone,params,location,enable_option,enable_prod&hit=false`
      this.$axios.get(url)
      .then(res => {
        if(this.$store.getters.browserType!=='pc')
          res.data.info = res.data.info.replace(/<img /gi, '<img style="margin:0 -16px;max-width:100vw" ');
        else
          res.data.info = res.data.info.replace(/<img /gi, '<img style="margin:0 -16px;max-width:416px" ');
        this.card = res.data;
        
         this.getCouponList();
        this.order_product = {
        "product_id": this.card.id,
        "name": this.card.name,
        "quantity": 1,
        "comm_price": 0,
        "point": 0,
        "discount_price": 0,
        "total_price": 0,
        "img": this.card.img,
        "delivery_price": this.card.price.delivery_price,
        "order_product_option": [],
        "product": this.card,
    }
    // 옵션 사용할 경우 
    if(this.card.enable_option) this.getSelectorStocks();
    // 자체 상품일 경우
    else this.selectProduct();
    
    this.initializeDeliveryMethod();
    
    // 최근 본 상품 목록에 담기
    let recentlyViewProducts = this.$store.getters.recentlyViewProducts ? this.$store.getters.recentlyViewProducts : [];
    let itemToFind = recentlyViewProducts.find(item => item.id === this.card.id);
    let idx = recentlyViewProducts.indexOf(itemToFind);
    if (idx > -1) recentlyViewProducts.splice(idx, 1);
    this.card.date = this.dayjs().format('YYYY-MM-DD');
    recentlyViewProducts.unshift(this.card);
    this.$store.commit('setRecentlyViewProducts', recentlyViewProducts);
    
    this.detectClientHeight();
      });
    },
    clickDownloadCoupon() {
      this.showCouponList = true;
      this.lock(document.querySelector('html'));
      this.lock(document.querySelector('body'));
    },
    getCouponList() {
      this.$axios.get(`/user/${this.user.user_id}/product/${this.$route.query.id}/download_coupon`).then(res => {
        this.couponList = res.data;
      })
    },
    lock(element) {
      element.style.overflow = 'hidden';
      element.style.touchAction = 'none';
    },
    unlock(element) {
      element.style.removeProperty('overflow');
      element.style.removeProperty('touch-action');
    },
    closePage() {
      this.showCouponList = false;
      this.unlock(document.querySelector('html'));
      this.unlock(document.querySelector('body'));
    },
    toggleLiked(res) {
      if (res) {
        this.card.like_count += 1;
      } else {
        this.card.like_count -= 1;
      }
    },
    detectClientHeight() {
      this.$nextTick(function() {
        if(this.$refs.cardHeight) {
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
    // 장바구니 넣기
    clickCart() {
      if(this.card.enable_option) {
        if(this.order_product.order_product_option.length===0) {
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
    // 찜하기
    clickFav() {
      // if(!this.isLogin) {
      //   this.$router.push('signin')
      // }
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
        if(this.card.enable_option) {
          if(this.order_product.order_product_option.length===0) {
            this.toast('주문할 상품을 선택해주세요.');
            return;
          }
        
          let isOptionType0 = false;
          this.order_product.order_product_option.some(op=> {
            let ss = find(this.selectorStocks, 'id', op.option_id);
            // 속성옵션 0, 추가옵션 1
            if(ss.option_type===0) isOptionType0 = true;
            return (ss.option_type===0)
          })
          if(!isOptionType0) {
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
    //상품 선택
    selectProduct() {
      let comm_price = 0;
      let point_price = 0;
      let discount_price = 0;
      let price = this.card.price;
      let product_price = price.price;
      
      // 속성 옵션일 경우 상품가격 + 옵션가 
      // 0: 비율, 1: 금액 
      // 수수료, 포인트, 할인 계산
      if(price.is_point) {
        if(price.point_type===0) point_price = product_price * price.point_rate / 100;
        else point_price = price.point;
      }
      if(this.isDiscountProd) {
        if(price.discount_type===0) discount_price = product_price * price.discount_rate / 100;
        else discount_price = price.discount_price;
      }
      if(price.is_comm) {
        if(price.comm_type===0) comm_price = product_price * price.comm_rate / 100;
        else comm_price = price.comm_price;
      }
      
      this.order_product.comm_price = comm_price;
      this.order_product.point = point_price;
      this.order_product.discount_price = discount_price;
      this.order_product.product_price = product_price;
      //console.log('product_price', product_price)
      this.order_product.total_price = product_price - discount_price;
    },
    // 상품옵션 선택
    selectOption(value) {
      // order_product 중복 체크 후(option id체크) 있을 경우 종료
      let op = find(this.order_product.order_product_option, 'option_id', value);
      if(op) return;
      
      let total_price = 0;
      let comm_price = 0;
      let point_price = 0;
      let discount_price = 0;
      let price = this.card.price;
      
      this.selectorStocks.forEach(selector=> {
        if(selector.id===value) {
          // console.log('옵션가',selector.price);
          // console.log('상품가',price.price);
          // 속성 옵션일 경우 상품가격 + 옵션가 
          if(selector.option_type===0) total_price = selector.price + price.price; 
          else total_price = selector.price;
          // 0: 비율, 1: 금액 
          // 수수료, 포인트, 할인 계산
          if(price.point_type===0) point_price = total_price * price.point_rate / 100;
          else point_price = price.point;
          if(price.discount_type===0) discount_price = total_price * price.discount_rate / 100;
          else discount_price = price.discount_price;
          if(price.comm_type===0) comm_price = total_price * price.comm_rate / 100;
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
    // 옵션 가져오기
    getSelectorStocks() {
        if(this.card.id) {
          this.$axios.post(`public/product/${this.card.id}/selector_stocks`)
            .then( res => {
              this.selectorStocks = res.data.stocks;
              this.order_product.selectorStocks = res.data.stocks;
            });
        }
      },
    // 배송유형이 있을 경우 초기화 작업
    initializeDeliveryMethod() {
      let names = [
        { label: 'parcel', value: '택배' },
        { label: 'post', value: '등기 / 소포' },
        { label: 'cargo', value: '화물배송' },
        { label: 'visit', value: '방문수령' },
        { label: 'quick', value: '퀵배송' }
      ]
        // 배송 유형
      if(this.card.price.delivery_price) {
        let items = this.card.price.delivery_price.delivery_method;
        if(items.length>1) {
          let arr = [];
          items.forEach(item=> {
            arr.push({ label: find(names, 'label', item).value, value: item })
          })
          this.deliveryMethodArr = arr; 
        }
        else {
          if(items.length===1) {
            this.deliveryMethodArr = [
              { label: find(names, 'label', items[0]).value, value: items[0] }
            ]
          }
        }
        if(items.length>0) this.selectedDeliveryMethod = items[0]
        }
      
    },
    deleteOrderProduct(idx) {
      this.order_product.order_product_option.remove(idx);
    }
  },
  computed: {
    maximumCouponDiscountPrice() {
      if (this.couponList.length !== 0) {
        let discountPriceArray = [];
        this.couponList.forEach(coupon => {
          if (coupon.benefits_type === 0) { // 혜택 유형이 상품 금액할인인 경우
            if (coupon.discount_type === 0) {
              if (this.card.price.sale_price !== 0) {
                discountPriceArray.push(this.card.price.sale_price * (coupon.discount_rate / 100))
              } else {
                discountPriceArray.push(this.card.price.price * (coupon.discount_rate / 100))
              }
            } else {
              discountPriceArray.push(coupon.discount_price)
            }
          } else if (coupon.benefits_type === 1) { // 주문 금액할인인 경우
            if (coupon.discount_type === 0) {
              if (this.card.price.sale_price !== 0) {
                discountPriceArray.push(this.card.price.sale_price * (coupon.discount_rate / 100))
              } else {
                discountPriceArray.push(this.card.price.price * (coupon.discount_rate / 100))
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
      if (this.card.price.is_discount) {
        if (this.card.price.discount_period_type === false) {
          if (this.card.price.discount_start !== null && this.card.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.card.price.discount_start || currentDate > this.card.price.discount_end) {
              return false;
            } else {
              return true;
            }
          } else if (this.card.price.discount_start !== null && this.card.price.discount_end === null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate < this.card.price.discount_start) {
              return false;
            } else {
              return true;
            }
          } else if (this.card.price.discount_start === null && this.card.price.discount_end !== null) {
            let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
            if (currentDate > this.card.price.discount_end) {
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
                  let index = this.card.discount_time.findIndex(item => {
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
        position: 'static',
        width: '100%',
        backgroundColor: 'white',
        borderTop: this.brandBorder.main.border,
        borderBottom: this.brandBorder.main.border
      }
    },
    imgStyle() {
      return {
        width: '100%',
        height: '256px',
      }
    },
    partnerStyle() {
      return {
        padding: '16px',
        borderBottom: `1px solid ${this.getColor('기본 테두리선 색상')}`
      }
    },
    partnerImg() {
      return {
        width: '48px',
        height: '48px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url("${this.card.partner.img}")`,
        borderRadius: '50%'
      }
    },
    arrowLeftStyle() {
      return {
        top: 'calc(50% - 20px)',
        color: 'white',
        left: '12px',
        fontSize: '40px',
      }
    },
    arrowRightStyle() {
      return {
        top: 'calc(50% - 20px)',
        color: 'white',
        right: '12px',
        fontSize: '40px',
      }
    },
    computedPrice() {
      if(this.card.price.discount_type===1) {
        return this.card.price.price - this.card.price.discount_price;
      }
      else if(this.card.price.discount_type===0) {
        return Math.round(this.card.price.price * (1 - (this.card.price.discount_rate / 100)));
      }
    },
    deliveryCharge() {
      let delivery = this.card.price.delivery_price;
      let type = delivery.delivery_type;
      let result = ''
      switch (type) {
          // 고정배송비
          case 0:
            result = `<div>${this.currencyKor(delivery.fix_price)}</div>`;
            break;
          // 배송비 무료
          case 1:
            result = '<div>배송비 무료</div>';
            break;
          // 금액별 배송비
          case 2:
            let arr_price_charge = delivery.delivery_price_setting.sort((a,b) => {return a.min<b.min ? -1 : a.min>b.min ? 1 : 0})
            let str_price_charge = '';
            for(let i=0; i<arr_price_charge.length; i++) {
              let item = arr_price_charge[i];
              let price_price_charge = 0;
              if (item.price!==undefined) price_price_charge = item.price;
              else if (item.parcel_price!==undefined) price_price_charge = item.parcel_price;
              if (i===arr_price_charge.length-1) {
                str_price_charge += `<div>${ item.min > 0 ? this.currencyKor(item.min) + ' 이상 ' : ''}<b style="margin-left:8px">${price_price_charge === 0 ? '무료' : this.currencyKor(price_price_charge)}</b></div>`;
              }
              else {
                str_price_charge += `<div style="color: #000000">${ item.min > 0 ? this.currencyKor(item.min) + ' ' : ''}~ ${this.currencyKor(item.max)} 미만 <b style="margin-left:8px">${price_price_charge === 0 ? '무료' : this.currencyKor(price_price_charge)}</b></div>`;
              }
            }
            result = str_price_charge;
            break;
          // 수량별 배송비
          case 3:
            let arr_quantity_charge = delivery.delivery_price_setting.sort((a,b) => {return a.min<b.min ? -1 : a.min>b.min ? 1 : 0})
            let str_quantity_charge = '';
            for(let i=0; i<arr_quantity_charge.length; i++) {
              let item = arr_quantity_charge[i];
              let price_quantity_charge = 0;
              if (item.price!==undefined) price_quantity_charge = item.price;
              else if (item.parcel_price!==undefined) price_quantity_charge = item.parcel_price;
              if (i===arr_quantity_charge.length-1) {
                str_quantity_charge += `<div>${ item.min > 0 ? this.currencyNum(item.min) + '개 이상 ' : ''}<b style="margin-left: 8px">${price_quantity_charge === 0 ? '무료' : this.currencyKor(price_quantity_charge)}</b></div>`;
              }
              else {
                str_quantity_charge += `<div>${ item.min > 0 ? this.currencyNum(item.min) + '개 ' : ''}~ ${this.currencyNum(item.max)}개 미만 <b style="margin-left:8px">${price_quantity_charge === 0 ? '무료' : this.currencyKor(price_quantity_charge)}</b></div>`;
              }
            }
            result = str_quantity_charge;
            break;
        }
      return result;
    },
    // 속성 옵션
    optionArr1() {
      let options = this.selectorStocks.filter(item=> {
        return item.option_type===0;
      })
      return options;
    },
    // 속성 옵션
    optionArr2() {
      let options = this.selectorStocks.filter(item=> {
        return item.option_type===1;
      })
      return options;
    },
    totalPrice() {
      // console.log('전체 ',this.order_product)
      let totalPrice = 0;
      if(!this.order_product) return 0
      if(this.card.enable_option) {
        this.order_product.order_product_option.forEach(item=> {
          let op = find(this.selectorStocks, 'id', item.option_id);
          if(op!==undefined) {
            // 속성 옵션
            if(op.option_type===0) {
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
      if(this.isDiscountProd){
        if (this.card.price.discount_rate!==0 && this.card.price.discount_type===0) {
          let discountedPrice = this.card.price.price * (1 - (this.card.price.discount_rate / 100))
          return discountedPrice;
        }
        else if(this.card.price.discount_price!==0 && this.card.price.discount_type===1) {
          return this.card.price.price - this.card.price.discount_price;
        }
      }
      else return this.card.price.price;
    }
  },
  watch: {
    '$route.query.id'(n) {
      this.getData();
    }
  }
}
</script>
<style scoped>
.option-modal-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-end;
}
.option-modal {
  width: 100%;
  height: 375px;
  overflow-y: scroll;
  background-color: #fff;
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
  width: 100%;
  height: 1px;
  margin: 16px 0;
}
</style>
<style>
#delivery-info-text .sun-editor-editable p {
    font-size: inherit !important;
  }
</style>
