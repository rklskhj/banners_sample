<template>
<div class="position-relative" :style="bgStyle" style="color:white">
    <div v-if="detail" class="detail">
      <div class="flex">
        <e-image :isBg="true" :isLazy="false"
        :img="detail.img ? detail.img : dummyImage.person" :useThumb="true"
        :width="60" :useRatio="true" :imgRadius="60"
        :imageRates="{ratio: '1:1'}"></e-image>
        <div style="flex:1;margin:0 20px 0 16px">
          <div class="size-24 weight-700">{{ detail.name }}</div>
          <div class="size-12 weight-500">{{ detail.simple_desc }}</div>
        </div>
        <i class="material-icons-outlined icon-share" @click="$refs.share.share=true">share</i>
      </div>
      <div class="flex-between" style="margin-top:52px;text-align:center">
        <div class="flex">
          <div>
            <div class="size-13">리뷰</div>
            <div class="size-14">{{ detail.reviews_count }}</div>
          </div>
          <div style="margin-left:32px">
            <div class="size-13">평점</div>
            <div class="size-14">{{ detail.rate }}</div>
          </div>  
        </div>
        
        <icon-circle-like @liked="res => toggleLiked(res)" likeType="partner" style="display:block"
            :containStyle='{"backgroundColor": "transparent"}'
            :countCustomStyle='{color: "white",fontSize: "12px"}'
            :menuTitle="'찜 목록'" :count="detail.like_count"
            color="ffffff" activeColor="highlight"></icon-circle-like>
      </div>
    </div>
    <share ref="share" v-if="detail" :product="detail"></share>
  </div>
</template>
<script>

export default {
  name: 'BlockPartnerDetailCard',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "detail": undefined
    }
  },
  created() {
    this.getData();
  },
  
  methods: {
    getData() {
      this.$api.PartnerDetail(this).then(res => {
        this.detail = res;
      });
    },
    toggleLiked(res) {
      if (res) {
        this.detail.like_count += 1;
      } else {
        this.detail.like_count -= 1;
      }
    }
  },
  computed: {
    bgStyle() {
      let deco = {
        width: '100%'
      };
      if(this.detail) {
        let img = this.detail.img;
        if(this.detail.imgs.length>0) {
          img = this.detail.imgs[0];
        }
        deco.background = `linear-gradient( rgba(0, 0, 0, 0.3) 100%, rgba(0, 0, 0, 0.3)100%), url(${img})`;
        deco.backgroundSize = 'cover';
        deco.backgroundPosition = 'center';
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.detail {
    padding: 57px 16px 25px 16px
  }
  .icon-share {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }
</style>

