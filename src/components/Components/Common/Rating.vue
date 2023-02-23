<template>
  <div class="rating">
    <star-rating :star-size="rateSize"
                 :border-width="2"
                 :inactive-color="defaultColor"
                 :border-color="useBorder ? rateColor : ''"
                 :increment="0.1"
                 :active-color="rateColor"
                 :show-rating="showRating"
                 :read-only="disabled"
                 v-model="value"
                 :rounded-corners="roundShape ? true : false"
                 :padding="ratePadding"
                 :star-points="roundShape ? (isNew ? newShape : originShape) : []"></star-rating>
  </div>
</template>

<script>
  import StarRating from 'vue-star-rating';

  export default {
    name: "Rating",

    components: {
      StarRating
    },

    props: {
      value: {
        type: Number,
        required: true
      },
      useBorder: {
        type: Boolean,
        default: true
      },
      defaultColor: {
        type: String,
        required: false,
        default: '#ffffff'
      },
      rateColor: {
        type: String,
        required: false,
        default: '#fddb46'
      },
      rateSize: {
        type: Number,
        required: false,
        default: 25
      },
      showRating: {
        type: Boolean,
        required: false,
        default: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: true
      },
      roundShape: {
        type: Boolean,
        required: false,
        default: false
      },
      isNew: {
        type: Boolean,
        required: false,
        default: false
      },
      ratePadding: {
        type: Number,
        required: false,
        default: 0
      }
    },
    data() {
      return {
        originShape: [23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17],
        newShape: [20,34, 30,40, 31,40, 32,40, 33,38, 33,37, 31,25, 39,18, 40,16, 40,15, 39,14, 38,13, 27,12, 22,1, 21,0, 20,0, 19,0, 18,1, 13,12, 2,13, 1,14, 0,15, 0,16, 1,18, 9,25, 7,37, 7,38, 8,40, 9,40, 10,40, 20,34]
      }
    }
  }
</script>