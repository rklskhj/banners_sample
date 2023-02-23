<template>
<div @click="clickCard" class="unselect full-width" style="text-align:center">
    <div class="card-partner full-width" ref="card">
      <div v-if="width>0" class="flex-justify" :style="{'width': `${width}px`}">
        <e-image :isBg="true" :isLazy="false"
          :img="card.img ? card.img : dummyImage.bg" :useThumb="true"
          :width="`calc(${width}px - ${width}px/5)`" :useRatio="true" :style="radius"
          :imageRates="cardProps.imageRates" class="lazy-background-image-cover position-relative"
          imgRadius="50%">
          <!--<div slot="inner" class="position-absolute" style="bottom:12px;right:12px" v-if="cardProps.visible.like">-->
          <!--  <icon-btn-like likeType="partner" :id="card.id"-->
          <!--    color="white" activeColor="highlight"-->
          <!--    :useFullIcon="true" :textShadow="'0px 1px 6px rgba(0, 0, 0, 0.25)'"></icon-btn-like>-->
          <!--</div>-->
        </e-image>
      </div>
      
      <div :style="brandBgColor.white" style="padding-top:8px">
        <div v-if="cardProps.visible.name && card.name !== ''" 
            class="size-14 margin-bottom-4 p-main" style="width:100%">{{ card.name }}</div>
        <template v-if="cardProps.visible.simple_desc && card.simple_desc !== ''">
          <div class="size-13 ellipsis p-sub2" :style="{width: `${width}px`}">{{ card.simple_desc }}</div>
        </template>
        
        <div class="flex-justify full-width">
          <div class="flex-align weight-700 margin-bottom-6 p-main">
            <div v-if="cardProps.visible.rate" style="margin-right:6px"
              class="flex-align">
              <i class="material-icons-round" 
                style="font-size:16px;color:#F8D053;margin-right:2px">star_rate</i>
              <div class="size-12">{{ card.rate ? card.rate : 0 }}</div>
            </div>
            <div v-if="cardProps.visible.review" style="margin-right:6px"
                  class="size-12"><span class="weight-400">리뷰</span> {{ card.reviews_count ? card.reviews_count : 0 }}</div>
            <div v-if="cardProps.visible.distance && getDistance() !== ''"
              class="size-12 weight-400 p-main">거리 <span class="weight-700">{{ getDistance() }}</span></div>
          </div>
        </div>
        
        <div v-if="cardProps.visible.address && card.address !== ''"
            class="size-12 ellipsis p-sub2" :style="{width: `${width}px`}">{{ card.address }}</div>
            
        <div v-if="cardProps.visible.tags && card.tags && card.tags.length>0"
            class="flex-align wrap margin-bottom-8" :style="{width: `${width}px`, gap: '6px 0'}">
          <div v-for="(tag,tagIdx) in tags" class="unselect p-sub2 p-bg-sub ellipsis"
            @click.stop.prevent="tagClick(tag)"
            :style="tagStyle">#{{ tag }}</div>
        </div>
        
        <div v-if="cardProps.visible.phone && card.phone !== ''"
          class="size-12 p-main">{{ card.phone }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import CardMixin from "@/components/Components/Mixins/CardMixin"

export default {
  name: 'CardPartner',
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
      this.width = this.$refs.card.clientWidth;
    })
  },
  
  methods: {
    clickCard() {
      this.routerPush(`partner_detail?id=${this.card.id}`);
    },
    tagClick(tag) {
      this.routerPush(`search?keyword=${tag}`);
    },
    deg2rad(deg) {
      return deg * (Math.PI/180)
    },
    getDistance() {
      if(this.card.location&&this.$store.getters.currentPosition) {
        let lat1 = this.card.location.latitude;
        let lng1 = this.card.location.longitude;
        let lat2 = this.$store.getters.currentPosition.lat;
        let lng2 = this.$store.getters.currentPosition.lng;
        
        let r = 6371; // 지구의 반지름(km)
        let dLat = this.deg2rad(lat2-lat1);
        let dLon = this.deg2rad(lng2-lng1);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = r * c; // Distance in km
        let distance = `${Math.round(d*1000)}`;
        if (distance > 1000) {
          distance = String(distance).slice(0,-3) + 'km'
        } else {
          distance += 'm'
        }
        return distance; 
      } else {
        return '';
      }
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
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.card-partner {
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
</style>

