
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
      "postParam": undefined,
      "scrollEnd": false,
      "isLastPage": false,
      "totalCount": 0,
      "totalPages": 1,
      "currentPage": 1,
      "pageLoadType": "none"
    }
  },
    mounted() {
      // 무한 스크롤
	  if (this.pageLoadType === 'infinite') {
	   window.addEventListener('scroll', this.onScroll)
	  }
	},
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
  
    methods: {
      onScroll() {
		  let scrollTop = document.scrollingElement ? document.scrollingElement.scrollTop : document.getElementsByTagName('html')[0].scrollTop;
		  scrollTop += window.innerHeight;
		  let scrollHeight = document.getElementById('app').scrollHeight;
		  
		  this.scrollEnd = scrollTop > (scrollHeight - 300);
		},
    getList() {
		  if(this.loading || this.currentPage === 1 || this.isLastPage) {
		    return;
		  }
		  
		  this.loading = true;
      // post
      if (this.postParam!==undefined) {
        this.postParam.page_num = this.currentPage;
        this.$axios.post(this.url, this.postParam).then(res => {
          this.isLastPage = this.currentPage >= this.totalPages;
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
          this.isLastPage = this.currentPage >= this.totalPages;
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
