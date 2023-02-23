<template>
<div @click="clickCard" class="unselect full-width">
    <div class="card-product full-width" ref="card">
      <e-image :isBg="true" :isLazy="false" v-if="width>0"
        :img="card.img ? card.img : dummyImage.bg" :useThumb="true"
        :width="width" :useRatio="true" :style="radius"
        :imageRates="cardProps.imageRates" class="lazy-background-image-cover position-relative"
        :imgRadius="8">
        <div slot="inner" class="position-absolute" style="bottom:12px;right:12px;z-index:1" v-if="cardProps.visible.product.like">
          <icon-btn-like likeType="product" :id="card.id"
            color="white" activeColor="highlight"
            :useFullIcon="true" :textShadow="'0px 1px 6px rgba(0, 0, 0, 0.25)'"></icon-btn-like>
        </div>
        <div v-if="soldout" slot="inner"
                class="position-absolute prod-unavailable size-14 weight-700 p-white">{{ card.soldout ? '품절': '예약마감' }}</div>
      </e-image>
      
      <div class="p-bg-white" style="padding-top:8px">
        <div class="col-12">
          <div v-if="cardProps.visible.partner.name && ((card.partner && card.partner.name != '') || $store.getters.service.title !== '')"
              class="size-11 weight-700 ellipsis p-main" :style="{width: `${width}px`}">{{ card.partner ? card.partner.name : $store.getters.service.title }}</div>
          <div v-if="cardProps.visible.product.name" 
              class="size-14 ellipsis p-main" style="height:20px" :style="{width: `${width}px`}">{{ card.name }}</div>
          <div v-if="cardProps.visible.product.simple_desc && card.simple_desc !== ''"
              class="size-13 ellipsis margin-bottom-2 p-sub2" :style="{width: `${width}px`}">{{ card.simple_desc }}</div>
              
          <div v-if="cardProps.visible.product.address && card.address !== ''"
              class="size-12 ellipsis margin-bottom-6 p-sub2" :style="{width: `${width}px`}">{{ card.address }}</div>
          
          <div v-if="cardProps.visible.product.tags && card.tags && card.tags.length>0"
              class="flex-align wrap margin-bottom-8" :style="{width: `${width}px`, gap: '6px 0'}">
            <div v-for="(tag,tagIdx) in tags" class="unselect p-sub2 p-bg-sub ellipsis"
              @click.stop.prevent="tagClick(tag)"
                :style="tagStyle">#{{ tag }}</div>
          </div>
          
          <template v-if="card.has_download_coupon && cardProps.visible.product.coupon">
            <div class="size-12 weight-400 text-center p-white p-bg-primary radius-4"
              style="width:36px">쿠폰</div>
          </template>
        </div>
        
        <div class="flex-between" style="align-items: flex-end">
          <div class="weight-700 flex-align p-main">
            <div v-if="cardProps.visible.product.rate" class="flex-align"
              style="margin-right:8px">
              <i class="material-icons-round" 
                style="font-size: 16px; color:#F8D053;margin-right:2px">star_rate</i>
              <div class="size-12">{{ card.rate ? card.rate : 0 }}</div>
            </div>
            <div v-if="cardProps.visible.product.review"
                  class="size-12"><span class="weight-400">리뷰</span> {{ card.reviews_count }}</div>
          </div>
          <template v-if="card.price.price_type && card.price.price_type===1">
            <div v-if="cardProps.visible.product.price.price"
              class="size-16 weight-600 margin-bottom-2 p-main">{{ card.price.price_text }}</div>
          </template>
          <template v-else>
            <div class="flex-end">
              <div style="text-align:right">
                <div class="size-12 weight-400 p-sub2"
                  :class="{'soldout': soldout}"
                    v-if="isDiscount && cardProps.visible.product.price.org_price && card.price.discount_type === 0 && card.price.discount_rate > 0"
                    style="text-decoration:line-through">{{ card.price.price | currency }}</div>
                <div class="flex-align margin-bottom-2" v-if="card.price"
                  :class="{'soldout': soldout}">
                  <template v-if="isDiscount && cardProps.visible.product.price.discount_price">
                    <div class="size-16 weight-700 p-highlight">
                      <span v-if="card.price.discount_type===0 && card.price.discount_rate > 0" style="margin-right:6px">{{ card.price.discount_rate }}%</span>
                      <!--<span v-else-if="card.price.discount_type===1">{{ card.price.discount_price | currency }}</span>-->
                    </div>
                  </template>
                  <div v-if="cardProps.visible.product.price.price" 
                      class="size-16 weight-700 p-main">{{ isDiscount ? card.price.sale_price : card.price.price | currency }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CardMixin from "@/components/Components/Mixins/CardMixin"

export default {
  name: 'CardProductPc',
  components: {

  },
  mixins: [
    CardMixin
  ],
  props: {
    card: {
      type: Object,
      required: true,
    },
    cardProps: {
      type: Object,
      required: true,
    },

  },
  data() {
    return {
      "width": 0
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      if(this.$refs.card)
        this.width = this.$refs.card.clientWidth;
    })
  },
  
  methods: {
    clickCard() {
      this.routerPush(`product_detail?id=${this.card.id}`);
    },
    tagClick(tag) {
      this.routerPush(`search?keyword=${tag}`);
    }
  },
  computed: {
    tags() {
      let count = 3;
      let textLength = 0;
      if(this.card.tags.length>0) {
        textLength = this.card.tags[0].length;
        if(textLength>=8) {
          count = 1;
        }
        textLength += this.card.tags[1].length;
        if(textLength>=8) {
          count = 2;
        }
      }
      return this.card.tags.slice(0,count);
    },
    tagStyle() {
      return {
        width: 'fit-content',
        padding: '0 6px',
        height: '18px',
        lineHeight: '18px',
        borderRadius: '50px',
        marginRight: '6px',
        fontSize: '12px'
      }
    },
    soldout() {
      return this.card.possible_reservation_resv === false || this.card.possible_booking_resv === false || this.card.soldout === true;
    },
    isDiscount() {
      let result = false;
      let currentDate = this.dayjs().format('YYYY-MM-DD HH:mm');
      if (this.card.price.is_discount) {
        result = true;
        // 기간별
        if (!this.card.price.discount_period_type) {
          // 시작일 <= 현재일 <= 종료일
          if (this.card.price.discount_start && this.card.price.discount_end) {
            result = currentDate >= this.card.price.discount_start && currentDate <= this.card.price.discount_end;
          } 
          // 시작일 <= 현재일
          else if (this.card.price.discount_start && this.card.price.discount_end === null) {
            result = currentDate >= this.card.price.discount_start;
          } 
          // 현재일 <= 종료일
          else if (this.card.price.discount_start === null && this.card.price.discount_end) {
            result = currentDate <= this.card.price.discount_end;
          } 
        } 
        // 시간별
        else {
          let resv = this.$store.getters.selectedResv;
          if (resv) {
            result = this.card.discount_time.findIndex(i => i.start_time === resv.start_time && i.end_time === resv.end_time) > -1;
          }
        }
      }
      return result;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.card-product {
  overflow: hidden;
}
.space {
  height: 140px;
}
.icon-wrap {
  margin-right: 10px;
}
.icon-wrap .material-icons {
  margin-right: 2px;
  width: 15px;
}
.line {
  background: rgba(255,255,255,0.4);
  height: 1px;
}
.desc {
  height: 34px;
}
.prod-unavailable {
    bottom: 0;
    left: 0;
    height: 40px;
    width: 100%;
    border-radius: inherit;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(34, 34, 34, 0.8);
  }
  .soldout {
    opacity: 0.4;
  }
</style>

