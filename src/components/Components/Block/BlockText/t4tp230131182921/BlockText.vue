<template>
<div style="word-break:break-all;padding: 25px 0" :style="containerStyle">
  <div :style="pagePadding">
    <div :style="menuContent" style="white-space:pre-wrap">{{ content }}</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockText',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "styles": {
        "block": {
          "align": "center",
          "color": {
            "content": "brandColor.main"
          },
          "fontSize": {
            "content": 24
          },
          "backgroundColor": "brandBgColor.main"
        }
      },
      "content": "🔍\n분야별 전문가들을\n한번에 비교하고 찾아보세요"
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.parseColor(this.styles.block.backgroundColor)
      }
    },
    menuContent() {
      return {
        color: this.parseColor(this.styles.block.color.content),
        fontSize: this.styles.block.fontSize.content + 'px',
        textAlign: this.styles.block.align,
        whiteSpace: 'pre-wrap'
      }
    }
  },
  watch: {
    
  }
}
</script>


