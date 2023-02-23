<template>
<div class="full-width" style="min-height:100vh">
  <div class="flex-justify p-bg-white" style="padding: 42px 0 26px">
    <div class="size-24 weight-700 p-main" :style="pcMaxWidth">내 전화연결 내역</div>
  </div>
  <div class="flex-justify">
    <div :style="pcMaxWidth" style="margin-top: 8px; padding-bottom: 120px">
    
      <list-vertical style="padding: 16px 0;">
        <transition-group name="fade" slot="card" tag="div">
          <card-call-pc
            v-for="(item, idx) in list"
            :key="`card-${item.id}`"
            :card="item"
            :style="{marginBottom: pageGutter}"></card-call-pc>
        </transition-group>
      </list-vertical>
      
      <div v-if="list.length===0" class="empty-view p-sub">전화 연결 내역이 없습니다.</div>
    </div>
  </div>
</div>
</template>
<script>
import CardCallPc from "@/components/Components/Card/CardCallPc.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockMyCallListPc',
  components: {
    CardCallPc
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
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.styles.backgroundColor);
    },
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
      }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


