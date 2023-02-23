<template>
  <c-input-text v-bind="$props"
                ref="text"
                :value.sync="inputValue"
                :formType="formType"
                type="email"
                :containStyle="containStyle"></c-input-text>
</template>

<script>
  import CInputText from "./CInputText.vue";
  import FormMixin from "@/components/Mixins/FormMixin";

  export default {
    components: {CInputText},
    name: "c-input-email",
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
      },
      containStyle: {
        type: Object,
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
