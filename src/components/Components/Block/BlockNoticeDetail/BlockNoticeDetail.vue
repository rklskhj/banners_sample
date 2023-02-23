<template>
<div v-if="detail" class="p-main" style="padding:16px 0 80px" :style="pagePadding">
  <div class="size-24 weight-500">{{ detail.title }}</div>
  <div class="size-12 weight-400 margin-bottom-24 p-sub2">{{ detail.created_time.split(' ')[0] }}</div>
  
  <div class="margin-bottom-30 p-bg-white p-border-top-main p-border-bottom-main"
    style="width: 100%;min-height: 240px">
    <e-editor :html="detail.content" style="padding:20px 0px"></e-editor>
  </div>
  
  <div class="unselect p-bg-white p-sub2 size-14 text-center p-border-main radius-8"
    style="width: 100%;height: 48px;line-height: 48px" @click="routerPush('notice')">목록</div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockNoticeDetail',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "detail": undefined
    }
  },
  created() {
    this.getData();
    this.getList();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.$axios.get(`public/board/notice/${this.$route.query.id}`)
      .then(res => {
        this.detail = res.data;
      })
    },
    getList() {
      this.$axios.get('public/board/notice')
      .then(res => {
        this.list = res.data.data;
      })
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


