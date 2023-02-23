<template>
          <div class="flex-justify position-relative">
            <div :style="pcMaxWidth">
              <transition name="fade">
    <component v-if="board" :is="componentName" @next="clickNext" @end="clickEnd" :value="value"></component>
  </transition>
      
            </div>
          </div>
        
</template>
<script>
          import WtSignupPc from '@/components/Pages/WtSignupPc.vue'
import WtAgreementPc from '@/components/Pages/WtAgreementPc.vue'
import WtPutNamePc from '@/components/Pages/WtPutNamePc.vue'
import WtPutEmailPc from '@/components/Pages/WtPutEmailPc.vue'
import WtVerifyPc from '@/components/Pages/WtVerifyPc.vue'
import WtPasswordPc from '@/components/Pages/WtPasswordPc.vue'
import WtSignupDonePc from '@/components/Pages/WtSignupDonePc.vue'
  export default {
    name: 'PageSignup',
    components: { 
      WtSignupPc, WtAgreementPc, WtPutNamePc, WtPutEmailPc, WtVerifyPc, WtPasswordPc, WtSignupDonePc 
    },
    data() {
      return { 
        value: {},
        componentName: 'Signup',
        boards: [{"id": 536533, "name": "WtSignupPc", "template_name": "", "route_pc__id": 72047, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 0}, {"id": 536527, "name": "WtAgreementPc", "template_name": "", "route_pc__id": 72047, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 1}, {"id": 536528, "name": "WtPutNamePc", "template_name": "", "route_pc__id": 72047, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": 0, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 2}, {"id": 536536, "name": "WtPutEmailPc", "template_name": "", "route_pc__id": 72047, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 3}, {"id": 536534, "name": "WtVerifyPc", "template_name": "", "route_pc__id": 72047, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 4}, {"id": 536535, "name": "WtPasswordPc", "template_name": "", "route_pc__id": 72047, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 5}, {"id": 536524, "name": "WtSignupDonePc", "template_name": "", "route_pc__id": 72047, "activated": true, "login_required": false, "grade": null, "partner_grade": null, "order_conversion_type": null, "category1": null, "category2": null, "category3": null, "tab_name": "회원가입", "tab_index": 6}],
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
