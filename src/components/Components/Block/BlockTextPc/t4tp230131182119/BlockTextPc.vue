<template>
<div style="word-break:break-all;padding: 40px 0">
  <div class="flex-justify">
    <div :style="pcMaxWidth">
      <div :style="menuContent">{{ content }}</div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockTextPc',
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
            "content": 44
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
    this.setBg();
  },
  
  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.styles.block.backgroundColor);
    }
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
    'styles.block.backgroundColor'() {
      this.setBg();
    }
  }
}
</script>


