<template>
<div :style="[pagePaddingAll, pcMaxWidth]" style="padding: 16px 16px 100px">
  
  <list-vertical v-if="list && list.length > 0" style="padding: 16px 0;">
    <transition-group name="fade" slot="card" tag="div">
      <card-call-pc
        v-for="(item, idx) in list"
        :key="`card-${item.id}`"
        :card="item"
        :style="{marginBottom: pageGutter}"></card-call-pc>
    </transition-group>
  </list-vertical>
  
  <div v-else-if="list && list.length===0" class="empty-view p-sub">전화 연결 내역이 없습니다.</div>
</div>
</template>
<script>
import CardCallPc from "@/components/Components/Card/CardCallPc.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockMyOrderCallPc',
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
      "list": undefined,
      "styles": {
        "backgroundColor": "brandBgColor.sub"
      }
    }
  },
  created() {
      this.getData();
    },
  mounted() {
    this.setBg();
  },
  
  methods: {
    setBg() {
      document.getElementsByClassName('tab-page')[0].style.backgroundColor = this.parseColor(this.styles.backgroundColor);
    },
    getData() {
        this.pageLoadType = 'infinite';
        this.currentPage = 1;
        this.$store.commit('setLoadingSpinner', true);
        this.$axios.get(`user/${this.user.user_id}/my/call`).then(res=> {
          this.totalPages = res.data.total_page;
          this.totalCount = res.data.count;
          this.currentPage = 2;
          this.list = res.data.data;
          this.$store.commit('setLoadingSpinner', false);
        }).catch(() => {
          this.list = [];
          this.$store.commit('setLoadingSpinner', false);
        });
      }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


