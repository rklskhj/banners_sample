<template>
  <div class="time-picker-container" :style="containerStyle" @click="clickContainer">
    <div>{{ timeValue }}</div>
    <div class="lp-outsider-layout" v-if="vSelect" @click.stop.prevent="vSelect=false"></div>
    <i class="material-icons icon-alarm" :style="iconStyle">alarm</i>

    <!-- 시작 선택 -->
    <div class="time-picker-select" v-if="vSelect" @click.stop.prevent>
      <div class="time-list" id="hour-list">
        <div
          v-for="hour in hours"
          :key="'hour-'+hour"
          :class="{'selected': hour === selectedTime.hour}"
          class="item unselect"
          @click="clickHour(hour)"
        >{{ '%02d'.format(hour) }}</div>
      </div>
      <div class="time-list" id="min-list">
        <div
          v-for="minute in minutes"
          :key="'minute-'+minute.min"
          :class="{'disabled' : minute.disabled, 'selected': (minute === selectedTime.min || minute.min === selectedTime.min)}"
          class="item unselect"
          @click="clickMinute(minute)"
        >{{ '%02d'.format(minute.min) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TimePicker",
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: "시간 선택"
      },
      value: {
        type: String
      },
      // 시간 단위
      unit: {
        type: Number,
        default: 5
      },
      // 시간 범위 - 시작
      start: {
        type: Object,
        default: () => {
          return {
            hour: 0,
            min: 0
          };
        }
      },
      // 시간 범위 - 종료
      end: {
        type: Object,
        default: () => {
          return {
            hour: 23,
            min: 59
          };
        }
      },
      // 선택 불가능 시간 범위 기능 사용하기
      usingRange: {
        type: Boolean,
        default: false
      },
      // 선택 불가능 시간 범위
      disableRange: {
        type: Object,
        default: () => {
          return {
            start: {
              hour: 13,
              min: 0
            },
            end: {
              hour: 14,
              min: 0
            }
          };
        }
      }
    },
    data() {
      return {
        vSelect: false,
        hours: [],
        minutes: [],
        selectedTime: {
          hour: -1,
          min: -1
        }
      };
    },
    computed: {
      containerStyle() {
        let deco = {};

        if (this.width !== "") {
          deco.width = this.width + "px";
        }
        if (this.disabled) {
          deco.backgroundColor = "#eeeeee";
          deco.color = "#d2d2d2";
        }

        return deco;
      },
      iconStyle() {
        return this.disabled ? { color: "#d2d2d2" } : { color: "#9b9b9b" };
      },
      timeValue() {
        return this.selectedTime.hour === -1 || this.selectedTime.min === -1
          ? this.placeholder
          : "%02d:%02d".format(this.selectedTime.hour, this.selectedTime.min);
      }
    },
    created() {
      this.initHour();
    },
    methods: {
      clickContainer() {
        if (!this.disabled) this.vSelect = true;
      },
      initHour() {
        this.hours = [];
        for (let i = this.start.hour; i <= this.end.hour; i++) {
          this.hours.push(i);
        }
        if (this.value && this.value !== "") {
          let value = this.value.split(":");
          this.clickHour(parseInt(value[0]));
          this.selectedTime = {
            hour: parseInt(value[0]),
            min: parseInt(value[1])
          };
        }
      },
      clickHour(hour) {
        this.selectedTime.hour = hour;
        this.selectedTime.min = -1;
        //this.$emit('update:value', '');

        this.minutes = [];
        for (let i = 0; i < 60 / this.unit; i++) {
          let min = i * this.unit;
          let disabled = false;

          if (
            // 시작시간
            (this.start.hour === hour && min < this.start.min) ||
            // 종료시간
            (this.end.hour === hour && min > this.end.min) ||
            // 불가능한 시간대 - 시작시간
            (this.usingRange &&
              this.disableRange.start.hour === hour &&
              min >= this.disableRange.start.min) ||
            // 불가능한 시간대 - 종료시간
            (this.usingRange &&
              this.disableRange.end.hour === hour &&
              min <= this.disableRange.end.min)
          ) {
            disabled = true;
          }

          this.minutes.push({
            min: min,
            disabled: disabled
          });
        }
      },
      clickMinute(minute) {
        if (minute.disabled) return;
        this.selectedTime.min = minute.min;
        this.$emit(
          "update:value",
          "%02d:%02d".format(this.selectedTime.hour, this.selectedTime.min)
        );
        this.vSelect = false;
      }
    },
    watch: {
      start() {
        this.initHour();
      },
      value(n) {
        if (!n) {
          this.selectedTime = {
            hour: -1,
            min: -1
          };
        }
        if (n.indexOf(":") > -1) {
          let time = n.split(":");
          let hour = parseInt(time[0]);
          let min = parseInt(time[1]);
          if (hour !== this.selectedTime.hour || min !== this.selectedTime.min) {
            this.selectedTime = {
              hour: hour,
              min: min
            };
          }
        } else {
          if (this.selectedTime.hour !== -1 && this.selectedTime.min !== -1) {
            this.selectedTime = {
              hour: -1,
              min: -1
            };
          }
        }
      },
      vSelect(n) {
        if (n) {
          // 목록 열릴 때, body에 스크롤 숨김처리
          document
            .getElementsByTagName("body")[0]
            .setAttribute("style", "overflow-y:hidden !important");

          // 선택되어있는 hour, min 위치로 이동
          if (this.selectedTime.hour > -1) {
            this.$nextTick(() => {
              for (let i = 0; i < this.hours.length; i++) {
                if (this.hours[i] === this.selectedTime.hour) {
                  document.getElementById("hour-list").scrollTop = 30 * i;
                  break;
                }
              }
              if (this.selectedTime.min > -1) {
                for (let i = 0; i < this.minutes.length; i++) {
                  if (this.minutes[i].min === this.selectedTime.min) {
                    document.getElementById("min-list").scrollTop = 30 * i;
                    break;
                  }
                }
              }
            });
          }
        } else {
          // 목록 닫힐 때, body에 스크롤 처리
          document
            .getElementsByTagName("body")[0]
            .setAttribute("style", "overflow-y:scroll !important");
          if (this.selectedTime.min === -1) {
            this.$emit("update:value", "");
          }
        }
      }
    }
  };
</script>

<style lang="stylus" scoped>
  @import '@/assets/css/lp_main';

  .time-picker-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    border-radius: 8px;
    border: 1px solid #dfdfdf;
    padding-left: 8px !important;
    background: white;
    color: #9b9b9b;
    min-width: 99px;
    min-height: 32px;
  }

  .icon-alarm {
    // position: absolute;
    // top: 5px;
    // right: 4px;
    margin-right: 7px;
    // color: #989898;
    font-size: 18px;
  }

  .time-picker-select {
    position: absolute;
    top: 29px;
    left: 0;
    background: white;
    z-index: 1000;
    border: 1px solid #ddd;
    width: 200px;
    display: flex;
  }

  .item {
    text-align: center;
    padding: 4px;
    height: 30px;
    color: #707070;
  }

  .item:hover, .selected {
    background-color: $primary;
    color: white;
  }

  .time-list {
    overflow-y: scroll;
    height: 240px;
    width: 50%;
  }

  .disabled {
    color: #d8d8d8;
  }

  .lp-outsider-layout {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
