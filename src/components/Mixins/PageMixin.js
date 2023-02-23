
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    data() {
            return {
		    "login_required": false
		}
    },
    mounted() {
	  if(!this.isLogin && this.login_required) {
	    this.$router.replace('signin');
	  }
	},
    methods: {
        
    },
    computed: {
      wrapperStyle() {
        return {
          marginTop: '50px'
        }
      },
      pageHeight() {
        return {
          minHeight: 'calc(100vh - 50px)'
        }
      },
      pageBottom() {
        return {
          paddingBottom: '50px'
        }
      },
      pageBg() {
        return {
          backgroundColor: '#ffffff'
        }
      },
    },
    watch: {
        
    }
}
