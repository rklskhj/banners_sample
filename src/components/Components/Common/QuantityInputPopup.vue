<template>
<div class="flex-between" :style="inputStyle">
  <div class="flex-center unselect"
    @click="clickDecrement">
    <i :style="iconLeftStyle" class="material-icons">remove</i>
  </div>

  <div class="unselect" :style="numberStyle" @click="clickNum">{{ inputValue }}</div>

  <div  class="flex-center unselect"
    @click="clickIncrement">
    <i :style="iconRightStyle" class="material-icons">add</i>
  </div>
  <sweet-modal ref="numModal" overlay-theme="dark">
    <modal @confirm="confirm" @cancel="$refs.numModal.close()">
      <template v-slot:header>수량 입력</template>
      <template v-slot:content>
        <input type="number" v-model.number="modalValue" />
      </template>
    </modal>
  </sweet-modal>
</div>
</template>

<script>
export default {
  name: "QuantityInputPopup",
  props: {
    value: {
      type: [String, Number],
      required: false
    },
    inputStyle: {
      type: Object,
      default: ()=> {
        return {
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          padding: '0 12px',
          height: '48px',
          width: '100%'
        }
      }
    },
    numberStyle: {
      type: Object,
      default: () => {
        return {
          fontSize: '14px',
          fontWeight: '600'
        }
      }
    },
    btnMinusStyle: {
      type: Object,
      default: () => {
        return {
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          backgroundColor: '#eeeeee',
          lineHeight: '24px',
          color: '#000',
          textAlign: 'center',
          fontSize: '18px'
        }
      }
    },
    btnPlusStyle: {
      type: Object,
      required: false,
      default: () => {
        return {
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          backgroundColor: '#eeeeee',
          lineHeight: '24px',
          color: '#000',
          textAlign: 'center',
          fontSize: '18px'
        }
      }
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    },
    disableState: {
      type: Boolean,
      required: false,
      default: undefined
    },
    numInput: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      inputValue: 0,
      modalValue: 0
    }
  },
  created() {
    if(this.value) {
      this.inputValue = this.value;
    }
  },
  watch: {
    value(n) {
      this.inputValue = n;
    },
    inputValue(n) {
      this.$emit('update:value', n);
    },
    modalValue(n) {
      if(n > this.max) {
        this.modalValue = this.max;
      }

      /*else if(n < this.min) {
        this.modalValue = this.min;
      }*/
    }
  },
  methods: {
    clickNum() {
      if(this.numInput) {
        this.modalValue = undefined;
        this.$refs.numModal.open();
      }
    },
    confirm() {
      if(this.modalValue) {
        this.inputValue = this.modalValue;
        this.$emit('update:value', this.inputValue)
      }
      this.$refs.numModal.close();
    },
    clickIncrement() {
      if(this.disableState!==undefined) {
        if(!this.disableState) this.inputValue += 1;
      }
      else {
        if(this.inputValue < this.max) {
          this.inputValue += 1;
        }
      }
      this.$emit('update:value', this.inputValue)
    },
    clickDecrement() {
      if(this.inputValue > this.min) {
        this.inputValue -= 1;
      }
      this.$emit('update:value', this.inputValue)
    }
  },
  computed: {
    iconLeftStyle() {
      // disabled style
      if (this.inputValue <= this.min) {
        if (this.btnMinusStyle) {
          let obj = this.cloneItem(this.btnMinusStyle);
          obj.backgroundColor = '#ddd';
          obj.color = '#bbb';
          obj.cursor = 'not-allowed';
          return obj;
        }
        else {
          return {
            width: '30px',
            height: '30px',
            marginRight: '8px',
            backgroundColor: '#ddd',
            color: '#bbb',
            cursor: 'not-allowed'
          }
        }
      }


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
      // disabled style
      if ((this.inputValue >= this.max) || this.disableState) {
        if (this.btnPlusStyle) {
          let obj = this.cloneItem(this.btnPlusStyle);
          obj.backgroundColor = '#ddd';
          obj.color = '#bbb';
          obj.cursor = 'not-allowed';
          return obj;
        }
        else {
          return {
            width: '30px',
            height: '30px',
            marginRight: '8px',
            backgroundColor: '#ddd',
            color: '#bbb',
            cursor: 'not-allowed'
          }
        }
      }

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
    }
  }
}
</script>
<style lang="stylus" scoped>
  input
    border 1px solid #dddddd
    border-radius 4px
    padding 12px
    width 100%
</style>
