<template>
  <div :style="containerStyle" class="c-input-range-dual-container
              c-root
              position-relative
              full-width">

    <div style="padding:0 24px">
      <!-- 레이블 -->
      <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

      <vue-slider ref="slider"
                  v-model="inputValue"
                  :min="parseInt(min)"
                  :max="parseInt(max)"
                  :interval="computedInterval"
                  :height="8"
                  :dotSize="20"
                  :bgStyle="bgStyle"
                  :dotStyle="dotStyle"
                  :processStyle="processStyle"
                  :sliderStyle="sliderStyle"
                  :tooltipStyle="tooltipStyle"
                  tooltip="none"
                  @change="onChange"
      >
        <template v-slot:dot="{ value, focus }">
          <div :style="dotStyle"></div>
        </template>

      </vue-slider>
      <!-- Label Number -->
      <div class="unit" :style="unitStyle">{{ selectedLabel }}</div>
    </div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import FormMixin from "@/components/Mixins/FormMixin";
  import 'vue-slider-component/theme/antd.css'


  export default {
    name: 'c-input-rangeDual',

    components: {
      vueSlider
    },

    mixins: [
      FormMixin
    ],

    props: {
      min: {
        type: [Number, String],
        required: true,
      },
      max: {
        type: [Number, String],
        required: true,
      },
      unit: {
        type: String,
        required: false,
      },
      interval: {
        type: [Number, String],
        required: true,
      }
    },

    mounted() {
      if(this.value) {
        this.onChange();
      }
    },

    watch: {
      value(n) {
        this.inputValue = n;
      }
    },

    data() {
      return {
        inputValue: this.value,
        delay: false
      };
    },

    computed: {
      computedInterval() {
        if(this.interval)  return this.interval;
        else {
          if(this.max > 100)
            return this.max / 100;

          else if(this.max > 10)
            return this.max / 10;

          else
            return 1;
        }
      },
      bgStyle() {
        return this.brandBgColor.white;
      },
      dotStyle() {
        return {
          border: '1px solid '+this.getColor('브랜드 강조 색상'),
          width: '100%',
          height: '100%',
          borderRadius: '100%',
          backgroundColor:'white'
        };
      },
      processStyle() {
        return this.brandBgColor.brand;
      },
      sliderStyle() {
        return this.brandBgColor.brand;
      },
      tooltipStyle() {
        let processColor = this.getColor('브랜드 강조 색상');
        return {
          background: processColor,
          border: `1px solid ${processColor}`
        };
      },
      selectedLabel() {
        return `${this.getLabel(this.inputValue[0])} ~ ${this.getLabel(this.inputValue[1])}`;
      },
      unitStyle() {
        return this.brandColor.sub;
      }
    },

    methods: {
      onChange() {
        this.$emit('update:value', this.inputValue);
        this.$emit('update:selectedValue', this.selectedLabel);
      },
      getLabel(value) {
        let val = parseInt(value);
        if(val === 0)
          return `0${this.unit ? this.unit : ''}`;

        let txt = '';
        let unit = 1000000000000;

        let unitTextArray = ['조 ','억 ','만'];
        let utIdx = 0;
        while(unit >= 10000) {
          let divideVal = Math.floor(val / unit);
          if(divideVal>=1) {
            txt += divideVal + unitTextArray[utIdx];
            val = val - divideVal*unit;
          }
          utIdx++;
          unit /= 10000;
        }
        if(val>0 ) {
          txt += ` ${val}`;
        }
        return `${txt}${this.unit ? this.unit : ''}`;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .unit
    font-size 0.9rem
    margin-top 4px
    text-align right
</style>
