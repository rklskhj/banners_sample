<template>
  <div class="full-width" :style="containerStyle">
    <div v-if="formType.label && label" :style="labelStyle">{{ label }}</div>
    <div class="time-info-select week-day-group contents">
      <div class="full-width">
        <!-- 평일 영업시간 -->
        <div class="time-info-wrapper" :style="brandBorder.sub">
          <div
            class="size-14 flex-align"
            :style="[brandColor.main,{marginBottom: dayOTExpended === true ? '16px' : '0'}]"
            style="justify-content: space-between"
            @click="dayOTExpended = !dayOTExpended">
            <span>평일 영업시간</span>
            <i
              class="size-18 material-icons"
            >{{ dayOTExpended === true ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
          </div>
          <div v-if="dayOTExpended === true" class="is-full">
            <div>
              <div class="day-label span-day">{{ week1_bsnhour.name }}</div>
              <div class="day-of-the-week">
                <time-range-picker
                  :start_time.sync="week1_bsnhour.open_start"
                  :end_time.sync="week1_bsnhour.open_end"
                ></time-range-picker>
                <div
                  :class="{ 'checked-box' : week1_bsnhour.is_copy,
                             'not-checked-box' : !week1_bsnhour.is_copy }"
                  @click.stop.prevent="clickCopy('week1')"
                >
                  <i
                    v-if="week1_bsnhour.is_copy"
                    class="material-icons checked-icon"
                    @click.stop.prevent="clickCopy('week1')"
                  >check</i>
                </div>
                <div class="span-day">평일 동일</div>
              </div>
              <template v-for="(day, idx) in bsnhour">
                <div v-if="idx < 5" :key="'day'+idx">
                  <div class="day-label span-day">{{ day.name }}</div>
                  <div class="day-of-the-week">
                    <time-range-picker
                      class="time-picker-margin"
                      :start_time.sync="day.open_start"
                      :end_time.sync="day.open_end"
                    ></time-range-picker>
                    <div
                      :class="{ 'checked-box' : day.is_closed,
                             'not-checked-box' : !day.is_closed }"
                      @click.stop.prevent="clickCheck(idx)"
                    >
                      <i
                        v-if="day.is_closed"
                        class="material-icons checked-icon"
                        @click.stop.prevent="clickCheck(idx)"
                      >check</i>
                    </div>
                    <div class="span-day">휴무</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 평일 브레이크타임 -->
        <div class="time-info-wrapper" :style="brandBorder.sub">
          <div
            class="size-14 flex-align"
            :style="[brandColor.main,{marginBottom: dayBTExpended === true ? '16px' : '0'}]"
            style="justify-content: space-between"
            @click="dayBTExpended = !dayBTExpended"
          >
            <span>평일 브레이크타임</span>
            <i
              class="size-18 material-icons"
            >{{ dayBTExpended === true ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
          </div>
          <div v-if="dayBTExpended === true" class="is-full">
            <div>
              <div class="day-label span-day">{{ break1_bsnhour.name }}</div>
              <div class="day-of-the-week">
                <time-range-picker
                  :start_time.sync="break1_bsnhour.break_start"
                  :end_time.sync="break1_bsnhour.break_end"
                ></time-range-picker>
                <div
                  :class="{ 'checked-box' : break1_bsnhour.is_copy,
                             'not-checked-box' : !break1_bsnhour.is_copy }"
                  @click.stop.prevent="clickCopy('break1')"
                >
                  <i
                    v-if="break1_bsnhour.is_copy"
                    class="material-icons checked-icon"
                    @click.stop.prevent="clickCopy('break1')"
                  >check</i>
                </div>
                <div class="span-day">평일 동일</div>
              </div>
              <template v-for="(day,idx) in bsnhour">
                <div v-if="idx < 5" :key="'day'+idx">
                  <div class="day-label span-day">{{ day.name }}</div>
                  <div class="day-of-the-week">
                    <time-range-picker
                      class="time-picker-margin"
                      :start_time.sync="day.break_start"
                      :end_time.sync="day.break_end"
                    ></time-range-picker>
                    <div
                      :class="{ 'checked-box' : day.is_closed,
                             'not-checked-box' : !day.is_closed }"
                      @click.stop.prevent="clickCheck(idx)"
                    >
                      <i
                        v-if="day.is_closed"
                        class="material-icons checked-icon"
                        @click.stop.prevent="clickCheck(idx)"
                      >check</i>
                    </div>
                    <div class="span-day">휴무</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 주말 영업시간 -->
        <div class="time-info-wrapper" :style="brandBorder.sub">
          <div
            class="size-14 flex-align"
            :style="[brandColor.main,{marginBottom: weekendOTExpended === true ? '16px' : '0'}]"
            style="justify-content: space-between"
            @click="weekendOTExpended = !weekendOTExpended"
          >
            <span>주말 영업시간</span>
            <i
              class="size-18 material-icons"
            >{{ weekendOTExpended === true ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
          </div>
          <div v-if="weekendOTExpended === true" class="is-full">
            <div>
              <div class="day-label span-day">{{ week2_bsnhour.name }}</div>
              <div class="day-of-the-week">
                <time-range-picker
                  :start_time.sync="week2_bsnhour.open_start"
                  :end_time.sync="week2_bsnhour.open_end"
                ></time-range-picker>
                <div
                  :class="{ 'checked-box' : week2_bsnhour.is_copy,
                             'not-checked-box' : !week2_bsnhour.is_copy }"
                  @click.stop.prevent="clickCopy('week2')"
                >
                  <i
                    v-if="week2_bsnhour.is_copy"
                    class="material-icons checked-icon"
                    @click.stop.prevent="clickCopy('week2')"
                  >check</i>
                </div>
                <div class="span-day">주말 동일</div>
              </div>
              <template v-for="(day,idx) in bsnhour">
                <div v-if="idx >= 5" :key="'day'+idx">
                  <div class="day-label span-day">{{ day.name }}</div>
                  <div class="day-of-the-week">
                    <time-range-picker
                      class="time-picker-margin"
                      :start_time.sync="day.open_start"
                      :end_time.sync="day.open_end"
                    ></time-range-picker>
                    <div
                      :class="{ 'checked-box' : day.is_closed,
                             'not-checked-box' : !day.is_closed }"
                      @click.stop.prevent="clickCheck(idx)"
                    >
                      <i
                        v-if="day.is_closed"
                        class="material-icons checked-icon"
                        @click.stop.prevent="clickCheck(idx)"
                      >check</i>
                    </div>
                    <div class="span-day">휴무</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 주말 브레이크타임 -->
        <div class="time-info-wrapper" :style="brandBorder.sub">
          <div
            class="size-14 flex-align"
            :style="[brandColor.main,{marginBottom: weekendBTExpended === true ? '16px' : '0'}]"
            style="justify-content: space-between"
            @click="weekendBTExpended = !weekendBTExpended"
          >
            <span>주말 브레이크타임</span>
            <i
              class="size-18 material-icons"
            >{{ weekendBTExpended === true ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
          </div>
          <div v-if="weekendBTExpended === true" class="is-full">
            <div>
              <div class="day-label span-day">{{ break2_bsnhour.name }}</div>
              <div class="day-of-the-week">
                <time-range-picker
                  :start_time.sync="break2_bsnhour.break_start"
                  :end_time.sync="break2_bsnhour.break_end"
                ></time-range-picker>
                <div
                  :class="{ 'checked-box' : break2_bsnhour.is_copy,
                             'not-checked-box' : !break2_bsnhour.is_copy }"
                  @click.stop.prevent="clickCopy('break2')"
                >
                  <i
                    v-if="break2_bsnhour.is_copy"
                    class="material-icons checked-icon"
                    @click.stop.prevent="clickCopy('break2')"
                  >check</i>
                </div>
                <div class="span-day">주말 동일</div>
              </div>
              <template v-for="(day,idx) in bsnhour">
                <div v-if="idx >= 5" :key="'day'+idx">
                  <div class="day-label span-day">{{ day.name }}</div>
                  <div class="day-of-the-week">
                    <time-range-picker
                      class="time-picker-margin"
                      :start_time.sync="day.break_start"
                      :end_time.sync="day.break_end"
                    ></time-range-picker>
                    <div
                      :class="{ 'checked-box' : day.is_closed,
                             'not-checked-box' : !day.is_closed }"
                      @click.stop.prevent="clickCheck(idx)"
                    >
                      <i
                        v-if="day.is_closed"
                        class="material-icons checked-icon"
                        @click.stop.prevent="clickCheck(idx)"
                      >check</i>
                    </div>
                    <div class="span-day">휴무</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimePicker from "../Common/TimePicker.vue";
