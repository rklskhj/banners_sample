
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    
    
    methods: {
        clickBack() {
		  if(this.$route.query.notif) {
		    this.$router.push("/splash");
		  }
		  else {
        if (window.history.length > 2) {
          this.$router.back();
        } else {
          this.routerPush('/home');
        }
		  }
		}
    },
    computed: {
        
    },
    watch: {
        
    }
}
