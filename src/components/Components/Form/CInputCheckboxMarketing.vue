<template>
  <div :style="containerStyle">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
    <div :style="wrapStyle">
      <c-input-checkboxArray :value="checkAll" @update:value="val => updateCheckAll(val)" ref="cbArray"
        :items="items" :labelCustomStyle="labelCustomStyle"
        :boxCustomStyle="boxCustomStyle" :checkCustomStyle="checkCustomStyle"
        :containerCustomStyle="containerCustomStyle"></c-input-checkboxArray>
      <div :style="cbGroupStyle">
        <c-input-checkbox-group :options="options" :containerCustomStyle="{marginTop: '12px'}" ref="cbGroup"
          :value="selectedVal" @update:value="val => updateSelectedVal(val)"
          :boxCustomStyle="boxCustom" :checkCustomStyle="checkCustom"
          :boxWrapStyle="{marginRight: '32px', marginBottom: '0px'}"
          :boxWrapLastStyle="{marginRight: '0px', marginBottom: '0px'}"></c-input-checkbox-group>
        <div style="margin-top: 16px">
          <div v-for="(info, idx) in infoMessages" :key="'info-'+idx"
            class="size-12 weight-500" :style="brandColor.sub">- {{ info.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import CInputCheckboxArray from './CInputCheckboxArray.vue'
  import CInputCheckboxGroup from './CInputCheckboxGroup.vue'

  export default {
    name: 'c-input-checkboxMarketing',
    components: {
      CInputCheckboxArray,
      CInputCheckboxGroup
    },
    mixins: [
      FormMixin
    ],

    props: {
      items: {
        type: Array,
        required: true
      },
      options: {
        type: Array,
        required: true
      },
      wrapStyle: {
        type: Object,
        required: false
      },
      infoMessages: {
        type: Array,
        required: false
      },
      value: {
        type: Array,
        required: true
      },
      cbGroupCustomStyle: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        checkAll: false,
        selectedVal: []
      };
    },
    created() {
      if (this.value===undefined) this.selectedVal = [];
      else this.selectedVal = this.value;
    },
    methods: {
      updateCheckAll(val) {
        if (val) {
          let options = this.$refs.cbGroup.options;
          options.forEach(item => {
            if (!this.$refs.cbGroup.isChecked(item)) {
              this.$refs.cbGroup.selectedValue.push(item['value']);
            }
          })
        } else {
          this.$refs.cbGroup.selectedValue = [];
        }
        this.checkAll = val;
      },
      updateSelectedVal(val) {
        this.selectedVal = val;
        if (this.selectedVal.length === this.options.length) {
          this.$refs.cbArray.checked = true;
          this.checkAll = true;
        } else {
          if (this.checkAll) {
            this.$refs.cbArray.checked = false;
            this.checkAll = false;
          }
        }
      }
    },
    computed: {
      boxCustom() {
        return {
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          border: '2px solid #dddddd'

        }
      },
      checkCustom() {
        return {
          width: '28px',
          height: '28px',
          fontSize: '24px',
          backgroundColor: this.getColor('Primary Color'),
          borderRadius: '8px',
          color: 'white',
          top: '-2px',
          left: '-2px',
          padding: '2px'
        }
      },
      cbGroupStyle() {
        let deco = {
          padding: '0 40px'
        };
        if (this.cbGroupCustomStyle) deco = this.cbGroupCustomStyle;
        return deco;
      }
    },
    watch: {
      value() {
        if (this.value===undefined) {
          this.selectedVal = [];
        }
        else {
          this.selectedVal = this.value;
        }
      },
      selectedVal() {
        this.$emit('update:value', this.selectedVal)
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

</style>
