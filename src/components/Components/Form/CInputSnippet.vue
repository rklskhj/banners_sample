<!--
<template>
  <div class="c-input-snippet-container
              c-root
              position-relative
              flex-align"
       :id="capturedId"
       :style="containerStyle"
       @click.stop.prevent="clickEl">

    &lt;!&ndash; 레이블 &ndash;&gt;
    <a-input-label
      :uid="element('a-input-label').uid"
      :itemStyles="element('a-input-label').styles"
      :itemProperties="element('a-input-label').properties"
      ></a-input-label>

    &lt;!&ndash; Snippet &ndash;&gt;
    <div class="value-button flex-center"
         v-if="styles.snippet.buttonPosition === 'between' ||
              styles.snippet.buttonPosition === 'left'"
         :style="buttonStyle"
         @click.stop.prevent="decreaseValue">-</div>
    <div class="value-button flex-center"
         v-if="styles.snippet.buttonPosition === 'left'"
         :style="buttonStyle"
         @click.stop.prevent="increaseValue">+</div>
    <input :style="inputStyle"
           @keyup="onKeyup"
           v-model.number="properties.num"/>
    <div class="value-button flex-center"
         v-if="styles.snippet.buttonPosition === 'right'"
         :style="buttonStyle"
         @click.stop.prevent="decreaseValue">-</div>
    <div class="value-button flex-center"
         v-if="styles.snippet.buttonPosition === 'between' ||
              styles.snippet.buttonPosition === 'right'"
         :style="buttonStyle"
         @click.stop.prevent="increaseValue">+</div>

  </div>
</template>

<script>
  import ElementMixin from '@/components/Mixins/ElementMixin'
  import ComponentMixin from '@/components/Mixins/ComponentMixin'

  export default {

    name: "c-input-snippet",

    mixins: [
      ElementMixin,
      ComponentMixin
    ],

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
        elements: this.itemElements
      }
    },

    methods: {
      onKeyup() {

      },
      decreaseValue() {
        this.properties.num&#45;&#45;;
        if(this.properties.num < 0)
          this.properties.num = 0;
      },
      increaseValue() {
        this.properties.num++;
        if(this.properties.num > this.properties.max)
          this.properties.num = this.properties.max;
      },
    },

    computed: {
      containerStyle() {
        let styles = this.cloneItem(this.styles.container);
        if ( this.builderEditMode ) {
          styles = this.applyFakeStyle(this.type, styles);
        }
        let deco = this.decoToStyle(styles);
        return deco;
      },

      buttonStyle() {
        let styles = this.cloneItem(this.styles.snippet.button);
        let deco = this.decoToStyle(styles);
        return deco;
      },

      inputStyle() {
        let styles = this.cloneItem(this.styles.snippet.input);
        let deco = this.decoToStyle(styles);
        return deco;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .value-button
    cursor pointer

</style>
-->
