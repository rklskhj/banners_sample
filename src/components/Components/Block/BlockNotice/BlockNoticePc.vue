<template>
<div style="margin:25px 0" :style="pcMaxWidth">
  <div class="size-22 weight-700 margin-bottom-24 p-main">공지사항</div>
  
  <list-vertical v-if="list && list.length>0"
    class="p-border-top-sub p-border-bottom-sub">
    <div slot="card-grid" class="full-width">
      <t1-t-card-notice-pc  v-for="(item,idx) in list"
        :style="cardStyle(idx)"
        :key="`card-notice-${item.id}-${idx}`"
        :card="item"></t1-t-card-notice-pc>
    </div>
  </list-vertical>
  
  <div v-if="list&&list.length===0" class="empty-view size-16 weight-500 p-sub">
    등록된 공지사항이 없습니다.</div>      
  
  <pagination-default :pagingData="pagingData" :pageNum="3" :arrowEnd="true"
    @curPaginationNum="(val) => curNum(val)" :arrow="true"
    v-if="pagingData"></pagination-default>
</div>
</template>
<script>
import t1TCardNoticePc from "@/components/Components/Card/t1/CardNoticePc.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockNoticePc',
  components: {
    t1TCardNoticePc,
    PaginationDefault
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
      "pagingData": undefined,
      "curPaginationNum": undefined
    }
  },
  created() {
    this.getList();
  },
  mounted() {

  },
  
  methods: {
    getList() {
      let num = 1;
      if(this.curPaginationNum) {
        num = this.curPaginationNum;
      }
      this.$axios.get(`public/board/notice?page_num=${num}&page_length=10`)
      .then(res => {
        this.list = res.data.data;
        this.pagingData = res.data;
      })
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getList();
    },
    cardStyle(idx) {
      let deco = {
        padding: '32px 0 38px'
      };
      
      if(idx<this.list.length-1) {
        deco.borderBottom = `1px solid ${this.getColor('보조 배경 색상')}`;
      }
      
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


