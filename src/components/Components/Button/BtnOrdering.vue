<template>
  <component v-if="componentName !== 'btn-'"
            :is="componentName"
            :product="product"
            :customStyle="btnStyle"
            :width="width"
            :menuTitle="menuTitle"
            :usePopup="usePopup"
            :name="name"
            @liked="res => $emit('liked', res)"></component>
</template>

<script>
  export default {
    name: "BtnOrdering",
    props: {
      product: {
        type: Object,
        required: true
      },
      width: {
        type: String,
        default: "100%",
        required: false,
      },
      height: {
        type: String,
        default: "48px",
        required: false,
      },
      styles: {
        type: String,
        default: "more",
        required: false,
      },
      name: {
        type: String
      },
      menuTitle: {
        type: String,
        required: false
      },
      usePopup: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      componentName() {
        let name = 'btn-';
        switch(this.product.order_conversion_type) {
          case 1: name += 'call'; break;
          case 2: name += 'outlink'; break;
          case 3: name += 'delivery'; break;
          case 4: name += 'meet'; break;
          case 5: name += 'counsel'; break;
          case 8: name += 'commerce'; break;
          case 10: name += 'reservation'; break;
          case 11: name += 'booking'; break;
          case 12: name += 'mart1'; break;
        }

        return name;
      },
      btnStyle() {
        let deco = {
          width: `${this.width}`,
          height: `${this.height}`,
          textAlign: 'center',
          lineHeight: `${this.height}`,
          borderRadius: '8px',
          fontSize: '14px',
        };
        deco.backgroundColor = `${this.getColor('Primary Color')}`
        deco.color = 'white'
        return deco;
      },
    }
  }
</script>

<style lang="stylus" scoped>

</style>