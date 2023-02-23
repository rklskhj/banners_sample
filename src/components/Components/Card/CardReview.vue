<template>
<div class="p-border-top-sub" style="padding:16px 0">
    <!-- 별점, 작성일, 수정,삭제 버튼 -->
    <div class="flex-align" style="gap: 0 8px; margin-top: 16px">
      <e-image :isBg="true" :isLazy="false"
        :img="card.author_img ? card.author_img : dummyImage.person" :useThumb="true"
        :width="34" :useRatio="true" :imgRadius="34"
        :imageRates="{ratio:'1:1'}" />
      
      <div style="flex:1">
        <div class="flex-align size-12" style="gap: 0 8px">
          <span class="p-sub">{{ maskingName(card.author) }}</span>
          <span class="p-border-right-sub" style="height: 16px"></span>
          <div class="p-sub2">{{ dateFormat(card.created_time, 'ago') }}</div>
        </div>
        
        <div class="flex-align" style="gap: 0 4px; margin-top: 8px">
          <!--<i v-for="star in rate" :key="'rate-'+star" -->
          <!--style="color:#F8D053;font-size:16px"-->
          <!--class="material-icons-round">star</i>-->
          <!--<i v-for="star in (5-rate)" :key="'un-rate-'+star" -->
          <!--style="color:#dddddd;font-size:16px"-->
          <!--class="material-icons-round">star</i>-->
          <!--<span class="star-rating">-->
          <!--  <span :style="ratingStyle"></span>-->
          <!--</span>-->
          <rating :value="card.rate"
            :rateSize="14" :isNew="true"
            :roundShape="true"
            :useBorder="false"
            rateColor="#F8D053"
            defaultColor="#DDDDDD"></rating>
          <div class="size-14 weight-700 p-main">{{ card.rate }}</div>
        </div>
        <div v-if="$route.path === '/partner_detail'" class="size-12 p-sub2"
          style="margin-top: 12px">{{ card.product }}</div>
      </div>
      
      
      <div class="flex-align" v-if="user.user_id === Number(card.author_id)">
        <div class="btn unselect p-sub2" @click="clickEdit">수정</div>
        <div class="btn unselect p-sub2" @click="clickDelete">삭제</div>
      </div>
    </div>
    
    <!-- 작성 내용 -->
    <!-- 이미지 -->
    <div style="margin:12px 0" v-if="card.imgs.length>0">
      <list-horizontal :cardHeight="74">
        <template v-slot:card>
          <div v-for="(img, idx) in card.imgs" :key="'img-'+idx" style="display:inline-block;margin-right:4px" @click="clickImg">
            <e-image :isBg="true" :isLazy="false"
              :img="img" :useThumb="true" :width="74" :useRatio="true" :imgRadius="8":imageRates="{ratio:'1:1'}"/>
          </div>
        </template>
      </list-horizontal>
    </div>
    <div class="size-14 weight-500 p-sub">{{ card.title }}</div>
    <div class="size-13 p-sub" style="margin-top:2px;line-height:20px; white-space: pre-wrap; word-break: break-word">{{ card.content }}</div>
    <!-- 답변 -->
    <div v-if="card.comment_author" class="box-comment radius-8 p-bg-sub2">
      <div class="size-14 weight-500 p-main">{{ card.comment_author }}</div>
      <div class="size-14 p-sub" style="margin-top: 2px; white-space: pre-wrap; word-break: break-word">{{ card.comment }}</div>
      <div class="size-12 p-sub2" style="margin-top: 2px">{{ dateFormat(card.comment_date, 'ago') }}</div>
    </div>
    
  </div>
</template>
<script>
import CardMixin from "@/components/Components/Mixins/CardMixin"

export default {
  name: 'CardReview',
  components: {

  },
  mixins: [
    CardMixin
  ],
  props: {
    card: {
      type: Object,
    },

  },
  data() {
    return {

    }
  },
  created() {
      
  },
  
  methods: {
    maskingName(name) {
      // 3글자 이상인 경우, (length / 2) 반올림한 index부터 글자 '*'로 마스킹
      if (name.length > 3) {
        let originName = name.split('');
        originName.forEach((name, idx) => {
          if (Math.round(originName.length / 2) < idx) return;
          originName[idx] = '*';
        });
        let joinName = originName.join();
        return joinName.replace(/,/g, '');
      }
      // 2~3글자면 마지막 글자만 마스킹
      else if (name.length > 1 && name.length <= 3) {
        return name.substring(0, name.length - 1) + '*' + name.substring(name.length);
      }
    },
    clickEdit() {
      this.routerPush(`review_reg?product_id=${this.card.product_id}&review_id=${this.card.id}`);
      this.$emit('close');
    },
    clickDelete() {
      this.$emit('delete');
    },
    clickCard() {
      this.routerPush('product_detail?id=' + this.card.product_id);
    },
    clickImg() {
      this.$root.$emit('page_overlay', 'ReviewImageOverlay', {prop: {card: this.card}});
    }
  },
  computed: {
    rate() {
      return this.card.rate ? parseInt(this.card.rate) : 0;
    },
    ratingStyle() {
      let deco = {}
      let splitedNum = [];
      if (this.card.rate) {
        splitedNum = String(this.card.rate).split('.');
        if (splitedNum.length !== 1) {
          deco.width = Number(splitedNum[0] * 20) + Number(String(parseFloat('0.' + splitedNum[1])).split('.')[1] * 2) + '%';
        } else {
          deco.width = Number(splitedNum[0] * 20) + '%'
        }
      } else {
        deco.width = '0%'
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.btn {
    font-size: 12px;
    padding: 8px;
  }
  
.box-comment {
  margin-top:12px;
  padding:16px;
}

.star-rating {
  width:78px;
}

.star-rating,.star-rating span {
  display:inline-block;
  height:14px;
  overflow:hidden;
  background:url('https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/40373908.png') no-repeat;
} 

.star-rating span {
  background-position:left bottom;
  line-height:0;
  vertical-align:top;
}
</style>

