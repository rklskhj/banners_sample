<template>
<div v-if="detail" class="p-main" style="margin:25px 0" :style="pcMaxWidth">
  <div class="size-28 weight-700 margin-bottom-8">{{ detail.title }}</div>
  <div class="size-13 margin-bottom-30 p-sub2">
    {{ dayjs(detail.created_time).format('YYYY.MM.DD') }}</div>
  
  <div class="p-bg-white p-border-top-sub p-border-bottom-sub"
    style="padding: 32px 0 96px; width: 100%; min-height: 200px">
    <e-editor :html="detail.content" style="padding:0"></e-editor>
  </div>
  
  <template v-if="(curIdx || curIdx===0) && curIdx<list.length-1">
    <div class="flex-between unselect p-border-bottom-sub"
      style="padding: 24px 0" @click="clickPrev">
      <div class="flex-align size-16">
        <div class="p-primary" style="margin-right:40px">이전글</div>
        <div class="p-main">{{ list[this.curIdx + 1].title }}</div>
      </div>
      <div class="size-14 p-sub2">{{ dayjs(list[this.curIdx + 1].created_time).format('YYYY.MM.DD') }}</div>
    </div>
  </template>
  
  <template v-if="curIdx && curIdx>0">
    <div class="flex-between unselect p-border-bottom-sub"
      style="padding: 24px 0" @click="clickNext">
      <div class="flex-align size-16">
        <div class="p-primary" style="margin-right:40px">다음글</div>
        <div class="p-main">{{ list[this.curIdx - 1].title }}</div>
      </div>
      <div class="size-14 p-sub2">{{ dayjs(list[this.curIdx - 1].created_time).format('YYYY.MM.DD') }}</div>
    </div>
  </template>
  
  <div class="flex-justify" style="margin-top:48px">
    <div @click="routerPush('notice')"
      style="width: 314px; height: 48px; line-height: 48px"
      class="unselect size-16 text-center p-border-main radius-8 p-bg-white p-sub2">목록</div>
  </div>
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockNoticeDetailPc',
  components: {

  },
  mixins: [
    BlockMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "curIdx": undefined,
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
        this.getCurrentIdx();
      })
    },
    getCurrentIdx() {
      for(let i=0;i<this.list.length;i++) {
        if(this.list[i].id === Number(this.$route.query.id)){
          this.curIdx = i;
        }
      }
    },
    clickPrev() {
      let id = this.list[this.curIdx + 1].id;
      this.$router.push(`notice_detail?id=${id}`);
      this.getData();
      this.getList();
      this.getCurrentIdx();
    },
    clickNext() {
      let id = this.list[this.curIdx - 1].id;
      this.$router.push(`notice_detail?id=${id}`);
      this.getData();
      this.getList();
      this.getCurrentIdx();
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


