<template>
  <div :style="containStyle ? containStyle : containerStyle">
    <!-- 레이블 -->
    <div class="flex-align" v-if="formType.label && label">
      <div :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
      <div v-if="type==='number'">
        <div v-if="validate.enable_option"
             :style="[labelStyle,brandColor.help]" style="padding-left:4px">({{ validate.min }}~{{ validate.max }} 사이 숫자만 입력)</div>
        <div v-else
             :style="[labelStyle,brandColor.help]" style="padding-left:4px">(숫자만 입력)</div>
      </div>
    </div>
    <!-- description -->
    <div v-if="formType.description && description">
      <div :style="descriptionStyle">{{ description }}</div>
    </div>

    <!-- 인풋 -->
    <div class="flex-align full-width position-relative">
      <!-- 아이콘 -->
      <!--<i v-if="icon.enable"
        class="material-icons"
        :style="iconStyle">
        {{ properties.icon }}
      </i>-->

      <!-- input -->
      <div
        class="flex-align full-width"
        :class="{'input-disabled': disableStatus===true}"
        :style="disableStyle"
      >
        <div v-if="prefix" :style="brandColor.brand" style="padding-right: 8px">{{ prefix }}</div>

        <input
          class="input"
          :style="computedInputStyle"
          ref="input"
          :type="type"
          :value="inputValue"
          min="0"
          :maxlength="maxLength"
          @keyup="chkValid"
          @keyup.enter="$emit('onEnter')"
          @blur="chkValid"
          :placeholder="placeholder"
          @input="e => onKeyup(e.target.value)"
          :readonly="disableStatus===true"
        />

        <div v-if="formType.unit && unit" :style="unitStyle" style="margin-left: 8px">{{ unit }}</div>

      </div>

      <!-- 삭제 아이콘 -->
      <i
        v-if="deleteIcon
              && value"
        class="material-icons unselect"
        :style="deleteIconStyle"
        @click="clear"
      >clear</i>
    </div>

    <!-- 에러메세지 -->
    <div
      v-if="errorMsg!=='' && !formType.vErrorNotShown"
      :style="errorStyle"
      class="lp-error-msg"
    >{{ errorMsg }}</div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin';

  export default {
    mixins: [
      FormMixin
    ],

    props: {
      type: {
        type: String,
        required: false,
        default: 'text'
      },
      deleteIcon: {
        type: Boolean,
        required: false
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
      isBiz: {
        type: Boolean,
        default: false
      }
    },

    created() {
      if(this.value) {
        this.inputValue = this.value;
        if(this.type === 'number') {
          if(typeof(this.inputValue) === String) {
            this.inputValue = this.inputValue.replace(/-/gi, '');
          }
        }
      }
    },

    mounted() {
      this.computeInputStyle();
      if(this.validate) {
        this.valid = this.validate;
      }

      this.disableStatus = this.disabled;

      // 회원가입, 내 정보 수정에서 password 및 아이디 자동 기입 방지 목적
      if(this.$route.path.indexOf('profile') > -1 || this.$route.path.indexOf('signup') > -1 && !this.disabled) {
        this.disableStatus = true;
        setTimeout(()=>{
          this.disableStatus = false;
        },500)
      }
    },

    data() {
      return {
        disableStatus: false,
        inputValue: '',
        errorMsg: '',
        keyup: false,
        valid: {
          valid_required: false,
          error_msg: '',
          max_length:100,
          min_length:0,
          alpha_s: true,
          alpha_g: true,
          special: true,
          num: true
        },
        computedInputStyle: undefined,
        minMsg: ''
      };
    },

    watch: {
      disabled(n) {
        this.disableStatus = n;
      },
      value(n) {
        this.inputValue = n;
      }
    },

    computed: {
      maxLength() {
        if (this.validate)
          return this.validate.max_length ? this.validate.max_length : 50;
        else
          return 50;
      },
      inputFormStyle() {
        let deco = {};
        deco.color = this.inputStyle.color;
        return deco;
      },
      iconStyle() {
        let styles = this.cloneItem(this.styles.input.icon);
        let deco = this.decoToStyle(styles);
        deco.position = 'absolute';
        if (this.styles[this.type].icon.direction==='left') deco.right = 'unset';
        else if (this.styles[this.type].icon.direction==='right') deco.left = 'unset';
        return deco;
      },

      errorStyle() {
        let deco = {
          color: this.brandBgColor.alert
        };
        return deco;
      },
      disableStyle() {
        return {
          borderRadius: this.inputStyle.borderRadius ? this.inputStyle.borderRadius : '0'
        }
      }
    },

    methods: {
      computeInputStyle() {
        let deco = this.inputStyle;

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

        deco.fontfamily = 'Noto Sans CJK kr';

        this.computedInputStyle = deco;
      },
      onKeyup(value) {
        this.inputValue = value;

        if (this.type === 'phone') {
          this.inputValue= autoHyphenPhone(this.inputValue);
        }
        if (this.isBiz) {
          this.inputValue = autoHyphenBiz(this.inputValue);
        }
        // 숫자 타입일 때, 최대값이 설정된 경우 그 값이상 못 올라가도록 설정
        else if(this.type === 'number') {
          if(this.validate && this.validate.enable_option) {
            this.inputValue.replace('-','');
            let min = this.validate.min;
            let max = this.validate.max ? this.validate.max : this.validate.max_length;
            if(min && min > 0) {
              if(min > parseInt(this.inputValue)) {
                this.minMsg = `${min} 이상의 숫자를 입력해주세요`
              }
              else this.minMsg = '';
            }

            if(max && max > 0) {
              if(parseInt(this.inputValue) > max) {
                this.inputValue= max;
                this.toast(`최대 ${max}까지의 숫자만 입력할 수 있습니다`)
              }
            }
          }
        }

        this.$emit('update:value', this.inputValue);
      },
      chkValid() {
        if(this.minMsg) this.errorMsg = this.minMsg;
        else this.errorMsg = '';
        // validation이 필수가 아닌 경우
        if (!this.validate || !this.validate.valid_required) return;

        let props = {
          value: this.value,
          type: this.type,
          validate: this.validate
        }

        this.errorMsg = this.isValid(props, this.name);
        this.validate.error_msg = this.errorMsg;
        // this.valid.error_msg = this.errorMsg;
        this.computeInputStyle();
      },
      clear() {
        this.inputValue = '';
        this.$emit('update:value', this.inputValue);
      }

    }
  }
</script>

<style lang="stylus">
  .input
    font-family inherit
  .input::placeholder
    color #bdbdbd
</style>

<style lang="stylus" type="stylus" scoped>

  .c-input-text-container
    width 100%

  .label
    display block

  input
    border 0
    flex 1
    background-color transparent
    -webkit-appearance 'none'
    -webkit-border-radius 0
    font-family inherit

  textarea:focus
  input:focus
    outline none

  .lp-error-msg
    color #e80000
    font-size 0.7rem
    margin-top 4px
    width: 100%

  textarea
    width 100%
    height 100%
    overflow hidden
    border 0
    resize none

  .input-disabled
    background-color #eee
    color #777
    visibility hidden

</style>
