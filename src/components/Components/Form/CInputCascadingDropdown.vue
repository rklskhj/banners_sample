<template>
  <div :style="containerStyle">

    <transition-group name="fade">

      <div v-if="formType.label && label" :style="labelStyle" key="drop1-label">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
      <c-input-dropdown v-bind="drop1" :gutter="0"
                        :dropdownCustomStyle="dropdownCustomStyle"
                        :dropItemCustomStyle="dropItemCustomStyle"
                        :iconCustomStyle="iconCustomStyle"
                        @update:value="res => selectedItem(res, 0)"
                        key="drop1-dropdown"></c-input-dropdown>
      <div v-if="drop2.options && drop2.options.length>0" style="width:100%;height:8px" key="drop2-label"></div>
      <c-input-dropdown v-bind="drop2" v-if="drop2.options && drop2.options.length>0" :gutter="0"
                        :dropdownCustomStyle="dropdownCustomStyle"
                        :dropItemCustomStyle="dropItemCustomStyle"
                        :iconCustomStyle="iconCustomStyle"
                        @update:value="res => selectedItem(res, 1)"
                        key="drop2-dropdown"></c-input-dropdown>
      <div v-if="drop2.options && drop2.options.length>0 && drop3.options && drop3.options.length>0" style="width:100%;height:8px" key="drop3-label"></div>
      <c-input-dropdown v-bind="drop3" v-if="drop2.options && drop2.options.length>0 && drop3.options && drop3.options.length>0" :gutter="0"
                        :dropdownCustomStyle="dropdownCustomStyle"
                        :dropItemCustomStyle="dropItemCustomStyle"
                        :iconCustomStyle="iconCustomStyle"
                        @update:value="res => selectedItem(res, 2)"
                        key="drop3-dropdown"></c-input-dropdown>

    </transition-group>

  </div>
</template>

<script>
  import FormMixin from "@/components/Mixins/FormMixin";

  export default {
    name: "c-input-cascadingDropdown",

    mixins: [
      FormMixin
    ],

    props: {
      dropdown: {
        type: Array,
        required: true
      },
      dropItemCustomStyle: {
        type: Object,
        required: false
      },
      iconCustomStyle: {
        type: Object,
        required: false
      }
    },

    created() {
      this.drop1.options = this.dropdown;
      if(this.value) {
        if(this.value.dropdown1) {
          let selItem = find(this.drop1.options, 'id', this.value.dropdown1);
          this.drop1.value = selItem.value;
          this.drop1.selectedValue = typeof(this.drop1.value) === 'object' ? this.drop1.value.value : this.drop1.value;

          if(this.value.dropdown2) {
            setTimeout(()=> {
              this.drop2.options = selItem.child;
              let selItem2 = find(this.drop2.options, 'id', this.value.dropdown2);
              this.drop2.value = selItem2.value;
              this.drop2.selectedValue = typeof(this.drop2.value) === 'object' ? this.drop2.value.value : this.drop2.value;

              setTimeout(()=> {
                if(this.value.dropdown3) {
                  this.drop3.options = selItem2.child;
                  this.drop3.value = find(this.drop3.options, 'id', this.value.dropdown3).value;
                  this.drop3.selectedValue = typeof(this.drop3.value) === 'object' ? this.drop3.value.value : this.drop3.value;
                }
              },300);
            },300);
          }
        }
      }
    },

    data() {
      return {
        selectedLabel: '',
        drop1: {
          label: '',
          options: [],
          selectedValue: undefined,
          init: false
        },
        drop2: {
          label: '',
          options: [],
          selectedValue: undefined,
          init: false
        },
        drop3: {
          label: '',
          options: [],
          selectedValue: undefined,
          init: false
        }

      }
    },

    methods: {
      selectedItem(item, idx) {
        if(idx === 0) {
          if(this.drop1.init) {
            this.drop1.init = false;
            return;
          }
          let selItem = find(this.drop1.options, 'value', item);

          this.drop1.selectedValue = item;
          this.drop2.options = selItem.child;
          this.drop2.selectedValue = (selItem.child && selItem.child.length > 0) ? selItem.child[0].value : undefined;
          this.drop2.value = this.drop2.selectedValue;
        }

        else if(idx === 1){
          if(this.drop2.init) {
            this.drop2.init = false;
            return;
          }
          let selItem = find(this.drop2.options, 'value', item);
          this.drop2.selectedValue = item;
          this.drop3.options = selItem.child;
          this.drop3.selectedValue = (selItem.child && selItem.child.length > 0) ? selItem.child[0].value : undefined;
          this.drop3.value = this.drop3.selectedValue;
        }

        else if(idx === 2){
          if(this.drop3.init) {
            this.drop3.init = false;
            return;
          }
          this.drop3.selectedValue = item;
        }

        this.$emit('update:value', {
          dropdown1: this.drop1.selectedValue,
          dropdown2: this.drop2.selectedValue,
          dropdown3: this.drop3.selectedValue
        });
        let sel = '';
        if(this.drop1.selectedValue) {
          sel = find(this.drop1.options, 'id', this.drop1.selectedValue).label;
        }


        if(this.drop2.selectedValue) {
          if(sel !== '') sel += ' ';
          sel = find(this.drop2.options, 'id', this.drop2.selectedValue).label;
        }

        if(this.drop3.selectedValue) {
          if(sel !== '') sel += ' ';
          sel = find(this.drop3.options, 'id', this.drop3.selectedValue).label;
        }


        this.$emit('update:selectedValue', sel);
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

.fade-enter-active
  transition opacity .3s ease-in-out
.fade-enter
  opacity 0

</style>
