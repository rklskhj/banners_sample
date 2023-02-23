<template>
<div id="button-menu-container" v-show="visible && list.length>0">
  <template v-for="(item,idx) in list">
    <template v-if="item.visible">
      <div v-if="item.img_type==='icon'" :key="'btn-menu'+idx" :style="buttonStyles"
           class="unselect btn material-icons-outlined position-relative" @click="clickBtn(item)">
          {{ item.icon }}
        <div v-if="item.icon.indexOf('cart') > -1 && cartCount > 0"
          class="position-absolute cart-count p-bg-primary flex-center p-white size-10 weight-700"
          :style="countFontStyle">{{ cartCount >= 100 ? '99+' : cartCount }}</div>
      </div>
      <img v-else :key="'btn-menu'+idx" :src="item.img" class="unselect img-box" :style="buttonStyle"
        @click="clickBtn(item)">
    </template>
  </template>
</div>
</template>
<script>

export default {
  name: 'BlockButtonMenu',
  components: {

  },
  mixins: [

  ],
  props: {
    list: {
      type: Array,
    },
    index: {
      type: Number,
    },
    visible: {
      type: Boolean,
    },
    buttonStyle: {
      type: Object,
    },

  },
  data() {
    return {
      "cartCount": 0
    }
  },
  created() {
    this.cartCount = this.$store.getters.cart.length;
  },
  mounted() {
    
  },
  
  methods: {
    clickBtn(item) {
      if (item.emit) {
        this.$emit(item.emit);
      }
      else if(item.linkType === 'outlink') {
        if(item.link.indexOf('http')>-1) {
          const a = document.createElement("a");
          a.href =item.link;
          a.setAttribute('target', '_blank');
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
        } else {
          this.$router.push(item.link);
        }
      }
      else if (item.link!==undefined) {
        if(item.linkType && item.linkType !== 'link') {
          this.$root.$emit('page_'+item.linkType, item.link);
        }
        else {
         this.$router.push(item.link); 
        }
      }
    }
  },
  computed: {
    countFontStyle() {
      return {
        fontFamily: this.$store.getters.brand.font
      }
    },
    buttonStyles() {
      let deco = {};
      if(this.buttonStyle) {
        let deco = this.cloneItem(this.buttonStyle);
        if(deco.color) {
         deco.color = this.parseColor(deco.color); 
        }
      }
      return deco;
    }
  },
  watch: {
    '$store.getters.cart'(n) {
      if (n) {
        this.cartCount = n.length;
      }
    }
  }
}
</script>
<style scoped>
#button-menu-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 24px;
}
  
.img-box {
  width: 30px;
  height: 30px;
}

.material-icons-outlined {
  vertical-align: bottom;
}

.cart-count {
  min-width: 16px;
  max-width: 24px;
  height: 16px;
  padding: 0 4px;
  border-radius: 50px;
  top: -4px;
  left: 14px;
  line-height: 14px;
}
</style>

