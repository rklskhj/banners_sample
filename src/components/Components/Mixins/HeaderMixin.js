
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
      clickBack() {
        let preventBack = false;
        ['cancel_done', 'exc_done', 'ret_done'].forEach(item => {
          if (this.$route.path.indexOf(item) > -1) {
            preventBack = true;
          }
        })
        if(this.$route.query.notif) {
          this.routerPush("/splash");
        }
        else if (preventBack) {
          this.routerPush('/home');
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
