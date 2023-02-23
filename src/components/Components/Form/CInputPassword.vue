<template>
  <c-input-text v-bind="$props"
                :formType="formType"
                :value.sync="inputValue"
                type="password"
                @onEnter="$emit('onEnter')"></c-input-text>
</template>

<script>
  import CInputText from "./CInputText.vue";
  import FormMixin from "@/components/Mixins/FormMixin";

  export default {
    components: {CInputText},
    name: "c-input-password",
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
      validate: {
        type: Object,
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
        inputValue: ''
      }
    },
    created() {
      if(this.value) this.inputValue = this.value;
    }
  }
</script>
