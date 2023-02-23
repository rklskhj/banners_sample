<template>
<div class="grid-box-wrap overflow-hidden unselect radius-12 p-bg-white" style="padding: 32px"
  @click="routerPush(`product_detail?id=${card.product.id}`)">
  <div class="flex" style="gap: 0 16px">
    <e-image :isBg="true" :isLazy="false" :img="card.product.img"
      :useThumb="true" :width="100" :imageRates="{'ratio': '1:1'}" class="radius-8 overflow-hidden"></e-image>
    <div class="flex-1">
      <div class="size-14 ellipsis p-sub" style="width:100%">{{ card.partner.name }}</div>
      <div class="size-16 weight-500 ellipsis margin-bottom-4 p-main" style="width:100%">{{ card.product.name }}</div>
      <div class="size-16 p-primary">{{ card.partner.phone }}</div>
    </div>
  </div>
  <div class="size-15 p-sub" style="text-align:end">{{ callTime }}</div>
</div>
</template>
<script>

export default {
  name: 'CardCallPc',
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
      
      if (this.device === 'mobile') {
        if (today.format('YY-MM-DD')===target.format('YY-MM-DD')) {
          return '오늘';
        }
        else if (today.isAfter(target)) {
          let diff = today.diff(target, 'day');
          return `${diff}일 전`;
        }
        else return '';
      } else {
        return this.dayjs(this.card.created_time).format('YYYY-MM-DD HH:mm');
      }
      
    },
    device() {
      return this.$store.getters.device;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.grid-box-wrap {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0 126px;
  }
</style>

