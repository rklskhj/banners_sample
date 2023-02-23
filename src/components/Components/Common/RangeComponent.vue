<!-- Range Output Component (Input Component: CInputRange) -->
<template>
  <div class="range-component flex-align">

      <!-- min label -->
      <div v-if="minLabel" class="range-label" :style="rangeLabelStyle">{{ minLabel }}</div>

      <!-- 레인지 슬라이더 -->
      <div class="flex-center" style="margin: 0 16px;">
        <vue-slider  ref="slider" v-model="rangeValue" 
          :min="min" :max="max" :interval="interval" 
          :width="width" :height="height" :tooltip="tooltip"
          :dotSize="dotSize" :dotStyle="dotStyle" :dotOptions="{disabled: true}"
          :processStyle="computedProcessStyle"
          :sliderStyle="computedSliderStyle"
          :tooltipStyle="computedTooltipStyle"
          :railStyle="railStyle"
          @drag-end="$emit('changed')"
          @click.native="$emit('changed')">
          <!-- Dot 대신 들어가는 Value -->
          <template v-slot:dot="{ value }">
            <div class="flex-center" :style="rangeValueStyle">{{ rangeValue }}</div>
          </template>
        </vue-slider>
      </div>

      <!-- max label -->
      <div v-if="maxLabel" class="range-label" :style="rangeLabelStyle">{{ maxLabel }}</div>
      
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'

  export default {
    name: 'range-component',

    components: {
      vueSlider
    },

    mixins: [
    ],

    data() {
      return {
        rangeValue: []
      }
    },

    props: {
      value: {
        type: [Array, Number],
        required: true
      },
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
      dotStyle: {
        type: Object,
        required: false
      },
      dotOptions: {
        type: Object,
        required: false
      },
      processStyle: {
        default: function() {
          return {
            backgroundColor: '#ddd'
          }
        },
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
      },
      rangeValueStyle: {
        default: function() {
          return { 
            backgroundColor: '#888',
            color: 'white',
            fontSize: '13px',
            borderRadius: '50%',
            width: '20px',
            height: '20px'
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
      }
    }
  }
</script>
