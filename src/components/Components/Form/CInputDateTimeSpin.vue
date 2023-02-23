<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label"
         :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 컨텐츠 -->
    <div class="c-input-date-content unselect position-relative">
      <div class="full-width flex-between" @click.stop.prevent="openPicker('date')"
           :style="inputStyle">{{ !date || date === ''  ? '날짜 선택' : date }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>

      <div class="full-width flex-between" @click.stop.prevent="openPicker('time')"
           :style="inputStyle" style="margin-left: 8px">{{ !time || time === ''  ? '시간 선택' : time }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
    </div>

    <!-- Picker -->
    <transition name="fade">
      <date-picker v-if="vPicker.date" :value.sync="date" @close="vPicker.date=false"></date-picker>
      <time-picker v-if="vPicker.time" :value.sync="time" @close="vPicker.time=false"></time-picker>
    </transition>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import DatePicker from "../Common/DatePicker.vue";
  import TimePicker from "../Common/TimePickerAs.vue";

  export default {
    name: 'c-input-dateTimeSpin',
    components: {
      DatePicker,
      TimePicker
    },
    mixins: [
      FormMixin
    ],

    data() {
      return {
        vPicker: {
          date: false,
          time: false
        },
        date: '',
        time: ''
      };
    },
    created() {
      this.setDateTime();
    },
    watch: {
      value(){
        this.setDateTime();
      },
      date() {
        this.setValue();
      },
      time() {
        this.setValue();
      },
    },
    methods: {
      setDateTime() {
        if(this.value && this.value !== '') {
          [this.date, this.time] = this.value.split(' ');
        }
      },
      setValue() {
        if(this.date !== '' && this.time !== '') {
          this.$emit('update:value',`${this.date} ${this.time}`);
        }
      },
      openPicker(key) {
        if(this.disabled) return;
        this.vPicker[key] = true;
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
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .c-input-date-content
    display flex

  .fade-enter-active
    transition all .3s

  .fade-leave-active
    transition all 3s reverse

  .fade-enter, .fade-leave
    opacity 0

</style>
