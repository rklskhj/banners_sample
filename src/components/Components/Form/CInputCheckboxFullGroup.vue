<template>
  <div :style="containerStyle">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div class="grid-box">
      <div class="unselect"
           :class="columnStyle"
           :style="[gutterStyle(idx)]"
           v-for="(item, idx) in options"
           :key="`check-box-${idx}`">
        <div class="flex-center" @click="toggleCheck(item)" :style="btnStyle(item)">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'CInputCheckboxFullGroup',
    mixins: [
      FormMixin
    ],
    props: {
      options: {
        type: Array,
        required: true
      },
      value: {
        type: Array,
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
      }
    },
    data() {
      return {
        align: 'left',
        selectedValue: []
      }
    },
    computed: {
      columnStyle() {
        if (this.radioButtonFull && this.radioButtonFull.col!==undefined) {
          return `col-${this.radioButtonFull.col}`;
        }
        else return 'col-6';
      },
    },
    created() {
      if (this.value===undefined) this.selectedValue = [];
      else this.selectedValue = this.value;
    },
    watch: {
      value(n) {
        if (this.value===undefined) this.selectedValue = [];
        else this.selectedValue = this.value;
      },
      selectedValue(n) {
        this.$emit('update:value', n);
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
      toggleCheck(item) {
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
  .check-box
  .check-box-text
    cursor pointer

  .check-box-label
    cursor pointer

  .check-align
    margin-right 10px

</style>
