<template>
<div class="flex-end full-width">
  <div @click="openOverlay" class="size-14 unselect"
    :class="{
      'p-primary': category !== null,
      'p-main': category === null
    }"><i class="material-icons-outlined">category</i>카테고리</div>
  <div class="unselect p-bg-primary p-white radius-20 size-12" v-if="category"
    style="padding: 2px 8px;margin-left: 8px">{{ category.label }} <i class="material-icons-outlined" @click="clickClose">close</i></div>
  <div v-if="vOverlay" :class="{'c-input-category-overlay': !isPc, 'c-input-category-modal': isPc}" @click="clickOutside">
    <div :class="{'category-modal-wrapper':isPc}" @click.stop.prevent="">
      <block-input-category-overlay :categories="categories" :category.sync="category" @closePage="vOverlay=false"/>
    </div>
  </div>
</div>
</template>
<script>
import BlockInputCategoryOverlay from "@/components/Components/Block/BlockInputCategoryOverlay/BlockInputCategoryOverlay.vue"

export default {
  name: 'CategoryFilter',
  components: {
    BlockInputCategoryOverlay
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "category": null,
      "vOverlay": false,
      "categories": []
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    clickOutside() {
      this.vOverlay = false;
    },
    getData() {
      this.$axios.get('public/category?depth=3&all=true').then(res => {
          this.categories = res.data.map(cat1=>{
            if(cat1.child) {
              cat1.child.map(cat2 => {
                if(cat2.child) {
                  cat2.child.map(cat3 => {
                    return {id: cat3.id, label: cat3.name, value: cat3.id};
                  });
                }
                return {id: cat2.id, label: cat2.name, value: cat2.id, child: cat2.child, expand: false};
              });
            }
            return {id: cat1.id, label: cat1.name, value: cat1.id, child: cat1.child, expand: false};
          });
      });
    },
    clickClose() {
      this.category = null;
    },
    openOverlay() {
      for(let cat of this.categories) {
        cat.expand = false;
        if(this.category && cat.id === this.category.id) {
          cat.expand = true;
          break;
        }
        else if(cat.child) {
          for(let cat2 of cat.child) {
            if(this.category && cat2.id === this.category.id) {
              cat.expand = true;
              break;
            }
            if(cat2.child) {
              if(cat2.child.filter(cat3=>{ return this.category && cat3.id === this.category.id }).length>0) {
                cat.expand = true;
                break;
              }
            }
          }
        }
      }
      this.vOverlay = true;
      history.pushState('category_overlay','');
      this.$store.commit('setPopstate', 'category_overlay');
    }
  },
  computed: {
    isPc() {
      return this.$store.getters.device === 'pc';
    }
  },
  watch: {
    category(n) {
      this.$emit('selected', n);
    }
  }
}
</script>
<style scoped>
.c-input-category-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;
}
.c-input-category-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
}
.category-modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 564px;
  height: 756px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.material-icons-outlined {
  font-size: 16px;
  vertical-align: sub;
}
</style>

