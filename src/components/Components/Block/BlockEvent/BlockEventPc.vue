<template>
<div style="margin:25px 0" :style="pcMaxWidth" v-if="event"
  class="position-relative">
  <!--<div class="size-22 weight-500" style="margin-bottom: 18px" :style="brandColor.main">이벤트</div>-->
  
  <tab :menu="menu" tabPosition="flex-start" :selectedTabStyle="selectedTabStyle"
    :unselectedTabStyle="unselectedTabStyle" :dividerStyle="{width: '100%', height: '1px', backgroundColor: '#ebebeb'}" :wrapRadius="false"
    :additionalTabWrap="{width: '342px'}" :indicator="indicator">
    <div slot="0" style="margin-top:40px">
      <div class="margin-bottom-12 size-16 weight-500 p-main">
        전체 이벤트 {{ onList.length }}개</div>
      <list-vertical>
        <transition-group name="fade" slot="card" class="grid-box" tag="div">
        <div 
          v-for="(item,idx) in onList"
          :key="`card-prod-${item.id}-${idx}`"
          :style="cardStyle(idx)">
          <t6-t-card-event-pc :card="item"
                      ></t6-t-card-event-pc>
        </div>
        </transition-group>
      </list-vertical>
      <div v-if="onList&&onList.length===0" class="empty-view p-sub size-16">
        진행중인 이벤트가 없습니다.</div>
    </div>
    
    <div slot="1" style="margin-top:40px">
      <div class="margin-bottom-12 size-16 weight-500 p-main">
        전체 이벤트 {{ endList.length }}개</div>
      <list-vertical>
        <transition-group name="fade" slot="card" class="grid-box" tag="div">
        <div 
          v-for="(item,idx) in endList"
          :key="`card-prod-${item.id}-${idx}`"
          :style="cardStyle(idx)">
          <t6-t-card-event-pc :card="item"
                      ></t6-t-card-event-pc>
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
import t6TCardEventPc from "@/components/Components/Card/t6/CardEventPc.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockEventPc',
  components: {
    t6TCardEventPc
  },
  mixins: [
    BlockMixin,
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
      "event": undefined,
      "onList": [],
      "endList": [],
      "cardColumn": 3
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
        this.getOnList();
        this.getEndList();
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
    },
    getOnList() {
      let result = []
      if(this.event) {
        this.event.forEach(item => {
          if(this.dayjs().isBefore(item.end_date) || this.dayjs().isSame(item.end_date, 'day')) {
            item.disabled = false;
            result.push(item)
          }
        })
      }
      this.onList = result;
    },
    getEndList() {
      let result = []
      if(this.event) {
        this.event.forEach(item => {
          if(this.dayjs().isAfter(item.end_date, 'day')) {
            item.disabled = true;
            result.push(item)
          }
        })
      }
      this.endList = result;
    }
  },
  computed: {
    selectedTabStyle() {
      return {
        color: this.brandColor.primary.color,
        textAlign: 'center',
        fontSize: '16px',
        backgroundColor: 'white',
        padding: '14px 16px',
        fontWeight: '700',
        width: '50%'
      }
    },
    unselectedTabStyle() {
      return {
        color: this.brandColor.sub.color,
        textAlign: 'center',
        fontSize: '16px',
        backgroundColor: 'white',
        padding: '14px 16px',
        fontWeight: '500',
        width: '50%',
      }
    },
    indicator() {
      return `3px solid ${this.getColor('Primary Color')}`
    }
  },
  watch: {
    
  }
}
</script>


