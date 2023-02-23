<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div class="c-time-content" @click.stop.prevent="openPicker">
      <div class="full-width flex-between"
           :style="inputStyle"
           :class="{ 'disabled-text' : disabled}">
        {{ value === "" ? placeholder : value }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
    </div>

    <transition name="fade">
      <time-picker v-if="pickerOpened" @close="pickerOpened=false" :value.sync="time"></time-picker>
    </transition>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import TimePicker from "../Common/TimePickerAs.vue";

  export default {
    name: 'CInputTime',
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

    data() {
      return {
        pickerOpened: false,
        time: ''
      };
    },
    created() {
      this.time = this.value;
    },
    watch: {
      value() {
        this.time = this.value;
      },
      time() {
        this.$emit('update:value', this.time);
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
    methods: {
      openPicker() {
        if (this.disabled) return;
        this.pickerOpened = true;
      },
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
