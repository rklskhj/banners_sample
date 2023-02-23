
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    data() {
    return {
      "menu": [],
      "dragging": false,
      "childList1": [],
      "childList2": [],
      "selectedTab": 0,
      "scrollArray1": [],
      "scrollArray2": [],
      "scrollArray3": [],
      "selectedItem1": undefined,
      "selectedItem2": undefined,
      "selectedItem3": undefined
    }
  },
    created() {
    this.init();
  },
  mounted() {
    
  },
  activated() {
    console.log('activated gnb')
    this.init();
  },
  
    methods: {
      init() {
        this.childList1 = []
        this.childList2 = []
        this.scrollArray1 = []
        this.scrollArray2 = []
        this.scrollArray3 = []
        this.selectedItem1 = undefined
        this.selectedItem2 = undefined
        this.selectedItem3 = undefined
        
        this.getMenuset();
      },
    async getMenuset() {
      let res = await this.$axios.get(`public/ui/menuset/style/header?activated=true`);
      let list = [];
      
      if(res.data[0].menu[0].is_category) {
        // 카테고리일때 메뉴셋 형식에 맞게 menu 구성
        this.$store.getters.category.forEach(cat => {
          let child = [];
          
          if(cat.child && cat.child.length>0) {
            cat.child.forEach(chi => {
              let grand = [];
              
              if(chi.child && chi.child.length>0) {
                chi.child.forEach(gra => {
                  grand.push({
                    link: `product?gnb=${gra.id}`,
                    linkType: 'link',
                    name: gra.name,
                    id: gra.id,
                    icon: gra.img_before,
                    index: gra.index,
                    packages: gra.packages
                  })
                });  
              }
              
              child.push({
                link: `product?gnb=${chi.id}`,
                linkType: 'link',
                name: chi.name,
                id: chi.id,
                icon: chi.img_before,
                child: grand,
                index: chi.index,
                packages: chi.packages
              });
            });
          }
          
          list.push({
            link: `product?gnb=${cat.id}`,
            linkType: 'link',
            name: cat.name,
            id: cat.id,
            icon: cat.img_before,
            child: child,
            index: cat.index,
            packages: cat.packages
          });
        });
        
        this.$store.commit('setCategory',list);
      }
      
      else {
        res.data.menu.forEach(menu => {
          list.push(menu);
        }); 
      }
      
      this.menu = list;
      
      if(this.type==='scroll') {
        // scroll array1 구성
        this.onReg1(); 
      }
      
      setTimeout(() => {
        this.$nextTick(() => {
          // 라우트로 바로 진입했을때
          this.getInitItem();          
        });
      }, 300)
      
    },
    getInitItem() {
      // link와 정확히 일치하는지
      let query = location.pathname.slice(1) + location.search;
      this.menu.forEach(item => {
        if(item.link===query) {
          this.selectedItem2 = undefined;
          this.selectedItem3 = undefined;
          // 1depth 일때
          this.selectedItem1 = item;
          // 전체 있을때
          if(item.child.length>0) {
            if(item.child[0].id===item.id) {
              this.selectedItem2 = item.child[0];
            }
          }
          
          if(this.type==='scroll') {
            // 스크롤 이동
            this.setScroll(item.index,'one'); 
          }
        }
        else {
          if(item.child&&item.child.length>0) {
            item.child.forEach(child => {
              if(child.link===query) {
                this.selectedItem3 = undefined;
                // 2depth 일때
                this.selectedItem1 = item;
                this.selectedItem2 = child;
                // 전체 있을때
                if(child.child.length>0) {
                  if(child.child[0].id===child.id) {
                    this.selectedItem3 = child.child[0];
                  }
                }
                
                if(this.type==='scroll') {
                  this.onReg2();
                  this.setScroll(item.index,'one');
                  setTimeout(() => {
                    this.setScroll(child.index,'two');
                  },300) 
                }
              }
              else {
                if(child.child&&child.child.length>0) {
                  child.child.forEach(grand => {
                    if(grand.link===query) {
                      // 3depth 일때
                      this.selectedItem1 = item;
                      this.selectedItem2 = child;
                      this.selectedItem3 = grand;
                      
                      if(this.type==='scroll') {
                        this.onReg2();
                        this.onReg3();
                        this.setScroll(item.index,'one');
                        setTimeout(() => {
                          this.setScroll(child.index,'two');
                        },300);
                        setTimeout(() => {
                          this.setScroll(grand.index,'three');
                        },300); 
                      }
                    }
                  })
                } 
              }
            })
          }
        }
      })
    },
    onReg1() {
      // 스크롤 array1 등록
      setTimeout(() => {
        this.$nextTick(() => {
          let totalWidth = 0;
          // 스크롤아이템 width 저장
          for (let i=0; i<this.menu.length; i++) {
            if (this.$refs.dragscroll1&&this.$refs[`tabItem${i}`][0]) {
              // console.log('refs', this.$refs.oneDepth.$refs[`tabItem${i}`])
              let width = this.$refs[`tabItem${i}`][0].offsetWidth;
              this.scrollArray1.push({
                id : this.menu[i].id,
                name : this.menu[i].name,
                width: width,                        // 본인 너비
                accumulatedWidth: totalWidth+width   // 본인 누적너비
              });
              totalWidth += width;                   // 총 너비
            }
          }
        })
      },300)
    },
    onReg2() {
      // 스크롤 array2 등록
      setTimeout(() => {
        this.$nextTick(() => {
          let totalWidth = 0;
          // 스크롤아이템 width 저장
          for (let i=0; i<this.selectedItem1.child.length; i++) {
            if (this.$refs.dragscroll2&&this.$refs[`childItem${i}`][0]) {
              let width = this.$refs[`childItem${i}`][0].offsetWidth;
              this.scrollArray2.push({
                id : this.selectedItem1.child[i].id,
                name : this.selectedItem1.child[i].name,
                width: width,                        // 본인 너비
                accumulatedWidth: totalWidth+width   // 본인 누적너비
              });
              totalWidth += width;                   // 총 너비
            }
          }
        })
      },300)
    },
    onReg3() {
      // 스크롤 
      setTimeout(() => {
        this.$nextTick(() => {
          let totalWidth = 0;
          // 스크롤아이템 width 저장
          for (let i=0; i<this.selectedItem2.child.length; i++) {
            if (this.$refs.dragscroll2&&this.$refs[`childItem${i}`][0]) {
              let width = this.$refs[`childItem${i}`][0].offsetWidth;
              this.scrollArray3.push({
                id : this.selectedItem2.child[i].id,
                name : this.selectedItem2.child[i].name,
                width: width,                        // 본인 너비
                accumulatedWidth: totalWidth+width   // 본인 누적너비
              });
              totalWidth += width;                   // 총 너비
            }
          }
        })
      },300)
    },
    linkPush(link) {
      if(link.split('?')[0] === this.$route.path.replace('/','')) {
        this.$router.replace(link);
      }
      else{
        this.routerPush(link);
      }
    },
    clickTab1(item, idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedItem2 = undefined;
        this.selectedItem3 = undefined;
        this.scrollArray2 = [];
        this.scrollArray3 = [];
        this.selectedItem1 = item;
        
        if(item.child.length>0) {
          // 전체 있을때
          if(item.child[0].id===item.id) {
            this.selectedItem2 = item.child[0]
          }
          
          if(this.type==='scroll') {
            // scrollArray2 등록
            this.onReg2(); 
          }
        }
        if(this.type==='scroll') {
          // 가운데로 스크롤 이동
          this.setScroll(idx,'one'); 
        }
        
        this.linkPush(item.link);
      }
    },
    clickTab2(item, idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedItem3 = undefined;
        this.scrollArray3 = [];
        this.selectedItem2 = item;
        
        if(item.child.length>0) {
          // 전체 있을때
          if(item.child[0].id===item.id) {
            this.selectedItem3 = item.child[0];
          }
          
          if(this.type==='scroll') {
            // scrollArray3 등록
            this.onReg3(); 
          }
        }
        if(this.type==='scroll') {
          // 가운데로 스크롤 이동
          this.setScroll(idx,'two'); 
        }
        
        this.linkPush(item.link); 
      }
    },
    clickTab3(item, idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else {
        this.selectedItem3 = item;
      
        if(this.type==='scroll') {
          // 가운데로 스크롤 이동
          this.setScroll(idx,'three'); 
        }
        
        this.linkPush(item.link); 
      }
    },
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    },
    setScroll(index, str) {
        let target;
        if(str==='one') {
          target = this.scrollArray1[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscroll1.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        else if(str==='two') {
          target = this.scrollArray2[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscroll2.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        else if(str==='three') {
          target = this.scrollArray3[index];
          if (target) {
            let result = (target.accumulatedWidth - (target.width/2));
            result -= (this.$store.getters.deviceWidth/2);
            this.$refs.dragscroll3.scrollTo({
              behavior: 'smooth',
              left: result
            });
          }
        }
        
      }
    },
    computed: {
    grabStyle() {
        return {
          borderBottom: this.brandBorder.main.border,
        }
      }
    },
    watch: {
    
    }
}
