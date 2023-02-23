<template>
  <div class="position-relative">

    <!-- 레이블 -->
    <div v-if="formType.label && label"
         :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 컨텐츠 -->
    <div class="c-input-category-content unselect position-relative"
         @click.stop.prevent="openOverlay">
      <div class="full-width c-input-category-content"
           :style="inputStyle">
        <span v-if="category && category.label">{{ category.label }}</span>
        <span :style="brandColor.sub2" v-else>카테고리 선택</span>
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
    </div>

    <transition name="fade">
      <div v-if="vOverlay"
           class="c-input-category-overlay">
        <block-input-category-overlay :categories="categories"
                                      :category.sync="category"
                                      @closePage="vOverlay=false"/>
      </div>
    </transition>


  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import BlockInputCategoryOverlay from "../Block/BlockInputCategoryOverlay.vue";

  export default {
    name: "CInputCategory",
    components: {
      BlockInputCategoryOverlay

    },
    mixins: [
      FormMixin
    ],
    created() {
      this.getData();
    },
    mounted() {
      window.addEventListener('popstate', this.popState);
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.popState);
    },
    data() {
      return {
        vOverlay: false,
        category: {},
        categories: [],
        prop: {
          selectedItem1: 0
        }
      }
    },
    computed: {
      iconStyle() {
        if (this.iconCustomStyle) return this.iconCustomStyle;
        else return {
          color: this.brandColor.sub.color
        };
      },
    },
    methods: {
      popState() {
        if(this.$store.getters.popstate[0]==='category_overlay') {
          this.$store.commit('removePopstate');
          this.vOverlay = false;
        }
      },
      getData() {
        this.$axios.get('public/category?depth=2&all=true').then(res => {
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
            this.category = this.value;
        });
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

        };
        this.vOverlay = true;
        history.pushState('category_overlay','');
        this.$store.commit('setPopstate', 'category_overlay');
      }
    },
    watch: {
      category() {
        this.$emit('update:value', this.category);
      },
      value() {
        this.category = this.value;
      }
    }
  }
</script>

<style lang="stylus" scoped>
.c-input-category-overlay
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background-color white
  z-index 1000
.c-input-category-content
  display flex
  align-items center
  justify-content space-between
.fade-enter-active
  transition all .3s

.fade-leave-active
  transition all 3s reverse

</style>
