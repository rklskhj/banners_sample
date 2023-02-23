<template>
<div class="full-width" @click="clickCard" ref="cardWrap">
  
  <e-image :isBg="true" :isLazy="false" :img="card.img ? card.img : dummyImage.bg"
    style="background-color:rgba(0,0,0,0.3)" 
    :useRatio="true" class="position-relative radius-8" :imgRadius="8"
    :useThumb="true" :width="width" :imageRates="imageRates">
    <div slot="inner" class="full-width full-height">
      <div class="position-absolute" style="right:0;bottom:0">
        <div class="flex-center size-16 weight-500 p-bg-primary p-white"
          style="padding: 2px 10px">{{ formattedEndDate() }}</div>
      </div>
    </div>
  </e-image>
  
  <div class="p-bg-white" style="margin-top:8px">
    <div class="size-16 weight-500 margin-bottom-4 p-main"
      style="width: 100%; overflow: hidden">{{ card.title }}</div>
    
    <div style="width: 100%; overflow: hidden"
      class="size-12 weight-400 p-main">{{ formattedDate() }}</div>
  </div>
    
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'CardEvent',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {
    card: {
      type: Object,
      required: true,
    },

  },
  data() {
    return {
      "width": 0,
      "imageRates": {
        "ratio": "1.3:1"
      }
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      this.width = this.$refs.cardWrap.clientWidth;
    })
  },
  
  methods: {
    clickCard() {
      if(!this.card.disabled) {
        this.routerPush(`event_detail?id=${this.card.id}`)
      }
    },
    formattedDate() {
      if (this.card.start_date === '1111-01-01' && this.card.end_date === '9999-01-01') {
        return '상시';
      } else {
        return `${this.dateFormat(this.card.start_date, 'date_3')} ~ ${this.dateFormat(this.card.end_date, 'date_3')}`
      }
    },
    formattedEndDate() {
      let currentDate = this.dayjs().format('YYYY-MM-DD');
      if (this.card.end_date >= currentDate && this.card.start_date !== '1111-01-01' && this.card.end_date !== '9999-01-01') {
        return `D-${this.dayjs(this.card.end_date).diff(currentDate, 'day')}`;
      } else if (this.card.end_date >= currentDate && this.card.start_date === '1111-01-01' && this.card.end_date === '9999-01-01') {
        return '상시';
      } else {
        return '종료';
      }
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


