<template>
<div class="grid-box overflow-hidden unselect radius-8 p-bg-white"
  style="padding: 16px"
  @click="routerPush(`product_detail?id=${card.product.id}`)">
  <div :class="device==='mobile' ? 'col-3' : 'col-1'">
    <e-image :isBg="false" :isLazy="false" :img="card.product.img"
      class="position-relative radius-6" :useRatio="true"
      :imageRates="{'ratio': '1:1'}" :width="80"></e-image>
  </div>
  <div class="flex wrap" :class="device==='mobile' ? 'col-9' : 'col-11'" style="padding:10px 12px">
    <div class="flex-align full-width" style="gap: 0 14px">
      <div class="size-12 ellipsis p-sub" style="height:auto; flex: 1">{{ card.partner.name }}</div>
      <div class="size-10 p-sub2">{{ callTime }}</div>
    </div>
    <div class="size-14 weight-500 ellipsis margin-bottom-2 p-main" style="height:auto; width:100%;">{{ card.product.name }}</div>
    <div class="size-13 p-primary">{{ card.partner.phone }}</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'CardCall',
  components: {

  },
  mixins: [

  ],
  props: {
    card: {
      type: Object,
      required: true,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    callTime() {
      // diff 사용을 위해, 오늘 날짜 시간을 00:00:00으로 설정 (startOf('day'))
      let today = this.dayjs().startOf('day'); 
      let target = this.dayjs(this.card.created_time).startOf('day');
      
      if (today.format('YY-MM-DD')===target.format('YY-MM-DD')) {
        return '오늘';
      }
      else if (today.isAfter(target)) {
        // let diff = today.diff(target, 'day');
        // return `${diff}일 전`;
        return target.format('YYYY.MM.DD HH:mm')
      }
      else return '';
    },
    device() {
      return this.$store.getters.device;
    }
  },
  watch: {
    
  }
}
</script>


