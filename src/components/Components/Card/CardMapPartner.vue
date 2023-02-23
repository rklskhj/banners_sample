<template>
<div>
    <div :style="pagePadding">
      <div class="flex" style="justify-content: space-between">
        <div style="flex:1" @click="routerPush(`partner_detail?id=${card.id}`)">
          <div class="size-18 weight-500">{{ card.name }}</div>
          <div class="flex-align size-12 weight-700 margin-bottom-4">
            <i class="material-icons p-deco"
               style="font-size:12px;margin-right:4px">star</i>

            <div class="p-main">{{ card.rate }}</div>

            <div class="p-sub2" style="margin:0 8px">·</div>

            <div class="p-main"><span class="weight-400">리뷰 </span> {{ card.reviews_count|currencyNum }}</div>
            <div class="p-sub2" style="margin:0 8px">·</div>
            <div class="size-12 weight-400 p-main">{{ card.phone }}</div>
          </div>
          <div class="size-12 weight-400 p-sub2">{{ card.address }}</div>
        </div>
        <icon-btn-like likeType="partner" :id="card.id" menuTitle="마이페이지 > 찜 목록"
                       activeColor="highlight"></icon-btn-like>
      </div>
      <template v-if="card.tags.length>0">
        <div class="flex-align full-width size-12 weight-400 p-primary" style="flex-wrap: wrap;margin-top:12px">
          <div v-for="(item,idx) in card.tags.slice(0,5)"
               :key="'tag-'+idx"
               style="margin-right:8px">
            #{{ item }}
          </div>
        </div>
      </template>
    </div>
    <list-horizontal v-if="card.imgs.length>0" style="margin-top:12px" :cardHeight="100">
      <template v-slot:card>
        <img style="width: 16px"/>
        <img v-for="(img,idx) in card.imgs" :key="'img-'+idx" :src="getThumb(img)" @click="clickImg"
             class="thumb radius-8">
        <img style="width: 12px"/>
      </template>
    </list-horizontal>
    <list-horizontal v-if="card.imgs.length === 0 && card.img" style="margin-top:12px" :cardHeight="100">
      <template v-slot:card>
        <img style="width: 16px"/>
        <img :src="getThumb(card.img)" @click="clickImg"
             class="thumb radius-8">
        <img style="width: 12px"/>
      </template>
    </list-horizontal>
  </div>
</template>
<script>

export default {
  name: 'CardMapPartner',
  components: {

  },
  mixins: [

  ],
  props: {
    card: {
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
  
  methods: {
    clickImg() {
        this.$root.$emit('page_overlay', 'PhotoSearchOverlay', {prop: {imgs: this.card.imgs, name: this.card.name }});
      },
    getThumb(imageSrc) {
        let temp = imageSrc.split('.');
        let path = temp[0].split('//')[1];
        if (path === "launchpack-storage" || path.indexOf("launchpack-service-")>-1) {
          temp[temp.length - 2] = `${temp[temp.length - 2]}_thumb`;
          return temp.join('.');
        } else {
          return imageSrc;
        }
      }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.thumb {
    width: 100px;
    height: 100px;
    margin-right: 4px;
    border: 1px solid #f5f5f5;
    object-fit: cover;
    object-position: center;
  }
</style>

