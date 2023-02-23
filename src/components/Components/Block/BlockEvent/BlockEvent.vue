<template>
<div style="padding:16px 0 100px" :style="pagePadding">
  <tab :menu="menu" tabPosition="center"
    :dividerStyle="{}" :wrapRadius="false"
    :unselectedTabStyle="unselectedTabStyle">
    <div slot="0" style="margin-top:32px">
      <div class="size-18 weight-500 margin-bottom-16 p-main">진행중인 이벤트</div>

      <list-vertical>
        <transition-group name="fade" slot="card" tag="div">
          <div
            v-for="(item,idx) in onList"
            :key="`event-${item.id}`">
            <t5-t-card-event class="unselect" :style="onCardStyle(idx)" :card="item" :key="`event-${item.id}`"></t5-t-card-event>
          </div>
        </transition-group>
      </list-vertical>
      
      <div v-if="onList&&onList.length===0" class="empty-view p-sub size-16">
        진행중인 이벤트가 없습니다.</div>
    </div>
    
    <div slot="1" style="margin-top:32px">
     <div class="size-18 weight-500 margin-bottom-16 p-main">종료된 이벤트</div>
     
      <list-vertical>
        <transition-group name="fade" slot="card" tag="div">
          <div
          v-for="(item,idx) in endList"
          :key="`event-end-${item.id}`">
          <t5-t-card-event :card="item" :style="endCardStyle(idx)" :key="`event-end-${item.id}`"></t5-t-card-event>
        </div>
        </transition-group>
      </list-vertical>
      
      <div v-if="endList&&endList.length===0" class="empty-view p-sub size-16">
        종료된 이벤트가 없습니다.</div>
    </div>
  </tab>
</div>
</template>
<script>
import t5TCardEvent from "@/components/Components/Card/t5/CardEvent.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockEvent',
  components: {
    t5TCardEvent
  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "menu": [
        {
          "id": 0,
          "name": "진행중인 이벤트"
        },
        {
          "id": 1,
          "name": "종료된 이벤트"
        }
      ],
      "event": undefined
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      let url = 'public/board/event?page_num=1&page_length=10'
      this.$axios.get(url)
      .then(res => {
        this.event = res.data.data;
      })
    },
    onCardStyle(idx) {
      let deco = {
        marginBottom: '16px'
      }
      if (idx === this.onList.length - 1) {
        deco.marginBottom = 0;
      }
      return deco;
    },
    endCardStyle(idx) {
      let deco = {
        marginBottom: '16px'
      }
      if (idx === this.endList.length - 1) {
        deco.marginBottom = 0;
      }
      return deco;
    }
  },
  computed: {
    unselectedTabStyle() {
      return {
        color: `${this.getColor('보조 내용 색상')}`,
        width: '50%',
        height: '47px',
        lineHeight: '47px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        backgroundColor: 'white',
        borderBottom: this.brandBorder.sub.border
      }
    },
    onList() {
      let result = []
      if(this.event) {
        this.event.forEach(item => {
          if(this.dayjs().isBefore(item.end_date) || this.dayjs().isSame(item.end_date, 'day')) {
            item.disabled = false;
            result.push(item)
          }
        })
      }
      return result;
    },
    endList() {
      let result = []
      if(this.event) {
        this.event.forEach(item => {
          if(this.dayjs().isAfter(item.end_date, 'day')) {
            item.disabled = true;
            result.push(item)
          }
        })
      }
      return result;
    }
  },
  watch: {
    
  }
}
</script>


