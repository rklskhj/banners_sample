<template>
<page-header :full="true" :style="containerBg">
    <template v-slot:full>
      <div class="flex-align" style="gap: 0 10px; padding: 16px 0">
        <i class="material-icons unselect p-main" @click="moveToPreviousPath">keyboard_arrow_left</i>
        <block-header-search class="flex-1" v-bind="searchInput"></block-header-search>
      </div>
    </template>
  </page-header>
</template>
<script>
import BlockHeaderSearch from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderSearch.vue"

export default {
  name: 'PageHeaderMobile',
  components: {
    BlockHeaderSearch
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "bgColor": "brandBgColor.main",
      "searchInput": {
        "visible": true,
        "iconStyle": {
          "top": "14px",
          "left": "8px",
          "color": "brandColor.main",
          "fontSize": "18px"
        },
        "wrapStyle": {
          "width": "100%",
          "position": "relative"
        },
        "inputStyle": {
          "color": "brandColor.main",
          "width": "100%",
          "height": "44px",
          "padding": "12px 8px 12px 36px",
          "textAlign": "left",
          "borderRadius": "8px",
          "backgroundColor": "brandBgColor.sub2"
        },
        "borderColor": "brandBorder.main",
        "placeholder": "검색어를 입력해 주세요."
      }
    }
  },
  created() {
    let pagePadding = parseInt(this.pagePadding.paddingLeft.replace('px','')) * 2;
    // this.searchInput.wrapStyle.width = `calc(100% - ${pagePadding}px)`;
  },
  mounted() {
    
  },
  
  methods: {
    moveToPreviousPath() {
      if (this.$store.getters.searchPreviousPath !== '') {
        this.routerPush(this.$store.getters.searchPreviousPath);
      } else {
        this.routerPush('/home');
      }
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor),
        height: '76px'
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
input::placeholder {
    color: #828282;
  }
</style>

