<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div class="grid-box" style="margin-top:12px">
      <div v-for="(item, idx) in options"
           :key="`radio-button-${idx}`"
           class="flex-between full-width"
           :style="labelWrapStyle(item,idx)"
           @click.stop.prevent="selectRadioButton(item)">

        <div class="flex full-width">
          <div v-if="align==='left'"
               class="outer" :style="outerStyle(item)">
            <div v-if="item.value===selectedValue"
                 :style="innerStyle(item)"
                 class="inner flex-center">
              <i v-if="useIcon" class="material-icons" :style="iconCustom.style">{{ iconCustom.iconName }}</i>
            </div>
          </div>

          <div class="radio-button-text position-relative" :style="itemLabelStyle(item)"
               @mouseover="setHover(true, item)"
               @mouseleave="setHover(false, item)">{{ item.label }}
            <div class="position-absolute hover-text-style"
                 v-if="hoverText&&item.disabled&&item.disabled_action==='hover'"
                 :style="[brandColor.sub, brandBgColor.sub, brandBorder.main]">준비중입니다.</div>
            <div :style="brandColor.main" style="font-size:11px" v-if="item.desc">{{ item.desc }}</div>
          </div>

          <div v-if="align==='right'"
               class="outer" :style="outerStyle(item)">
            <div v-if="item.value===selectedValue"
                 class="inner flex-center" :style="innerStyle(item)">
              <i v-if="useIcon" class="material-icons" :style="iconCustom.style">{{ iconCustom.iconName }}</i>
            </div>
          </div>
        </div>

        <i v-if="align==='check' && item.value===selectedValue" class="material-icons size-14 bold" :style="brandColor.brand">check</i>

      </div>
    </div>


  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-radiobuttonGroup',

    mixins: [
      FormMixin
    ],

    props: {
      options: {
        type: Array,
        required: true
      },
      value: {
        type: [String, Number, Boolean],
        required: false
      },
      label: {
        type: String,
        required: false
      },
      align: {
        type: String,
        required: false,
        default: 'left'
      },
      itemLableSelectedStyle: {
        type: Object,
        required: false
      },
      itemLableUnselectedStyle: {
        type: Object,
        required: false
      },
      labelWrapCustomStyle: {
        type: Object,
        required: false
      },
      labelWrapLastStyle: {
        type: Object,
        required: false
      },
      outerCustomStyle: {
        type: Object,
        required: false
      },
      innerCustomStyle: {
        type: Object,
        required: false
      },
      useIcon: {
        type: Boolean,
        default: false
      },
      iconCustom: {
        type: Object,
        required: false
      }
    },

    computed: {

    },

    data() {
      return {
        currentIdx: 0,
        hover: false,
        selectedValue: '',
        hoverText: false,
        disabledState: ''
      }
    },

    created() {

      if (this.options) {
        this.disabledState = this.options.every(item => {
          return item.disabled===undefined || item.disabled===false || item.disabled==='';
        })
      }
      else this.disabledState = true;


      if(this.disabledState===false) {
        this.options.forEach(item => {
          if(item.disabled) {

            for(let i=0;this.options.length;i++) {
              if ((this.options[i].disabled===undefined || this.options[i].disabled===false) && (this.options[i].value !==undefined || this.options[i].value!=='') && this.selectedValue==='') {
                this.selectedValue = this.options[i].value;
                this.$emit('update:value', this.selectedValue);
                this.$emit('update:selectedValue', find(this.options, 'value', this.selectedValue).label);
                break;
              }
            }
          }
        })
      }

      else {
        if(this.value) {
          this.selectedValue = this.value;
          this.$emit('update:value', this.selectedValue)
        }
        if(this.options.length > 0 && (this.value===undefined || this.value === '') && this.selectedValue==='') {
          this.$emit('update:value', this.options[0].value);
          this.$emit('update:selectedValue',  this.options[0].label);
        }

        if((this.value || this.value===0 || this.value===false) && this.selectedValue==='') {
          this.selectedValue = this.value;
          this.$emit('update:value', this.options[0].value);
          this.$emit('update:selectedValue',  this.options[0].label);
          if (find(this.options, 'value', this.value)!==undefined) {
            this.$emit('update:selectedValue', find(this.options, 'value', this.value).label);
          }
        }
      }
    },
    watch: {
      options(n) {
        if(this.value.length===0) {
          this.value = n[0].value;
        }
      },
      value(n) {
        if(n || n===0 || n===false) {
          this.selectedValue = n;
        }
      }
    },
    methods: {
      outerStyle(item) {
        let deco = {
          width: '16px',
          height: '16px',
          margin: '4px 8px 0 0',
          border: this.brandBorder.main.border.replace('1px','2px'),
          cursor: 'pointer'
        };
        if (this.outerCustomStyle) {
          deco = this.outerCustomStyle;
        }
        if(item.disabled) {
          deco.cursor = 'default'
        }
        if(item.value === this.selectedValue) {
          deco.border = this.brandBorder.primary.border.replace('1px','2px');
        }
        return deco;
      },

      innerStyle(item) {
        let deco = {
          width: '8px',
          height: '8px',
          backgroundColor: this.brandBgColor.brand.backgroundColor,
          cursor: 'pointer'
        };
        if (this.innerCustomStyle) {
          deco = this.innerCustomStyle;
        }
        if(item.disabled) {
          deco.cursor = 'default'
        }
        return deco;
      },
      setHover(val, item) {
        this.hover = val;
        if(this.hover) {
          if(item.disabled&&item.disabled_action==='hover') {
            this.hoverText = true;
          }
        }
        else {
          this.hoverText = false;
        }
      },
      labelWrapStyle(item,idx) {
        let deco = {
          width: '100%'
        };

        if(this.labelWrapCustomStyle) {
          deco = this.labelWrapCustomStyle;
          if(idx===this.options.length-1) {
            if(this.labelWrapLastStyle) deco = this.labelWrapLastStyle;
          }
        }

        else {
          // deco[idx%2===0 ? 'paddingRight' : 'paddingLeft'] = '12px';
          deco.paddingBottom = '12px';

          if(item.id===this.options[this.options.length-1].id) {
            deco.paddingRight = '0';
          }
        }
        return deco;
      },
      itemLabelStyle(item) {
        let deco = {
          fontSize: '15px',
          flex: 1,
          color: this.brandColor.main.color
        };
        if(item.disabled) {
          deco.color = this.brandColor.sub3.color;
          deco.cursor = 'default';
        }
        else {
          if(item.value === this.selectedValue) {
            if(this.itemLableSelectedStyle) deco = this.itemLableSelectedStyle;
          } else {
            if(this.itemLableUnselectedStyle) deco = this.itemLableUnselectedStyle;
            else deco.color = this.brandColor.main.color;
          }
        }

        return deco;
      },
      selectRadioButton(item) {
        if(!item.disabled) {
          this.selectedValue = item.value;
          this.$emit('update:value', item.value);
          this.$emit('update:selectedValue', item.label);
        }

        // // 모든 라디오버튼 off
        // let data = this.itemProperties.options;
        // for(let i=0; i<data.length; i++) {
        //   data[i].selected = false;
        // }
        // // 선택된 라디오버튼만 on
        // data[idx].selected = true;

        /*let action = this.cloneItem(this.properties.action);
        if(action!==undefined) {
          action.value = action.value.replace('{value}', item.label);
        }
        this.onClickAction(action);*/

      },
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

  .inner
    border-radius 50%
    width 10px
    height 10px



  .hover-text-style
    left 0
    top 28px
    padding 2px 12px
    white-space pre
    border-radius 8px

</style>