import TimeRangePicker from "../Common/timeRangePicker.vue";
import FormMixin from '@/components/Mixins/FormMixin'

export default {
  name: "CInputCompanyOperating",
  props: ["bsnhour"],
  mixins: [FormMixin],
  components: {
    TimeRangePicker,
    TimePicker
  },
  data() {
    return {
      dayOTExpended: false,
      dayBTExpended: false,
      weekendOTExpended: false,
      weekendBTExpended: false,
      input_bsnhour: {
        name: "월요일",
        code: 0,
        is_closed: false,
        open_start: "",
        open_end: "",
        break_start: "",
        break_end: ""
      },
      // 디폴트 값
      week1_bsnhour: {
        is_copy: false,
        name: "평일",
        open_start: "",
        open_end: "",
        break_start: "",
        break_end: ""
      },
      week2_bsnhour: {
        is_copy: false,
        name: "주말",
        open_start: "",
        open_end: "",
        break_start: "",
        break_end: ""
      },
      break1_bsnhour: {
        is_copy: false,
        name: "평일",
        open_start: "",
        open_end: "",
        break_start: "",
        break_end: ""
      },
      break2_bsnhour: {
        is_copy: false,
        name: "주말",
        open_start: "",
        open_end: "",
        break_start: "",
        break_end: ""
      },
      times: []
    };
  },
  created() {
    this.time();
  },
  methods: {
    time() {
      for (let i = 0; i <= 23; i++) {
        let min = 0;
        for (let j = 0; j < 2; j++) {
          if (j === 0) min = "00";
          else if (j === 1) min = "30";

          let time = i.toString() + ":" + min;
          this.times.push({ hour: time });
        }
      }
    },
    clickCopy(type) {
      // 평일
      if (type === "week1") {
        if (this.week1_bsnhour.is_copy === false) {
          this.week1_bsnhour.is_copy = true;
          for (let i = 0; i < 5; i++) {
            this.bsnhour[i].open_start = this.week1_bsnhour.open_start;
            this.bsnhour[i].open_end = this.week1_bsnhour.open_end;
          }
        } else if (this.week1_bsnhour.is_copy === true) {
          this.week1_bsnhour.is_copy = false;
        }
      }
      // 주말
      else if (type === "week2") {
        if (this.week2_bsnhour.is_copy === false) {
          this.week2_bsnhour.is_copy = true;
          for (let i = 5; i < 8; i++) {
            this.bsnhour[i].open_start = this.week2_bsnhour.open_start;
            this.bsnhour[i].open_end = this.week2_bsnhour.open_end;
          }
        } else if (this.week2_bsnhour.is_copy === true) {
          this.week2_bsnhour.is_copy = false;
        }
      }
      // 평일 브레이크타임
      else if (type === "break1") {
        if (this.break1_bsnhour.is_copy === false) {
          this.break1_bsnhour.is_copy = true;
          for (let j = 0; j < 5; j++) {
            this.bsnhour[j].break_start = this.break1_bsnhour.break_start;
            this.bsnhour[j].break_end = this.break1_bsnhour.break_end;
          }
        } else if (this.break1_bsnhour.is_copy === true) {
          this.break1_bsnhour.is_copy = false;
        }
      }
      // 주말 브레이크타임
      else if (type === "break2") {
        if (this.break2_bsnhour.is_copy === false) {
          this.break2_bsnhour.is_copy = true;
          for (let j = 5; j < 8; j++) {
            this.bsnhour[j].break_start = this.break2_bsnhour.break_start;
            this.bsnhour[j].break_end = this.break2_bsnhour.break_end;
          }
        } else if (this.break2_bsnhour.is_copy === true) {
          this.break2_bsnhour.is_copy = false;
        }
      }
      this.$emit("update:value", this.bsnhour);
    },
    clickCheck(index) {
      if (this.bsnhour[index].is_closed === false) {
        this.bsnhour[index].is_closed = true;
        this.bsnhour[index].open_start = "";
        this.bsnhour[index].open_end = "";
        this.bsnhour[index].break_start = "";
        this.bsnhour[index].break_end = "";
      } else if (this.bsnhour[index].is_closed === true) {
        this.bsnhour[index].is_closed = false;
      }
      this.$emit("update:value", this.bsnhour);
    }
    /*getData(){
        for(let i=0; i<this.bsnhour.length; i++) {
          let hours = '';
          let brk = '';

          if (this.bsnhour[i].is_holiday) hours = '휴무';
          else if (this.bsnhour[i].is_full) {
            hours = '24시간 영업';
            this.bsnhour[i].start_time = '00:00';
            this.bsnhour[i].end_time = '23:59';
          }
          else {
            let bsn_st = this.bsnhour[i].start_time;
            let bsn_end = this.bsnhour[i].end_time;
            hours = '영업시간: ' + bsn_st + ' ~ ' + bsn_end;

            if (this.bsnhour[i].unable_break === false) {
              let brk_st = this.input_bsnhour.break_start;
              let brk_end = this.input_bsnhour.break_end;
              brk = '브레이크타임: ' + brk_st + ' ~ ' + brk_end;
              this.bsnhour[i].break_start = brk_st;
              this.bsnhour[i].break_end = brk_end;
              this.bsnhour[i].unable_break = this.input_bsnhour.unable_break;
            }
          }

          this.bsnhour[i].hours = hours;
          if (brk != '')
            this.bsnhour[i].hours += '\n' + brk;
        }
      }*/
  }
};
</script>

