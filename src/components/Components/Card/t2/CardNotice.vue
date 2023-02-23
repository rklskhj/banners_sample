<template>
<div v-if="card" class="p-bg-white p-border-bottom-main"
  :style="wrapStyle" 
  @click="routerPush(`notice_detail?id=${card.id}`)">
  <div class="flex-between">
    <div class="full-width">
      <div
        class="size-16 weight-500 margin-bottom-6 p-main">{{ card.title }}</div>
      <e-editor :html="card.content" class="editor-style ellipsis-multiple"
        v-if="card.content.indexOf('<img')===-1"></e-editor>
      <div v-else class="editor-style"></div>
    </div>
    
    <template v-if="card.img">
      <img :src="card.img" class="img-style radius-8">
    </template>
  </div>
  <div style="margin-top:8px"
    class="size-12 weight-400 p-sub2">{{ card.created_time.split(' ')[0] }}</div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'CardNotice',
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

    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    wrapStyle() {
      return {
        padding: '16px 0 18px',
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.editor-style {
  padding: 0;
  height: 35px;
  width: 100%;
}
.img-style {
  width: 88px;
  height: 88px;
  margin-left: 8px;
}
</style>

