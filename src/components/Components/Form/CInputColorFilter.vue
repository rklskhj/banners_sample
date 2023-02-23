<template>
<div :style="containerStyle">
  <!-- 레이블 -->
  <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

  <div class="flex wrap">
    <div class="unselect" v-for="(item, idx) in options" :key="'color-checkbox-'+idx"
      :style="colorWrapperStyle(idx)"
      @click="toggleCheck(item)">
      <div class="flex-center" :style="[colorShape, colorStyle(item)]">
        <i v-if="isChecked(item)" :style="checkedStyle(item)" class="material-icons">check</i>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import FormMixin from "@/components/Mixins/FormMixin";
  export default {
    name: 'CInputColorFilter',
    mixins: [
      FormMixin
    ],
    props: {
      options: {
        type: Array,
        required: true
      },
      value: {
        type: [Array,String],
        required: false
      },
      label: {
        type: String,
        required: false
      },
      customColorShape: {
        type: Object,
        required: false
      },
      customColorWrapperStyle: {
        type: Object,
        required: false
      },
      // 'full'스타일 일 경우
      // column, gutter(px)
      radioButtonFull: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        align: 'left',
        selectedValue: []
      }
    },
    computed: {
      colorShape() {
        let deco = {
          width: '40px',
          height: '40px',
          borderRadius: '100%',
        }
        if (this.customColorShape) {
          deco = this.customColorShape;
        }
        deco.border = this.brandBorder.main.border;
        return deco;
      }
    },
    created() {
      if (this.value===undefined) this.selectedValue = [];
      else this.selectedValue = this.value;
    },
    watch: {
      value() {
        if (this.value===undefined || this.value === '') this.selectedValue = [];
        else this.selectedValue = this.value;
      },
      selectedValue(n) {
        this.$emit('update:value', n);
      }
    },
    methods: {
      colorWrapperStyle(index) {
        let deco = {
          paddingBottom: '24px',
          width: '20%'
        };
        let maxLen = parseInt(this.options.length/5) + 1;
        if(parseInt(index/5)+1 === maxLen) {
          deco.paddingBottom = 0;
        }
        if (this.customColorWrapperStyle) {
          deco = this.customColorWrapperStyle;
        }
        return deco;
      },
      checkedStyle(item) {
        let deco = {
          fontSize: '20px'
        }
        deco.color = this.getTextColorByBgColor(item.color);
        return deco;
      },
      colorStyle(item) {
        return {
          backgroundColor: `${item.color}`
        };
      },
      getTextColorByBgColor(hexColor) {
        let c = hexColor.substring(1); // 색상 앞 # 제거
        let rgb = parseInt(c, 16) // rrggbb를 10진수로 변환
        let r = (rgb >> 16 ) & 0xff // red 추출
        let g = (rgb >> 8) & 0xff; // green 추출
        let b = (rgb >> 0) & 0xff; // blue 추출
        let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // ITU-R BT.709(16:9 비율 HDTV 색상표준)에 기반한 색상 변환

        // 글자 색 반환
        return luma < 127.5 ? this.brandColor.white.color : '#000000';
      },
      gutterStyle(idx) {
        let deco = {};
        let gutter = '4px';
        if (this.radioButtonFull && this.radioButtonFull.gutter!==undefined) {
          gutter = this.radioButtonFull.gutter + 'px';
        }
        deco.padding = gutter;
        let col = 6;
        if (this.radioButtonFull && this.radioButtonFull.col!=undefined) {
          col = this.radioButtonFull.col;
        }
        let num = 12/col;
        if (idx % num === 0) deco.paddingLeft = 0;              // 열 첫번째
        else if (idx % num === (num-1)) deco.paddingRight = 0;  // 열 마지막
        return deco;
      },
      toggleCheck(item) {
        if (this.selectedValue === '') this.selectedValue = [];
        if (!this.selectedValue.includes(item['id'])) {
          this.selectedValue.push(item['id']);
        }
        else {
          let index = this.selectedValue.indexOf(item['id'])
          if (index >= 0) {
            this.selectedValue.remove(index);
          }
        }
        this.$emit('changed');
      },
      isChecked(item) {
        if (!this.selectedValue.includes(item['id'])) return false;
        else return true;
      },
      btnStyle(item) {
          if (this.selectedValue.indexOf(item.id)>-1) {
            if (this.fullSelectedCustomStyle) return this.fullSelectedCustomStyle;
          }
          else {
            if (this.fullUnselectedCustomStyle) return this.fullUnselectedCustomStyle;
          }

        let deco = {
          borderRadius: this.radius.borderRadius,
          border: this.brandBorder.main.border,
          color: this.brandColor.sub.color,
          backgroundColor: this.brandBgColor.sub.backgroundColor,
          height: '48px',
          textAlign: 'center',
          // lineHeight: '48px',
        };
        if(this.selectedValue.indexOf(item.id)>-1) {
          deco.color = this.brandColor.white.color;
          deco.backgroundColor = this.brandBgColor.brand.backgroundColor;
        }

        return deco;
      }
    }
  }
</script>
<style lang="stylus" type="stylus" scoped>

</style>
