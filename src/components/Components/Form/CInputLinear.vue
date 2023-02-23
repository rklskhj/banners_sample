<!--
<template>
  <div :style="containerStyle" class="c-input-linear-container
              c-root
              position-relative"
       :id="capturedId"
       :style="containerStyle"
       @click.stop.prevent="clickEl">

    &lt;!&ndash; 레이블 &ndash;&gt;
    <a-input-label
      :uid="element('a-input-label').uid"
      :itemStyles="element('a-input-label').styles"
      :itemProperties="element('a-input-label').properties"
    ></a-input-label>

    <div class="c-input-linear">
      <div class="flex" style="justify-content: space-between">
        <div
          @key="'linear-'+idx"
          v-for="(num, idx) in rangeVal" :key="`num${idx}`"
          :style="numberStyle(num, idx)"
          @click.stop.prevent="clickNum(num)"
        >{{ num }}</div>
      </div>
      <div :style="labels">
        <div style="text-align: center;">{{ properties.range.min.label }}</div>
        <div style="text-align: center;">{{ properties.range.max.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import ElementMixin from '@/components/Mixins/ElementMixin'
  import ComponentMixin from '@/components/Mixins/ComponentMixin'

  export default {
    name: "c-input-linear",

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
        elements: this.itemElements,
      };
    },

    computed: {
      numberOuterStyle() {
        let deco = {
          width: (100.0 / this.rangeVal.length).toString() + '%'
        }

        return deco;
      },
      // 최소 ~ 최대값 범위의 array
      rangeVal() {
        let nums = [];
        for(let i = this.properties.range.min.val; i <= this.properties.range.max.val; i++)
          nums.push(i);

        return nums;
      },

      // 전체 스타일
      containerStyle() {
        let styles = this.cloneItem(this.styles.container);
        if ( this.builderEditMode ) {
          styles = this.applyFakeStyle(this.type, styles);
        }
        let deco = this.decoToStyle(styles);
        return deco;
      },

      // 최대, 최소값 label 스타일
      labels() {
        let deco = {
          marginTop: '2px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: lp.colorToString(lp.Color(162, 174, 186, 1), this.getBrandColor)
        }

        return deco;
      }
    },

    methods: {
      // 번호 클릭
      clickNum(num) {
        console.log(num);
        this.properties.selected = num;
        this.$emit('update:itemProperties', this.properties);
      },

      // 숫자 스타일
      numberStyle() {
        let deco = this.decoToStyle(this.style.number);
        deco.lineHeight = (deco.height.val - 2) + 'px';
        return deco;
      },
    }

  }
</script>
-->
