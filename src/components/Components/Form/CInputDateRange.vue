<template>
<div>

  <!-- 레이블 -->
  <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

  <!-- input 영역 -->
  <div :style="inputStyle" class="flex-between position-relative unselect" @click="$refs.schedulePeriodModal.open()">
    <div class="flex-align">
      <i class="material-icons" style="font-size: 20px; margin-right: 8px; color: #d6d6d6">today</i>
      <span v-if="start_date && end_date">{{ `${period.resv_date} ~ ${period.resv_end_date}` }}</span>
      <!-- <span v-else-if="placeholder">{{ placeholder }}</span> -->
      <span v-else>{{ placeHolder }}</span>
    </div>
    <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
  </div>

  <sweet-modal ref="schedulePeriodModal" overlay-theme="dark">
  <div style="height:75vh;padding-bottom:40px">
    <div class="size-20 bold margin-bottom-12" :style="brandColor.main"
    style="padding:20px 16px 0">날짜 선택</div>
  <!-- 요일 -->
    <div class="flex lp-days" :style="brandColor.main">
      <div class="lp-day size-14 weight-500"
           v-for="(day,idx) in days" :key="'day-'+idx" :class="{'lp-day-sun': idx===0, 'lp-day-sat': idx===6}">{{ day }}</div>
      <div class="days-divider"></div>
    </div>

    <div :style="[wrapScroll]">
        <div style="margin-bottom:50px;" v-if="visible">
        <!-- 요일 -->
        <!--<div class="flex lp-days" :style="brandColor.main">-->
        <!--  <div class="lp-day size-14 weight-500"-->
        <!--       v-for="(day,idx) in days" :key="'day-'+idx" :class="{'lp-day-sun': idx===0, 'lp-day-sat': idx===6}">{{ day }}</div>-->
        <!--  <div class="days-divider"></div>-->
        <!--</div>-->
        <div style="padding:70px 20px 100px 20px;">
        <!-- 일 -->
        <div v-for="(cal, cal_idx) in calendar" :key="`cal-${cal_idx}`">
        <div class="size-20 bold">{{ cal.year }}년 {{ cal.month }}월</div>
        <div class="flex wrap lp-dates">
            <div class="lp-date unselect position-relative"
                v-for="(date,idx) in cal.dates"
                :key="'date-wrap'+idx"
                @click="clickDate(date, idx)"
                :style="dayWrapStyle(date)">
            <div class="flex-center" :style="dayStyle(date, idx)" :key="'date'+idx">
                <!-- 일자 표시 -->
                <div class="position-absolute size-14 weight-500 date-number">{{ date.day > 0 ? date.day : '' }}</div>
            </div>
            </div>
        </div>
        </div>
        </div>

        <fixed-bottom v-if="touch>0" style="width:90%;" :class="{'fixed-bottom-ie': this.isIE, 'fixed-bottom-ios': this.isIOS}">
        <div :style="[pagePadding, brandBgColor.white, {borderTop: brandBorder.main.border}]"
        style="padding-top: 20px; padding-bottom: 20px;" :class="{'fixed-bottom-ie-content': this.isIE}">

            <div v-if="btnEnable" class="size-14 weight-500 flex-center" style="height: 48px; margin-bottom: 12px;"
            :style="[brandBgColor.primary, brandColor.white, radius]" @click="clickOk">{{ selectedDate }}</div>

            <div v-if="!btnEnable" class="size-14 weight-500 flex-center"
            style="height: 48px; color: #9b9b9b; background-color: #dddddd; margin-bottom: 12px;" :style="radius"
            @click.stop>최소 {{ minPeriodDate }}이상 선택해야 예약이 가능합니다</div>

            <!--<div v-if="!btnEnable" :style="brandColor.sub" class="size-12">최소 {{ minPeriodDate }}이상 선택해야 예약이 가능합니다</div>-->
            <!--<div :style="brandColor.sub" class="size-12" style="margin-top: 4px;">최소 {{ minPeriodDate }}이상 선택해야 예약이 가능합니다</div>-->

            <div class="size-14 weight-500 flex-center" style="height: 48px;"
            :style="[brandBgColor.main, brandColor.main, radius]" @click="$refs.schedulePeriodModal.close()">취소</div>

        <!--<btn :color="btnColor.color" :backgroundColor="btnColor.bg"-->
        <!--     :customStyle="customStyle" @clicked="clickOk" style="width:100px">선택완료</btn>-->
        </div>
        </fixed-bottom>
        </div>
    </div>
  </div>
  </sweet-modal>
