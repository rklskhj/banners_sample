
export default {
  components: {

  },
  mixins: [

  ],
  props: {

  },


  methods: {
    init() {
      if (this.menu && this.menu.length > 0) {
        if (!this.$route.query.category1 && !this.$route.query.category2 && !this.$route.query.category3 && this.$route.query.gnb !== undefined) {
          this.selectedTab = Number(this.$route.query.gnb);
        }

        if (this.depth === 1 && this.$route.query.category1) {
          for (let i = 0; i < this.menu.length; i++) {
            if (this.menu[i].id === Number(this.$route.query.category1)) {
              this.selectedTab = this.menu[i].id;
            }
          }
        }

        if (this.depth === 2 && this.$route.query.category2) {
          for (let i = 0; i < this.menu.length; i++) {
            if (this.menu[i].id === Number(this.$route.query.category2)) {
              this.selectedTab = this.menu[i].id;
            }
          }
        }

        if (this.depth === 3 && this.$route.query.category3) {
          for (let i = 0; i < this.menu.length; i++) {
            if (this.menu[i].id === Number(this.$route.query.category3)) {
              this.selectedTab = this.menu[i].id;
            }
          }
        }

      }
    },
    clickTab(item, idx) {
      // 드래그앤드 시 클릭방지
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      else if (item.disabled) {
        return;
      }
      else {
        this.selectedTab = item.id;
        this.$emit('clicked', item, idx);
      }

    },
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    }
  },
  computed: {
    grabStyle() {
      return {
        borderBottom: this.brandBorder.main.border,
      }
    }
  },
  watch: {
    '$route.query'(n) {
      setTimeout(() => {
        if (!n.category1 && !n.category2 && !n.category3) {
          if (this.$route.query.gnb !== undefined) this.selectedTab = 0;
          else this.selectedTab = undefined;
        }
      }, 200);
    }
  }
}
