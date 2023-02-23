<template>
  <component v-if="enablePage" :is="componentName"></component>
</template>

<script>
  import PartnerDetail from '@/components/Pages/PartnerDetail.vue'

  export default {
    name: 'PagePartnerDetail',
    components: { 
      PartnerDetail 
    },
    data() {
      return {
        enablePage: false,
        componentName: '/',
        category_id: 0,
        category: {},
        order_conversion_type: undefined,
        boards: [{"id": 536486, "name": "PartnerDetail", "template_name": "", "route__id": 72065, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "", "tab_index": 0}]
      }
    },
    watch: {
      componentName(n) {
        if(n === '') {
          if(!this.isLogin) {
            this.$router.replace('/signin');
          }
          else {
            let partner_grade = this.boards.map(item=>{ return item.partner_grade }).reduce((p,c) => { return p > c ? c : p; });
            let grade = this.boards.map(item=>{ return item.grade }).reduce((p,c) => { return p > c ? c : p; });


            // 파트너 등급 설정 된 페이지가 있을 경우
            if(partner_grade > 0) {
              // 파트너가 아닌 경우
              if(!this.user.partner) {
                this.$router.replace('/partner_signup');
              }
              // 파트너일땐, 등급 안맞는 페이지로 이동
              else {
                this.$router.replace('/wrong_partner_grade?order='+partner_grade);
              }
            }
            else if(grade > 0) {
              this.$router.replace('/wrong_grade?order='+grade);
            }
          }
        }
      },
      '$route'() {
        this.findName();
      }
    },
    mounted() {
      this.findName();
    },
    methods: {
      findName() {
      this.enablePage = true;
        this.componentName = this.getComponentName();
        this.$emit('componentName',this.componentName);
        
      },
      getOrderConversion(board) {
        let oc = board.filter(i => this.order_conversion_type && this.order_conversion_type === i.order_conversion_type);
        return oc.length > 0 ? oc : board;
      },
      getProductCategories() {
        return new Promise((resolve)=>{
          if(this.$route.path === '/product_detail') {
            this.$axios.get(`/user/0/mapping/product/${this.$route.query.id}?fields=category1,category2,category3,order_conversion_type`).then(cat_res=>{
              if(cat_res.status === 200) {
                this.category = cat_res.data;
                if(cat_res.data.category3) {
                  this.category_id = cat_res.data.category3;
                } else if(cat_res.data.category2) {
                  this.category_id = cat_res.data.category2;
                } else if(cat_res.data.category1) {
                  this.category_id = cat_res.data.category1;
                }
                this.order_conversion_type = cat_res.data.order_conversion_type;
              }
              resolve('ok');
            }).catch(()=>{
              resolve('ok');
            });
          }
          else {
            resolve('ok');
          }
        });
      },
      getComponentName() {
        if(this.isLogin) {
          let name = '';
          if(this.user.grade) {
            for(let i=this.user.grade.order; i>=1; i--) {
              name = this.getBoardsUserGrade(i);
              if(name!=='') {
                break;
              }
            }
          }
          if(name === '') {
            name = this.getBoardsUserLogin();
          }

          if(name === '') {
            name = this.getBoardsGuest();
          }
          return name;
        }
        else {
          return this.getBoardsGuest();
        }
      },
      getName(board) {
        if(board.template_name !== '') {
          return this.dashToPascal(`${board.template_name}${board.name}`);
        } else {
          return board.name;
        }
      },
      dashToPascal(value) {
        let camel = value.replace(/([-_][a-z])/ig, ($1) => {
          return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
        });
        return camel[0].toUpperCase() + camel.substring(1);
      },
      getBoardsGuest() {
        let board = this.boards.filter(item=>{ return item.activated && item.login_required === false });
        board = this.getCategories(board, true, 0);
        board = this.getOrderConversion(board);
        return board.length === 0 ? '' : this.getName(board[0]);
      },
      getBoardsUserLogin() {
        let board = this.boards.filter(item=>{ return item.activated && item.login_required === true && (item.grade === 1 || !item.grade) });
        board = this.getCategories(board, false, 1);
        board = this.getOrderConversion(board);
        return board.length === 0 ? '' : this.getName(board[0]);
      },
      getBoardsUserGrade(grade) {
        let board = this.boards.filter(item=>{ return item.activated && item.login_required === true && item.grade === grade });
        board = this.getCategories(board, false, grade);
        board = this.getOrderConversion(board);
        return board.length === 0 ? '' : this.getName(board[0]);
      },

      getCategories(boards, guest, grade) {
          if((['/product','/search','/product_detail','/filter'].indexOf(this.$route.path)===-1) || boards.length === 0) {
            return boards;
          }

          // 해당 카테고리 페이지가 있는 경우 반환
          let category_id = this.$route.query.gnb ? this.$route.query.gnb : this.$route.query.tab ? this.$route.query.tab : this.$route.query.category;

          let cat_board = [];
          if(this.$route.query.category3) {
            cat_board = boards.filter(item => { return item.category3 === Number(this.$route.query.category3) })
            if(cat_board.length>0) {
              category_id = this.$route.query.category3;
            }
          }
          if(cat_board.length === 0 && this.$route.query.category2) {
            cat_board = boards.filter(item => { return item.category2 === Number(this.$route.query.category2) })
            if(cat_board.length>0) {
              category_id = this.$route.query.category2;
            }
          }
          if(cat_board.length === 0 && this.$route.query.category1) {
            cat_board = boards.filter(item => { return item.category1 === Number(this.$route.query.category1) })
            if(cat_board.length>0) {
              category_id = this.$route.query.category1;
            }
          }

          if(this.category_id>0) {
            category_id = this.category_id;
          }

          // 주문전환 방식 맞는게 있는지 먼저 확인
          if(category_id > 0) {
            if(this.category && this.category.order_conversion_type) {
              cat_board = boards.filter(item => { return item.order_conversion_type === this.category.order_conversion_type });
              if(cat_board.length>0) {
                return cat_board;
              }
            }
            let category = undefined;
            for(let cat1 of this.$store.getters.category) {
              if(cat1.id === category_id) {
                  category = cat1;
                  break;
              } else if(cat1.child) {
                for(let cat2 of cat1.child) {
                  if(cat2.id === category_id) {
                    category = cat2;
                    break;
                  } else if(cat2.child) {
                    for(let cat3 of cat2.child) {
                      if(cat3.id === category_id) {
                        category = cat3;
                        break;
                      }
                    }
                  }
                }
              }
            }
            if(category) {
              let order_conversion_type = {
                'not': 0,
                'call': 1,
                'outlink': 2,
                'delivery': 3,
                'meet': 4,
                'counsel': 5,
                'estimate': 6,
                'license': 7,
                'commerce': 8,
                'group': 9,
                'reservation': 10,
                'booking': 11,
                'mart': 12,
              };
              cat_board = boards.filter(item => {
                if(!item.order_conversion_type) {
                  item.order_conversion_type = 0;
                }

                if(!category.packages) {
                  category.packages = [0];
                }
                return category.packages.filter(item2 => {
                  return item2 === order_conversion_type[item.order_conversion_type];
                }).length > 0
              });
              if(cat_board.length > 0) {
                return cat_board;
              }
            }
          }

          // query로 tab 또는 category로 id 가져온게 없는 경우
          if(category_id === undefined) {
            // 카테고리 설정 없는 보드 존재할 경우
            let board_all = boards.filter(item=>{ return !item.category1 });
            if(board_all.length>0) {    
              return board_all;
            } else {
              return [];
            }
          }
          category_id = parseInt(category_id);
          cat_board = boards.filter(item=>{ return item.category1 === category_id || item.category2 === category_id || item.category3 === category_id });
          // 현재 카테고리와 일치하는 카테고리가 없는 경우, 부모 카테고리로 된 보드 찾기
          if(cat_board.length === 0) {
            cat_board = boards.filter(item => { return item.category1 === this.category.category1 && item.category2 === this.category.category2 });

            if (cat_board.length === 0) {
              cat_board = boards.filter(item => { return item.category1 === this.category.category1 });
            }

            if (cat_board.length === 0) {
              cat_board = boards.filter(item=>{ return !item.category1});
            }
          }

          // 해당 보드가 없는 경우
          if(cat_board.length === 0) {
            return [];
          }
          else {
            if(guest) {
              // 비회원일 때, 상위 회원등급에 해당 카테고리 있는 경우 빈값
              if(this.getBoardsUserLogin() !== '') {
                return [];
              } 
              else {
                let hasUpperGrade = false;
                for(let i = 1; i<=10; i++ ) {
                  let upper_board = this.getBoardsUserGrade(i);
                  if(upper_board !== '') {
                    hasUpperGrade = true;
                    break;
                  }
                }
                if(hasUpperGrade) {
                  return [];
                }
              }
            }

            // 상위등급에서 해당 카테고리가 있는 경우
            if(!guest && grade > 1) {
              let hasUpperGrade = false;
              for(let i = grade+1; i<=10; i++ ) {
                let upper_board = this.getBoardsUserGrade(i);
                if(upper_board !== '') {
                  hasUpperGrade = true;
                }
              }
              if(hasUpperGrade) {
                // 하위등급에 해당 카테고리가 없는 경우
                let hasLowerGrade = false;
                for(let i = grade-1; i>0; i-- ) {
                  let lower_board = this.getBoardsUserGrade(i);
                  if(lower_board !== '') {
                    hasLowerGrade = true;
                  }
                }
                if(hasLowerGrade === false) {
                  return [];
                }
              }
            }        
            return cat_board;
          }
        }
    }
  }
</script>