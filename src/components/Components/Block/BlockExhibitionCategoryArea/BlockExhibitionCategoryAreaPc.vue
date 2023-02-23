<template>
<div v-if="detail.category && detail.category.length>0"
  style="padding-top:12px;margin-bottom:20px; height: auto" 
  class="overflow-hidden full-width p-border-bottom-main"
  v-dragscroll.x="true"
  @dragscrollmove.prevent.self="onDrag">
  <div class="grab-bing flex-align full-width">
    <div v-for="(category, idx) in detail.category" :key="'category-'+idx"
      class="unselect list-item p-main size-16"
      :class="{
        'bold': category.id === selectedCategory.id
      }"
      style="height: 58px; padding: 16px 0"
      :style="categoryStyle(category, idx)"
      @click.stop.prevent="clickCategory(category)">{{ category.name }}</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockExhibitionCategoryAreaPc',
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
      if (this.dragging) {
        this.dragging = false;
        return;
      } else {
        this.selectedCategory = item;
        this.$emit('category', item.id);
      }
    },
    itemStyle(item) {
      let deco = {
        marginRight: '10px',
        fontSize: '16px',
        padding: '10px 16px',
        borderRadius: '30px',
        marginBottom: '16px'
      };
      
      if(this.selectedCategory && item.id===this.selectedCategory.id) {
        deco.backgroundColor = this.brandBgColor.primary.backgroundColor;
        deco.border = this.brandBorder.primary.border;
        deco.color = 'white';
      }
      else {
        deco.backgroundColor = 'white';
        deco.border = this.brandBorder.main.border;
        deco.color = this.brandColor.sub.color;
      }
      
      return deco;
    },
    categoryStyle(item, idx) {
      let deco = {
        marginRight: '36px'
      };
      if (item.id === this.selectedCategory.id) {
        deco.borderBottom = `2px solid ${this.brandColor.main.color}`
      }
      if (idx === this.detail.category.length - 1) {
        deco.marginRight = '0px'
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

