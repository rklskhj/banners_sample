<template>
  <div style="margin-top:24px">
    <div class="position-relative">
      <!--remove autocomplete-->
      <input style="display:none" aria-hidden="true">
      <input type="password" style="display:none" aria-hidden="true">
      <!--End remove autocomplete-->
      <input class="input-password-re" type="password" :style="inputStyle"
            autocomplete="new-password"
             v-model="inputValue" @keyup="chkValid" :placeholder="placeholder" maxlength="30"
             @input="e => inputValue = e.target.value"
             @keyup.enter="$emit('onEnter')">
      <template v-if="valid !== 'not'">
        <div class="size-12" :style="`margin:4px 0;color:${statusColor}`">
          {{valid === 'wrong' ? '일치하는 비밀번호를 입력해주세요.' : valid === 'ok' ? '비밀번호가 일치합니다.' : ''}}
        </div>
        <i class="material-icons position-absolute" :style="`top:16px;right:16px;color:${statusColor}`">
          {{ valid === 'wrong' ? 'error_outline' : valid === 'ok' ? 'check' : '' }}</i>
      </template>
    </div>
  </div>
</template>

<script>
  import CInputText from "./CInputText.vue";
  import FormMixin from "@/components/Mixins/FormMixin";

  export default {
    components: {CInputText},
    name: "c-input-password-re",
    mixins: [
      FormMixin
    ],
    props: {
      password: {
        type: String
      },
      value: {
        type: String,
        required: false
      },
      label: {
        type: String,
        required: false
      },
      visibleTitle: {
        type: Boolean,
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
      name: {
        type: String,
        required: false
      }
    },
    watch: {
      inputValue(n) {
        this.$emit('update:value', n);
      }
    },
    data() {
      return {
        inputValue: '',
        valid: 'not'     // not, wrong, ok
      }
    },
    methods: {
      chkValid() {
        if (this.inputValue === '' || this.inputValue.length <= 1) {
          this.valid = 'not';
        } else if (this.inputValue !== this.password) {
          this.valid = 'wrong';
        } else {
          this.valid = 'ok';
        }
        this.$emit('valid', this.valid);
      }
    },
    created() {
      if (this.value) this.inputValue = this.value;
    },
    computed: {
      inputStyle() {
        let deco = {
          padding: '0 12px',
          fontSize: '16px',
          height: '54px',
          lineHeight: '54px',
          borderRadius: '8px',
          width: '100%'
        };
        deco.border = this.statusBorder;
        return deco;
      },
      statusColor() {
        let color = '';
        switch (this.valid) {
          case 'not':
            color = this.brandColor.main.color;
            break;
          case 'wrong':
            color = '#e74a4a';
            break;
          case 'ok':
            color = '#3ED00B';
            break;
        }
        return color;
      },
      statusBorder() {
        let border = '';
        switch (this.valid) {
          case 'not':
            border = this.brandBorder.main.border;
            break;
          case 'wrong':
            border = '1px solid #e74a4a';
            break;
          case 'ok':
            border = '1px solid #3ED00B';
            break;
        }
        return border;
      }
    }
  }
</script>
<style lang="stylus">
  .input-password-re
    font-family inherit
  .input-password-re::placeholder
    color #bdbdbd
</style>