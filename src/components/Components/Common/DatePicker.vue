<template>
  <div class="c-date-picker-bg"
       @click="$emit('close')">
    <div class="c-date-picker" @click.stop.prevent=""
         :style="pagePadding">
      <scroll-picker-group class="flex" ref="sp">
        <scroll-picker v-model="year" :options="option.year" @input="setCalendar"></scroll-picker>
        <scroll-picker v-model="month" :options="option.month" @input="setCalendar"></scroll-picker>
        <scroll-picker v-model="day" :options="option.day"></scroll-picker>
      </scroll-picker-group>

      <div class="flex" style="margin: 0px 8px 12px 0px;justify-content: flex-end">
        <div class="btn-cancel unselect"
             @click.stop.prevent="$emit('close')">취소</div>
        <div class="btn-confirm unselect"
             :style="brandColor.primary"
             @click.stop.prevent="clickDone">확인</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ScrollPicker, ScrollPickerGroup} from 'vue-scroll-picker'

  export default {
    name: "DatePicker",
    components: {
      ScrollPicker,
      ScrollPickerGroup
    },
    props: {
      value: {
        type: String
      },
      min: {
        type: String,
        default: ''
      },
      max: {
        type: String,
        default: ''
      }
    },
    created() {
      this.initCss();
      this.initValue();
      this.setCalendar();
    },
    data() {
      return {
        year: 0,
        month: 0,
        day: 0,
        date: '',
        option: {
          year: [],
          month: [],
          day: []
        },
      }
    },
    computed: {
      cYear() {
        return Number(this.year.replace('y',''))
      },
      cMonth() {
        return Number(this.month.replace('m',''))
      },
      cDay() {
        return Number(this.day.replace('d',''))
      },
    },
    watch: {
      value() {
        this.initValue();
      }
    },
    methods: {
      initCss() {
        let el = document.getElementById("c-input-date");
        if (el === null) {
          el = document.createElement("style");
          el.setAttribute("type", "text/css");
          el.setAttribute("id", "c-input-date");

          el.innerHTML =
            `.c-date-picker .vue-scroll-picker-layer .middle {
   background-color: ${this.brandBgColor.brand.backgroundColor.replace('1)', '0.15)')};
}
.c-date-picker .-selected {
  color: ${this.brandColor.primary.color};
}
.c-date-picker .-selected + .vue-scroll-picker-item {
  color: #000;
}
`;
          document.head.appendChild(el);
        }
      },
      initValue() {
        this.date = this.value ? this.setDate(this.dayjs(this.value)) : this.setDate(this.dayjs());
      },
      //캘린더 데이터 생성
      setCalendar() {
        let min = {
          year: 1900,
          month: 1,
          day: 1
        };
        let max = {
          year: new Date().getFullYear() + 5,
          month: 12,
          day: new Date(this.cYear,this.cMonth,0).getDate()
        };
        if(this.min !== '') {
          [min.year, min.month, min.day] = this.min.split('-').map(d=>{ return Number(d) });
          if(this.cYear !== min.year) {
            min.month = 1;
          }
          if(this.cYear !== min.year || this.cMonth !== min.month) {
            min.day = 1;
          }
        }
        if(this.max !== '') {
          [max.year, max.month, max.day] = this.max.split('-').map(d=>{ return Number(d) });
          if(this.cYear !== max.year) {
            max.month = 12;
          }
          if(this.cYear !== max.year || this.cMonth !== max.month) {
            max.day = new Date(this.cYear,this.cMonth,0).getDate();
          }
        }


        if(this.option.year.length === 0) {
          for(let i=min.year; i<=max.year; i++) {
            this.option.year.push({
              name: `${i}년`,
              value: `${i}y`
            });
          }
        }

        this.option.month = [];
        for(let i=min.month; i<=max.month; i++) {
          this.option.month.push({
            name: `${i}월`,
            value: `${i}m`
          });
        }
        // 캘린더 마지막일
        this.option.day = [];
        for(let i=min.day; i<=max.day; i++) {
          this.option.day.push({
            name: `${i}일`,
            value: `${i}d`
          });
        }
        if(max.day < this.cDay) {
          this.day = max.day + 'd';
        }
      },
      setDate(date) {
        this.year = date.year() + 'y';
        this.month = date.month() + 1 + 'm';
        this.day = date.date() + 'd';
        return '%d.%02d.%02d'.format(this.cYear, this.cMonth, this.cDay);
      },
      clickDone() {
        this.date = '%d-%02d-%02d'.format(this.cYear, this.cMonth, this.cDay);
        this.$emit('update:value', this.date);
        this.$emit('close');
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .c-date-picker-bg
    position fixed
    z-index 1
    top 0
    right 0
    bottom 0
    left 0
    background-color rgba(0, 0, 0, 0.3)

  .c-date-picker
    width calc(100% - 20px)
    position fixed
    left 50%
    top 50%
    transform translate(-50%, -50%)
    border-radius 8px
    box-shadow 0 4px 4px 2px rgba(0, 0, 0, 0.2)
    z-index 10
    background-color white
    padding 16px

  @media screen and (min-width: 420px)
    .c-date-picker
      width 320px

  .btn-confirm
    text-align center
    padding 12px
    border-radius 3px

  .btn-cancel
    padding 12px
    text-align center
    margin-right 12px
    border-radius 3px
</style>
<style lang="stylus">
  $heightItem=46px
  .c-date-picker
    .vue-scroll-picker {
      height: 300px; /* default 10em */
    }
    .vue-scroll-picker-layer .top {
      box-sizing: border-box;
      border-bottom: 0;
      background: linear-gradient(
        180deg
        , #fff 20%, rgba(255,255,255,0));
      top: 0;
      left: 0;
      right: 0;
      height: calc(50% - 23px);
      cursor: pointer;
    }
    .vue-scroll-picker-layer .bottom {
      border-top: 0;
      background: linear-gradient(
        0deg
        , #fff 20%, rgba(255,255,255,0));
      bottom: 0;
      left: 0;
      right: 0;
      height: calc(50% - 23px);
      cursor: pointer;
    }
    .vue-scroll-picker-layer .middle {
      top: calc(50% - 23px);
      left: 0;
      right: 0;
      bottom: calc(50% - 23px);
    }
    .vue-scroll-picker-item {
      text-align: center;
      height: $heightItem;
      line-height: $heightItem;
    }
</style>
