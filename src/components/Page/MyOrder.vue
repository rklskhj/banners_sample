<template>
<div class="tab-page" style="min-height:100vh">
  
        <page-tab v-if="computedBoards.length>1" :tabs="computedBoards" device="mobile">
          <template v-for="(board, idx) in computedBoards">
            <component :key="idx" :slot="board.name" :is="getName(board)"></component>
          </template>
        </page-tab>
        <component v-else :is="getName(computedBoards[0])"></component>
    
</div>
    </template>
    <script>
      import MyOrderCall from '@/components/Pages/MyOrderCall.vue'
      import PageTab from "@/components/Components/Slot/PageTab.vue";

      export default {
        name: 'PageMyOrder',
        components: {
          PageTab, 
          MyOrderCall 
        },
        activated() {
          if (Object.keys(this.$route.query).length === 0) {
            this.$router.replace(`${this.$route.path}?tab_id=0`);
          }
        },
        mounted() {
          this.$emit('componentName');
          if(this.computedBoards.length === 0) {
            this.$router.replace('/signin');
          }
        },
        computed: {
          computedBoards() {
            if(!this.isLogin) {
              return this.boards.filter(item=>{
                return !item.login_required;
              });
            } else {
              return this.boards;
            }
          }
        },
        methods: {
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
        },
        data() {
          return {
            pageName: '내 주문 내역',
            enablePage: false,
            componentName: 'MyOrderTab',
            boards: [{"id": 0, "name": "MyOrderCall", "template_name": "", "route__id": 72042, "activated": true, "login_required": true, "grade": null, "partner_grade": null, "order_conversion_type": 1, "category1": null, "category2": null, "category3": null, "tab_name": "전화연결", "tab_index": 4}]
          }
        },

      }
    </script>
    