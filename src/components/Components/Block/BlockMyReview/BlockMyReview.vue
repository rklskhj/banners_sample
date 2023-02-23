<template>
<div v-if="list" style="padding-top: 16px;padding-bottom: 40px" :style="pagePadding">
  <div class="p-border-bottom-main" style="padding-bottom:12px">
    <div class="size-14 p-sub">{{ `전체 후기 ${list.length}개` }}</div>
  </div>
  <list-vertical v-if="list.length>0">
    <div style="min-height: 96px" slot="card">
      <transition-group name="fade" tag="div">
        <card-review-list
          v-for="(item,idx) in list"
          :key="item.id"
          :card="item"
          :idx="idx"
          :params="paramsArray"
          @delete="onDelete(idx)"
          ></card-review-list>
      </transition-group>
    </div>
  </list-vertical>
  <div v-if="list.length===0"
    class="empty-view p-help" style="padding-bottom:80px">
    등록된 상품 후기가 없습니다.</div>
</div>
</template>
<script>
import CardReviewList from "@/components/Components/Card/CardReviewList.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockMyReview',
  components: {
    CardReviewList
  },
  mixins: [
    ListMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "url": "",
      "list": [],
      "paramsArray": []
    }
  },
  created() {
      this.url = `/user/${this.user.user_id}/my/review`;
      this.getReviews();
    },
  
  methods: {
    getReviews() {
      this.$axios.get(this.url)
      .then(res => {
        if (res.status===200) {
          this.list = res.data.data;
          this.getParams();
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


