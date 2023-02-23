<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label"
         :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 컨텐츠 -->
    <div :style="brandColor.sub" style="margin-bottom:4px" class="size-14">시작일</div>
    <div class="c-input-date-content unselect position-relative">
      <div class="full-width flex-between" @click.stop.prevent="openPicker('min','date')"
           :style="inputStyle">{{ !min.date || min.date === ''  ? '날짜 선택' : min.date }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>

      <div class="full-width flex-between" @click.stop.prevent="openPicker('min','time')"
           :style="inputStyle" style="margin-left: 8px">{{ !min.time || min.time === ''  ? '시간 선택' : min.time }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
    </div>

    <div :style="brandColor.sub" style="margin:12px 0 4px 0" class="size-14">종료일</div>
    <div class="c-input-date-content unselect position-relative">
      <div class="full-width flex-between" @click.stop.prevent="openPicker('max','date')"
           :style="inputStyle">{{ !max.date || max.date === ''  ? '날짜 선택' : max.date }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>

      <div class="full-width flex-between" @click.stop.prevent="openPicker('max','time')"
           :style="inputStyle" style="margin-left: 8px">{{ !max.time || max.time === ''  ? '시간 선택' : max.time }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
    </div>

    <!-- Picker -->
    <transition name="fade">
      <date-picker v-if="vPicker.min.date" :max="max.date"
                   :value.sync="min.date" @update:value="setValue" @close="vPicker.min.date=false"></date-picker>
      <time-picker v-if="vPicker.min.time" :value.sync="min.time"
                   @update:value="setValue" @close="vPicker.min.time=false"></time-picker>
      <date-picker v-if="vPicker.max.date" :min="min.date"
                   :value.sync="max.date" @update:value="setValue" @close="vPicker.max.date=false"></date-picker>
      <time-picker v-if="vPicker.max.time" :value.sync="max.time"
                   @update:value="setValue" @close="vPicker.max.time=false"></time-picker>
    </transition>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import DatePicker from "../Common/DatePicker.vue";
  import TimePicker from "../Common/TimePickerAs.vue";

  export default {
    name: 'c-input-dateTimeRange',
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
          min: {
            date: false,
            time: false
          },
          max: {
            date: false,
            time: false
          }
        },
        min: {
          date: '',
          time: ''
        },
        max: {
          date: '',
          time: ''
        }
      };
    },
    created() {
      this.initValue();
    },
    watch: {
      value() {
        this.initValue();
      }
    },
    methods: {
      initValue() {
        if(this.value) {
          if(this.value[0]!=='') {
            [this.min.date, this.min.time] = this.value[0].split(' ');
          }
          if(this.value[1]!=='') {
            [this.max.date, this.max.time] = this.value[1].split(' ');
          }
        }
      },
      setValue() {
        let param = [
          this.getDateTime(this.min),
          this.getDateTime(this.max)
        ];
        this.$emit('update:value', param);
      },
      getDateTime(value) {
        if(value.date !== '' && value.time !== '') {
          return `${value.date} ${value.time}`;
        } else {
          return '';
        }
      },
      openPicker(key1, key2) {
        if(this.disabled) return;
        this.vPicker[key1][key2] = true;
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
