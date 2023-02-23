<template>
<div v-if="detail" :style="pcMaxWidth" style="margin:40px 0">
  <div class="margin-bottom-24 size-24 weight-700 p-main">이벤트</div>
    
  <e-image :isBg="true" :isLazy="true" :img="detail.img"
    class="position-relative" :useRatio="false"
    width="100%" :height="260">
    <div slot="inner" class="position-absolute full-width full-height" 
      style="background-color:rgba(0,0,0,0.3)"></div>
    <div slot="inner" class="position-absolute layer-box">
        <div class="size-32 weight-700 margin-bottom-16 p-white">{{ detail.title }}</div>
          
        <div class="size-18 p-white">{{ formattedDate() }}</div>
    </div>
  </e-image>
  
  <div style="margin-bottom:80px; min-height: 400px; padding:40px" 
    class="size-14 full-width p-bg-white p-main p-border-main">
    <e-editor :html="detail.content"></e-editor>
  </div>
  
  <div class="flex-justify">
    <div @click="routerPush('/event')" class="unselect flex-justify size-16 radius-8 p-sub2 p-border-main"
      style="width: 314px; height: 48px; align-items: center">목록</div>
  </div>
  
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockEventDetailPc',
  components: {

  },
  mixins: [
    BlockMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "detail": undefined
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.$axios.get(`public/board/event/${this.$route.query.id}`)
      .then(res => {
        this.detail = res.data;
      })
    },
    formattedDate() {
      if (this.detail.start_date === '1111-01-01' && this.detail.end_date === '9999-01-01') {
        return '상시';
      } else {
        return `${this.dateFormat(this.detail.start_date, 'date_3')} ~ ${this.dateFormat(this.detail.end_date, 'date_3')}`
      }
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}
.layer-box {
  top: 50%;
  transform: translateY(-50%);
  left: 56px;
  width: 360px;
}
</style>

