<template>
<div class="unselect full-width unselect radius-8 p-border-main" @click="clickCard" ref="cardWrap">
  <e-image :isBg="true" :isLazy="false" :img="card.img ? card.img : dummyImage.bg"
    :useRatio="true" class="position-relative"
    imgRadius="8px 8px 0 0"
    :useThumb="true" :width="width" :imageRates="imageRates">
  </e-image>
  
  <div class="content-box p-white">
    <div class="flex-align margin-bottom-12">
      <div class="flex-center size-14 weight-400 p-white radius-12"
        :class="{'p-bg-primary': formattedEndDate() !== '종료'}" :style="labelBg"
        style="padding:1px 12px">{{ formattedEndDate() }}</div>
    </div>
      
    <div class="size-18 weight-500 ellipsis margin-bottom-4 p-main"
      style="width:100%;height:24px">{{ card.title }}</div>

    <div style="height: 20px" class="size-13 weight-400 p-sub2">{{ formattedDate() }}</div>
  </div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'CardEventPc',
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
      if (this.card.end_date >= currentDate && this.card.end_date !== '9999-01-01') {
        return `D-${this.dayjs(this.card.end_date).diff(currentDate, 'day')}`;
      } else if (this.card.end_date >= currentDate && this.card.end_date === '9999-01-01') {
        return '상시';
      } else {
        return '종료';
      }
    }
  },
  computed: {
    labelBg() {
      if(this.formattedEndDate()==='종료') {
        return {
          backgroundColor: this.brandColor.sub2.color
        }
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.content-box {
  padding: 20px 22px;
}
</style>

