
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    data() {
      return {
		    "url": "",
		    "loading": false,
		    "scrollEnd": false,
		    "isLastPage": false,
		    "totalCount": 0,
		    "totalPages": 1,
		    "currentPage": 1,
        "pageLoadType": "none",
        postParam: undefined

		}
    },
    mounted() {
	  if (this.pageLoadType === 'infinite') {
	    // 무한 스크롤
	    // window.document.body.onscroll = function() {
	    //   this.onScroll();
      // }.bind(this);
      
      this.$nextTick(function () {
        window.addEventListener('scroll', () => {
          this.onScroll();
        });
      })
	  }
	},
    methods: {
      onScroll() {
        let scrollTop = document.scrollingElement ? document.scrollingElement.scrollTop : document.getElementsByTagName('html')[0].scrollTop
		    scrollTop += window.innerHeight;
		
		  let scrollHeight = document.getElementById('app').scrollHeight;
		
		  if (scrollTop > (scrollHeight - 300)) {
		    this.scrollEnd = true;
		  }
		  else {
		    this.scrollEnd = false;
		  }
		},
		getList() {
		  if(this.loading || this.currentPage === 1) return;
		
		  if (this.currentPage > this.totalPages) {
		    this.isLastPage = true;
		    return;
		  }
		
      this.loading = true;
      
      
      // post
      if (this.postParam!==undefined) {
        this.postParam.page_num = this.currentPage;
        this.$axios.post(this.url, this.postParam).then(res => {
          this.currentPage++;
          this.list = this.list.concat(res.data.data);
          this.loading = false;
          this.$store.commit('setLoadingSpinner', false);
        }).catch(()=> {
          this.loading = false;
          this.$store.commit('setLoadingSpinner', false);
        });
      }
      // get
      else {
        this.$axios.get(this.url.replace('page_num=1', `page_num=${this.currentPage}`)).then(res => {
          this.currentPage++;
          this.list = this.list.concat(res.data.data);
          this.loading = false;
        }).catch(()=> {
          this.loading = false;
        });
      
        }
	  	}
    },
    computed: {
        
    },
    watch: {
      scrollEnd(n) {
  		  if(n) {
  		    this.getList();
  		  }
  		}
    }
}
