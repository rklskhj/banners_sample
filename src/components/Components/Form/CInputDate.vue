<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label"
         :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 컨텐츠 -->
    <div class="c-input-date-content unselect position-relative"
         @click.stop.prevent="openPicker">
      <div class="full-width c-input-date-content-date"
           :style="inputStyle">{{ !date || date === ''  ? '날짜 선택' : date }}</div>
      <!-- 아이콘 -->
      <i class="material-icons"
         :style="iconStyle">calendar_today</i>
    </div>

    <transition name="fade">
      <div v-show="pickerOpened"
           class="c-input-date-picker-bg"
           @click.stop.prevent="closePicker">
      </div> <!-- bg -->
    </transition>

    <!-- Picker -->
    <transition name="fade">
      <div v-if="pickerOpened"
           class="c-input-date-picker"
           v-on-clickaway="closePicker">
        <div class="lp-cal-padding" style="position: relative">
          <div class="lp-cal-select">
            <i class="lp-cal-arrow material-icons"
               @click="prev">keyboard_arrow_left</i>

            <div style="position:relative" class="flex">
              <div class="lp-cal-title">
                <span @click="clickYear" class="unselect">{{ year }}년</span>
                <!-- 연 목록 -->
                <div v-if="yearOpened" class="lp-modal-div lp-year">
                  <div class="lp-year-element unselect"
                       v-for="(year, idx) in modalYears" :key="idx"
                       @click="selectYear(year)">{{ year }}년</div>
                </div>
              </div>

              <div class="lp-cal-title unselect">
                <span @click="clickMonth">{{ month }}월</span>
                <!-- 월 목록 -->
                <div v-if="monthOpened" class="lp-modal-div lp-month">
                  <div class="lp-month-element unselect"
                       v-for="(month, idx) in modalMonths" :key="idx"
                       @click="selectMonth(month)">{{ month }}월</div>
                </div>
              </div>
            </div>

            <i class="lp-cal-arrow material-icons"
               @click="next">keyboard_arrow_right</i>
          </div>
        </div>
        <div class="flex" style="padding:12px">
          <!-- 요일 -->
          <div
              v-for="(day, idx) in ['일','월','화','수','목','금','토']" :key="'day'+idx"
              :class="{
                'lp-sunday':idx==0,
                'lp-day':idx>0
              }">{{ day }}</div>

          <!-- 날짜 -->
          <div class="lp-date"
               v-for="(date, idx) in dates" :key="'date'+idx"
               :class="{
                'now': isNow(date),
                'weight-300': !prohibitBeforeDate || (prohibitBeforeDate && isBefore(date)),
                'weight-700': !prohibitBeforeDate || (prohibitBeforeDate && !isBefore(date))
              }"
               @click="clickDate(idx)">
            <div v-if="date.year!=0">
              <!-- 클릭된 날짜 모양 표시 -->
              <div v-if="date.clicked"
                   class="lp-click-date"
                   :style="brandBgColor.primary">{{ date.day }}</div>
              <!-- 일반 날짜 모양 표시 -->
              <div v-else class="lp-cal-date"
                :class="{
                  'unselect': !isBefore(date),
                  'prohibited': isBefore(date)
                }">{{ date.day }}</div>
            </div>
          </div>
        </div>
        <!--<div class="lp-cal-bottom-btn" @click="clickDone">{{ selDate.year }}년 {{ selDate.month }}월 {{ selDate.day }}일</div>-->
        <div class="flex" style="margin: 0px 8px 12px 0px;justify-content: flex-end">
          <div class="lp-cal-bottom-btn-cancel unselect"
               @click.stop.prevent="clickCancel">취소</div>
          <div class="lp-cal-bottom-btn-confirm unselect"
               :style="brandColor.primary"
               @click.stop.prevent="clickDone">확인</div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import { directive as onClickaway } from 'vue-clickaway';


  export default {
    name: 'c-input-date',
    props: {
      prohibitBeforeDate: {
        type: Boolean,
        default: false
      }
    },
    mixins: [
      FormMixin
    ],

    directives: {
      onClickaway: onClickaway
    },

    created() {
      if(this.value) {
        let date = this.dayjs(this.value)
        this.date = '%d-%02d-%02d'
          .format(date.year(), date.month()+1, date.date());
        this.year = date.year();
        this.month = date.month() + 1;
        this.day = date.date();
      }

      else {
        this.date = this.placeholder;
        // 날짜 picker 현재 날짜로 설정.
        let now = this.dayjs();
        this.year = now.year();
        this.month = now.month() + 1;
        this.day = now.date();

      }

      this.setCalendar();

      this.selectedYear = this.year;
      this.selectedMonth = this.month;
      this.selectedDay = this.day;
    },

    data() {
      return {
        // Picker
        pickerOpened: false,
        year: 0,
        month: 0,
        day: 0,
        dates: [],
        selectedYear: 0,
        selectedMonth: 0,
        selectedDay: 0,

        yearOpened: false,
        monthOpened: false,
        date: ''
      };
    },

    computed: {
      /* date() {
        if(this.value) {
          let properties = this.value;
          if (properties.year === 0 &&
              properties.month === 0 &&
              properties.day === 0) {
            return this.placeholder;
          }
          let date = '%d-%02d-%02d'
            .format(properties.year, properties.month, properties.day);
          return date;
        }
      },*/

      iconStyle() {
        /*let styles = this.cloneItem(this.styles.input.icon);
        let deco = this.decoToStyle(styles);
        deco.position = 'absolute';
        if (this.styles.date.icon.direction==='left') deco.right = 'unset';
        else if (this.styles.date.icon.direction==='right') deco.left = 'unset';
        return deco;*/
        if (this.formType && !this.formType.inputIcon) return 'display:none' ;
        let deco = {
          position: 'absolute',
          padding: '18px',
          color: this.brandColor.sub.color,
          right: 0,
          fontSize: '19px'
        };
        return deco;
      },

      modalYears() {
        let years = []
        for(let i=this.dayjs().add(3, 'year').year(); i>=1940; i--) {
          years.push(i);
        }
        return years;
      },

      modalMonths() {
        let months = []
        for(let i=1; i<=12; i++) {
          months.push(i);
        }
        return months;
      }
    },

    watch: {
      value(n) {
        let date = this.dayjs(n)
        this.date = '%d-%02d-%02d'
          .format(date.year(), date.month()+1, date.date());
      }
    },

    methods: {
      openPicker() {
        if(this.disabled) return;
        this.pickerOpened = true;
      },

      closePicker() {
        this.pickerOpened = false;
      },

      //캘린더 데이터 생성
      setCalendar() {
        // 캘린더 시작일
        var day = this.dayjs('%d-%02d-01'.format(this.year, this.month))
          .startOf('month');

        // 캘린더 마지막일
        var end_day = this.dayjs('%d-%02d-01'.format(this.year, this.month))
          .endOf('month')
          .format('MM-DD');

        var dates = [];

        // 시작일 전 공백 채우기
        for(let i = 0; i < day.day(); i++) {
          dates.push({
            clicked: false,
            year: 0,
            month: 0,
            day: 0,
          });
        }

        for (let i = 0; day.format('MM-DD') != end_day; i++) {
          if (i > 0) {
            day = day.add(1, 'day');
          }
          var clicked = false;
          if (day.format('YYYY-MM-DD') === '%d-%02d-%02d'
            .format(this.selectedYear,
              this.selectedMonth,
              this.selectedDay)) {
            clicked = true;
          }
          dates.push({
            clicked: clicked,
            year: day.year(),
            month: day.month() + 1,
            day: day.date()
          });
        }
        this.dates = dates;
      },

      //이전 달
      prev() {
        var prevDt = this.dayjs('%d-%02d-01'.format(this.year, this.month)).subtract(1, 'month');
        this.year = prevDt.year();
        this.month = prevDt.month() + 1;
        this.setCalendar();
      },
      //다음 달
      next() {
        var nextDt = this.dayjs('%d-%02d-01'.format(this.year, this.month)).add(1, 'month');
        this.year = nextDt.year();
        this.month = nextDt.month() + 1;
        this.setCalendar();
      },

      isNow(date) {
        let now = this.dayjs();
        if (date.year === now.year() &&
          date.month === now.month() + 1 &&
          date.day === now.date()) {
          return true;
        } else {
          return false;
        }
      },
      isBefore(date) {
        return this.dayjs(`${date.year}-${date.month}-${date.day}`).isBefore(this.dayjs(), 'day');
      },

      //날짜 클릭시 원 표시
      clickDate(idx) {
        for(var i=0; i<this.dates.length; i++) {
          if(i == idx){
            if (this.prohibitBeforeDate) {
              let date = {
                year: this.dates[i].year,
                month: this.dates[i].month,
                day: this.dates[i].day
              }
              if (this.isBefore(date)) {
                this.dates[i].clicked = false;
              } else {
                this.dates[i].clicked = true;
                this.selectedYear = this.dates[i].year;
                this.selectedMonth = this.dates[i].month;
                this.selectedDay = this.dates[i].day;
              }
            } else {
              this.dates[i].clicked = true;
              this.selectedYear = this.dates[i].year;
              this.selectedMonth = this.dates[i].month;
              this.selectedDay = this.dates[i].day;
            }
          } else{
            this.dates[i].clicked = false;
          }
        }
      },

      clickYear() {
        this.yearOpened = true;
        this.monthOpened = false;
      },

      clickMonth() {
        this.yearOpened = false;
        this.monthOpened = true;
      },

      selectYear(year) {
        this.year = year;
        this.setCalendar();
        this.yearOpened = false;
      },

      selectMonth(month) {
        this.month = month;
        this.setCalendar();
        this.monthOpened = false;
      },


      clickCancel() {
        this.pickerOpened = false;
      },

      clickDone() {
        this.year = this.selectedYear;
        this.month = this.selectedMonth;
        this.day = this.selectedDay;

        this.date = '%d-%02d-%02d'
          .format(this.year, this.month, this.day);

        /*let res = {
          year: this.year,
          month: this.month,
          day: this.day,
          date: date
        }*/

        this.$emit('update:value', this.date);

        this.pickerOpened = false;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .prohibited
    cursor not-allowed
    -ms-user-select none
    -moz-user-select -moz-none
    -khtml-user-select none
    -webkit-user-select none
    user-select none
  .c-input-date-content
    display flex

  .c-input-date-picker-bg
    position fixed
    z-index 999
    top 0
    right 0
    bottom 0
    left 0
    background-color rgba(0, 0, 0, 0.3)

  .c-input-date-picker
    width 360px
    position fixed
    left 50%
    bottom 20%
    transform translateX(-50%)
    border 1px solid #ddd
    box-shadow 0px 3px 4px 2px #00000029
    z-index 1000
    background-color white

  .flex
    flex-wrap wrap
  .lp-cal-padding
    padding 20px
    padding-bottom 0

  .lp-cal-select
    display flex
    justify-content space-between
    padding 0
    padding-bottom 12px

  .lp-cal-title
    text-align center
    line-height 25px
    position relative
    margin 0 4px

  .lp-cal-arrow
    font-size 1.6rem
    padding 0 12px
    cursor pointer

  .lp-sunday
  .lp-day
  .lp-date
    text-align center
    padding 8px

  .lp-sunday
  .lp-day
    width 14.285714%
    font-size 0.8rem

  .lp-sunday
    color #fc0000

  .lp-day
    color #787878

  .lp-date
    width 14.285714%
    color #777777
    position relative

  .now
    font-weight bold

  .lp-cal-date
  .lp-done-date
  .lp-click-date
    margin 0 auto
    border-radius 28px
    width 28px
    height 28px
    line-height 29px
    font-size 0.82rem

  .lp-click-date
    color white

  .lp-done-date
    background-color #ececec
    color #787878

  .lp-done-date-click
    border 1px solid #787878

  .lp-cal-bottom-btn-confirm
    text-align center
    padding 12px
    border-radius 3px

  .lp-cal-bottom-btn-cancel
    padding 12px
    text-align center
    margin-right 12px
    border-radius 3px

  /* 모달 부분 */

  .lp-year-element
  .lp-month-element
    margin 12px
    text-align left
    font-size 15px

  .lp-year-element:hover
  .lp-month-element:hover
    font-weight bold
    cursor pointer

  .lp-year-element
    width 52px

  .lp-month-element
    width 42px

  .lp-modal-div
    background white
    position absolute
    top 30px
    left -12px
    z-index 11
    height 240px
    overflow-y scroll
    border 1px solid #ddd

  .fade-enter-active
    transition all .3s

  .fade-leave-active
    transition all 3s reverse

  .fade-enter, .fade-leave
    opacity 0

  .drawer-enter-active
    transition all .3s

  .drawer-leave-active
    transition all .3s reverse

  .drawer-enter, .drawer-leave
    bottom -400px

</style>
