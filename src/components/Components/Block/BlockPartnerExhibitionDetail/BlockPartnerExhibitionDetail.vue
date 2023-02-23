<template>
<div :style="pageBg" class="position-relative" v-if="detail">
  <div class="flex-between" :style="pagePadding" style="padding-top:24px;padding-bottom:12px">
    <div :style="brandColor.main" class="size-18 weight-500">{{ detail.title }}</div>
    <icon-btn-share :size="18" icon="share" @share="$refs.share.share=true"></icon-btn-share>
  </div>
  <block-exhibition-editor-area :detail="detail"></block-exhibition-editor-area>
  <block-exhibition-category-area :detail="detail" @category="setCategory"></block-exhibition-category-area>

  <div :style="pagePadding" style="margin:25px 0">
    <list-vertical>
      <div slot="card" class="full-width">
        <v1-t-card-partner v-for="(item, idx) in list"
           :key="'card-prod-'+idx"
           :idx="idx"
           class="margin-bottom-24"
           :card="item"
           :cardProps="cardProps"></v1-t-card-partner>
        <div v-if="list && list.length===0" key="empty-view"
             class="empty-view"
             :style="brandColor.sub">목록이 없습니다.</div>
      </div>
    </list-vertical>
  </div>

  <share ref="share" :shareData="detail"></share>  
</div>
</template>
<script>
import BlockExhibitionEditorArea from "@/components/Components/Block/BlockExhibitionEditorArea/BlockExhibitionEditorArea.vue"
import BlockExhibitionCategoryArea from "@/components/Components/Block/BlockExhibitionCategoryArea/BlockExhibitionCategoryArea.vue"
import v1TCardPartner from "@/components/Components/Card/v1/CardPartner.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockPartnerExhibitionDetail',
  components: {
    BlockExhibitionEditorArea,
    BlockExhibitionCategoryArea,
    v1TCardPartner
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "detail": undefined,
      "category": 0,
      "cardProps": {
        "type": "partner",
        "visible": {
          "cart": false,
          "like": true,
          "name": true,
          "rate": true,
          "tags": false,
          "phone": false,
          "review": true,
          "address": false,
          "distance": true,
          "simple_desc": false
        },
        "imageRates": {
          "ratio": "4:3"
        }
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
        navigator.geolocation.getCurrentPosition(position => {
          let add = {};
          add.latitude = position.coords.latitude;
          add.longitude = position.coords.longitude;
          let location = {lat: add.latitude, lng: add.longitude};
          this.$store.commit('setCurrentPosition', location);
          this.$store.commit('setCurrentAddress', add);
  
          // 다시 호출해서 좌표 업데이트하는 방식 - recursive
          // this.getAddress(location);
        }, error => {}, {
          enableHighAccuracy: false,
          maximumAge:Infinity,
          timeout: 10000
        });
      } 
      else {
        console.log('GPS를 지원하지 않습니다');
      }
      
    })
  },
  
  methods: {
    getData() {
      let field = 'id,title,desc,category,info';
      this.$axios.get(`user/${this.$store.getters.user.user_id}/mapping/exhibition_partner/${this.$route.query.id}?fields=${field}`).then(res=>{
        this.detail = res.data;
        if(res.data.category.length>0) {
         this.category = res.data.category[0].id; 
        }
        
        this.getPartner();
      });
    },
    setCategory(res) {
      this.category = res;
    },
    getPartner() {
      this.url = `user/${this.user.user_id}/mapping/partner`
      this.url += '?fields=id,img,name,simple_desc,min_price,distance,rate,reviews_count,address,location,tags,phone';
      this.url += '&page_num=1&page_length=12';
      if(this.category !== 0) {
        this.url += `&exhibition_category=${this.category}`;
      }
      else {
        this.url += `&exhibition=${this.detail.id}`;
      }
      this.currentPage = 1;

      this.$axios.get(this.url).then(res => {
        this.totalPages = res.data.total_page;
        this.currentPage = 2;
        this.list = res.data.data;
      });
    }
  },
  computed: {
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    category() {
      this.getPartner();
    }
  }
}
</script>


