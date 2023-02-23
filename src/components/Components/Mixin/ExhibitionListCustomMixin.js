
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    data() {
    return {
      "ids": "",
      "url": "",
      "maxIdx": 9,
      "minIdx": 0,
      "idsList": undefined,
      "loading": false,
      "sorting": {},
      "interval": 10,
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
    if (this.pageLoadType === 'infinite') {
      // 무한 스크롤
     window.addEventListener('scroll', this.onScroll)
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
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
        if (this.minIdx + this.interval > this.idsList.length) {
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
          this.minIdx += this.interval;
          this.maxIdx = this.maxIdx + this.interval > this.idsList.length ? this.idsList.length : this.maxIdx + this.interval;
          let oldIds = this.ids;
          let ids = [];
          for (let i = this.minIdx; i < this.maxIdx; i++) {
            ids.push(this.idsList[i].parent);
          }
          this.ids = ids.toString();
          this.url = this.url.replace(`ids=${oldIds}`, `ids=${this.ids}`)
          this.$axios.get(this.url).then(res => {
            this.list = this.list.concat(res.data.data);
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          })
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
