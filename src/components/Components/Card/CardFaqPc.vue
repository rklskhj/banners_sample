<template>
<div class="unselect p-bg-white radius-12"
  style="padding:16px 24px">
  <div class="size-18 weight-500 p-main"
    :class="{'p-border-bottom-sub': card.toggle}"
    :style="titleStyle"
    @click="card.toggle = !card.toggle"><span class="p-primary"
      style="margin-right:8px">Q</span>{{ card.question }}</div>
  <template v-if="card.toggle">
    <div class="size-16 weight-500 p-main" style="margin:12px 0 8px"
      ><span class="p-highlight" style="margin-right:8px">A</span>답변 내용</div>
    <e-editor :html="card.answer" style="padding: 0; font-size: 14px !important"></e-editor>
  </template>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'CardFaqPc',
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
      "selectedCard": undefined
    }
  },
  created() {

  },
  mounted() {
  
  },
  
  methods: {
    clickCard() {
      this.selectedCard = this.card.id
    }
  },
  computed: {
    titleStyle() {
      if(this.card.toggle) {
        return {
          paddingBottom: '16px',
        } 
      }
    }
  },
  watch: {
    
  }
}
</script>


