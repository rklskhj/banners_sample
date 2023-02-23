<template>
<div :style="pcMaxWidth" style="margin:25px 0">
  <div class="flex-between margin-bottom-24">
    <div class="size-22 weight-700 p-main" lp-text>진행중인 이벤트</div>
    <div class="size-16 weight-500 unselect p-primary" @click="routerPush(`event`)">전체보기</div>
  </div>
  
  <list-vertical v-if="list && list.length>0">
    <div slot="card-grid" class="full-width">
      <div class="full-width flex wrap">
        <t6-t-card-event-pc v-for="(item,idx) in list"
          :style="cardStyle(idx)"
          :key="`card-prod-${item.id}-${idx}`"
          :idx="idx"
          :card="item"></t6-t-card-event-pc>
      </div>
    </div>
  </list-vertical>
</div>
</template>
<script>
import t6TCardEventPc from "@/components/Components/Card/t6/CardEventPc.vue"

export default {
  name: 'BlockHomeEventPc',
  components: {
    t6TCardEventPc
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "cardColumn": 3,
      "visibleNum": 3
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
      let gutters = 24;
      let gutter = gutters * 0.5;
      let width = `${(((this.$store.getters.brand.layout_maxwidth*12/12) - gutters * (this.cardColumn-1)) / this.cardColumn).toFixed(2)}px`;

      let obj = {
        width: width,
        marginBottom: `32px`
      };
      if(idx % this.cardColumn === 0 || idx % this.cardColumn === this.cardColumn - 1) {
        if(idx % this.cardColumn === 0) {
          obj.marginLeft = 0;
          obj.marginRight = `${gutter}px`;
        } else {
          obj.marginRight = 0;
          obj.marginLeft = `${gutter}px`;
        }
      } else {
        obj.marginLeft = `${gutter}px`;
        obj.marginRight = obj.marginLeft;
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


