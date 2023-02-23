<template>
<div>
  <div class="flex-between" :style="titleStyle">
    <div class="size-24 weight-700 p-main">문의</div>
    <div v-if="$route.path !== '/partner_detail'" class="size-12 unselect flex-center p-bg-primary p-white radius-8"
      style="width: 160px; height: 40px"
      @click="clickInquiry">문의작성</div>
  </div>
  <list-vertical v-if="list && list.length > 0">
    <card-inquiry slot="card" v-for="(item, idx) in list" :card="item" :key="'item-'+idx"
      class="p-border-bottom-sub"></card-inquiry>
  </list-vertical>
  <div v-if="list&&list.length===0" class="empty-view p-sub2 size-16">문의가 없습니다.</div>
</div>
</template>
<script>
import CardInquiry from "@/components/Components/Card/CardInquiry.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'ListProductInquiryPc',
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
    this.eventBus.$on('closeInquiryRegModal', () => {
      this.currentPage = 1;
      this.list = [];
      this.getData();
    })
  },
  
  methods: {
    getData() {
      if(!this.isProd) {
        this.url = `public/partner/${this.$route.query.id}/inquiry?page_num=1&page_length=10&hit=false`;  
      } else {
        let product_id = this.$route.query.id;
        this.url = `public/product/${product_id}/inquiry?secret=true&page_num=1&page_length=10&hit=false`;
        if(this.isLogin)
          this.url = `user/${this.user.user_id}/product/${product_id}/inquiry?secret=true&page_num=1&page_length=10&hit=false`;
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
    clickInquiry() {
      if (this.isLogin) {
        this.$root.$emit('page_modal', 'InquiryRegModal', {prop: {product_id: this.$route.query.id}})
      } else {
        this.toast('로그인 후 문의 작성이 가능합니다.');
        this.routerPush('/signin');
      }
    }
  },
  computed: {
    titleStyle() {
      if (this.list && this.list.length > 0) {
        return {
          paddingBottom: '24px',
          borderBottom: '1px solid #e3e3e3'
        }
      } else {
        return {
          paddingBottom: '24px'
        }
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.empty-view {
    border-top: 1px solid #e3e3e3;
    border-bottom: 1px solid #e3e3e3;
    padding: 60px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

