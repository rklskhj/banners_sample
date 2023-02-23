<template>
<div style="margin-top:20px" class="full-width">
  <span class="size-14" v-for="(cat,idx) in categories" 
    :class="{'unselect': idx !== categories.length - 1}"
    style="user-select:none"
    :key="'bread-cat-'+idx" @click="clickItem(cat, idx)"><span
    @mouseover="onHover(idx)" @mouseleave="onLeave(idx)"
    :class="{
      'p-primary': cat.hover,
      'p-sub': !cat.hover
    }">{{ cat.name }}</span> <i class="material-icons" 
    style="vertical-align:middle;font-size:15px;margin: 0 8px"
    :style="iconStyle"
    v-if="idx < categories.length-1">keyboard_arrow_right</i></span>
</div>
</template>
<script>

export default {
  name: 'BlockBreadcrumbPc',
  components: {

  },
  mixins: [

  ],
  props: {
    product: {
      type: Object,
    },

  },
  data() {
    return {
      "categories": []
    }
  },
  created() {
    let categories = [];
    if(this.product.category1) {
      let cat1 = this.$store.getters.category.filter(item=>{ return item.id === this.product.category1 });
      if(cat1.length>0) {
        cat1 = cat1[0];
        categories.push(cat1);
        
        if(this.product.category2) {
          let cat2 = cat1.child.filter(item=>{ return item.id === this.product.category2 });
          if(cat2.length>0) {
            cat2 = cat2[0];
            categories.push(cat2);
            if(this.product.category3) {
              let cat3 = cat2.child.filter(item=>{ return item.id === this.product.category3 });
              if(cat3.length>0) {
                categories.push(cat3[0]);
                
              }
            }
          }
        }
      }
    }
    categories.forEach(cat => {
      cat.hover = false;
    })
    this.categories = categories;
  },
  mounted() {

  },
  
  methods: {
    onHover(idx) {
      let categories = this.cloneItem(this.categories);
      categories.forEach((cat, index) => {
        if (idx === index) {
          categories[idx].hover = true;
        }
      })
      this.categories = categories;
    },
    onLeave(idx) {
      let categories = this.cloneItem(this.categories);
      categories.forEach((cat, index) => {
        if (idx === index) {
          categories[idx].hover = false;
        }
      })
      this.categories = categories;
    },
    clickItem(item, idx) {
      if (idx !== this.categories.length - 1) {
        this.routerPush(`product?gnb=${item.id}`);
      }
    }
  },
  computed: {
    iconStyle() {
      let deco = {
        color: this.brandBorder.main.border.split('1px solid ')[1]
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


