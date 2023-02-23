<template>
<!--<a :href="`product_detail?id=${card.id}`" target="_blank">-->
    <div class="unselect full-width" @click="clickCard">
    <div class="flex-align">
      <div class="position-relative" style="width:21%" ref="card">
        <e-image :imageRates="cardProps.imageRates" :isBg="true" :img="card.img"
                 :useThumb="true" :width="width"
                 class="position-relative radius-8"
                 style="overflow: hidden">
          <div v-if="isDiscount&&card.price.discount_type===1&&cardProps.visible.product.price.discount_price&&card.price.discount_price>0"
            slot="inner"
            class="size-12 weight-400 position-absolute p-bg-highlight p-white radius-10" 
            style="padding:1px 7px;top:8px;left:8px">
            {{ card.price.discount_price | currency }} 할인
          </div>
          <template v-if="showSoldout">
            <div v-if="soldout" slot="inner" class="position-absolute prod-unavailable size-14 weight-700 p-white">{{ card.soldout ? '품절': '예약마감' }}</div>
          </template>
        </e-image>
      </div>

      <div style="flex:1;padding:0 16px">
        <div v-if="cardProps.visible.partner.name && ((card.partner && card.partner.name != '') || $store.getters.service.title !== '')" 
            class="size-11 weight-700 ellipsis p-main">{{ card.partner ? card.partner.name : $store.getters.service.title }}</div>
        <div class="size-14 weight-400 ellipsis p-main" style="width:100%"
          v-if="cardProps.visible.product.name">{{ card.name }}</div>
        <div class="size-13 margin-bottom-8 p-sub2"
          v-if="cardProps.visible.product.simple_desc && card.simple_desc !== ''">{{ card.simple_desc }}</div>
        <template v-if="card.price.price_type && card.price.price_type===1">
          <div v-if="cardProps.visible.product.price.price"
            :class="{'soldout': soldout}"
            class="size-16 weight-600 margin-bottom-4 p-main">{{ card.price.price_text }}</div>
        </template>
        <template v-else>
          <div class="size-12 weight-400 p-sub2"
            :class="{'soldout': soldout}"
              v-if="isDiscount && cardProps.visible.product.price.org_price && card.price.discount_type === 0 && card.price.discount_rate > 0"
              style="text-decoration:line-through">{{ card.price.price | currency }}</div>
          <div class="flex-align margin-bottom-4" v-if="card.price"
            :class="{'soldout': soldout}">
            <template v-if="isDiscount && cardProps.visible.product.price.discount_price">
              <div v-if="card.price.discount_type===0 && card.price.discount_rate > 0"
                class="size-16 weight-700 p-highlight" style="margin-right:8px">
                {{ card.price.discount_rate }}%
              </div>
            </template>
            <div class="size-16 weight-700 p-main"
              v-if="cardProps.visible.product.price.price">{{ isDiscount ? card.price.sale_price : card.price.price | currency }}</div>
          </div>
        </template>
        <div class="flex-align size-12 margin-bottom-4 p-main">
          <template v-if="cardProps.visible.product.rate">
            <i class="material-icons" style="margin-right:2px;font-size: 16px;color:#F8D053">star</i>
            <div class="weight-700" style="margin-right:8px">{{ card.rate }}</div>
          </template>
          <div v-if="cardProps.visible.product.review"
            style="margin-right:8px">리뷰 <span class="weight-700">{{ card.reviews_count }}</span></div>
        </div>
        <div v-if="cardProps.visible.product.address && card.address !== ''" style="width:100%"
            class="size-12 ellipsis margin-bottom-4 p-sub2">{{ card.address }}</div>
        <div v-if="cardProps.visible.product.tags && card.tags && card.tags.length>0"
            class="flex-align wrap margin-bottom-8" style="width: 100%; gap: 6px 0">
          <div v-for="(tag,tagIdx) in tags" class="unselect p-sub2 p-bg-sub ellipsis"
            @click.stop.prevent="tagClick(tag)"
            :style="tagStyle">#{{ tag }}</div>
        </div>
        <template v-if="card.has_download_coupon&&cardProps.visible.product.coupon">
          <div class="size-12 weight-400 text-center p-white p-bg-primary radius-4"
            style="width:36px">쿠폰</div>
        </template>
      </div>
      
      <div v-if="cardProps.visible.product.like">
        <icon-btn-like likeType="product" :id="card.id"
          color="e3e3e3" activeColor="highlight"
          :useFullIcon="true"></icon-btn-like>
      </div>
    </div>
  </div>
  <!--</a>-->
</template>
<script>

export default {
  name: 'CardProductPc',
  components: {

  },
  mixins: [

  ],
  props: {
    card: {
      type: Object,
    },
    cardProps: {
      type: Object,
      required: true,
    },
    showSoldout: {
      type: Boolean,
      default: true,
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
    soldout() {
      return this.card.possible_reservation_resv === false || this.card.possible_booking_resv === false || this.card.soldout === true;
    },
    tags() {
      let count = 3;
      let textLength = 0;
      if(this.card&&this.card.tags&&this.card.tags.length>0) {
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

