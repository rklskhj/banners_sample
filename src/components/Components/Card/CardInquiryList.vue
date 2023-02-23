<template>
<div class="p-border-bottom-sub" style="padding:16px 0">
    <!-- 상품 정보 -->
    <div class="flex-align full-width" @click="clickCard">
      <e-image :isBg="true" :isLazy="false"
        :img="card.img ? card.img : dummyImage.bg" :useThumb="true"
        :width="56" :useRatio="true" :imgRadius="8"
        :imageRates="{ratio:'1:1'}" />
      
      <div style="padding-left:8px;flex:1">
        <div class="size-12 p-sub">{{ card.product_info.partner.name }}</div>
        <div class="size-14 weight-500 p-main">{{ card.product }}</div>
        <div class="size-10 p-sub2">{{ card.product_info.simple_desc }}</div>
      </div>
    </div>
    
    <!-- 별점, 작성일, 수정,삭제 버튼 -->
    <div class="flex-between" style="margin:12px 0">
      <div class="flex-align">
        <div v-if="card.answerer"
          class="tag-answer size-12 radius-4 p-bg-primary p-white">답변완료</div>
        <div v-else class="tag-answer size-12 radius-4 p-bg-brand1 p-primary">미답변</div>
        <div class="size-12 p-sub2" style="margin-left:8px">
          <i class="material-icons-outlined" v-if="card.is_secret" style="margin-right:4px;vertical-align:sub;font-size:16px">lock</i>
          {{ dateFormat(card.created_time, dayjs().isSameOrBefore(card.created_time, 'day') ? 'ago' : 'date_3') }}</div>
      </div>
      <div class="flex-align" style="gap: 0 8px">
        <div class="btn size-12 radius-6 p-border-brand p-primary"
          @click="clickEdit">수정</div>
        <div class="btn size-12 radius-6 p-border-sub p-sub2"
          @click="clickDelete">삭제</div>
      </div>
    </div>
    
    <!-- 작성 내용 -->
    <div class="size-14 weight-500 p-sub"><span class="size-13 weight-700 p-primary" style="margin-right:4px">Q</span>{{ card.title }}</div>
    <div class="size-13 p-sub" style="margin-top:2px;line-height:20px">{{ card.question_content }}</div>
    <!-- 답변 -->
    <template v-if="card.answerer">
      <div class="size-14 weight-500 p-sub" style="margin-top:24px"><span class="weight-700 p-highlight" style="margin-right:4px">A</span>답변내용</div>
      <div class="size-13 p-sub" style="margin-top:2px;line-height:20px">{{ card.answer_content }}</div>
      <div class="size-12 p-sub2" style="margin-top:2px">{{ card.answerer }}<span style="margin:0 8px">|</span>
        {{ dateFormat(card.answered_time, dayjs().isSameOrBefore(card.answered_time, 'day') ? 'ago' : 'date_3') }}</div>
    </template>
    
  </div>
</template>
<script>
import CardMixin from "@/components/Components/Mixins/CardMixin"

export default {
  name: 'CardInquiryList',
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
    clickEdit() {
      this.routerPush(`inquiry_reg?product_id=${this.card.product_id}&inquiry_id=${this.card.id}`);
    },
    clickDelete() {
      this.$emit('delete');
    },
    clickCard() {
      this.routerPush('product_detail?id=' + this.card.product_id);
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.btn {
    padding: 8px;
    height: 32px;
  }
  
.tag-answer {
  padding: 3px 8px;
}
</style>

