<template>
  <div class="c-time-picker-bg"
       @click="$emit('close')">
    <div @click.stop.prevent="">
      <div class="c-time-picker" :style="pagePadding">
        <scroll-picker-group class="flex" ref="sp">
          <scroll-picker v-model="hour" :options="hourOptions"></scroll-picker>
          <scroll-picker v-model="minute" :options="minuteOptions"></scroll-picker>
        </scroll-picker-group>

        <div class="grid-box">
          <div class="col-6">
            <div class="c-time-picker-button"
                 :style="[brandBgColor.main, brandColor.sub2, brandBorder.main]"
                 @click.stop.prevent="clickCancel">취소
            </div>
          </div>
          <div class="col-6">
            <div class="c-time-picker-button"
                 :style="[brandBgColor.primary, brandColor.white, brandBorder.primary]"
                 @click.stop.prevent="clickDone">확인
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ScrollPicker, ScrollPickerGroup} from 'vue-scroll-picker'

  export default {
    name: "TimePickerAs",
    components: {
      ScrollPicker,
      ScrollPickerGroup
    },
    props: {
      minuteStep: {
        type: Number,
        default: 5
      },
      value: {
        type: String
      }
    },
    created() {
      this.initValue();
      this.initCss();
    },

    watch: {
      value() {
        this.initValue();
      }
    },
    data() {
      return {
        hour: '9h',
        minute: '0m',
        date: '',
      }
    },
    methods: {
      initValue() {
        if (this.value) {
          let values = this.value.split(':').map(v => { return Number(v) });
          this.hour = values[0] + 'h';
          this.minute = values[1] + 'm';
        }
      },
      initCss() {
        let el = document.getElementById("c-input-time");
        if (el === null) {
          el = document.createElement("style");
          el.setAttribute("type", "text/css");
          el.setAttribute("id", "c-input-time");

          el.innerHTML =
            `.c-time-picker .vue-scroll-picker-layer .middle {
   background-color: ${this.brandBgColor.brand.backgroundColor.replace('1)', '0.15)')};
}
.c-time-picker .-selected {
  color: ${this.brandColor.primary.color};
}
.c-time-picker .-selected + .vue-scroll-picker-item {
  color: #000;
}
`;
          document.head.appendChild(el);
        }
      },
      clickCancel() {
        this.$emit('close');
      },

      clickDone() {
        this.$emit('update:value', '%02d:%02d'.format(this.hour.replace('h', ''), this.minute.replace('m', '')));
        this.$emit('close');
      },
    },
    computed: {
      hourOptions() {
        return Array.from({length: 24}, (v, i) => i).map(i => {
          return {name: i, value: `${i}h`};
        });
      },

      minuteOptions() {
        let opts = [];
        for (let i = 0; i < 60; i += this.minuteStep) {
          opts.push({
            name: i,
            value: `${i}m`
          });
        }
        return opts;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .c-time-picker-bg
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background-color rgba(0, 0, 0, 0.3)
    z-index 10

  .c-time-picker
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
    .c-time-picker
      width 320px

  .c-time-picker-button
    height 48px
    line-height 48px
    text-align center
    border-radius 8px
    font-size 12px

  .c-time-picker-button:first-child
    margin-right 4px

  .c-time-picker-button:last-child
    margin-left 4px
</style>
<style lang="stylus">
  $heightItem = 46px
  .c-time-picker
    .vue-scroll-picker {
      height: 320px; /* default 10em */
    }

    .vue-scroll-picker-layer .top {
      box-sizing: border-box;
      border-bottom: 0;
      background: linear-gradient(
        180deg, #fff 20%, rgba(255, 255, 255, 0));
      top: 0;
      left: 0;
      right: 0;
      height: calc(50% - 23px);
      cursor: pointer;
    }

    .vue-scroll-picker-layer .bottom {
      border-top: 0;
      background: linear-gradient(
        0deg, #fff 20%, rgba(255, 255, 255, 0));
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
