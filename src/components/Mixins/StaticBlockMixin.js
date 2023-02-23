
export default {
  components: {

  },
  mixins: [

  ],
  props: {

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
    syncBrandColor(data) {
      Object.keys(data).forEach(key => {
        if (data[key].brand) {
          data[key] = find(this.$store.getters.brand.color_theme.data, 'name', data[key].brand).color;
        }
      })
      return data;
    }
  },
  computed: {
  
  },
  watch: {
  
  }
}
