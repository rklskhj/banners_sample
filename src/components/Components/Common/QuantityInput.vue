<template>
  <div class="flex-align" :style="wrapStyle">
    <div class="flex-center unselect"
        :style="{cursor: active && min !== inputValue ? 'pointer' : 'not-allowed'}"
         @click="clickRemove">
      <i :style="iconLeftStyle" class="material-icons">remove</i>
    </div>

    <input type="number" :style="inputNumberStyle"
           :value="inputValue" :disabled="disabled"/>

    <div class="flex-center unselect"
          :style="{cursor: active ? 'pointer' : 'not-allowed'}"
          @click="clickAdd">
      <i :style="iconRightStyle" class="material-icons">add</i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "QuantityInput",
    props: {
      value: {
        type: [String, Number],
        required: false
      },
      inputStyle: {
        type: Object,
        required: false
      },
      btnMinusStyle: {
        type: Object,
        required: false
      },
      btnPlusStyle: {
        type: Object,
        required: false
      },
      min: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 100
      },
      disabled: {
        type: Boolean,
        default: false
      },
      active: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        inputValue: '',
      }
    },
    created() {
      if(this.value) this.inputValue = this.value;
    },
    watch: {
      value(n) {
        this.inputValue = n;
      },
      inputValue(n) {
        this.$emit('update:value', n);
      }
    },
    methods: {
      clickAdd() {
        if (this.active) {
          if(this.inputValue < this.max) {
            this.inputValue += 1;
          } else {
            this.toast('최대 주문 수량입니다.')
          }
          this.$emit('update:value', this.inputValue)
        } else {
          return;
        }
      },
      clickRemove() {
        if (this.active) {
          if(this.inputValue > this.min) {
            this.inputValue -= 1;
          } else {
            this.toast('최소 수량입니다.');
          }
          this.$emit('update:value', this.inputValue)
        } else {
          return;
        }
      }
    },
    computed: {
      iconLeftStyle() {
        if(this.btnMinusStyle) {
          return this.btnMinusStyle;
        }
        else {
          return {
            width: '30px',
            height: '30px',
            marginRight: '8px'
          }
        }
      },
      iconRightStyle() {
        if(this.btnPlusStyle) {
          return this.btnPlusStyle;
        }
        else {
          return {
            width: '30px',
            height: '30px',
            marginLeft: '8px'
          }
        }
      },
      inputNumberStyle() {
        if(this.inputStyle) {
          return this.inputStyle;
        } else {
          return {
            width: '33px',
            height: '30px',
            textAlign:'right',
            paddingRight:'6px'
          };
        }
      },
      wrapStyle() {
        if (this.active) {
          return {
            width: 'fit-content',
            backgroundColor: 'transparent',
            color: this.brandColor.main.color
          }
        } else {
          return {
            width: 'fit-content',
            backgroundColor: '#f3f3f3',
            color: '#b9b9b9'
          }
        }
      }
    }
  }
</script>

<style scoped>
  input {
    background-color: transparent;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>