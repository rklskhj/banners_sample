<template>
  <div :style="containerStyle" class="position-relative full-width">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}</div>
    <div class="flex-align wrap">
      <!-- 박스(좌측) -->
      <div v-if="boxAlign==='left'"
           class="check-box unselect"
           :style="[boxStyle,lineStyle]"
           style="margin-right:4px"
           @click.stop.prevent="toggleCheck">
        <i v-if="checked"
           class="material-icons"
           :style="checkStyle">check</i>
      </div>

      <!-- 레이블 -->
      <div class="check-box-text"
           :style="labelStyle">
        <span v-for="(item,idx) in items"  :key="'item-'+idx" :style="spanStyle(item)">
          <span v-if="item.link" @click="toggleLink(item.linkType, item.link)">{{ item.text }}</span>
          <span v-else-if="item.rootemit" @click="rootemit(item.rootemit)">{{ item.text }}</span>
          <span v-else>{{ item.text }}</span>
        </span>
        <span v-if="label.indexOf('*')>-1" class="p-sub2"> (필수)</span>
      </div>

      <!-- 박스(우측) -->
      <div v-if="boxAlign==='right'"
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
    name: 'c-input-checkboxArray',
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
      items: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        checked: false,
      };
    },


    methods: {
      toggleCheck() {
        this.checked = !this.checked;
        this.$emit('update:value', this.checked)
      },
      spanStyle(item) {
        if(item.styles) return item.styles.container;
      },
      toggleLink(linkType, link) {
        if(linkType === 'page' || linkType === undefined) {
          this.routerPush(link);
        } else {
          this.$root.$emit('page_'+linkType, link);
        }

      },
      rootemit(val) {
        this.$root.$emit(val);
      }
    },
    computed: {
      lineStyle() {
        return {
          border: this.brandBorder.main.border
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
      margin 0 4px !important

    .check-box
      display flex
      align-items center
      justify-content center
      background-color white
</style>
