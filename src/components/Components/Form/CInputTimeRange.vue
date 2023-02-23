<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div class="c-time-content"
         style="display: flex; align-items: center;">
      <div :style="inputStyle" style="flex:1" @click.stop.prevent="openPicker('min')"
           :class="{ 'disabled-text' : disabled}" class="flex-between">
        {{ min }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
      <div :style="brandColor.sub2" style="margin:0 12px"> ~ </div>
      <div :style="inputStyle" style="flex:1" @click.stop.prevent="openPicker('max')"
           :class="{ 'disabled-text' : disabled}" class="flex-between">
        {{ max }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
    </div>

    <transition name="fade">
      <time-picker v-if="vPicker.min" @close="vPicker.min=false" :value.sync="min"></time-picker>
      <time-picker v-if="vPicker.max" @close="vPicker.max=false" :value.sync="max"></time-picker>
    </transition>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import TimePicker from "../Common/TimePickerAs.vue";

  export default {
    name: 'CInputTimeRange',
    components: {
      TimePicker
    },
    props: {
      timePickerIcon: {
        type: Object,
        required: false
      },
      minuteStep: {
        type: Number,
        default: 5
      }
    },
    mixins: [
      FormMixin
    ],
    created() {
      this.initValue();
    },
    watch: {
      value() {
        this.initValue();
      },
      min() {
        this.setValue();
      },
      max() {
        this.setValue();
      }
    },
    computed: {
      iconStyle() {
        if (this.iconCustomStyle) return this.iconCustomStyle;
        else return {
          color: this.brandColor.sub.color
        };
      },
    },
    data() {
      return {
        vPicker:{
          min: false,
          max: false
        },
        min: '',
        max: ''
      };
    },
    methods: {
      openPicker(key) {
        if (this.disabled) return;
        this.vPicker[key] = true;
      },
      initValue() {
        this.min = this.value[0];
        this.max = this.value[1];
      },
      setValue() {
        this.value[0] = this.min;
        this.value[1] = this.max;
        this.$emit('update:value', this.value);
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .c-time-content
    display flex

  .fade-enter-active
    transition all .3s

  .fade-leave-active
    transition all 3s reverse

  .fade-enter, .fade-leave
    opacity 0

  .disabled-text
    color #bbb
</style>


