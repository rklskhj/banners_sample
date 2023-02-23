<template>
<div style="padding-top:25px;padding-bottom:25px">
  <div class="flex-between full-width" style="padding-bottom:16px" :style="pagePadding">
    <div class="size-18 weight-500 p-main">이벤트</div>
    <div class="size-14 weight-400 p-primary"
      @click="routerPush('event')">전체보기</div>
  </div>
  
  <list-horizontal :cardHeight="260" 
    v-if="list&&list.length>0">
    <t4-t-card-event v-for="(item,idx) in list" :key="'event-'+item.id"
      :card="item" :style="cardStyle(idx)"
      slot="card"
      class="margin-bottom-24"></t4-t-card-event>
  </list-horizontal>
</div>
</template>
<script>
import t4TCardEvent from "@/components/Components/Card/t4/CardEvent.vue"

export default {
  name: 'BlockHomeEvent',
  components: {
    t4TCardEvent
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "visibleNum": 5
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.$axios.get('public/board/event').then(res => {
        let list = [];
        res.data.data.forEach(item => {
          if (this.dayjs().isBefore(item.end_date) || this.dayjs().isSame(item.end_date, 'day')) {
            list.push(item);
          }
        })
        if (list.length > this.visibleNum) {
          this.list = list.slice(0,this.visibleNum);
        } else {
          this.list = list;
        }
      })
    },
    cardStyle(idx) {
      let obj = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '256px',
        marginRight: '16px'
      };
      
      if(idx === 0) {
        obj.marginLeft = this.pagePaddingAll.padding;
      } else if (idx === this.list.length - 1) {
        obj.marginRight = this.pagePaddingAll.padding;
      }
      
      return obj;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


