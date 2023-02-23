<template>
  <div class="time-range-picker-container">
    <time-picker
      :placeholder="start_placeholder"
      :usingRange="usingRange"
      :disableRange="disableRange"
      @update:value="res => $emit('setStart', res)"
      :disabled="disabled"
      :value.sync="startTime"
      :unit="unit"
      :start="start"
      :end="end"
    ></time-picker>
    <div style="margin:5px 8px">~</div>
    <time-picker
      :placeholder="end_placeholder"
      :usingRange="usingRange"
      :disableRange="disableRange"
      @update:value="res => $emit('setEnd', res)"
      :disabled="disabled"
      :value.sync="endTime"
      :unit="unit"
      :start="end_start"
      :end="end"
    ></time-picker>
  </div>
</template>

<script>
import TimePicker from "./TimePicker.vue";
export default {
  name: "timeRangePicker",
  components: { TimePicker },
  props: {
    start_time: {
      type: String
    },
    end_time: {
      type: String
    },
    unit: {
      type: Number,
      default: 10
    },
    start_placeholder: {
      type: String,
      default: "시작 시간"
    },
    end_placeholder: {
      type: String,
      default: "종료 시간"
    },
    disabled: {
      type: Boolean,
      default: false
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
    }
  },
  data() {
    return {
      startTime: "",
      endTime: "",
      end_start: {
        hour: 0,
        min: 0
      }
    };
  },
  created() {
    this.startTime = this.start_time;
    this.endTime = this.end_time;
    this.end_start = this.start;
  },
  watch: {
    start_time(n) {
      this.startTime = n;
    },
    end_time(n) {
      this.endTime = n;
    },
    startTime(n) {
      if (!n) return;
      this.$emit("update:start_time", n);
      let start = parseInt(n.replace(":", ""));
      if (this.endTime) {
        let end = parseInt(this.endTime.replace(":", ""));
        if (start > end) {
          this.endTime = "";
          this.$emit("update:end_time", "");
        }
        if (n.indexOf(":") > -1) {
          this.end_start = {
            hour: parseInt(n.split(":")[0]),
            min: parseInt(n.split(":")[1])
          };
        }
      }
    },
    endTime(n) {
      this.$emit("update:end_time", n);
    }
  }
};
</script>

<style lang="stylus" scoped>
.time-range-picker-container {
  display: flex;
  align-items: center;
}
</style>
