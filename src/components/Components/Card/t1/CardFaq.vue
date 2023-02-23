<template>
<div class="unselect p-bg-white radius-8"
  style="padding:16px">
  <div class="size-14 weight-500 p-main"
    :class="{'p-border-bottom-sub': card.toggle}"
    :style="titleStyle"
    @click="card.toggle = !card.toggle"><span class="size-13 weight-700 p-primary"
      style="margin-right:4px">Q</span>{{ card.question }}</div>
  <template v-if="card.toggle">
    <div class="size-14 weight-500 p-main" style="margin:12px 0 8px"
      ><span class="size-13 weight-700 p-highlight"
        style="margin-right:4px">A</span>답변 내용</div>
    <e-editor :html="card.answer" style="padding: 0"></e-editor>
  </template>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'CardFaq',
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
          paddingBottom: '12px',
        } 
      }
    }
  },
  watch: {
    
  }
}
</script>


