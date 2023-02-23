<template>
<div :style="pagePadding" style="padding: 16px 0px 100px">
  <!-- <div class="size-20 weight-500 p-main">전화연결 내역</div> -->

  <list-vertical>
    <transition-group name="fade" slot="card" tag="div">
      <card-call
        v-for="(item, idx) in list"
        :key="`card-${item.id}`"
        :card="item"
        :style="{marginBottom: pageGutter}"></card-call>
    </transition-group>
  </list-vertical>
  
  <div v-if="list.length===0" class="empty-view p-sub">전화 연결 내역이 없습니다.</div>
</div>
</template>
<script>
import CardCall from "@/components/Components/Card/CardCall.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockMyCallList',
  components: {
    CardCall
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": [],
      "styles": {
        "backgroundColor": "brandBgColor.sub"
      }
    }
  },
  created() {
    this.init();
    this.getData();
  },
  mounted() {
    this.setBg();
  },
  
  methods: {
    init() {
      this.list = [];
    },
    getData() {
      this.pageLoadType = 'infinite';
      this.currentPage = 1;
      this.$axios.get(`user/${this.user.user_id}/my/call`).then(res=> {
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.currentPage = 2;
        this.list = res.data.data;
      });
    },
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.styles.backgroundColor);
      this.$el.parentElement.style.minHeight = 'calc(100vh - 50px)'
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


