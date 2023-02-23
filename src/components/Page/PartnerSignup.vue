<template>
          <transition name="fade">
    <component v-if="board" :is="componentName" @next="clickNext" @end="clickEnd" :value="value"></component>
  </transition>

</template>
<script>
          import WtPartnerAgreement from '@/components/Pages/WtPartnerAgreement.vue'
import WtPartnerPutName from '@/components/Pages/WtPartnerPutName.vue'
import WtPartnerPutEmail from '@/components/Pages/WtPartnerPutEmail.vue'
import WtPartnerVerify from '@/components/Pages/WtPartnerVerify.vue'
import WtPartnerPassword from '@/components/Pages/WtPartnerPassword.vue'
import WtPartnerSignupDone from '@/components/Pages/WtPartnerSignupDone.vue'
  export default {
    name: 'PagePartnerSignup',
    components: { 
      WtPartnerAgreement, WtPartnerPutName, WtPartnerPutEmail, WtPartnerVerify, WtPartnerPassword, WtPartnerSignupDone 
    },
    data() {
      return { 
        value: {},
        componentName: 'PartnerSignup',
        boards: [{"id": 536733, "name": "WtPartnerAgreement", "template_name": "", "route__id": 72086, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 0}, {"id": 536739, "name": "WtPartnerPutName", "template_name": "", "route__id": 72086, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": 0, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 1}, {"id": 536732, "name": "WtPartnerPutEmail", "template_name": "", "route__id": 72086, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 2}, {"id": 540217, "name": "WtPartnerVerify", "template_name": "", "route__id": 72086, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": 0, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 3}, {"id": 541103, "name": "WtPartnerPassword", "template_name": "", "route__id": 72086, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": 0, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 4}, {"id": 536730, "name": "WtPartnerSignupDone", "template_name": "", "route__id": 72086, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 5}],
        board: null
      }
    },
    mounted() {
      this.$emit('componentName');
    },
    watch: {
      '$route'() {
        this.init();
        this.findName();
      }
    },
    created() {
      this.init();
      this.findName();
    },
    methods: {
      init() {
        if (this.$route.fullPath.indexOf('step=')===-1) {
          let path = this.$route.fullPath;
          if(this.$route.fullPath.indexOf('?')>-1) {
            path = path.replace(`${this.$route.path}?`, `${this.$route.path}?step=0&`);
          } else {
            path = path.replace(`${this.$route.path}`, `${this.$route.path}?step=0`);
          }
          this.$router.replace(path);
        }
      },
      findName() {
        let step = this.$route.query.step ? this.$route.query.step : 0;
        this.board = null;
        setTimeout(()=>{
          this.board = this.boards.filter(item=>{
            return item.tab_index === Number(step)
          })[0];

          if(this.board.template_name !== '') {
            this.componentName = this.dashToPascal(`${this.board.template_name}${this.board.name}`);
          } else {
            this.componentName = this.board.name;
          }
          this.$emit('componentName',this.componentName);
        },300);
      },
      clickNext() {
        let step = Number(this.$route.query.step);
        if(this.boards.length-1 > step) {
          this.routerPush(`${this.$route.fullPath.replace('step=' + step, 'step=' + (step+1) )}`);
        }
      },
      clickEnd() {
        let step = Number(this.$route.query.step);
        this.routerPush(`${this.$route.fullPath.replace('step=' + step, 'step=' + (this.boards.length-1) )}`);
      }
    }
}
</script>
<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
