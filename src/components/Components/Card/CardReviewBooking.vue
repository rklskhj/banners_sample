<template>
<div class="p-border-sub radius-8" style="padding:16px">
    <!-- 별점, 작성일, 수정,삭제 버튼 -->
    <div class="grid-wrap">
      <div class="flex-align" style="gap: 0 8px">
        <e-image :isBg="true" :isLazy="false"
          :img="card.author_img ? card.author_img : dummyImage.person" :useThumb="true"
          :width="32" :useRatio="true" :imgRadius="32"
          :imageRates="{ratio:'1:1'}" />

        <div style="flex: 1">
          <div class="size-10 weight-400 p-sub">{{ card.author }}</div>
          <div class="size-12 weight-400 p-sub2">{{ dateFormat(card.created_time, 'ago') }}</div>
        </div>
      </div>

      <!-- 이미지 -->
      <div v-if="card.imgs && card.imgs.length > 0" class="unselect" @click="clickImg">
        <e-image :isBg="true" :isLazy="false" class="position-relative"
          :img="card.imgs[0]" :useThumb="true" :width="48" :useRatio="true" :imageRates="{ratio:'1:1'}">
          <template v-if="card.imgs.length > 1" #inner>
            <div class="position-absolute size-10 weight-400 flex-center" style="padding: 0 2px; height: 16px; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); color: white">+ {{ card.imgs.length - 1 }}</div>
          </template>
        </e-image>
      </div>
      
    </div>
    <!-- <div class="flex-align" v-if="user.user_id === Number(card.author_id)">
      <div class="btn unselect p-sub2" @click="clickEdit">수정</div>
      <div class="btn unselect p-sub2" @click="clickDelete">삭제</div>
    </div> -->

    <div class="flex-align" style="margin-top: 16px; gap: 0 4px">
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
        :rateSize="14"
        :roundShape="true"
        :useBorder="false"
        :isNew="true"
        rateColor="#F8D053"
        defaultColor="#DDDDDD"></rating>
      <div class="size-12 weight-700 p-main">{{ card.rate }}</div>
    </div>
    
    <!-- 작성 내용 -->
    <div style="margin-top: 16px">
      <div class="size-14 weight-500 p-sub">{{ card.title }}</div>
      <div class="size-13 p-sub ellipsis-multiple"
        style="width: 100%; -webkit-line-clamp: 6; margin-top:4px; line-height:20px; height: 120px">{{ card.content }}</div>
      <div v-if="!showMore && card.comment_author" class="unselect flex-align p-main"
        style="margin-top: 4px" @click="showAll">
        <div class="size-14 weight-400">더보기</div>
        <i class="material-icons" style="font-size: 20px">keyboard_arrow_right</i></div>
    </div>
    <!-- 답변 -->
    <div v-if="card.comment_author && showMore" class="box-comment radius-8 p-sub2">
      <div class="size-14 weight-500 p-main">{{ card.comment_author }}</div>
      <div class="size-14 p-sub">{{ card.comment }}</div>
      <div class="size-12 p-sub2" style="margin-top:2px">{{ dateFormat(card.comment_date, 'ago') }}</div>
    </div>
    
  </div>
</template>
<script>
import CardMixin from "@/components/Components/Mixins/CardMixin"

export default {
  name: 'CardReviewBooking',
  components: {

  },
  mixins: [
    CardMixin
  ],
  props: {
    card: {
      type: Object,
    },
    showMore: {
      type: Boolean,
      default: false,
    },

  },
  data() {
    return {

    }
  },
  created() {
      
  },
  
  methods: {
    clickEdit() {
      this.routerPush(`review_reg?product_id=${this.card.product_id}&review_id=${this.card.id}`);
    },
    clickDelete() {
      this.$emit('delete');
    },
    clickCard() {
      this.routerPush('product_detail?id=' + this.card.product_id);
    },
    clickImg() {
      this.$root.$emit('page_overlay', 'ReviewImageOverlay', {prop: {card: this.card}});
    },
    showAll() {
      this.$root.$emit('page_overlay', 'AllReviewOverlay')
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
.grid-wrap {
  display: grid;
  grid-template-columns: 168px 48px;
  gap: 0 12px;
  align-items: center;
  height: 48px;
}
.btn {
    font-size: 12px;
    padding: 8px;
  }
  
.box-comment {
  margin-top:16px;
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

