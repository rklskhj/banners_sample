<template>
<!--<a :href="`product_detail?id=${card.id}`" target="_blank">-->
    <div class="unselect full-width" @click="clickCard">
    <div class="flex-align" :style="{
      'gap': $store.getters.device === 'mobile' ? '0 8px' : '0 12px'
    }">
      <div class="position-relative" ref="card">
        <e-image :imageRates="{ratio: '1:1'}" :isBg="true" :img="card.img"
                 :useThumb="true" :width="width"
                 class="position-relative radius-8"
                 style="overflow: hidden">
        </e-image>
      </div>

      <div class="flex-1">
        <div v-if="(card.partner && card.partner.name != '') || $store.getters.service.title !== ''" 
            class="size-12 weight-400 ellipsis p-main">{{ card.partner ? card.partner.name : $store.getters.service.title }}</div>
        <div class="weight-500 ellipsis p-main"
          :class="{
            'size-14': $store.getters.device === 'mobile',
            'size-16': $store.getters.device !== 'mobile'
          }" style="width:100%" v-if="card.name !== ''">{{ card.name }}</div>
        <div class="p-sub2" :class="{
          'size-10': $store.getters.device === 'mobile',
          'size-12': $store.getters.device !== 'mobile'
        }" v-if="card.simple_desc !== ''">{{ card.simple_desc }}</div>
      </div>
    </div>
  </div>
  <!--</a>-->
</template>
<script>

export default {
  name: 'CardReviewReg',
  components: {

  },
  mixins: [

  ],
  props: {
    card: {
      type: Object,
    },

  },
  data() {
    return {
      "width": 0
    }
  },
  created() {
      
    },
  mounted() {
    this.$nextTick(() => {
      if (this.$store.getters.device === 'mobile') {
        this.width = 56;
      } else {
        this.width = 80;
      }
    })
  },
  
  methods: {
    clickCard() {
      this.routerPush(`product_detail?id=${this.card.id}`);
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


