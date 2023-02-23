<template>
  <div :style="containerStyle">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div :style="listStyle" class="full-width" style="margin-top:12px">
      <div v-for="(item, idx) in options"
           :key="`check-box-${idx}`"
           class="flex-between" :style="boxWrapStyles(item,idx)">

        <div class="flex-align full-width">
        <!-- 박스(좌측) -->
        <div v-if="aligns==='left'"
             class="check-box unselect position-relative"
             :style="[boxStyle, unselectBoxStyle(item)]"
             style="margin-right:4px"
             @click.stop.prevent="toggleCheck(item)">
          <i v-if="isChecked(item)"
             class="material-icons position-absolute flex-center full-width full-height" style="top:0;left:0"
             :style="checkStyle">check</i>
        </div>

        <!-- 레이블 -->
        <div class="check-box-text"
             @click.stop.prevent="toggleCheck(item)"
             :style="itemLabelStyle(item)">
          {{ item['label'] }}
        </div>

        <!-- 박스(우측) -->
        <div v-if="aligns==='right'"
             class="check-box unselect position-relative"
             :style="[boxStyle, unselectBoxStyle(item)]"
             style="margin-left:4px"
             @click.stop.prevent="toggleCheck(item)">
          <i v-if="item.value"
             class="material-icons position-absolute flex-center full-width full-height" style="top:0;left:0"
             :style="checkStyle">check</i>
        </div>
        </div>

        <i v-if="aligns==='check' && isChecked(item)" class="material-icons size-15 bold" :style="brandColor.brand">check</i>

      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'CInputCheckboxGroup',
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
      boxWrapStyle: {
        type: Object,
        required: false
      },
      boxWrapLastStyle: {
        type: Object,
        required: false
      },
      boxLableSelectedStyle: {
        type: Object,
        required: false
      },
      boxLableUnselectedStyle: {
        type: Object,
        required: false
      },
      aligns: {
        type: String,
        required: false,
        default: 'left'
      },
    },
    data() {
      return {
        align: 'left',
        selectedValue: []
      }
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
        let labelArray = [];
        this.options.forEach(item => {
          if (n.some(value => value === item.value)) {
            labelArray.push(item.label);
          }
        })
        this.$emit('update:selectedValue', labelArray.join(', '))
      }
    },
    methods: {
      unselectBoxStyle(item) {
        if (this.isChecked(item) !== true && !this.boxCustomStyle) {
          return {
            borderRadius: '3px',
            border: this.brandBorder.main.border
          }
        }
      },
      boxWrapStyles(item,idx) {
        let deco = {};
        if(this.boxWrapStyle) {
          deco = this.boxWrapStyle;
          if(idx===this.options.length-1) {
            if(this.boxWrapLastStyle) deco = this.boxWrapLastStyle;
          }
        }

        else {
          deco.marginRight = '24px';
          deco.marginBottom = '12px';
          if(idx===this.options.length-1) {
            deco.marginRight = '0';
          }
        }
        return deco;
      },
      itemLabelStyle(item) {
        let deco = {
          color: this.brandColor.main.color
        };
          if(this.isChecked(item)) {
            if(this.boxLableSelectedStyle) deco = this.boxLableSelectedStyle;
            else deco.color = this.brandColor.brand.color;
          } else {
            if(this.boxLableUnselectedStyle) deco = this.boxLableUnselectedStyle;
            else deco.color = this.brandColor.main.color;
          }

        return deco;
      },
      toggleCheck(item) {
        if (!this.selectedValue.includes(item['value'])) {
          this.selectedValue.push(item['value']);
        }
        else {
          let index = this.selectedValue.indexOf(item['value'])
          if (index >= 0) {
            this.selectedValue.remove(index);
          }
        }
      },
      isChecked(item) {
        if (!this.selectedValue.includes(item['value'])) return false;
        else return true;
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

  .check-box
      display flex
      align-items center
      justify-content center
      background-color white

</style>
