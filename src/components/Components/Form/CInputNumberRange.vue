<template>
  <div :style="containerStyle" class="full-width">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- input -->
    <div class="flex-between">
      <input v-if="visible === true" @blur="onBlurNumber" type="number" class="full-width" :style="inputStyle" placeholder="최저" v-model.number="temp">
      <input v-if="visible === false" @focus="onFocusText" type="text" class="full-width" :style="inputStyle" placeholder="최저" v-model="temp">
      <div style="padding:8px; flex-shrink:0">~</div>
      <input v-if="visible1 === true" @blur="onBlurNumber1" type="number" class="full-width" :style="inputStyle" placeholder="최고" v-model.number="temp1">
      <input v-if="visible1 === false" @focus="onFocusText1" type="text" class="full-width" :style="inputStyle" placeholder="최고" v-model="temp1">
  </div>
  </div>
</template>

<script>
import FormMixin from '@/components/Mixins/FormMixin';

export default {
  name: 'c-input-numberRange',
  props: {
    filterOptions: {
      type: Object
    }
  },
  components: {},
  mixins: [
    FormMixin
  ],
  data() {
    return {
      temp: '',
      temp1: '',
      visible: true,
      visible1: true,
      inputLowPrice: '',
      inputHighPrice: '',
    }
  },
  mounted() {
    if(this.value) {
      if (this.value[0] !== this.options.min) {
        this.temp = this.value[0];
      }
      if (this.value[1] !== this.options.max) {
        this.temp1 = this.value[1];
      }
      this.inputLowPrice = this.value[0];
      this.inputHighPrice = this.value[1];
    }
  },
  methods: {
    onBlurNumber() {
      this.visible = false;
      this.inputLowPrice = this.temp;
      this.temp = this.thousandSeprator(this.temp);
      this.$emit('update:value', [this.inputLowPrice, this.inputHighPrice])
    },
    onBlurNumber1() {
      this.visible1 = false;
      this.inputHighPrice = this.temp1;
      this.temp1 = this.thousandSeprator(this.temp1);
      this.$emit('update:value', [this.inputLowPrice, this.inputHighPrice])
    },
    onFocusText() {
      this.visible = true;
      this.temp = this.inputLowPrice;
    },
    onFocusText1() {
      this.visible1 = true;
      this.temp1 = this.inputHighPrice;
    },
    thousandSeprator(amount) {
      if (amount !== '' && amount !== undefined && amount !== 0 && amount !== '0' && amount !== null) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return amount;
      }
    }
  },
  watch: {
    'filterOptions.selectedValue'(n) {
      if (n === '') {
        this.temp = '';
        this.temp1 = '';
        this.inputLowPrice = '';
        this.inputHighPrice = '';
      }
    }
  }
}
</script>

<style lang="stylus" type="stylus" scoped>

</style>
