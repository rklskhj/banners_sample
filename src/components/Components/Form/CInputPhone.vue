<template>
  <c-input-text v-bind="$props"
                :value.sync="inputValue"
                :formType="formType"
                type="phone"></c-input-text>
</template>

<script>
  import CInputText from "./CInputText.vue";
  import FormMixin from "@/components/Mixins/FormMixin";
  export default {
    components: {CInputText},
    name: "c-input-phone",
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
        required: false
      }
    },
    watch: {
      value(n) {
        this.inputValue = n;
      },
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
