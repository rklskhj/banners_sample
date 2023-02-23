<template>
<div v-if="detail" class="p-main p-bg-sub" style="padding: 24px 0 56px" :style="pagePadding">
    <!--<span class="header-title" slot="center">1:1문의 상세</span>-->
    <div class="p-bg-white radius-8" style="padding:16px">
      <!-- 문의 -->
      <div>
        <div class="flex-align size-12 weight-400 p-sub2"
          style="gap: 0 8px; margin-bottom: 16px">
          <div>{{ detail.user_data.name }}</div>
          <div style="color: #e0e0e0">|</div>
          <div class="flex-align" style="gap: 0 8px">
            <div>{{ dateFormat(detail.created_time, 'date_3') }}</div>
            <div>{{ dayjs(detail.created_time).format('HH:mm') }}</div>
          </div>
        </div>
        <div class="size-16 weight-500 p-main" style="margin-bottom: 8px">{{ detail.title }}</div>
        <div class="size-14 p-sub" style="white-space:pre-line">{{ detail.content }}</div>
        <div style="margin: 12px 0">
          <div v-for="(item, idx) in detail.imgs" :key="'item-'+idx" 
            class="flex-align" style="margin: 4px 0;">
            <i class="material-icons p-sub" style="font-size:18px; margin-right:4px;">attachment</i>
            <a :href="item" target="_blank" style="text-decoration:none;">
              <span class="p-primary size-12">{{ item.split('/')[item.split('/').length-1] }}</span>
            </a>
          </div>
        </div>
      </div>
      <!-- 답변 -->
      <div v-if="detail.is_answered">
        <div style="margin: 16px 0; height: 0; width: 100%" class="p-border-top-main"></div>
        <div class="size-14 weight-500 p-main" style="margin-bottom: 8px">답변내용</div>
        <div class="size-14 weight-400 p-sub" style="white-space:pre-line">{{ detail.answer_content }}</div>
        <div class="flex-align size-12 weight-400 p-sub2" style="margin-top: 8px; gap: 0 8px">
          <div>{{ dateFormat(detail.answer_time, 'date_3') }}</div>
          <div>{{ dayjs(detail.answer_time).format('HH:mm') }}</div>
        </div>
      </div>
    </div>
    
    <btn class="p-sub p-bg-white"
      @clicked="routerPush('contact')"
      style="margin-top: 32px; font-size: 16px !important; font-weight: 600 !important; height: 56px !important; line-height: 56px !important"
      :style="[$store.getters.device === 'mobile' ? {} : {width:'320px'}, brandBorder.main]">목록</btn>  
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockContactDetailMember',
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


