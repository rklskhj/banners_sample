
export default {
    components: {

    },
    mixins: [

    ],
    props: {

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
      textColor(type) {
        if(type.indexOf('rgba')>-1) {
          return {
            color: type
          }
        }
        else {
          return this.brandColor[type]
        }
      }
    },
    computed: {
    containerStyle() {
        return {
          marginBottom: this.$store.getters.commonStyle.blockMarginBottom
        }
      },
    // Block margin-bottom
      blockMargin() {
        return {
          marginBottom: `${this.$store.getters.commonStyle.blockMarginBottomPc}`
        }
      },
    /* *******
        PC      
        ****** */
      // PC max-width
      pcMaxWidth() {
          return {
            width: this.maxWidth,
          }
      },
    // PC full-width
      pcFullWidth() {
        return {
          width: '100%'
        }
      },
    // PC Block margin-bottom
      pcBlockMargin() {
        return {
          marginBottom: `${this.$store.getters.commonStyle.blockMarginBottomPc}`
        }
      },
    // 가로형리스트 내부의 카드 스타일
      horizontalCardStyle() {
        return {
          display: 'inline-block',
          marginLeft: this.$store.getters.brand.layout_gutters +'px',
          marginRight: this.$store.getters.brand.layout_gutters +'px'
        }
      }
    },
    watch: {
    
    }
}
