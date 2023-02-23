<!--
<template>
  <div :style="containerStyle" class="c-input-rich-editor-container
              c-root
              position-relative"
       :id="capturedId"
       @click.stop.prevent="clickEl"
       :style="containerStyle">


    <lp-editor></lp-editor>

  </div>
</template>

<script>
  import ElementMixin from '@/components/Mixins/ElementMixin'
  import ComponentMixin from '@/components/Mixins/ComponentMixin'
  import LpEditor from '@/components/components/Elements/Common/LpEditor'

  export default {
    
    name: "c-input-rich-editor",

    mixins: [
      ElementMixin,
      ComponentMixin
    ],

    components: {
      LpEditor
    },

    props: {
      itemProperties: {
        type: Object,
        required: true
      },
      itemStyles: {
        type: Object,
        required: true
      },
      itemElements: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        properties: this.itemProperties,
        styles: this.itemStyles,
        elements: this.itemElements,
      }
    },

    computed: {
      containerStyle() {
        let deco = {};
        let styles = this.cloneItem(this.styles.container);

        deco = this.decoToStyle(styles);

        return deco;
      }
    }    

  }
</script>

<style lang="stylus" type="stylus" scoped>

</style>
-->
