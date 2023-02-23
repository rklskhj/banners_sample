<template>
<div class="p-main p-bg-white"
  style="padding: 16px;margin-bottom:16px"
  :style="{'borderBottom': `1px solid ${brandColor.subLine.color}`}">
  <!--작성자, 별점, 컨텍스트메뉴-->
  <div class="flex-between">

    <div class="flex-align">
      <div style="margin-right:8px" :style="bgCoverStyle(card.author_img)"></div>
      <div class="wrap size-12">
        <rating :value="card.rate ? card.rate : 0" :rateSize="16" :disabled="true"
          style="margin-bottom:8px;"
          rateColor="#ffc351"></rating>
        <div class="flex-align">
          <div style="font-weight:500;margin-right:8px">{{ card.author }}</div>
          <label-user-grade :grade="card.author_grade" :fontSize="11"></label-user-grade>
          <div style="color:#9b9b9b">{{ dateFormat(card.created_time, 'ago') }}</div>
        </div>
      </div>
    </div>
    
    <!--별점, 작성자, 작성일자, 옵션-->
    <div>
      <!--<div v-if="card.order_product&&card.order_product.order_product_option">-->
      <!--  <div class="size-16" :style="brandColor.main"-->
      <!--    style="line-height:26px;"-->
      <!--    v-for="item in card.order_product.order_product_option" :key="item.id">-->
      <!--    {{ computedOption(item) }}-->
      <!--  </div>-->
      <!--</div>-->
      
      <div class="flex-align size-12 weight-500" v-if="card.self">
        <div class="p-bg-sub p-sub radius-4 unselect"
          style="padding:8px 16px" @click="modify">수정</div>
          <div class="unselect radius-4 p-bg-sub p-white"
            :style="delStyle" @click="del">삭제</div>
      </div>

    </div>

  </div>
    
  <!--후기 내용, 후기 이미지-->
  <div class="grid-box" style="margin-top:8px">
    <div class="p-main">
      <div v-if="!card.secret">
        <div class="size-16 weight-500 margin-bottom-4" style="white-space:pre-wrap; line-height:18px;">{{ card.title }}</div>
      </div>
      <div v-if="!card.secret">
        <div class="size-12" style="white-space:pre-wrap; line-height:16px;">{{ card.content }}</div>
      </div>
      <div v-else
           class="flex-align size-18 secret p-help"
           style="margin:10px 0 16px">
        <i class="material-icons size-16"
           style="margin-right:4px">lock</i>
        비밀글 입니다.
      </div>
      <div v-if="card.imgs && card.imgs.length>0" style="margin-top:16px">
        <image-single :imgs="card.imgs" :width="100"></image-single>
        <!--<div :style="reviewImgStyle(card.imgs[0])"></div>-->
      </div>
    </div>
  </div>

    <!-- 답변 -->
    <div class="radius-8" style="margin: 16px 0 0 160px;padding:12px 12px 16px" 
      :style="brandBgColor.sub" v-if="card.comment && !card.secret">
      <div class="flex-between margin-bottom-14">
        <div class="flex-align">
          <!--<div class="author-img" style="margin-right:8px"-->
          <!--:style="bgCoverStyle(card.author_img)"></div>-->
          <div class="size-12">
            <div class="p-primary">{{ card.answerer }}</div>
            <div class="p-sub">{{ dateFormat(card.comment_date, 'ago') }}</div>
          </div>
        </div>
      </div>
      <div v-if="!card.secret">
        <e-editor :html="card.comment" class="size-12 p-main"></e-editor>
      </div>
      <div v-else
        class="flex-align size-13 secret margin-bottom-8 p-help">
        <i class="material-icons size-14"
            style="margin-right:4px">lock</i>
        비밀글 입니다.
      </div>
    </div>

    <!-- 후기 삭제 -->
    <sweet-modal ref="delModal" overlay-theme="dark">
      <modal @confirm="deleteReview" @cancel="$refs.delModal.close()">
        <div slot="header">후기 삭제</div>
        <div slot="content">후기를 삭제하시겠습니까?</div>
      </modal>
    </sweet-modal>
  </div>
</template>
<script>
import LabelUserGrade from "@/components/Components/Common/LabelUserGrade.vue"

export default {
  name: 'CardReviewPc',
  components: {
    LabelUserGrade
  },
  mixins: [

  ],
  props: {
    card: {
      type: Object,
      required: true,
    },
    last: {
      type: Boolean,
      required: false,
    },
    userType: {
      type: String,
      required: false,
    },
    partnerId: {
      type: Number,
    },

  },
  data() {
    return {
      "menu": [
        {
          "name": "수정",
          "action": "modify"
        },
        {
          "name": "삭제",
          "action": "del"
        }
      ]
    }
  },
  created() {
      if(this.userType) {
        this.menu = [
          {
            name: '답변 남기기',
            action: 'regComment'
          }
        ]
      }
    },
  
  methods: {
    bgCoverStyle(img) {
      if(!img || img === '') {
        img = this.dummyImage.person;
      }
      return {
        backgroundImage: `url(${img})`,
        borderRadius: '50%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '40px',
        height: '40px'
      }
    },
    regComment() {
        this.routerPush(`review_comment_reg?product_id=${this.card.product_id}&review_id=${this.card.id}&partner_id=${this.user.partner_id}`);
      },
    computedOption(item) {
      if(item.option.option_type===0) {
        return `[기본옵션] ${item.option.name}`
      }
      if(item.option.option_type===1) {
        return `[추가옵션] ${item.option.name}`
      }
    },
    reviewImgStyle(img) {
        let deco = {
          border: '1px solid ' + this.getColor('기본 테두리선 색상'),
          backgroundSize: 'cover',
          backgroundImage: 'url('+ img +')',
          marginTop: '8px',
          marginRight: '6px',
          width: '100px',
          height: '100px'
        };

        return deco;
      },
    modify() {
        this.routerPush(`review_reg?product_id=${this.card.product_id}&review_id=${this.card.id}&partner_id=${this.user.partner_id}`);
      },
    del() {
        this.$refs.delModal.open();
      },
    deleteReview() {
        this.$axios.delete(`user/${this.user.user_id}/product/${this.card.product_id}/review/${this.card.id}`).then(res=>{
          if(res.status===200) {
            this.toast('후기가 삭제되었습니다.');
            this.$refs.delModal.close();
            this.$emit('del', this.card.id);
          }
        })
      },
    clickProduct() {
        this.routerPush(`product_detail?id=${this.card.product_id}`);
      }
  },
  computed: {
    ratingStyle() {
        return {
          margin: '0 !important'
        }
      },
    prodImgStyle() {
        return {
          width: '40px',
          height: '40px',
        }
      },
    isMine() {
        if(this.userType==='partner') return true;
        else if(this.user.user_id===parseInt(this.card.author_id)) return true;
        else return false;
      },
    delStyle() {
        return {
          padding: '8px 16px',
          marginLeft: '8px'
        }
      }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.answer-box {
  padding: 16px;
}

.author-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.sub-text-margin  {
  margin-right: 2px;
}

.review-content {
  font-size: 14px;
  font-weight: normal;
  margin: 12px 0 18px;
}

.line {
  height: 1px;
  margin-top: 16px;
  width: 100%;
}
</style>

