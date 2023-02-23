<template>
  <div>
    <page-header v-if="!isPc">
      <div slot="right">
        <i class="material-icons header-icon" @click="clickClose" style="margin: 0 10px;">close</i>
      </div>
      <span class="header-title" slot="center">카테고리</span>
    </page-header>
    <div v-else style="margin-top:24px" class="size-16 weight-500 header-title">카테고리</div>
    <div class="block-category-container" :style="pagePadding">
      <!-- 1차 카테고리 -->
      <div v-for="(cat1,idx) in categories" :key="'cat1-'+idx"
           :style="`border-bottom:${brandBorder.sub.border}`">
        <div class="category-1 unselect flex-between" @click="clickCategory1(cat1)">
          <div class="flex-align">
            <div :style="brandColor[category && cat1.id === category.id && (!cat1.child || cat1.child.length===0) ? 'primary' : 'sub']">{{ cat1.label }}</div>
            <i v-if="category && cat1.id === category.id && (!cat1.child || cat1.child.length===0)"
               class="material-icons icon-check"
               :style="[brandBgColor.brand,brandColor.white]">check</i>
          </div>
          <i class="material-icons"
             v-if="cat1.child && cat1.child.length>0">keyboard_arrow_{{ cat1.expand ? 'up' : 'down' }}</i>
        </div>
        <div v-if="cat1.child && cat1.child.length>0 && cat1.expand" style="padding-bottom:16px">
          <!-- 2차 카테고리 -->
          <div v-for="(cat2, idx2) in cat1.child" :key="'cat2-'+idx2">
            <div class="category-2 unselect flex-align" @click="clickCategory(cat1, cat2, 2)">
              <div :style="brandBorder.main" class="bridge"></div>
              <div :style="brandColor[category && cat2.id === category.id && (!cat2.child || cat2.child.length===0) ? 'primary' : 'sub']">{{ cat2.label }}</div>
              <i v-if="category && cat2.id === category.id && (!cat2.child || cat2.child.length===0)"
                 class="material-icons icon-check"
                 :style="[brandBgColor.brand,brandColor.white]">check</i>
            </div>
            <!-- 3차 카테고리 -->
            <div v-for="(cat3, idx3) in cat2.child" :key="'cat3-'+idx3">
              <div class="category-3 unselect flex-align" @click="clickCategory(cat2, cat3, 3)">
                <div :style="brandBorder.main" class="bridge"></div>
                <div :style="brandColor[category && cat3.id === category.id ? 'primary' : 'sub2']">{{ cat3.label }}</div>
                <i v-if="category && cat3.id === category.id"
                   class="material-icons icon-check"
                   :style="[brandBgColor.brand,brandColor.white]">check</i>
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
    name: "BlockInputCategoryOverlay",
    props: {
      categories: {
        type: Array
      },
      category: {
        type: Object
      }
    },
    created() {

    },
    data() {
      return {}
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
      isPc() {
        return this.$store.getters.device === 'pc';
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .block-category-container
    padding-top 50px
    padding-bottom 50px
    height 100vh
    overflow-y auto

  @media screen and (min-width: 420px)
    .block-category-container
      height calc(100% - 50px)

  .category-1
    padding 16px 0
  .category-2
  .category-3
    padding 12px 0
  .category-2
    padding-left 20px
  .category-3
    padding-left 32px

  .bridge
    border-top 0 !important
    border-right 0 !important
    width 8px
    height 8px
    margin-right 8px

  .icon-check
    width 18px
    height 18px
    border-radius 100%
    font-size 16px
    text-align center
    margin-left 8px
</style>
