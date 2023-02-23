<template>
<div style="padding:40px 0 40px" v-if="list" :style="pcMaxWidth">
  <div class="p-main">
    <div class="size-24 weight-700" style="margin-bottom: 24px">내 후기 목록</div>
    <div class="size-16 weight-500" style="margin-bottom: 24px">전체 후기 {{ list.length }}개</div>
  </div>
  <list-vertical v-if="list && list.length>0">
    <template v-slot:card>
      <transition-group name="fade" tag="div">
        <card-review-list-pc
          v-for="(item,idx) in list"
          :key="'item-'+idx"
          :card="item"
          :idx="idx"
          :params="paramsArray"
          @getList="getReviews"
          @delete="onDelete(idx)"></card-review-list-pc>
      </transition-group>
    </template>
  </list-vertical>
  <div v-if="list.length===0"
    class="empty-view p-help" style="padding-bottom:80px">
    등록한 상품 후기가 없습니다.</div>
  
  <pagination-default :pagingData="pagingData" :pageNum="5" :arrowEnd="true"
    @curPaginationNum="(val) => curNum(val)"
    v-if="pagingData"></pagination-default>
</div>
</template>
<script>
import CardReviewListPc from "@/components/Components/Card/CardReviewListPc.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockMyReviewPc',
  components: {
    CardReviewListPc,
    PaginationDefault
  },
  mixins: [
    ListMixin,
    BlockMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "url": "",
      "list": [],
      "pagingData": undefined,
      "paramsArray": [],
      "curPaginationNum": undefined
    }
  },
  created() {
    this.getReviews();
  },
  
  methods: {
    getReviews() {
      let num = 1;
      if(this.curPaginationNum) {
        num = this.curPaginationNum;
      }
      this.url = `/user/${this.user.user_id}/my/review?page_num=${num}&page_length=10`;
      this.$axios.get(this.url)
      .then(res => {
        if (res.status===200) {
          this.list = res.data.data;
          this.getParams();
          this.pagingData = res.data;
        }
      })
      .catch(() => {
      })
    },
    getParams() {
      let paramArray = []
      this.list.forEach(item => {
        this.$axios.get(`user/${this.user.user_id}/mapping/product/${item.product_id}?fields=params&hit=false`).then(res => {
          paramArray.push(res.data.params);
        })
      })
      this.paramsArray = paramArray;
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getReviews();
    },
    onDelete(idx) {
      let res = confirm('상품평을 삭제하시면 재작성이 불가능합니다. 삭제하시겠습니까?');
      if(res) {
        this.$axios.delete(`user/${this.user.user_id}/product/${this.list[idx].product_id}/review/${this.list[idx].id}`).then(res=>{
          this.list.remove(idx);
        });
      }
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


