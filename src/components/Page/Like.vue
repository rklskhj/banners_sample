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
      import LikeProduct from '@/components/Pages/LikeProduct.vue'
import LikePartner from '@/components/Pages/LikePartner.vue'
      import PageTab from "@/components/Components/Slot/PageTab.vue";

      export default {
        name: 'PageLike',
        components: {
          PageTab, 
          LikeProduct, LikePartner 
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
            pageName: '찜 목록',
            enablePage: false,
            componentName: 'LikeTab',
            boards: [{"id": 0, "name": "LikeProduct", "template_name": "", "route__id": 72049, "activated": true, "login_required": true, "grade": 1, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "상품", "tab_index": 0}, {"id": 1, "name": "LikePartner", "template_name": "", "route__id": 72049, "activated": true, "login_required": true, "grade": 1, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "파트너", "tab_index": 1}]
          }
        },

      }
    </script>
    