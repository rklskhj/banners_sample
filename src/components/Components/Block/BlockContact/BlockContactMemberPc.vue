<template>
<div style="padding:32px 0 100px;min-height:100vh" :style="pcMaxWidth" class="position-relative">
  <div class="flex-between">
    <div>
      <div class="size-24 bold p-main">1:1 문의 목록</div>
    </div>
    
    <div style="width: 120px; height: 40px" @click="routerPush(`contact_reg`)"
      class="size-14 bold unselect flex-center p-white p-bg-primary radius-8">
      문의 작성</div>
  </div>
  
  <transition name="fade">
  <div v-if="list"
    class="size-16 weight-500 flex-between p-main p-border-bottom-sub"
    style="margin-top: 24px; padding: 16px 16px 12px; height: 56px">
    <div class="col-1" style="text-align: center">답변 상태</div>
    <div class="col-8 ellipsis" style="text-align: left">제목</div>
    <div class="col-1" style="text-align: center">날짜</div>
    
  </div>
  </transition>
  
  <transition-group v-if="list" name="fade">
    <card-contact-pc v-for="(item, idx) in list" :key="'item-'+idx"
      :card="item"></card-contact-pc>
  </transition-group> 

  <div v-if="list && list.length===0" class="empty-view p-sub">
    문의 내역이 없습니다.
  </div>
  
  <pagination-default :pagingData="pagingData" :pageNum="5" :arrowEnd="true"
    @curPaginationNum="(val) => curNum(val)"
    v-if="pagingData"></pagination-default>
</div>
</template>
<script>
import CardContactPc from "@/components/Components/Card/CardContactPc.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockContactMemberPc',
  components: {
    CardContactPc,
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
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      let num = 1;
      if(this.curPaginationNum) {
        num = this.curPaginationNum;
      }
      this.$axios(`user/${this.$store.getters.user.user_id}/inquiry/personal?page_num=${num}&page_length=10`)
      .then(res => {
        this.list = res.data.data;
        this.count = res.data.count;
        this.pagingData = res.data;
      })
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getData();
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


