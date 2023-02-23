<template>
<div v-if="card"
  class="flex-between unselect p-bg-white"
  @click="routerPush(`notice_detail?id=${card.id}`)">
  <div style="width:calc(100% - 216px)">
    <div class="size-20 weight-500 margin-bottom-6 p-main">{{ card.title }}</div>
    <e-editor :html="card.content" style="padding:0;height:74px;width:100%;margin-bottom:16px; font-size: 15px !important"
      class="ellipsis-multiple p-sub2"
      v-if="card.content.indexOf('<img')===-1"></e-editor>
    <div v-else style="height:90px;width:100%;margin-bottom:16px"></div>
    <div class="size-14 p-sub2">{{ dayjs(card.created_time).format('YYYY.MM.DD') }}</div>
  </div>
  
  <div class="flex-end" style="width:216px">
    <e-image :isBg="true" :isLazy="false" :img="card.img"
      :useRatio="true" class="position-relative"
      :imgRadius="8"
      :useThumb="true" :width="width" :imageRates="imageRates">
    </e-image>
  </div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'CardNoticePc',
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
      "width": 150,
      "imageRates": {
        "ratio": "1:1"
      }
    }
  },
  created() {

  },
  mounted() {
  },
  
  methods: {
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


