
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    
    
    methods: {
        
    },
    computed: {
        containerStyle() {
		  return {
		    marginBottom: this.$store.getters.commonStyle.blockMarginBottom
		  }
		},
		blockMargin() {
		  return {
		    marginBottom: `${this.$store.getters.commonStyle.blockMarginBottomPc}`
		  }
		},
		pcMaxWidth() {
			if(this.$store.getters.device==='pc') {
				return {
					width: this.maxWidth,
				}
			}
		},
		pcFullWidth() {
		  return {
		    width: '100%'
		  }
		},
		pcBlockMargin() {
		  return {
		    marginBottom: `${this.$store.getters.commonStyle.blockMarginBottomPc}`
		  }
		},
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
