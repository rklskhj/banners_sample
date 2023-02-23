<template>
<div class="full-width" @click="clickCard" ref="cardWrap">
  
  <e-image :isBg="true" :isLazy="false" :img="card.img ? card.img : dummyImage.bg"
    :useRatio="true" class="position-relative"
    :useThumb="true" :width="width" :imageRates="imageRates"
    :imgRadius="8">
    <div slot="inner" class="full-width full-height"
      style="background-color:rgba(0,0,0,0.3)">
      <div slot="inner" class="position-absolute label-box">
        <div class="p-white">
          <div class="flex-align margin-bottom-6">
            <div class="flex-center size-16 weight-500 p-white radius-6"
              :class="{'p-bg-primary': formattedEndDate() !== '종료'}" :style="labelBg"
              style="padding:2px 10px">{{ formattedEndDate() }}</div>
          </div>
        </div>
      </div>
      <div slot="inner" class="position-absolute layer-box">
        <div class="p-white">
          <div class="size-16 weight-500 margin-bottom-2">{{ card.title }}</div>
          <div style="height: 18px"
            class="size-12 weight-400">{{ formattedDate() }}</div>
        </div>
      </div>
    </div>
  </e-image>
    
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
        "ratio": "16:9"
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
.label-box {
  right:16px;
  top:10px;
}
.layer-box {
  left: 16px;
  bottom: 16px;
}
</style>

