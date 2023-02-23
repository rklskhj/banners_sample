
export default {
    components: {

    },
    mixins: [

    ],
    props: {
		card: {
			type: Object,
			required: false,
		},
		last: {
			type: Boolean,
			default: false,
		},
		first: {
			type: Boolean,
			default: false,
		},
		gutter: {
			type: Number,
			required: false,
		},

    },
    
    
    methods: {
        lineClamp(line, lineHeight, ) {
		  return {
		    overflow: 'hidden',
		    textOverflow: 'ellipsis',
		    lineHeight: lineHeight+'px',
		    maxHeight: `${lineHeight*line}px`
		  }
		}
    },
    computed: {
        layout_gutter() {
		  if(this.gutter)
		    return this.gutter;
		  else
		    return this.$store.getters.brand.layout_gutters;
		},
		cardStyle() {
		  let style = {};
		
		  if(this.first) {
		    style.paddingRight = (this.layout_gutter * 2/3) + 'px';
		  }
		  else if(this.last) {
		    style.paddingLeft = (this.layout_gutter * 2/3) + 'px';
		  }
		  else {
		    let padding = (this.layout_gutter / 3) + 'px';
		    style.paddingLeft = padding;
		    style.paddingRight = padding;
		  }
		
		  return style;
		},
		dividerStyle() {
		  let deco = {
		    padding: this.layout_gutter + 'px',
		    //paddingBottom: this.layout_gutter + 'px',
		  }
		
		  if(!this.last) {
		    deco.borderBottom = '1px solid ' + this.getColor('기본 테두리선 색상');
		  }
		  return deco;
		}
    },
    watch: {
        
    }
}
