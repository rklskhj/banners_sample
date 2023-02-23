<template>
<div style="height:100%">
    <page-header v-if="$store.getters.device==='mobile'">
      <div slot="right">
        <i class="material-icons header-icon" @click="clickClose" style="margin: 0 10px;">close</i>
      </div>
      <span class="header-title p-main" slot="center">카테고리</span>
    </page-header>
    <div v-else class="full-width flex-align" style="height: 50px">
      <div class="full-width size-16 bold flex-center p-main">카테고리</div>
    </div>
    <div class="block-category-container" :style="pagePadding">
      <!-- 1차 카테고리 -->
      <div v-for="(cat1,idx) in categories" :key="'cat1-'+idx"
        class="p-border-bottom-sub">
        <div class="category-1 flex-between unselect" @click="clickCategory1(cat1)">
          <div class="flex-align">
            <div :class="{
                'p-primary': category && cat1.id === category.id && (!cat1.child || cat1.child.length === 0),
                'p-sub': category && cat1.id !== category.id && (cat1.child && cat1.child.length > 0)
              }">{{ cat1.label }}</div>
            <i v-if="category && cat1.id === category.id && (!cat1.child || cat1.child.length===0)"
               class="material-icons icon-check radius-circle p-bg-brand p-white">check</i>
          </div>
          <i class="material-icons"
            v-if="cat1.child && cat1.child.length>0">keyboard_arrow_{{ cat1.expand ? 'up' : 'down' }}</i>
        </div>
        <div v-if="cat1.child && cat1.child.length>0 && cat1.expand" style="padding-bottom:16px">
          <!-- 2차 카테고리 -->
          <div v-for="(cat2, idx2) in cat1.child" :key="'cat2-'+idx2" :style="`margin-top:${idx2 === 0 ? '0' : '22px'}`">
            <div class="category-2 flex-align unselect" @click="clickCategory(cat1, cat2, 2)">
              <div class="bridge p-border-left-main p-border-bottom-main"></div>
              <div :class="{
                  'p-primary': category && cat2.id === category.id && (!cat2.child || cat2.child.length === 0),
                  'p-sub': category && cat2.id !== category.id && (cat2.child && cat2.child.length > 0)
                }">{{ cat2.label }}</div>
              <i v-if="category && cat2.id === category.id && (!cat2.child || cat2.child.length===0)"
                 class="material-icons icon-check radius-circle p-bg-brand p-white">check</i>
            </div>
            <!-- 3차 카테고리 -->
            <div v-for="(cat3, idx3) in cat2.child" :key="'cat3-'+idx3" style="margin-top:22px">
              <div class="category-3 flex-align unselect" @click="clickCategory(cat2, cat3, 3)">
                <div class="bridge p-border-left-main p-border-bottom-main"></div>
                <div :class="{
                    'p-primary': category && cat3.id === category.id,
                    'p-sub2': category && cat3.id !== category.id
                  }">{{ cat3.label }}</div>
                <i v-if="category && cat3.id === category.id"
                   class="material-icons icon-check radius-circle p-bg-brand p-white">check</i>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'BlockInputCategoryOverlay',
  components: {

  },
  mixins: [

  ],
  props: {
    category: {
      type: Object,
    },
    categories: {
      type: Array,
    },

  },
  data() {
    return {

    }
  },
  created() {

    },
  
  methods: {
    clickClose() {
        this.$emit('closePage');
      },
    clickCategory1(cat1) {
        if(!cat1.child || cat1.child.length === 0) {
          cat1.depth = 1;
          this.$emit('update:category', cat1);
          this.clickClose();
        } else {
          cat1.expand = !cat1.expand;
        }
      },
    clickCategory(parent, cat, depth) {
        if(parent.id === cat.id) {
          parent.depth = depth - 1;
          this.$emit('update:category', parent);
        } else {
          cat.depth = depth;
          this.$emit('update:category', cat);
        }
        this.clickClose();
      }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.block-category-container {
  padding-top: 50px;
  padding-bottom: 50px;
  height: calc(100% - 50px);
  overflow-y: auto;
}
.category-1 {
  padding: 16px 0;
}
.category-2 .category-3 {
  padding: 12px 0;
}
.category-2 {
  padding-left: 20px;
}
.category-3 {
  padding-left: 32px;
}
.bridge {
  width: 8px;
  height: 8px;
  margin-right: 8px;
}
.icon-check {
  width: 18px;
  height: 18px;
  font-size: 16px;
  text-align: center;
  margin-left: 8px;
}
</style>

