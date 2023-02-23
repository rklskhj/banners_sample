<template>
<div>
  <div class="size-16 weight-500">문의</div>
  <list-vertical>
    <card-inquiry slot="card" v-for="(item,idx) in list" :card="item" :key="item.id"
      :style="inquiryCardStyle(idx)"></card-inquiry>
  </list-vertical>
  <div v-if="list&&list.length===0" class="empty-view p-sub2 size-14">문의가 없습니다.</div>
</div>
</template>
<script>
import CardInquiry from "@/components/Components/Card/CardInquiry.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'ListProductInquiry',
  components: {
    CardInquiry
  },
  mixins: [
    ListMixin
  ],
  props: {
    isProd: {
      type: Boolean,
      default: true,
    },

  },
  data() {
    return {
      "list": undefined
    }
  },
  created() {
    this.pageLoadType = 'infinite';
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      if(!this.isProd) {
        this.url = `public/partner/${this.$route.query.id}/inquiry?page_num=1&page_length=10`;  
      } else {
        let product_id = this.$route.query.id;
        this.url = `public/product/${product_id}/inquiry?secret=true&page_num=1&page_length=10`;
        if(this.isLogin)
          this.url = `user/${this.user.user_id}/product/${product_id}/inquiry?secret=true&page_num=1&page_length=10`;
      }
      
      this.currentPage = 1;
      this.$axios.get(this.url).then(res => {
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.$emit('totalCount', this.totalCount);
        this.currentPage = 2;
        this.list = res.data.data;
      })
    },
    inquiryCardStyle(idx) {
      let deco = {}
      if (idx !== 0 ) {
        deco = {
          borderTop: this.brandBorder.sub.border
        }
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


