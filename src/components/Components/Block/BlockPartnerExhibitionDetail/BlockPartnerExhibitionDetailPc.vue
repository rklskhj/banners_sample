<template>
<div :style="pcMaxWidth" v-if="detail">
  <div class="flex-between" style="padding-top:56px;padding-bottom:24px">
    <div :style="brandColor.main" class="size-24 weight-500">{{ detail.title }}</div>
    <icon-btn-share :size="26" icon="share" @share="$refs.share.share=true"></icon-btn-share>
  </div>

  <div :style="pcMaxWidth" style="margin:25px 0">
    <div :style="brandBgColor.white" class="full-width">
      <e-editor :html="detail.info" style="padding:0"></e-editor>
    </div>
  </div>

  <block-exhibition-category-area-pc :detail="detail" @category="setCategory"></block-exhibition-category-area-pc>

  <div :style="pcMaxWidth" style="margin:25px 0">
    <list-vertical>
      <div slot="card-grid" class="full-width">
        <transition-group name="fade" tag="div" class="full-width flex wrap">
          <v1-t-card-partner-pc v-for="(item, idx) in list"
             :style="cardStyle(idx)"
             :key="'card-prod-'+idx"
             :idx="idx"
             :card="item"
             :cardProps="cardProps"></v1-t-card-partner-pc>
        </transition-group>
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
import BlockExhibitionCategoryAreaPc from "@/components/Components/Block/BlockExhibitionCategoryArea/BlockExhibitionCategoryAreaPc.vue"
import v1TCardPartnerPc from "@/components/Components/Card/v1/CardPartnerPc.vue"
import ExhibitionListCustomMixin from "@/components/Components/Mixin/ExhibitionListCustomMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockPartnerExhibitionDetailPc',
  components: {
    BlockExhibitionCategoryAreaPc,
    v1TCardPartnerPc
  },
  mixins: [
    ExhibitionListCustomMixin,
    BlockMixin,
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
          "ratio": "1:1"
        }
      },
      "cardColumn": 3,
      "cardComponent": {
        "templateName": "t1",
        "componentName": "CardProductPc"
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
        this.url += '?fields=id,img,name,simple_desc,min_price,distance,rate,reviews_count,address,location,phone,tags';
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
      },
    cardStyle(idx) {
      let gutters = 24;
      let gutter = gutters * 0.5;
      let width = `${(((this.$store.getters.brand.layout_maxwidth*12/12) - gutters * (this.cardColumn-1)) / this.cardColumn).toFixed(2)}px`;

      let obj = {
        width: width,
        marginBottom: `24px`
      };
      if(idx % this.cardColumn === 0 || idx % this.cardColumn === this.cardColumn - 1) {
        if(idx % this.cardColumn === 0) {
          obj.marginLeft = 0;
          obj.marginRight = `${gutter}px`;
        } else {
          obj.marginRight = 0;
          obj.marginLeft = `${gutter}px`;
        }
      } else {
        obj.marginLeft = `${gutter}px`;
        obj.marginRight = obj.marginLeft;
      }

      return obj;
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