<style lang="stylus" type="stylus" scoped>
.day-label {
  margin-bottom: 4px;
}

.time-info-select {
  display: flex;
}

.time-info-wrapper {
  padding: 14px 16px;
  border-radius: 8px;
  min-height: 48px;
  margin-bottom: 8px;
}

// .week-day-group {
// padding: 10px;
// }

// .week-day-group:nth-of-type(2) {
// margin-left: 24px;
// }
@media (max-width: 1400px) {
  .time-info-select {
    flex-wrap: wrap;
  }
}

.time-info-options {
  width: 400px;
  border: 1px solid #ddd;
  padding: 16px;
}

.time-info-options-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.box-sel {
  margin-bottom: 10px;
  font-size: 0.9em;
  display: flex;
  color: #333;
}

// max-width 260px
// justify-content space-between
.btn-sel {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 7px;
  width: 80px;
  text-align: center;
  margin-right: 12px;
}

.day-of-the-week {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.span-day {
  font-size: 12px;
  line-height: 1.17;
  color: #000;
}

.span-option {
  margin-left: 5px;
  color: #333;
  font-size: 0.9rem;
}

.item-bsnhour {
  border: 1px solid #eee;
  padding: 5px;
  margin-left: 10px;
  font-size: 0.8em;
  white-space: pre-wrap;
}

.lp-title {
  font-size: 1.2rem;
  padding-bottom: 8px;
  border-bottom: 1px solid #c2c2c2;
  margin-bottom: 20px;
}

.checked-box, .not-checked-box {
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px solid $primary;
  border-radius: 3px;
  margin: 0 4px 0 20px;
  text-align: center;
}

.checked-box {
  background-color: $primary;
  cursor: pointer;
}

.not-checked-box {
  background-color: #fff;
  cursor: pointer;
}

.checked-icon {
  background: $primary;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  position: absolute;
  left: 0px;
  top: 0px;
}

.time-info-btn {
  background: $primary;
  color: #fff;
  display: inline-block;
  padding: 8px 20px;
  border-radius: 3px;
  cursor: pointer;
  float: right;
  margin: 20px 12px 0 0;
}

// .time-picker-margin {
// margin-left: 24px;
// }
.time-picker {
  height: 36px;
  margin-right: 12px;
}

.lp-bg-sub-title {
  padding: 0;
  padding-bottom: 12px;
  padding-top: 12px;
}

@media (max-width: 440px) {
  .time-info-btn {
    float: unset;
  }

  .time-info-options {
    width: 100%;
  }

  .btn-sel {
    width: 60px;
  }

  .item-bsnhour {
    width: 224px;
  }

  .btn-sel {
    font-size: 0.8rem;
  }

  .day-of-the-week {
    font-size: 14px;
    line-height: 0.71;
  }
}
</style>