</div>
</template>
<script>
import PageMixin from "@/components/Mixins/PageMixin"
import FormMixin from '@/components/Mixins/FormMixin';

export default {
  name: 'CInputDateRange',
  components: {

  },
  mixins: [
    PageMixin,
    FormMixin
  ],
  props: {
    filterOptions: {
        type: Object,
    }
  },
  data() {
    return {
      "max": 1,
      "days": [
        "일",
        "월",
        "화",
        "수",
        "목",
        "금",
        "토"
      ],
      "dates": [],
      "touch": 0,
      "maximum": 1,
      "minimum": 1,
      "visible": false,
      "calendar": [],
      "end_date": "",
      "start_date": "",
      "currentDate": undefined,
      "ordered_count": 1,
      placeHolder: '날짜 선택',
    }
  },
  created() {
      this.currentDate = this.dayjs();
      // this.$axios.get(`user/0/mapping/product/${this.$route.query.id}?fields=minimum,maximum`).then(res => {
      //   this.minimum = res.data.minimum;
      //   this.maximum = res.data.maximum;
      // });
      this.setDates();
    },

  methods: {
    // 선택완료
    clickOk() {
    //   this.$emit('clickResv', this.period);

      this.filterOptions.set.forEach(item => {
        if(item.operator==='__gte') item.value = this.period.resv_date;
        if(item.operator==='__lte') item.value = this.period.resv_end_date;
      });
      // this.$store.commit('setSelectedResv', this.period);
      // this.$emit('selectedLabel', 2, `${this.period.start_date_label} ~ ${this.period.end_date_label}`);
      this.$emit('updateFilterOptions', this.filterOptions)
      this.$emit('update.value', this.period);
      this.$refs.schedulePeriodModal.close();
    },
    // 날짜 선택
    clickDate(date) {
      /* 갱신 이슈 */
      date.uid = this.uuidv4();

      if(date.prev || !date.enable) {
          return;
      }
      // 선택한 날짜가 최대 선택가능한 일 수 보다 넘치는 경우

      // 선택한 날짜가 기존 날짜보다 전일 경우 예외처리
      if(this.start_date.year >= date.year && this.start_date.month >= date.month && this.start_date.day >= date.day) {
        this.touch = 1;
        this.start_date = date;
        this.end_date = date;
      }
      // else if(this.calcPeriod(this.start_date, date) > this.maximum) {
      //   this.touch = 1;
      //   this.start_date = date;
      //   this.end_date = date;
      // }
      // 1번쨰 터치할 경우
      else if(this.touch===0) {
        this.touch += 1; // touch=1
        this.start_date = date;
        this.end_date = date;
      }
      // 2번쨰 터치할 경우
      else if(this.touch===1) {
        console.log('touch1')
        // 같은 날짜 선택
        if(this.start_date.year === date.year && this.start_date.month === date.month && this.start_date.day === date.day) {
          this.end_date = date;
        }
        // 다른 날짜 선택
        else {
          let start = this.start_date;
          let end = date;
          let start_date = this.dateFormat(this.dateToStr(start), 'date_3');
          let end_date = this.dateFormat(this.dateToStr(end), 'date_3');

          // 기간안에 예약가능한 날짜가 없을 경우 선택한 날짜 단일 선택으로 변경
          for(let i=0; i<this.calendar.length; i++) {
            let cal = this.calendar[i];
            for(let j=0; j<cal.dates.length; j++) {
              let dates = cal.dates[j];
              let date_item = this.dateFormat(this.dateToStr(dates), 'date_3');

              if(this.dayjs(start_date).isBefore(date_item) && this.dayjs(date_item).isBefore(end_date)) {
                if(!dates.enable) {
                  this.start_date = date;
                  this.end_date = date;
                  this.touch = 1;
                  return;
                }
              }
            }
          }

          this.touch += 1; // touch=2
          this.end_date = date;
        }
      }
      // 3번쨰 터치할 경우
      else if(this.touch===2) {
        this.start_date = date;
        this.end_date = date;
        this.touch = 1;
      }

    },
    dateToStr(date) {
      if(date.day === '') return '';
      return '%d-%02d-%02d'.format(date.year, date.month, date.day);
    },
    formattedDate(date) {
     return this.dayjs(this.dateToStr(date)).format('MM월 DD일(dd)');
    },
    btnStyle(resv) {
        let deco = {
          borderRadius: '20px',
          padding: '5px 20px',
          textAlign: 'center',
          marginBottom: '12px'
        };
        if(resv.remain === 0) {
          deco.color = 'white';
          deco.backgroundColor = '#ddd';
        }
        else {
          if(resv.selected) {
            deco.color = 'white';
            deco.backgroundColor = this.brandBgColor.brand.backgroundColor;
          } else {
            deco.color = this.brandColor.brand.color;
          }
          deco.border = this.brandBorder.brand.border;
        }

        return deco;
      },
    dayWrapStyle(date_target) {

        let start = this.cloneItem(this.start_date);
        let end = this.cloneItem(this.end_date);
        let date_val = this.cloneItem(date_target);

        // let start_d = '%d-%02d-%0d'.format(start.year.toString(), start.month.toString(), start.day.toString());
        // let end_d = '%d-%02d-%0d'.format(end.year.toString(), end.month.toString(), end.day.toString());
        // let date_d = '%d-%02d-%0d'.format(date_val.year.toString(), date_val.month.toString(), date_val.day.toString());

        let start_format = '';
        if (start.year && start.month && start.day) {
          start_format = '%d-%02d-%02d'.format(start.year.toString(), start.month.toString(), start.day.toString());
        }

        let end_format = '';
        if (end.year && end.month && end.day) {
          end_format = '%d-%02d-%02d'.format(end.year.toString(), end.month.toString(), end.day.toString());
        }

        let date_format = '';
        if (date_val.year && date_val.month && date_val.day) {
          date_format = '%d-%02d-%02d'.format(date_val.year.toString(), date_val.month.toString(), date_val.day.toString());
        }

        let start_date = this.dayjs(start_format).format('YYYY-MM-DD');
        let end_date = this.dayjs(end_format).format('YYYY-MM-DD');
        let date = this.dayjs(date_format).format('YYYY-MM-DD');

        let deco = {};

        // 선택한 날짜 기간에 스타일 추가
        if(this.dayjs(start_date).isSameOrBefore(date) && this.dayjs(date).isSameOrBefore(end_date)) {
          // console.log(start_date, end_date)
          if (start_date === end_date) {
            deco.justifyContent = 'center'
          }
          // 선택 처음날짜
          else if(start_date === date) {
            deco.justifyContent = 'flex-end';
          }
          // 선택 마지막날짜
          else if(end_date === date) {
            deco.justifyContent = 'flex-start';
          }
        }

        return deco;
      },
    dayStyle(date_target, idx) {

      let sun = idx%7===0 ? true : false;
      let sat = idx%7===6 ? true : false;

      let start = this.cloneItem(this.start_date);
      let end = this.cloneItem(this.end_date);
      let date_val = this.cloneItem(date_target);

      let start_format = '';
      if (start.year && start.month && start.day) {
        start_format = '%d-%02d-%02d'.format(start.year.toString(), start.month.toString(), start.day.toString());
      }

      let end_format = '';
      if (end.year && end.month && end.day) {
        end_format = '%d-%02d-%02d'.format(end.year.toString(), end.month.toString(), end.day.toString());
      }

      let date_format = '';
      if (date_val.year && date_val.month && date_val.day) {
        date_format = '%d-%02d-%02d'.format(date_val.year.toString(), date_val.month.toString(), date_val.day.toString());
      }

      let start_date = this.dayjs(start_format).format('YYYY-MM-DD');
      let end_date = this.dayjs(end_format).format('YYYY-MM-DD');
      let date = this.dayjs(date_format).format('YYYY-MM-DD');


      // let start = this.cloneItem(this.start_date);
      // let end = this.cloneItem(this.end_date);
      // let date_val = this.cloneItem(date_target);

      // if(start.month<10) start.month = '0' + start.month;
      // if(start.day<10) start.day = '0' + start.day;
      // if(end.month<10) end.month = '0' + end.month;
      // if(end.day<10) end.day = '0' + end.day;
      // if(date_val.month<10) date_val.month = '0' + date_val.month;
      // if(date_val.day<10) date_val.day = '0' + date_val.day;

      // let start_date = this.dayjs(`${start.year}-${start.month}-${start.day}`).format('YYYY-MM-DD');
      // let end_date = this.dayjs(`${end.year}-${end.month}-${end.day}`).format('YYYY-MM-DD');
      // let date = this.dayjs(`${date_val.year}-${date_val.month}-${date_val.day}`).format('YYYY-MM-DD');


      // prev: 현재날짜 기준 이전날짜, 다음달 날짜
      // enable: times 있을 경우 true

        let deco = {
          // borderRadius: '50%',
          color: 'white',
          width: '40px',
          height: '40px',
          lineHeight: '40px',
          // textAlign: 'center'
        };
        // 선택한 날짜 기간에 스타일 추가
        // (date.day>=this.start_date.day && date.month===this.start_date.month && date.year===this.start_date.year) &&
        // (date.day<=this.end_date.day && date.month===this.end_date.month && date.year===this.end_date.year)

        if(this.dayjs(start_date).isSameOrBefore(date) && this.dayjs(date).isSameOrBefore(end_date)) {
          deco.backgroundColor = this.brandBgColor.brand.backgroundColor;
          deco.color = 'white';
          deco.width = '100%';
          // 하루만 선택된 경우
          if (start_date === end_date) {
            deco.width  = '40px';
            deco.borderRadius = '8px';
          }
          // 선택 처음날짜
          else if(start_date === date) {
            deco.borderTopLeftRadius = '8px';
            deco.borderBottomLeftRadius = '8px';
            deco.width = 'calc(40px + ((100% - 40px) / 2))';
          }
          // 선택 마지막날짜
          else if(end_date === date) {
            deco.borderTopRightRadius = '8px';
            deco.borderBottomRightRadius = '8px';
            deco.width = 'calc(40px + ((100% - 40px) / 2))';
          }

        }
        else {
          deco.color = this.brandColor.main.color;
          // deco.border = '1px solid #dddddd';
          deco.lineHeight = '39px';

          if (sun) deco.color = '#f45853';
          else if (sat) deco.color = '#3c93cf';
        }
        // 이전날짜 비활성화 표시
        if(date_val.prev) {
          // deco.border = '1px solid #dddddd';
          deco.color = '#ddd';
          deco.lineHeight = '39px';

          if (sun) deco.color = 'rgba(244, 88, 83, 0.3)';
          else if (sat) deco.color = 'rgba(60, 147, 207, 0.3)';
        }
        else if(!date_val.enable) {
          deco.color = '#e4dde4';
        }

        return deco;
      },
    async setDates() {
      let currentDate = this.currentDate;
      for (let x=0; x<6; x++) {
        this.dates = [];
        let day = 0;
        if(x>0) {
          currentDate = currentDate.add(1, 'month');
        }
        let year = currentDate.year();
        let month = currentDate.month()+1;
        let start_day = currentDate.startOf('month').day();
        let end_date = currentDate.endOf('month').date();
        // console.log('year,month,start_day,end_date',year,month,start_day,end_date);
        // 6주일경우 42, 5주는 35
        let len = 42;
        if(start_day + end_date <= 35) {
          len = 35;
        }

        // 이전달 날짜 (prev:true)
        for(let i=start_day-1; i>=0; i--) {
          let old = this.dayjs(currentDate);
          old = old.subtract(1, 'month');
          let old_last = old.endOf('month').date();

          if(x===0) {
            this.dates.push({
              year: old.year(),
              month: old.month()+1,
              day: old_last - i,
              prev: true,
              uid: this.uuidv4()
            });
          }
          else {
            this.dates.push({
              year: old.year(),
              month: old.month()+1,
              day: '',
              prev: true,
              uid: this.uuidv4()
            });
          }
        }

        // 현재달 날짜 (prev: 이전날짜는 prev: true)
        for(let i=0; i< len; i++) {
          // console.log('i, day, start_day, end_date', i, day, start_day, end_date)
          if(i>=start_day && day<end_date) {
            let date = {
              year: year,
              month: month,
              day: ++day,
              enable: true,
              uid: this.uuidv4()
            };
            // console.log('날짜',year, month, day)
            date.prev = this.dayjs('%d-%02d-%02d'.format(year,month,day+1)).isBefore(this.dayjs());
            this.dates.push(date);
          }
        }

        let monthly = `${currentDate.year()}-${currentDate.month()+1}`;

        // let url = `public/product/${this.$route.query.id}/schedule/monthly/${monthly}`;

        //test
        //url = 'http://localhost:8000/' + url;

        // await this.$axios.get(url).then(res => {
        //   res.data.dates.forEach(item => {
        //     let current = this.dates.filter(date_item => {
        //         return date_item.year === item.year &&
        //           date_item.month === item.month &&
        //           date_item.day === item.day;
        //       })[0];

        //     if(current && item.day>0 && item.remain > 0) {
        //       current.enable = true;
        //     }

            // // times가 있을 경우 loop 실행
            // // if(item.day>0 && item.times.length>0)
            // if(item.day>0) {
            //   item.times = item.times.filter(time => {
            //     return !time.break_time
            //   });

            //   item.times.forEach(item => {
            //     item.selected = false;
            //   });
            //   let date = this.dates.filter(date => {
            //     return date.year === item.year &&
            //       date.month === item.month &&
            //       date.day === item.day;
            //   })[0];
            //   date.enable = true;
            //   date.times = item.times;
            //   // if(date.day===15) {
            //   //   date.enable = false;
            //   // }
            //}

        //   });
        // });

        this.calendar.push({"year": year, "month": month, "dates": this.dates})
        if(x===5) this.visible = true;
      }
    },
    calcPeriod(start_date, end_date) {
      if(!start_date) {
        return 0;
      }
      let resv_date = this.dateFormat(this.dateToStr(start_date), 'date_4');
      let resv_end_date = this.dateFormat(this.dateToStr(end_date), 'date_4');
      return this.dayjs(resv_end_date).diff(this.dayjs(resv_date), 'day') + 1;
    },

  },
  computed: {
    isIOS() {
      if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) { // ios13 이전 iPhone, iPad, iPod
        return true;
      } else if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) { // iPad (ios13 버전 이상)
        return true;
      } else {
        return false;
      }
    },
    iconStyle() {
      if (this.iconCustomStyle) return this.iconCustomStyle;
      else return {
        color: this.brandColor.sub.color
      };
    },
    minPeriodDate() {
      let date = this.minimum;
      return date>1 ? `${date-1}박 ${date}일` : `무박 ${date}일`;
      //return date>1 ? `${date-1}박` : `무박`;
    },
    selectedDate() {
      let start_date = this.formattedDate(this.start_date);
      let end_date = this.formattedDate(this.end_date);

      if(start_date===end_date) {
        return start_date;
      }
      else {
        return `${start_date} - ${end_date}`;
      }
    },
    period() {
      let resv_date = this.dateFormat(this.dateToStr(this.start_date), 'date_4');
      let resv_end_date = this.dateFormat(this.dateToStr(this.end_date), 'date_4');
      return {
        period: true,
        resv_date: resv_date,
        resv_end_date: resv_end_date,
        start_date_label: `${this.start_date.month}/${this.start_date.day}`,
        end_date_label: `${this.end_date.month}/${this.end_date.day}`,
        days: this.dayjs(resv_end_date).diff(this.dayjs(resv_date), 'day')
      }
    },
    btnEnable() {
      return (this.period.days+1) >= this.minimum;
    },
    btnColor() {
      if(this.btnEnable) {
        return {
          color: this.brandColor.white,
          bg: this.brandBgColor.brand
        }
      } else {
        return {
          color: this.brandColor.white,
          bg: this.brandBgColor.help
        }
      }
    },
    customStyle() {
        return {
          borderRadius: '8px'
        }
      },
    wrapScroll() {
      return {
        overflowY: 'auto',
        height: 'calc(100% - 60px)',
        // backgroundColor: this.brandBgColor.main.backgroundColor
      }
    },
  },
  watch: {

  }
}
</script>
<style scoped>
.lp-month {
  font-size: 15px;
  margin: 0 12px;
}
.lp-days {
  padding: 13px 20px;
  /* border-top: 1px solid #ddd; */
  border-bottom: 1px solid #ddd;
  margin-bottom: 12px;
  /* position: fixed; */
  top: 50px;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: rgba(255,255,255,0.7);
}
.lp-day {
  width: 14.2857%;
  text-align: center;
}
.lp-day-sun {
  color: #f45853;
}
.lp-day-sat {
  color: #3c93cf;
}
.lp-dates {
  margin-bottom: 20px;
}
.lp-date {
  width: 14.2857%;
  height: 14.2857%;
  display: flex;
  justify-content: center;
  margin: 8px 0;
}
.icon-arrow {
  color: #fff;
  background-color: #777;
  border-radius: 50%;
  font-size: 18px;
}
.box-resv {
  padding: 12px 0;
  border-top: 1px solid #ddd;
}

.date-number {
  height: 100%;
  width: 20px;
  text-align: center;
  top: 0;
  left: calc(50% - 10px);
}

.fixed-bottom-ie {
  transform: translateX(-50%) translateY(-60%) !important;
  max-width: 33% !important;
}
.fixed-bottom-ie-content {
  margin: 0 44px;
}
.fixed-bottom-ios {
  position: absolute !important;
}
</style>

