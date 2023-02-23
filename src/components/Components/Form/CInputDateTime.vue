<template>
  <div :style="containerStyle">
    <div :style="labelStyle" v-if="label">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
    <div class="flex">
      <c-input-date :value="inputDate"
                    @update:value="val=> clickDateTime(val, 'date')"
                    :formType="formType"></c-input-date>
      <c-input-time :value="inputTime"
                    @update:value="val=> clickDateTime(val, 'time')"
                    :formType="formType" style="margin-left:12px"></c-input-time>
    </div>
  </div>
</template>

<script>
  import FormMixin from "@/components/Mixins/FormMixin";
  import CInputDate from "./CInputDate.vue";
  import CInputTime from "./CInputTime.vue";

  export default {
    components: {
      CInputTime,
      CInputDate},
    mixins:[
      FormMixin
    ],
    name: "c-input-datetime",
    data() {
      return {
        inputDate: '',
        inputTime: '',
        Label: ''
      }
    },
    watch: {
      value(n) {
        this.inputDate = this.dayjs(n).format('YYYY-MM-DD');
        this.inputTime = this.dayjs(n).format('hh:mm');
      }
    },
    created() {
      if(this.value) {
        this.inputDate = this.dayjs(this.value).format('YYYY-MM-DD');
        this.inputTime = this.dayjs(this.value).format('hh:mm');
      }
    },
    methods: {
      clickDateTime(value, type) {
        if(type==='date'){
          this.$emit('update:value', `${value} ${this.inputTime}`);
        }
        else {
          this.$emit('update:value', `${this.inputDate} ${value}`);
        }
      }
    }
  }
</script>

<style scoped>

</style>
