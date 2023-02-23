<template>
<div class="radius-8 margin-bottom-12 p-main p-bg-white"
  style="padding: 16px" :style="{'borderBottom': `1px solid ${brandColor.subLine.color}`}">

  <!--작성자, 별점, 컨텍스트메뉴-->
  <div class="flex-between">
    
    <div class="flex-align">
      <div>
        <div v-if="!card.secret">
          <div class="size-16 weight-500 margin-bottom-4" style="white-space:pre-wrap; line-height:18px;">{{ card.title }}</div>
        </div>
        <div v-else>
          <i class="material-icons size-16"
           style="margin-right:4px">lock</i>비밀글 입니다.
        </div>
        <div class="flex-align">
          <div class="size-12" style="font-weight:500;margin-right:8px">{{ card.author }}</div>
          <label-user-grade :grade="card.author_grade" :fontSize="11"></label-user-grade>
          <div class="size-12" style="color:#9b9b9b">{{ dateFormat(card.created_time, 'ago') }}</div>
        </div>
      </div>
    </div>
    <div :class="{'p-primary': card.answer, 'p-sub': !card.answer}"
      class="size-12 margin-bottom-8 weight-500">{{ card.answer ? '답변완료' : '미답변' }}</div>
    <!--작성자 이미지-->
    <!--<div class="flex-align">-->
    <!--  <div style="margin-right:8px" :style="bgCoverStyle(card.author_img)"></div>-->
    <!--  <div class="wrap size-12">-->
    <!--    <div class="flex-align">-->
    <!--      <div style="font-weight:500;margin-right:8px">{{ card.author }}</div>-->
    <!--      <label-user-grade :grade="card.author_grade" :fontSize="11"></label-user-grade>-->
    <!--    </div>-->
    <!--    <div style="color:#9b9b9b">{{ dateFormat(card.created_time, 'ago') }}</div>-->
    <!--  </div>-->
    <!--</div>-->
    
    <!--별점, 작성자, 작성일자, 옵션-->
    <!--<div>-->
    <!--  <div class="flex-end">-->
    <!--    <div :style="card.answer ? brandColor.primary : brandColor.sub"-->
    <!--      class="size-12 margin-bottom-8 weight-500">{{ card.answer ? '답변완료' : '미답변' }}</div>-->
    <!--  </div>-->
        
    <!--  <div class="flex-align size-12 weight-500" v-if="card.self">-->
    <!--    <div style="padding:8px 16px;border-radius:4px;cursor:pointer" -->
    <!--      :style="[brandBgColor.sub, brandColor.sub]" @click="modify">수정</div>-->
    <!--      <div :style="[delStyle, brandColor.white]" @click="del">삭제</div>-->
    <!--  </div>-->
      
    <!--</div>-->

  </div>
  
  <div class="flex-end size-12 weight-500" v-if="card.self">
    <div class="unselect radius-4 p-bg-sub p-sub"
      style="padding:8px 16px" @click="modify">수정</div>
      <div class="unselect radius-4 p-bg-sub p-white"
        :style="delStyle" @click="del">삭제</div>
  </div>
    
  <!--문의 내용-->
  <div class="grid-box" style="margin-top:8px">
    <div class="p-main">
      <!--<div v-if="!card.secret">-->
      <!--  <div class="size-16 weight-500  margin-bottom-4" style="white-space:pre-wrap; line-height:18px;">{{ card.title }}</div>-->
      <!--</div>-->
      <div v-if="!card.secret">
        <div class="size-12" style="white-space:pre-wrap; line-height:16px;">{{ card.question_content }}</div>
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

     <!--답변 -->
    <div class="radius-8 p-bg-sub" style="margin: 16px 0 0 160px;padding:12px 12px 16px" 
      v-if="card.answer && !card.secret">
      <div class="flex-between margin-bottom-14">
        <div class="flex-align">
          <!--<div class="author-img" style="margin-right:8px"-->
          <!--:style="bgCoverStyle(card.author_img)"></div>-->
          <div class="size-12">
            <div class="p-primary">{{ card.answerer }}</div>
            <div class="p-sub">{{ dateFormat(card.answered_time, 'ago') }}</div>
          </div>
        </div>
      </div>
      <e-editor :html="card.answer_content" class="size-12 p-main"></e-editor>
    </div>




    <!-- 문의 삭제 -->
    <sweet-modal ref="delModal" overlay-theme="dark">
      <modal @confirm="deleteInquiry" @cancel="$refs.delModal.close()">
        <div slot="header">문의 삭제</div>
        <div slot="content">문의를 삭제하시겠습니까?</div>
      </modal>
    </sweet-modal>

  </div>
</template>
<script>
import LabelUserGrade from "@/components/Components/Common/LabelUserGrade.vue"

export default {
  name: 'CardInquiryPc',
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
      ],
      "showCard": false,
      "selectedCardId": undefined
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
    regComment() {
        this.routerPush(`inquiry_comment_reg?product_id=${this.card.product_id}&inquiry_id=${this.card.id}&partner_id=${this.user.partner_id}`);
      },
    inquiryImgStyle(img) {
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
        this.routerPush(`inquiry_reg?product_id=${this.card.product_id}&inquiry_id=${this.card.id}&partner_id=${this.partnerId}`);
      },
    del() {
        this.$refs.delModal.open();
      },
    deleteInquiry() {
        this.$axios.delete(`user/${this.user.user_id}/product/${this.card.product_id}/inquiry/${this.card.id}`).then(res=>{
          if(res.status===200) {
            this.toast('문의가 삭제되었습니다.');
            this.$refs.delModal.close();
            this.$emit('del', this.card.id);
          }
        })
      },
    clickProduct() {
      this.routerPush(`product_detail?id=${this.card.product_id}`);
    },
    clickCard() {
      this.selectedCardId = this.card.id
    },
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

