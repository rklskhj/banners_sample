<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div :style="radioButtonWrapStyle">
      <div class="unselect"
           v-for="(item, idx) in options"
           :key="`radio-button-${idx}`">
        <div class="flex-center" @click="selectRadioButton(item)" :style="btnStyle(item)">{{ item.label }}</div>
      </div>

      <!--<div v-for="(item, idx) in options"
          :key="`radio-button-${idx}`"
          class="flex-align c-radio"
          @click.stop.prevent="selectRadioButton(item)">

        <div v-if="align==='left'"
          class="outer" :style="outerStyle">
          <div v-if="item.value===selectedValue"
               :style="innerStyle"
            class="inner"></div>
        </div>

        <div class="radio-button-text" :style="itemLabelStyle(item)"
          @mouseover="setHover(true)"
          @mouseleave="setHover(false)">{{ item.label }}
          <div :style="brandColor.sub" style="font-size:11px" v-if="item.desc">{{ item.desc }}</div>
        </div>

        <div v-if="align==='right'"
          class="outer" :style="outerStyle">
          <div v-if="item.value===selectedValue"
            class="inner" :style="innerStyle"></div>
        </div>

      </div>-->
    </div>


  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-radio-full-buttonGroup',

    mixins: [
      FormMixin
    ],

    props: {
      options: {
        type: Array,
        required: true
      },
      value: {
        type: [String, Number],
        required: false
      },
      label: {
        type: String,
        required: false
      },
      // 'full'스타일 일 경우
      // column, gutter(px)
      radioButtonFull: {
        type: Object,
        required: false
      },
      radioButtonWrapCustomStyle: {
        type: Object,
        required: false
      }
    },

    computed: {
      columnStyle() {
        if (this.radioButtonFull && this.radioButtonFull.col!==undefined) {
          return `col-${this.radioButtonFull.col}`;
        }
        else return 'col-6';
      },
      radioButtonWrapStyle() {
        if (this.radioButtonWrapCustomStyle) {
          return this.radioButtonWrapCustomStyle;
        } else {
          return {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }
        }
      }
    },

    data() {
      return {
        currentIdx: 0,
        hover: false,
        selectedValue: ''
      }
    },

    created() {
      if(this.options.length > 0 && (this.value===undefined || this.value === '')) {
        this.$emit('update:value', '');
        // this.value = ;
      }

      if(this.value!==undefined) {
        this.selectedValue = this.value;
        let target = find(this.options, 'value', this.value)
        if (target) this.$emit('update:selectedValue', target.label);
      }
    },
    watch: {
      // options(n) {
      //   if(this.value!==undefined && this.value.length===0) {
      //     this.selectedValue = n[0].value;
      //   }
      // },
      value(n) {
        if(n!==undefined) {
          this.selectedValue = n;
        }
        else if (n===undefined) {
          this.selectedValue = '';
        }
      }
    },
    methods: {
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
      itemLabelStyle(item) {
        let deco = {
          fontSize: '15px'
        };
        if(item.value === this.selectedValue) {
          deco.color = this.brandColor.brand.color;
        } else {
          deco.color = this.brandColor.sub.color;
        }
        return deco;
      },
      selectRadioButton(item) {
        if (this.selectedValue===item.value) {
          this.selectedValue = ''; // 재선택 시 해제
          this.$emit('update:value', '');
          this.$emit('update:selectedValue', '');
        }
        else {
          this.selectedValue = item.value;
          this.$emit('update:value', item.value);
          this.$emit('update:selectedValue', item.label);
        }
        this.$emit('changed');
      },
      btnStyle(item) {
        if (item.value === this.selectedValue) {
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
        if(item.value === this.selectedValue) {
          deco.color = this.brandColor.white.color;
          deco.backgroundColor = this.brandBgColor.brand.backgroundColor;
        }

        return deco;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .c-input-radiobutton-group-container
    display flex
    flex-wrap wrap

  .c-input-radiobutton-group-wrap
    display flex
    align-items center

  .radio-button
  .radio-button-text
    cursor pointer

  .outer
    border-radius 50%
    display flex
    align-items center
    justify-content center
    width 18px
    height 18px
    cursor pointer

  .inner
    border-radius 50%
    width 10px
    height 10px
    cursor pointer

  .c-radio
    margin-right 24px
    margin-bottom 12px
  .c-radio:last-child
    margin-right 0


</style>
