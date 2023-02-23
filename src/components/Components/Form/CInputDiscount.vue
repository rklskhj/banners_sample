<template>
  <div :style="containerStyle">
    <div>
      <div class="flex-align" @click="selectRadioButton(0)" style="margin-top: 8px">
        <div class="outer" :style="outerStyle()">
          <div v-if="selectedValue === 0" class="inner" :style="innerStyle()"></div>
        </div>
        <div class="flex-align">
          할인율
          <div class="flex-align position-relative" style="margin-left: 8px; margin-right: 3.8px">
            <div class="flex-align" :style="disableStyle">
              <div v-if="prefix" :style="brandColor.brand" style="padding-right: 8px">{{ prefix }}</div>
              <input
                class="input"
                :class="{'input-disabled': selectedValue === 1}"
                :style="computedInputStyle"
                ref="input"
                type="number"
                :value="discountRateInputValue"
                min="0"
                :maxlength="maxLength"
                @keyup.enter="$emit('onEnter')"
                @blur="chkValid"
                :placeholder="placeholder"
                @input="e => onKeyupRateValue(e.target.value)"
                :readonly="selectedValue===1"
              />
            </div>
          </div>%
        </div>
      </div>
      <div class="flex-align" @click="selectRadioButton(1)" style="margin-top: 8px">
        <div class="outer" :style="outerStyle()">
          <div v-if="selectedValue === 1" class="inner" :style="innerStyle()"></div>
        </div>
        <div class="flex-align">
          금액할인
          <div class="flex-align position-relative" style="margin-left: 8px; margin-right: 3.8px">
            <div class="flex-align" :style="disableStyle">
              <div v-if="prefix" :style="brandColor.brand" style="padding-right: 8px">{{ prefix }}</div>
              <input
                class="input"
                :class="{'input-disabled': selectedValue === 0}"
                :style="computedInputStyle"
                ref="input"
                type="number"
                :value="discountPriceInputValue"
                min="0"
                :maxlength="maxLength"
                @keyup.enter="$emit('onEnter')"
                @blur="chkValid"
                :placeholder="placeholder"
                @input="e => onKeyupPriceValue(e.target.value)"
                :readonly="selectedValue===0"
              />
            </div>
          </div>원
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import FormMixin from '@/components/Mixins/FormMixin'

export default {
  name: "c-input-discount",
  mixins: [FormMixin],
  props: {
    type: {
      type: String,
      required: false,
      default: "text"
    },
    validate: {
      type: Object,
      required: false
    },
    prefix: {
      type: String,
      required: false
    },
    containStyle: {
      type: Object,
      required: false
    },
    discountInputCustomStyle: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      discountRateInputValue: "",
      discountPriceInputValue: "",
      selectedValue: 0,
      computedInputStyle: undefined
    };
  },
  mounted() {
    this.computeInputStyle();
  },
  methods: {
    computeInputStyle() {
      let deco = this.inputStyle;
      if (this.discountInputCustomStyle) {
        deco = this.discountInputCustomStyle;
      }

      /*let color = this.getColor('기본 테두리선 색상');
        if(this.errorMsg !== '') {
         color = this.brandBgColor.alert.backgroundColor;
        }

        switch (this.formType && this.formType.input) {
          case 'round':
            deco.borderRadius = this.radius.borderRadius;
            deco.border = `1px solid ${color}`;
            break;
          case 'underline':
            deco.borderBottom = `1px solid ${color}`;
            break;
        }*/

      if (this.$store) {
        deco.fontFamily = this.$store.getters.brand.font;
      }

      this.computedInputStyle = deco;
    },
    selectRadioButton(value) {
      this.selectedValue = value;
      this.$emit("update:value", {
        ...this.value,
        discount_type: this.selectedValue
      });
    },
    outerStyle() {
      let deco = {
        width: "18px",
        height: "18px",
        margin: "0px 8px 0px 0px",
        border: "1px solid " + this.getColor("기본 테두리선 색상"),
        backgroundColor: this.brandBgColor.white.backgroundColor,
        cursor: "pointer"
      };

      return deco;
    },

    innerStyle() {
      let deco = {
        width: "8px",
        height: "8px",
        backgroundColor: this.brandBgColor.brand.backgroundColor,
        cursor: "pointer"
      };

      return deco;
    },
    onKeyupRateValue(value) {
      this.discountRateInputValue = value;

      if (this.type === "phone") {
        this.discountRateInputValue = autoHyphenPhone(
          this.discountRateInputValue
        );
      }
      // 숫자 타입일 때, 최대값이 설정된 경우 그 값이상 못 올라가도록 설정
      else if (this.type === "number") {
        this.discountRateInputValue.replace("-", "");
        let max = this.validate.max_length;
        if (max && max > 0) {
          if (parseInt(this.discountRateInputValue) > max) {
            this.discountRateInputValue = max;
          }
        }
      }

      this.$emit("update:value", {
        ...this.value,
        discount_rate: parseInt(this.discountRateInputValue)
      });
    },
    onKeyupPriceValue(value) {
      this.discountPriceInputValue = value;

      if (this.type === "phone") {
        this.discountPriceInputValue = autoHyphenPhone(
          this.discountPriceInputValue
        );
      }
      // 숫자 타입일 때, 최대값이 설정된 경우 그 값이상 못 올라가도록 설정
      else if (this.type === "number") {
        this.discountPriceInputValue.replace("-", "");
        let max = this.validate.max_length;
        if (max && max > 0) {
          if (parseInt(this.discountPriceInputValue) > max) {
            this.discountPriceInputValue = max;
          }
        }
      }

      this.$emit("update:value", {
        ...this.value,
        discount_price: parseInt(this.discountPriceInputValue)
      });
    },
    chkValid() {
      // validation이 필수가 아닌 경우
      if (!this.validate.valid_required) return;

      let props = {
        value: this.value,
        type: this.type,
        validate: this.validate
      };

      this.errorMsg = this.isValid(props, this.name);
      this.validate.error_msg = this.errorMsg;
      // this.valid.error_msg = this.errorMsg;
      this.computeInputStyle();
    }
  },
  computed: {
    maxLength() {
      if (this.validate)
        return this.validate.max_length ? this.validate.max_length : 50;
    },
    disableStyle() {
      return {
        borderRadius: this.inputStyle.borderRadius
          ? this.inputStyle.borderRadius
          : "0",
        backgroundColor: this.brandBgColor.sub
      };
    }
  }
};
</script>

<style lang="stylus" type="stylus" scoped>
input
  border 0
  flex 1
  background-color white
  -webkit-appearance none
  -webkit-border-radius 0

.outer
  border-radius 50%
  display flex
  align-items center
  justify-content center
  width 18px
  height 18px

.inner
  border-radius 50%
  width 10px
  height 10px

.input-disabled
  background-color #eee !important
</style>
