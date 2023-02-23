<template>
<div v-if="detail" class="p-main" :style="pcMaxWidth" style="padding:40px 0 100px;min-height:100vh">
  <!--<div class="size-24 weight-500">1:1문의 상세</div>-->
  
  <!-- 문의 -->
  <div>
    <div class="size-16 p-sub">{{ detail.type }}</div>
    <div class="flex-align" style="gap: 0 96px">
      <div class="size-28 weight-700 p-main flex-1">{{ detail.title }}</div>
      <div class="size-12 weight-400 flex-center radius-4"
        style="width: 50px; height: 22px" :class="{
        'p-white p-bg-primary': detail.is_answered,
        'p-brand3 p-bg-brand1': !detail.is_answered
      }">{{ detail.is_answered ? '답변완료' : '미답변' }}</div>
    </div>
    <div class="p-border-bottom-sub p-border-top-sub" style="margin-top: 24px">
      <div style="margin: 32px 0">
        <div class="size-15 p-main" style="white-space: pre-line">{{ detail.content }}</div>
        <div style="margin: 12px 0;">
          <div v-for="(item, idx) in detail.imgs" :key="'item-'+idx" 
            class="flex-align" style="margin: 4px 0;">
            <i class="material-icons p-sub" style="font-size:18px; margin-right:4px;">attachment</i>
            <a :href="item" target="_blank" style="text-decoration:none;">
              <span class="p-primary size-12">{{ item.split('/')[item.split('/').length-1] }}</span>
            </a>
          </div>
        </div>
        <div class="flex-align" style="margin-top: 24px; gap: 0 8px">
          <div class="flex-align" style="gap: 0 6px">
            <img :src="user.profile" style="width: 20px; height: 20px; border-radius: 50%">
            <div class="size-15 p-sub2">{{ user.name }}</div>
          </div>
          <div style="color: #e3e3e3">|</div>
          <div class="flex-align size-15 p-sub2" style="gap: 0 4px">
            <div>{{ dateFormat(detail.created_time, 'date_3') }}</div>
            <div>{{ dayjs(detail.created_time).format('HH:mm') }}</div>
          </div>
        </div>
      </div>
      
      <!-- 답변 -->
      <div v-if="detail.is_answered" class="p-bg-sub2 radius-8" style="margin-bottom: 32px; padding: 16px 24px">
        <div class="size-16 weight-500 p-main">답변 내용</div>
        <div class="size-15 p-sub" style="white-space:pre-line; margin-top: 4px">{{ detail.answer_content }}</div>
        <div class="flex-align size-15 p-sub2" style="margin-top: 24px; gap: 0 4px">
          <div>{{ dateFormat(detail.answer_time, 'date_3') }}</div>
          <div>{{ dayjs(detail.answer_time).format('HH:mm') }}</div>
        </div>
      </div>
    </div>
  </div>
  
  <btn
    class="p-sub2 p-bg-white size-16 weight-400"
    @clicked="routerPush('contact')" :style="{'border': `${brandBorder.main.border} !important`}"
    style="margin: 40px auto 0; font-size: 16px !important; font-weight: 400 !important; height: 48px !important; line-height: 48px !important; border-radius: 8px; width: 314px">목록</btn>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockContactDetailMemberPc',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "detail": {}
    }
  },
  created() {
      this.$axios(`user/${this.$store.getters.user.user_id}/inquiry/personal/${this.$route.query.id}`)
      .then(res => {
        this.detail = res.data;
      })
    },
  
  methods: {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


