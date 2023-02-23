<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 인풋 -->
    <div class="flex-align
                full-width
                position-relative">

      <!-- 아이콘 -->
      <!--<i v-if="styles.textarea.icon.enable"
        class="material-icons"
        :style="iconStyle">
        {{ properties.icon }}
      </i>-->

      <!-- input -->
      <textarea
          ref="input"
          class="input"
          :style="inputStyle"
          :rows="rows"
          :value="value"
          @keyup.enter="$emit('onEnter')"
          @keyup="onKeyup" @blur="chkValid"
          :placeholder="placeholder"
          :readonly="disabled===true"></textarea>


      <!-- 삭제 아이콘 -->
      <i v-if="deleteIcon
              && value"
         class="material-icons"
         :style="deleteIconStyle"
         @click="clear">
        clear
      </i>

    </div>

    <!-- 에러메세지 -->
    <div v-if="errorMsg!==''"
         :style="errorStyle"
         class="lp-error-msg">{{ errorMsg }}</div>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-textarea',
    mixins: [
      FormMixin
    ],

    props: {
      type: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false
      },
      deleteIcon: {
        type: Boolean,
        required: false
      },
      validate: {
        type: Object,
        required: false
      },
      rows: {
        type: Number,
        required: false,
        default: 7
      }
    },

    mounted() {
      if(this.validate) {
        this.valid = this.validate;
      }
    },

    data() {
      return {
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
        }
      };
    },

    computed: {
      iconStyle() {
        let styles = this.cloneItem(this.styles.input.icon);
        let deco = this.decoToStyle(styles);
        deco.position = 'absolute';
        if (this.styles[this.type].icon.direction==='left') deco.right = 'unset';
        else if (this.styles[this.type].icon.direction==='right') deco.left = 'unset';
        return deco;
      },

      deleteIconStyle() {
        let deco = {};
        /*let styles = this.cloneItem(this.styles.input.deleteIcon);
        let deco = this.decoToStyle(styles);
        deco.position = 'absolute';*/
        return deco;
      },
      errorStyle() {
        let deco = {
          color: this.brandBgColor.alert
        };
        return deco;
      }
    },

    methods: {
      onKeyup(e) {
        this.inputValue = e.target.value;
        this.$emit('update:value', this.inputValue);
      },
      chkValid() {
        // validation이 필수가 아닌 경우
        if (!this.valid.valid_required) return;

        let props = {
          value: this.value,
          type: this.type,
          validate: this.valid
        }

        this.errorMsg = this.isValid(props, this.name);
        this.validate.error_msg = this.errorMsg;
        // this.valid.error_msg = this.errorMsg;
      },
      clear () {
        this.inputValue = '';
        this.$emit('update:value', this.inputValue);
      }

    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .c-input-textarea-container
    width 100%

  .label
    display block

  input
    border 0
    flex 1
    font-family inherit

  textarea:focus
  input:focus
    outline none

  .lp-error-msg
    color #e80000
    font-size 0.7rem
    margin-top 4px

  textarea
    width 100%
    height 100%
    overflow-y auto
    border 0
    resize none
    font-family inherit
</style>
