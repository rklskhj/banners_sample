<template>
<div>
  <page-header style="width: 100%">
    <div slot="right">
      <i class="material-icons header-icon unselect" @click="clickClose" style="margin: 0 10px;">close</i>
    </div>
    <span class="header-title" slot="center">상품 후기</span>
  </page-header>
  <div style="overflow-y:auto;height:auto"
    :style="{
      'paddingTop': $store.getters.device === 'mobile' ? '50px' : '32px'
    }">
    <div class="flex-align" :style="pagePadding" style="margin-bottom:32px">
      <e-image :isBg="true" :isLazy="false"
          :img="card.author_img ? card.author_img : dummyImage.person" :useThumb="true"
          :width="34" :useRatio="true" :imgRadius="100"
          :imageRates="{ratio:'1:1'}"></e-image>
      <div class="weight-500 size-14" style="margin-left:8px" :style="brandColor.sub2">{{ card.author }}</div>
    </div>
    <image-slider :listData="card.imgs"
                  :useRatio="true"
                  :imageRates="{ratio:'1:1'}"
                  :indicator="true"
                  :customNumIndicatorStyle="customNumIndicatorStyle"
                  indicatorType="num"></image-slider>
    <div :style="pagePadding">
      <div class="size-14 weight-500" style="margin-top:16px" :style="brandColor.main">{{ card.title }}</div>
      <div class="size-13" :style="brandColor.sub" style="margin-top:2px;line-height:20px">{{ card.content }}</div>
      <div v-if="$route.path !== '/product_detail'" class="size-14 unselect"
        :style="brandColor.primary" style="margin-top:12px" @click="showOrigin">원문보기</div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockReviewImageOverlay',
  components: {

  },
  mixins: [

  ],
  props: {
    prop: {
      type: Object,
    },

  },
  data() {
    return {
      "card": {},
      "customNumIndicatorStyle": {
        "left": "calc(50% - 24px)",
        "bottom": "20px"
      }
    }
  },
  created() {
    this.card = this.prop.card;
  },
  mounted() {
    this.$nextTick(() => {
      for(let el of document.getElementsByClassName('sweet-box-actions')) {
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
    })
  },
  
  methods: {
    showOrigin() {
      this.$emit('closePage');
      setTimeout(() => {
        this.$store.commit('setProductId', this.card.product_id);
        this.$store.commit('setReviewId', this.card.id);
      }, 1000);
    },
    clickClose() {
      this.$emit('closePage');
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


