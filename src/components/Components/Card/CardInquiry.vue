<template>
<div class="p-border-bottom-sub"
  :style="{'padding': isPC ? '24px 0' : '20px 0'}">
    <!-- 작성일 -->
    <div class="flex-between" style="margin:12px 0 4px 0">
      <div class="flex-align">
        <div v-if="card.answerer"
          class="tag-answer size-12 radius-4 p-bg-primary p-white">답변완료</div>
        <div v-else class="tag-answer size-12 radius-4 p-bg-brand1 p-brand3">미답변</div>
        <div class="size-12 p-sub2 flex-align" style="margin-left:12px">
          <i class="material-icons-outlined" v-if="card.is_secret" style="vertical-align:sub;font-size:16px">lock</i>
          <span style="margin-left: 2px">{{ maskingName(card.author) }}</span>
          <span class="p-sub3" style="margin: 0 8px">|</span>
          <div>{{ dateFormat(card.created_time, 'date_3') }}</div>
        </div>
      </div>
    </div>
    
    <!-- 작성 내용 -->
    <div class="size-14 p-main"><span class="weight-700 p-primary" style="margin-right:12px">Q</span>{{ card.title }}</div>
    <div v-if="!card.is_secret" class="size-14 p-sub"
      style="margin-top:4px;line-height:22px; white-space: pre-wrap; word-break: break-word">{{ card.question_content }}</div>
    <div v-else-if="(card.is_secret && parseInt(card.author_id) === parseInt($store.getters.user.user_id))"
      class="size-14 p-sub"
      style="margin-top:4px;line-height:22px; white-space: pre-wrap; word-break: break-word">{{ card.question_content }}</div>
    <!--<div v-else-if="(card.is_secret && parseInt(card.author_id) !== parseInt($store.getters.user.user_id))"-->
    <!--  class="size-18 p-help" style="margin-top:12px">-->
    <!--  <i class="material-icons size-16" style="vertical-align: bottom; margin-right: 4px">lock</i>-->
    <!--  비밀글 입니다.-->
    <!--</div>-->
    <!-- 답변 -->
    <template v-if="card.answerer">
      <div class="size-14 p-main" style="margin-top:16px"><span class="weight-700 p-highlight" style="margin-right:12px">A</span>답변</div>
      <div v-if="!card.is_secret || (card.is_secret && parseInt(card.author_id) === parseInt($store.getters.user.user_id))"
        class="size-14 p-sub" style="margin-top:4px;line-height:22px; white-space: pre-wrap; word-break: break-word">{{ card.answer_content }}</div>
      <!--<div v-else-if="(card.is_secret && parseInt(card.author_id) !== parseInt($store.getters.user.user_id))"-->
      <!--  class="size-18 p-help" style="margin-top: 12px">-->
      <!--  <i class="material-icons size-16" style="vertical-align: bottom; margin-right: 4px">lock</i>-->
      <!--  비밀글 입니다.-->
      <!--</div>-->
      <!--<div class="size-12 p-sub2" style="margin-top:2px">{{ card.answerer }}<span style="margin:0 8px">|</span>{{ dateFormat(card.answered_time, 'ago') }}</div>-->
    </template>
    
  </div>
</template>
<script>
import CardMixin from "@/components/Components/Mixins/CardMixin"

export default {
  name: 'CardInquiry',
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
    isPC() {
      return (this.$store.getters.browserType === 'pc');
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.tag-answer {
  padding: 3px 8px;
}
</style>

