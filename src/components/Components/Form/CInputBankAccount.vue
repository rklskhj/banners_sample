<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div class="c-input-bank-account-wrap">
      <!--<div style="margin:0 8px 8px 0;width:calc(50% - 8px)">
        <select :style="inputStyle" v-model="bank.value">
          <option v-for="(bank,idx) in banks" :key="'bank-'+idx"
                  :value="bank.value">{{ bank.label }}
          </option>
        </select>
      </div>-->
      <c-input-dropdown :options="banks"
                        @update:value="val => bank.bank = val"
                        placeholder="은행선택"></c-input-dropdown>
      <div style="margin-top:4px">
        <input :value="bank.name"
               @input="e => bank.name = e.target.value"
               placeholder="계좌주"
               type="text"
               :style="inputStyle">
        <input :value="bank.account_num"
               @input="e => bank.account_num = e.target.value"
               type="text"
               placeholder="계좌번호"
               :style="inputStyle">
      </div>
    </div>


  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import CInputDropdown from "./CInputDropdown.vue";

  export default {
    components: {CInputDropdown},
    name: 'c-input-bank-account',

    data() {
      return {
        banks: [],
        bank: {
          bank: '',
          name: '',
          account_num: ''
        }
      };
    },

    mixins: [
      FormMixin
    ],

    props: {
      label: {
        type: String,
        required: false
      },
      data: {
        type: Object,
        required: false
      },
    },

    created() {
      /*this.request.public.get('banks').then( res => {
        this.banks = res.data;
        this.banks.splice(0,0, {label:'은행선택', value:''});
      });*/
      this.$axios.get('public/banks').then(res => {
        this.banks = res.data;
        this.banks.splice(0, 0, {label: '은행선택', value: ''});
      })
    },

    watch: {
      data(n) {
        this.bank = n;
      },
      bank: {
        handler(n) {
          this.$emit('update:value', n);
        },
        deep: true
      }
    },

    methods: {}
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .c-input-bank-account-wrap
    display flex
    flex-wrap wrap


</style>
