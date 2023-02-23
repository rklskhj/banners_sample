<template>
<component v-if="componentName !== 'button-'"
            :is="componentName"
            :customStyle="btnStyle"
            :width="width"
            :menuTitle="menuTitle"
            :usePopup="usePopup"
            :name="name"
            @liked="res => $emit('liked', res)"></component>
</template>
<script>
import ButtonMeet from "@/components/Components/Button/ButtonMeet.vue"
import ButtonCounsel from "@/components/Components/Button/ButtonCounsel.vue"
import ButtonOutlink from "@/components/Components/Button/ButtonOutlink.vue"
import ButtonCall from "@/components/Components/Button/ButtonCall.vue"
import ButtonBooking from "@/components/Components/Button/ButtonBooking.vue"
import ButtonReservation from "@/components/Components/Button/ButtonReservation.vue"
import ButtonDelivery from "@/components/Components/Button/ButtonDelivery.vue"
import ButtonMart from "@/components/Components/Button/ButtonMart.vue"

export default {
  name: 'ButtonOrdering',
  components: {
    ButtonMeet,
    ButtonCounsel,
    ButtonOutlink,
    ButtonCall,
    ButtonBooking,
    ButtonReservation,
    ButtonDelivery,
    ButtonMart
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
      default: "48px",
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
        return name;
      },
    btnStyle() {
        let deco = {
          // width: `${this.width}`,
          height: `${this.height}`,
          textAlign: 'center',
          lineHeight: `${this.height}`,
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500'
        };
        deco.color = 'white'
        return deco;
      }
  },
  watch: {
    
  }
}
</script>


