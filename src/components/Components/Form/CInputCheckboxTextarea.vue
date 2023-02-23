<template>
  <div :style="containerStyle" class="full-width">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- text area -->
    <div v-html="textarea" class="full-width" style="height:100px;overflow-y:scroll; border: 1px solid #ddd; padding:12px; margin:12px 0"></div>

    <div class="flex-align">
      <!-- 박스(좌측) -->
      <div v-if="boxAlign === 'left'"
           class="check-box unselect"
           :style="boxStyle"
           style="margin-right:4px"
           @click.stop.prevent="toggleCheck">
        <i v-if="checked"
           class="material-icons"
           :style="checkStyle">check</i>
      </div>

      <!-- 레이블 -->
      <div class="check-box-text unselect" :style="textStyle"
           @click.stop.prevent="toggleCheck">
        {{ text }}
      </div>

      <!-- 박스(우측) -->
      <div v-if="boxAlign === 'right'"
           class="check-box unselect"
           :style="boxStyle"
           style="margin-left:4px"
           @click.stop.prevent="toggleCheck">
        <i v-if="checked"
           class="material-icons"
           :style="checkStyle">check</i>
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-checkbox-textarea',
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
      text: {
        type: String,
        required: true
      },
      textarea: {
        type: String,
        required: true
      },
      boxAlign: {
        type: String,
        required: false,
        default: 'left'
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
      }
    },

    computed: {
      textStyle() {
        let deco = cloneItem(this.labelStyle);
        delete deco.margin;
        deco.color = this.brandColor.main;
        deco.marginLeft = '4px';
        return deco;
      }
    },

    methods: {
      toggleCheck() {
        this.checked = !this.checked;
        this.$emit('update:value', this.checked);
        this.$emit('onUpdate', {
          name: this.name,
          value: this.checked
        });
      },
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
