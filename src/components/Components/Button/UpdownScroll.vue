<template>
<div class="position-fixed" :style="styles">
  <div :style="iconWrapStyle" class="flex-center margin-bottom-8"
    @click="clickUp">
    <i class="material-icons">keyboard_arrow_up</i>
  </div>
  <div :style="iconWrapStyle" class="flex-center"
    @click="clickDown">
    <i class="material-icons">keyboard_arrow_down</i>
  </div>
</div>
</template>
<script>

export default {
  name: 'UpdownScroll',
  components: {

  },
  mixins: [

  ],
  props: {
    styles: {
      type: Object,
      default: function() {
        return {
          bottom: '148px',
          right: '24px'
        }
      },
      required: false,
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
    clickUp() {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    },
    clickDown() {
      document.documentElement.scrollTop = document.body.scrollHeight;
    }
  },
  computed: {
    iconWrapStyle() {
      return {
        width: '32px',
        height: '32px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.24)'
      }
    }
  },
  watch: {
    
  }
}
</script>


