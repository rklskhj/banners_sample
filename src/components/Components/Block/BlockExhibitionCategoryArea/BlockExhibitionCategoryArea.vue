<template>
<div style="padding:8px 0" :style="pagePadding"
  v-if="detail.category && detail.category.length>0"
  class="overflow-hidden full-width"
  v-dragscroll.x="true"
  @dragscrollmove.prevent.self="onDrag">
  <div class="grab-bing flex-align full-width">
    <div v-for="(category, idx) in detail.category" :key="'category-'+idx"
      class="unselect list-item size-13"
      :class="{
        'p-sub': category.id !== selectedCategory.id,
        'p-bg-white': category.id !== selectedCategory.id,
        'p-white': category.id === selectedCategory.id,
      }" :style="categoryStyle(category)"
      style="height: 32px; padding: 6px 16px; border-radius: 30px"
      @click.stop.prevent="clickCategory(category)">{{ category.name }}</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockExhibitionCategoryArea',
  components: {

  },
  mixins: [

  ],
  props: {
    detail: {
      type: Object,
    },

  },
  data() {
    return {
      "dragging": false,
      "selectedCategory": undefined
    }
  },
  created() {
    if(this.detail.category.length>0) {
      this.selectedCategory = this.detail.category[0];
    }
  },
  mounted() {
    
  },
  
  methods: {
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    },
    clickCategory(item) {
      // 드래그앤드 시 클릭방지
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedCategory = item;
        this.$emit('category', item.id);
      }
    },
    categoryStyle(item) {
      let deco = {};
      if (item.id === this.selectedCategory.id) {
        deco.backgroundColor = this.brandColor.main.color;
      }
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.grab-bing {
  white-space: nowrap;
  position: relative;
}
.list-item {
  display: inline-block;
}
</style>

