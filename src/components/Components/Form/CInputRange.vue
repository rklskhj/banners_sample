<template>
  <div :style="[containerStyle, rangeWidth, rangeHeight]" class="c-input-range-container">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div class="position-relative full-width" :style="rangeWidth">
      <!-- min & max 레이블 -->
      <div v-if="minLabel" class="range-label position-absolute"
        :style="rangeLabelStyle" style="top:0; left:0;">{{ minLabel }}</div>
      <div v-if="maxLabel" class="range-label position-absolute"
        :style="rangeLabelStyle" style="top:0; right:0;">{{ maxLabel }}</div>

      <!-- 레인지 슬라이더 -->
      <div class="position-absolute flex-center"
        :style="[rangeWidth, {marginTop: `${this.sliderMarginTop}px`}]">
        <vue-slider ref="slider"
                    v-model="rangeValue"
                    :min="min"
                    :max="max"
                    :interval="interval"
                    :tooltip="tooltip"
                    :width="width"
                    :height="height"
                    :dotSize="dotSize"
                    :dotOptions="dotOptions"
                    :processStyle="computedProcessStyle"
                    :sliderStyle="computedSliderStyle"
                    :tooltipStyle="computedTooltipStyle"
                    :railStyle="railStyle"
                    @drag-end="$emit('changed')"
                    @click.native="$emit('changed')"
                    ></vue-slider>
      </div>
    </div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-range',

    components: {
      vueSlider
    },

    mixins: [
      FormMixin
    ],

    data() {
      return {
        rangeValue: []
      }
    },

    props: {
      /* props for customizing */
      minLabel: {
        type: String,
        required: false
      },
      maxLabel: {
        type: String,
        required: false
      },
      rangeLabelStyle: {
        type: Object,
        required: false
      },
      sliderMarginTop: {  // vue-slider-component margin-top (상위 레이블과 간격)
        type: Number,
        default: 0,
        required: false
      },
      totalHeight: {      // CInputRange의 전체 높이 (position때문에 필요)
        type: Number,
        default: 200,
        required: false
      },
      /* vue-slider-component props */
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      },
      interval: {
        default: 1,
        required: false
      },
      width: {
        default: 300,
        required: false
      },
      height: {
        default: 4,
        required: false
      },
      tooltip: {
        default: 'none',
        required: false
      },
      dotSize: {
        default: 20,
        required: false
      },
      dotOptions: {
        type: Object,
        required: false
      },
      processStyle: {
        required: false
      },
      sliderStyle: {
        required: false
      },
      tooltipStyle: {
        required: false
      },
      railStyle: {
        default: function() {
          return {
            backgroundColor: '#ddd'
          }
        },
        required: false
      }
    },

    created() {
      if (this.value) this.rangeValue = this.value;
    },

    updated() {
      if (this.value) this.rangeValue = this.value;
    },

    watch: {
      value(n) {
        this.rangeValue = n;
      },
      rangeValue(n) {
        this.$emit('update:value', n);
      }
    },

    computed: {
      computedProcessStyle() {
        if (this.processStyle) return this.processStyle;
        else return {
          backgroundColor: this.brandColor.primary.color
        }
      },
      computedSliderStyle() {
        if (this.sliderStyle) return this.sliderStyle;
        else return { backgroundColor: '#ddd' }
      },
      computedTooltipStyle() {
        if (this.tooltipStyle) return this.tooltipStyle;
        else return {}
      },
      rangeWidth() {
        return {
          width: `${(this.width + this.dotSize)}px`
        }
      },
      rangeHeight() {
        return {
          height: `${this.totalHeight}px`
        }
      }
    }
  }
</script>
