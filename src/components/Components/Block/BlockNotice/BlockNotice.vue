<template>
<div style="margin:25px 0" :style="pagePadding">
  <div class="size-14 weight-400 p-sub">총 <span class="weight-500">{{ count }}</span>개</div>
  
  <transition-group name="fade">
    <t2-t-card-notice v-for="item in list" :key="item.id" v-if="list"
      :card="item"></t2-t-card-notice>
  </transition-group>
  
  <div v-if="list&&list.length===0" class="empty-view p-sub">등록된 공지사항이 없습니다.</div>
          
  <pagination-default :pagingData="pagingData" :pageNum="3" :arrowEnd="true"
    @curPaginationNum="(val) => curNum(val)"
    v-if="pagingData"></pagination-default>
</div>
</template>
<script>
import t2TCardNotice from "@/components/Components/Card/t2/CardNotice.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockNotice',
  components: {
    t2TCardNotice,
    PaginationDefault
  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "count": undefined,
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
      this.$axios.get(`public/board/notice?page_num=${num}&page_length=5`)
      .then(res => {
        this.list = res.data.data;
        this.count = res.data.count;
        this.pagingData = res.data;
      })
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getList();
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


