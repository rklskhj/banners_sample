
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    data() {
    return {
      "formTypeCustom": {
        "box": "",
        "list": "horizontal",
        "align": "block",
        "input": "",
        "label": false,
        "button": "",
        "dropdown": "list",
        "inputIcon": false,
        "vErrorNotShown": false
      },
      "formTypeCustomLabel": {
        "box": "",
        "list": "horizontal",
        "align": "block",
        "input": "",
        "label": true,
        "button": "",
        "dropdown": "list",
        "inputIcon": false,
        "vErrorNotShown": false
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
    labelCustom() {
      return {
        color: this.brandColor.main.color,
        fontSize: '14px',
        marginBottom: '8px'
      }
    },
    inputCustom() {
        return {
          borderRadius: this.radius.borderRadius,
          border: this.brandBorder.main.border,
          backgroundColor: this.brandBgColor.white.backgroundColor,
          padding: '12px 16px',
          color: this.brandColor.main.color,
          fontSize: '14px',
          height: '48px',
          flex: 1
        }
      },
    buttonCustom() {
        return {
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: this.brandBgColor.primary.backgroundColor,
          color: this.brandColor.white.color,
          width: '100%',
          height: '48px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px',
          borderRadius: this.radius.borderRadius,
          pointer: 'cursor'
        }
      }
    },
    watch: {
    
    }
}
