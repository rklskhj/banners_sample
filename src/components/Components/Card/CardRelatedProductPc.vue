<template>
<div class="unselect" @click="clickProduct">
  <!--<div :style="childImgStyle(item.img)" class="margin-bottom-8"></div>-->
  <e-image :isBg="true" :isLazy="false" :img="item.img" class="position-relative radius-8" :imgRadius="8"
    :useThumb="true" :width="172" :imageRates="{ratio: '1:1'}">
    <div v-if="isDiscountChild(item) && item.price.discount_type===1"
      slot="inner"
      class="size-14 position-absolute p-bg-highlight p-white radius-6"
      style="padding: 2px 8px; top: 8px; left: 8px">
      {{ item.price.discount_price | currency }} 할인
    </div>
    <div slot="inner" class="position-absolute" style="bottom: 16px; right: 16px">
      <icon-btn-like likeType="product" @liked="res => toggleLiked(res)" :id="item.id"
        :size="24" color="e3e3e3" activeColor="highlight"
        :menuTitle="'마이페이지 > 찜'"
        :useFullIcon="true" :textShadow="'0px 1px 6px rgba(0, 0, 0, 0.25)'"></icon-btn-like>
    </div>
  </e-image>
  <div class="size-12 p-sub2" style="margin-top: 12px">{{ item.partner.name }}</div>
  <div :style="brandColor.main"
    class="ellipsis-multiple size-14 weight-500"
    style="width: 100%; height: auto">{{ item.name }}</div>
  <!--<div class="size-12 weight-500" :style="brandColor.main">{{ item.price.is_discount ? computedPrice(item) : item.price.price | currency }}</div>-->
  
  

  <div class="flex" style="justify-content:flex-start">  
    <div class="flex-align" style="justify-content:flex-start">
      <div v-if="isDiscountChild(item) && item.price.discount_type===0"
        style="margin-right:2px" class="size-20 bold p-highlight">
        <div>{{ item.price.discount_rate }}%</div>
        <!--<div v-if="item.price.discount_type===1">- {{ item.price.discount_price | currency }}</div>-->
      </div>
      <div class="size-20 bold p-main">
        {{ isDiscountChild(item) ? computedPrice(item) : item.price.price | currencyNum }}<span
        class="size-14 weight-400">원</span></div>
    </div>
  </div>
  <!--<div v-if="isDiscountChild(item)" :style="brandColor.sub" class="size-16"-->
  <!--      style="text-decoration:line-through;text-align:left">{{ item.price.price | currency }}</div>-->
  
</div>
</template>
<script>

export default {
  name: 'CardRelatedProductPc',
  components: {

  },
  mixins: [

  ],
  props: {
    item: {
      type: Object,
      required: true,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    clickProduct() {
      this.routerPush(`product_detail?id=${this.item.id}`);
    },
    computedPrice(item) {
      if(item.price.discount_type===1) {
        return item.price.price - item.price.discount_price;
      }
      else if(item.price.discount_type===0) {
        return item.price.price * (1 - (item.price.discount_rate / 100));
      }
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
    toggleLiked(res) {
        if (res) {
          this.item.like_count += 1;
        } else {
          this.item.like_count -= 1;
        }
      }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


