<template>
<div id="partner-detail-card">
  <div v-if="detail">
    <e-image :isBg="true" :isLazy="false" :img="detail.imgs.length > 0 ? detail.imgs[0] : detail.img ? detail.img : dummyImage.bg"
      :useRatio="true" class="position-relative"
      :useThumb="true" :width="width" :imageRates="imageRates"
      :imgRadius="8">
      <div slot="inner" class="full-width full-height flex-center"
        style="background-color:rgba(0,0,0,0.3)">
        <div :style="pcMaxWidth" class="flex-between">
          <div class="flex-align">
            <div v-lazy:background-image="detail.img" class="lazy-background-image-cover" :style="imgStyle"></div>
            
            <div :style="brandColor.white" style="margin-left:24px;">
              <div class="size-24 weight-700 margin-bottom-4">{{ detail.name }}</div>
              <div class="size-16">{{ detail.simple_desc }}</div>
            </div>
          </div>
          
          <div class="flex-align size-16 weight-700 text-center" :style="brandColor.white">
            <div style="margin-right:16px">
              <i class="material-icons" style="height:32px;width:48px">rate_review</i>
              <div>{{ detail.reviews_count }}</div>
            </div>
            
            <div style="margin-right:16px">
              <i class="material-icons" style="height:32px;width:48px">star</i>
              <div>{{ detail.rate ? detail.rate : '0' }}</div>
            </div>
            
            <div style="margin-right:16px">
              <icon-circle-like likeType="partner" color="white" style="height:32px;align-items:baseline"
                :containStyle="likeStyle" activeColor="highlight"></icon-circle-like>
              <div>{{ detail.like_count }}</div>
            </div>
            
            <div class="unselect">
              <i class="material-icons-outlined icon-share" @click="$refs.share.share=true"
                style="height:32px;width:48px">share</i>
              <div class="weight-400">공유</div>
            </div>
              <!-- <div class="flex-align" style="border-radius:4px;padding:4px 6px;" :style="brandBgColor.main">-->
              <!--  <i class="material-icons" style="color:#ffc351;font-size:18px;margin-right:6px"-->
              <!--    :style="brandColor.sub">visibility</i>-->
              <!--  <div>{{ detail.visit }}</div>-->
              <!--</div>-->
          </div>
  
            <!--<div :style="brandColor.sub">-->
            <!--  <div class="size-12 margin-bottom-4" v-if="detail.address">주소: {{ detail.address }}</div>-->
            <!--  <div class="size-12 margin-bottom-4" v-if="detail.company_operating">영업시간: {{ detail.company_operating }}</div>-->
            <!--  <div class="size-12 margin-bottom-4" v-if="detail.phone">연락처: {{ detail.phone }}</div>-->
            <!--</div>-->
            
      
  
          <share ref="share" v-if="detail" :product="detail"></share>
        </div>
      </div>
    </e-image>
  </div>
</div>
</template>
<script>
import BtnPc from "@/components/Components/Button/BtnPc.vue"

export default {
  name: 'BlockPartnerDetailCardPc',
  components: {
    BtnPc
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "width": 0,
      "detail": undefined,
      "imageRates": {
        "ratio": "5:1"
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      this.width = window.innerWidth;
    })
  },
  
  methods: {
    clickCall() {
      location.href = `tel:${this.detail.phone}`;
    },
    getData() {
      this.$api.PartnerDetail(this).then(res => {
        this.detail = res;
      })
    }
  },
  computed: {
    likeStyle() {
      return {
        borderRadius:"8px",
        height:"48px",
        width:"48px"
      }
    },
    imgStyle() {
      return {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
      }
    },
    partnerStyle() {
      return {
        padding: '16px',
        border: `1px solid ${this.getColor('기본 테두리선 색상')}`
      }
    }
  },
  watch: {
    
  }
}
</script>


