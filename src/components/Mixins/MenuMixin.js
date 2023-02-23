
export default {
  components: {

  },
  mixins: [

  ],
  props: {

  },


  methods: {
    async setMenus(styles, device) {
      let obj = this.$store.getters.brand.menu_set.filter(item => item.style === styles && item.device === device)[0];
      return obj.is_category ? await this.getCategories(obj.menu) : obj.menu;
    },
    async getCategories(setting) {
      let category = await this.$axios.get(`public/category?depth=3`);
      return category.data;
    }
  },
  computed: {

  },
  watch: {

  }
}
