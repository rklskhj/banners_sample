<template>
<page-header :style="containerBg">
    <template v-slot:left>
      <i class="material-icons back-btn"
        @click="clickBack" :style="brandColor.main">keyboard_arrow_left</i>
    </template>
    <template v-slot:center>
      <block-header-text v-bind="headerText"
        :title="headerTitle"></block-header-text>
    </template>
  </page-header>
</template>
<script>
import BlockHeaderText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderText.vue"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"

export default {
  name: 'PageHeaderMobile',
  components: {
    BlockHeaderText
  },
  mixins: [
    HeaderMixin
  ],
  props: {
    korName: {
      type: String,
    },

  },
  data() {
    return {
      "bgColor": "brandBgColor.main",
      "headerText": {
        "index": 0,
        "visible": true,
        "textColor": "brandColor.main",
        "textStyle": {
          "fontSize": "16px",
          "fontWeight": 500
        }
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
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor)
      }
    },
    headerTitle() {
      return this.korName ? this.korName : '';
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.back-btn {
    padding: 0 6px;
  }
</style>

