<template>
  <div :style="containerStyle" class="position-relative flex-align wrap full-width">
    <!-- 박스(좌측) -->
    <div v-if="boxAlign === 'left'"
         class="check-box unselect"
         :style="[boxStyle, unselectBoxStyle(checked)]"
         style="margin-right:4px"
         @click.stop.prevent="toggleCheck">
      <i v-if="checked"
         class="material-icons flex-center full-width full-height"
         :style="checkStyle">check</i>
    </div>

    <!-- 레이블 -->
    <div class="check-box-text"
         v-if="formType.label && label"
         :style="labelStyle"
         @click.stop.prevent="toggleCheck">
      {{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span> <slot name="confirm"></slot>
    </div>

    <!-- 박스(우측) -->
    <div v-if="boxAlign === 'right'"
         class="check-box unselect"
         :style="[boxStyle, unselectBoxStyle(checked)]"
         style="margin-left:4px"
         @click.stop.prevent="toggleCheck">
      <i v-if="checked"
         class="material-icons flex-center full-width full-height"
         :style="checkStyle">check</i>
    </div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-checkbox',
    mixins: [
      FormMixin
    ],

    props: {
      value: {
        type: Boolean,
        required: false
      },
      label: {
        type: String,
        required: false
      },
      boxAlign: {
        type: String,
        required: false,
        default: 'left'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        checked: this.value,
      };
    },

    created() {
      this.checked = this.value;
    },

    watch: {
      value(n) {
        this.checked = n;
      },
      disabled(n) {
        if (n) {
          this.checked = false
          this.$emit('update:value', this.checked)
        }
      }
    },

    methods: {
      toggleCheck() {
        if (!this.disabled) {
          this.checked = !this.checked;
          this.$emit('update:value', this.checked);
        } else {
          return;
        }
        // this.$emit('onUpdate', {
        //   name: this.name,
        //   value: this.checked
        // });
      },
      unselectBoxStyle(checked) {
        if (checked !== true && !this.boxCustomStyle) {
          return {
            borderRadius: '3px',
            border: this.brandBorder.main.border
          }
        }
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .check-box
  .check-box-text
    cursor pointer

  .check-box-text
    margin 0 !important

  .check-box
    display flex
    align-items center
    justify-content center
    background-color white
</style>
