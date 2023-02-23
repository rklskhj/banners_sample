<template>
<div v-if="list" style="padding-top: 12px;padding-bottom: 12px" :style="pagePadding">
  <div class="p-border-bottom-sub" style="padding-bottom:12px">
    <div class="size-14 p-sub">{{ `전체 문의 ${list.length}개` }}</div>
  </div>
    <list-vertical v-if="list.length>0">
      <div style="min-height:96px;" slot="card">
        <transition-group name="fade" tag="div">
          <card-inquiry-list
            v-for="(item,idx) in list"
            :key="item.id"
            :card="item"
            :idx="idx"
            @delete="onDelete(idx)"
            ></card-inquiry-list>
        </transition-group>
      </div>
    </list-vertical>
    <div v-if="list && list.length===0"
      class="empty-view p-help" style="padding-bottom:80px">
      등록된 상품문의가 없습니다.</div>
</div>
</template>
<script>
import CardInquiryList from "@/components/Components/Card/CardInquiryList.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockMyInquiry',
  components: {
    CardInquiryList
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
      "list": []
    }
  },
  created() {
      this.url = `/user/${this.user.user_id}/my/product/inquiry`;
      this.getContacts();
    },
  
  methods: {
    getContacts() {
        this.$axios.get(this.url)
        .then(res => {
          if (res.status===200) {
            this.list = res.data.data;
          }
        })
        .catch(() => {
        })
      },
    onDelete(idx) {
      let res = confirm('문의를 삭제하시면 재작성이 불가능합니다. 삭제하시겠습니까?');
      if(res) {
        this.$axios.delete(`user/${this.user.user_id}/product/${this.list[idx].product_id}/inquiry/${this.list[idx].id}`).then(res=>{
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


