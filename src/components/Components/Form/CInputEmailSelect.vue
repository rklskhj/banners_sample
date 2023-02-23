<template>
  <div class="c-input-email-select-container" :style="containerStyle">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- <c-input-text v-bind="$props"
                  :value.sync="inputValue"
                  :formType="formType"
                  :inputCustomStyle="inputCustomStyle"></c-input-text> -->

    <div class="flex">

      <!-- 아이디 인풋 -->
      <div style="width:47%">

        <!-- 인풋 -->
        <div class="flex-align
                    full-width
                    position-relative">

          <!-- input -->
          <div
            class="flex-align full-width"
            :class="{'input-disabled': disabled===true}">

            <input
              class="input full-width"
              :style="computedInputStyle"
              ref="input"
              type="text"
              :value="inputValue"
              :maxlength="maxLength"
              :placeholder="placeholder"
              @keyup="checkEmailValue"
              @input="e => onKeyup(e.target.value)"
              :readonly="disabled===true">
          </div>

          <!-- 삭제 아이콘 -->
          <!-- <i v-if="deleteIcon
                  && value"
            class="material-icons unselect"
            :style="deleteIconStyle"
            @click="clear">clear</i> -->

        </div>


      </div>

      <div class="flex-center" style="width:6%; color:#999; margin:0 4px;">@</div>

      <!-- 이메일 직접입력 -->
      <!-- <div v-if="showEmailSelf"  style="width:47%">
        <input
          type="text" class="full-width"
          placeholder="직접 입력"
          v-model="emailSelf"
          @blur="checkEmailValue"
          :style="computedInputStyle">
      </div> -->
      <!-- 이메일 드롭다운 -->
      <div style="width:47%"
          class="dropdown position-relative unselect full-width" ref="dropdown"
          :style="dropdown"
          @click.stop.prevent="isOpen=!isOpen">

        <span v-if="selectedEmail && !showEmailSelf" style="margin-right: 5px;"
        >{{ selectedEmail }}</span>

        <input v-if="showEmailSelf"
          type="text" class="full-width"
          placeholder="직접 입력"
          v-model="emailSelf"
          @keyup="checkEmailValue"
          @blur="checkEmailValue"
          :style="computedInputStyle">

        <i :style="brandColor.sub" class="material-icons drop-icon"
          @click.stop.prevent="isOpen=!isOpen">
          {{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
        <!-- List -->
        <ul v-if="isOpen && formType.dropdown !== 'modal'"
        class="dropdown-list position-absolute"
        v-click-outside="clickOutside">
          <li class="item unselect"
              v-for="(item, idx) in emailList"
              :key="idx"
              :style="[brandColor.main, brandBgColor.main]"
              @click.stop.prevent="clickItem(item)"
              @mouseover="mouseOverIndex=idx"
              @mouseleave="mouseOverIndex=undefined;">
            {{ item.value }}
          </li>
        </ul>
      </div>

    </div>

    <!-- 에러메세지 -->
    <div v-if="errorMsg!=='' && !formType.vErrorNotShown"
        :style="errorStyle"
        class="lp-error-msg">{{ errorMsg }}
    </div>

  </div>
</template>

<script>
  import CInputText from "./CInputText.vue";
  import FormMixin from '@/components/Mixins/FormMixin'
  import ClickOutside from 'vue-click-outside'
  export default {
    components: {CInputText},
    name: "c-input-email-select",
    directives: {
      ClickOutside
    },
    mixins:[
      FormMixin
    ],
    props: {
      value: {
        type: [String, Number],
        required:false
      },
      label: {
        type: String,
        required: false
      },
      placeholder: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false
      },
      visibleTitle: {
        type: Boolean,
        required: false
      },
      validate: {
        type: Object,
        required: false
      },
      name: {
        type: String,
        required: true
      }
    },
    created() {
      if(this.value) {
        this.setValue();
      }

      this.computeInputStyle();

      if(this.validate) {
        this.valid = this.validate;
      }
    },
    watch: {
      value(n) {
        this.setValue();
        // this.inputValue = n;
      },
      // inputValue(n) {
      //   // this.$emit('update:value', n);
      //   this.checkEmailValue();
      // }
    },
    data() {
      return {
        type: 'email',

        // 아이디 인풋
        inputValue: '',
        errorMsg: '',

        // 이메일 드롭다운
        selectedEmail: '',
        showEmailSelf: false,
        emailSelf: '',
        isOpen: false,
        emailList: [
          {
            value: '직접 입력'
          },
          {
            value: 'gmail.com'
          },
          {
            value: 'naver.com'
          },
          {
            value: 'daum.net'
          },
          {
            value: 'hanmail.net'
          },
          {
            value: 'nate.com'
          },
          {
            value: 'hotmail.com'
          },
          {
            value: 'msn.com'
          },
        ],

        computedInputStyle: {}
      }
    },
    computed: {
      maxLength() {
        if (this.validate)
          return this.validate.max_length ? this.validate.max_length : 50;
      },
      dropdown() {
        if (this.showEmailSelf) return this.noneStyle;
        else return this.dropdownStyle;
      },
      noneStyle() {
        return {
          padding: 0,
          border: 'none'
        }
      }
    },
    methods: {
      setValue() {
        let valueArr = this.value.split('@');
        if (valueArr.length===2) {
          // 아이디
          this.inputValue = valueArr[0];
          // 이메일
          let targetArr = this.emailList.filter(item => {return item.value===valueArr[1]});
          if (targetArr.length===0) {
            this.emailSelf = valueArr[1];
            this.showEmailSelf = true;
          }
          else {
            this.selectedEmail = valueArr[1];
            this.showEmailSelf = false;
          }
        }
      },

      // checkEmail
      checkEmailValue() {
        let email = '';
        if (this.showEmailSelf) {
          email = this.emailSelf;
        }
        else email = this.selectedEmail;

        let result = `${this.inputValue}@${email}`;

        if (!this.validate.valid_required) return;

        let props = {
          value: result,
          type: this.type,
          validate: this.validate
        }

        this.errorMsg = this.isValid(props, this.name);
        this.validate.error_msg = this.errorMsg;
        this.computeInputStyle();

        // 이메일 검사 완료
        if (!this.errorMsg) {
          this.isOpen = false;
          this.$emit('update:value', result);
        }
      },
      onKeyup(value) {
        this.inputValue = value;
        this.computeInputStyle();

        // this.checkEmailValue();
        // this.$emit('update:value', this.inputValue);
      },

      computeInputStyle() {
        let deco = this.inputStyle;
        let color = this.getColor('기본 테두리선 색상');
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
        }

        this.computedInputStyle = deco;
      },

      errorStyle() {
        let deco = {
          color: this.brandBgColor.alert
        };
        return deco;
      },

      clickItem(item) {
        if (item.value==='직접 입력') {
          this.emailSelf = '';
          this.showEmailSelf = true;
        }
        else {
          this.showEmailSelf = false;
          this.selectedEmail = item.value;
        }
        this.isOpen = false;
        this.checkEmailValue();
      },

      clickOutside() {
        this.isOpen = false;
      }

    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .c-input-email-select-container
    width 100%

  .label
    display block

  input
    border 0
    flex 1
    background-color transparent !important
    -webkit-appearance 'none'
    -webkit-border-radius 0

  textarea:focus
  input:focus
    outline none

  .lp-error-msg
    color #e80000
    font-size 0.7rem
    margin-top 4px
    width: 100%

  .input-disabled
    border 1px solid #eee
    background-color #eee
    color #777

  .dropdown-list
    z-index 1
    border 1px solid #f2f3f2
    top 42px
    left 0
    width 100%
    & li
      padding 4px 16px

  .drop-icon
    position absolute
    top 9px
    right 6px

</style>
