<template>
<page-header :style="containerBg">
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
        "textStyle": {}
      }
    }
  },
  created() {
    if(this.korName) {
      this.headerText.title = this.korName;
    }
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


