<template>
<component v-if="componentName !== 'button-'"
            :is="componentName"
            :product="product"
            :customStyle="btnStyle"
            :width="width"
            :menuTitle="menuTitle"
            :usePopup="usePopup"
            :name="name"
            :isDiscount="isDiscount"
            @liked="res => $emit('liked', res)"></component>
</template>
<script>
import ButtonMeetPc from "@/components/Components/Button/ButtonMeetPc.vue"
import ButtonCounselPc from "@/components/Components/Button/ButtonCounselPc.vue"
import ButtonOutlinkPc from "@/components/Components/Button/ButtonOutlinkPc.vue"
import ButtonCallPc from "@/components/Components/Button/ButtonCallPc.vue"
import ButtonBookingPc from "@/components/Components/Button/ButtonBookingPc.vue"
import ButtonReservationPc from "@/components/Components/Button/ButtonReservationPc.vue"
import ButtonDeliveryPc from "@/components/Components/Button/ButtonDeliveryPc.vue"
import ButtonMartPc from "@/components/Components/Button/ButtonMartPc.vue"

export default {
  name: 'ButtonOrderingPc',
  components: {
    ButtonMeetPc,
    ButtonCounselPc,
    ButtonOutlinkPc,
    ButtonCallPc,
    ButtonBookingPc,
    ButtonReservationPc,
    ButtonDeliveryPc,
    ButtonMartPc
  },
  mixins: [

  ],
  props: {
    name: {
      type: String,
    },
    width: {
      type: String,
      default: "100%",
      required: false,
    },
    height: {
      type: String,
      default: "56px",
      required: false,
    },
    styles: {
      type: String,
      default: "more",
      required: false,
    },
    product: {
      type: Object,
      required: true,
    },
    usePopup: {
      type: Boolean,
      default: false,
    },
    menuTitle: {
      type: String,
      required: false,
    },
    isDiscount: {
      type: Boolean,
    },
    template_name: {
      type: String,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    componentName() {
        let name = 'button-';
        switch(this.product.order_conversion_type) {
          case 1: name += 'call'; break;
          case 2: name += 'outlink'; break;
          case 3: name += 'delivery'; break;
          case 4: name += 'meet'; break;
          case 5: name += 'counsel'; break;
          case 8: name += 'commerce'; break;
          case 10: name += 'reservation'; break;
          case 11: name += 'booking'; break;
          case 12: name += 'mart'; break;
        }
        name += '-pc';
        return name;
      },
    btnStyle() {
        let deco = {
          // width: `${this.width}`,
          height: `${this.height}`,
          textAlign: 'center',
          lineHeight: `${this.height}`,
          borderRadius: '8px',
          fontSize: '18px',
        };
        deco.color = 'white'
        return deco;
      }
  },
  watch: {
    
  }
}
</script>


