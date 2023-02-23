<template>
<div>
  <!-- 1차 카테고리 -->
    <div class="category" v-click-outside="closeCategory1">
      <div class="flex-align unselect position-relative"
           @click.stop.prevent="toggleCategory1">
        <div class="size-28 weight-700 p-main">{{ Object.keys(selectedCat1).length > 0 ? selectedCat1.label : '전체' }}</div>
        <i class="material-icons p-main"
           style="font-size: 30px; margin-left: 8px">{{ cat1Open ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
        <ul v-if="cat1Open" class="category-ul p-bg-white p-main position-absolute">
          <li class="size-14 dropdown-item" style="padding: 6px 16px"
              v-for="(cat, idx) in category" :key="'cat-'+idx"
              @click.stop.prevent="clickCategory1(cat)">{{ cat.label }}
          </li>
        </ul>
      </div>
    </div>
  <div v-if="(selectedCat2 && Object.keys(selectedCat2).length !== 0) || (selectedCat3 && Object.keys(selectedCat3).length !== 0)"
    class="flex-align wrap" style="margin-top: 20px">
    <!-- 2차 카테고리 -->
    <div class="category" v-if="selectedCat2 && Object.keys(selectedCat2).length !== 0"
         v-click-outside="closeCategory2">
      <div class="dropdown p-border-main radius-8 flex-center unselect position-relative"
           @click.stop.prevent="toggleCategory2">
        <div>{{ selectedCat2.label }}</div>
        <i class="material-icons p-main"
           style="font-size: 30px; margin-left: 12px">{{ cat2Open ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>

        <ul v-if="cat2Open" class="category-ul p-bg-white p-main position-absolute">
          <li class="size-14 dropdown-item" style="padding: 6px 16px"
              v-for="(cat2, idx) in selectedCat1.child" :key="'cat2-'+idx"
              @click.stop.prevent="clickCategory2(cat2)">{{ cat2.label }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 3차 카테고리 -->
    <div class="category" v-if="selectedCat3 && Object.keys(selectedCat3).length !== 0"
         v-click-outside="closeCategory3">
      <div class="dropdown p-border-main radius-8 flex-center unselect position-relative"
           @click.stop.prevent="toggleCategory3">
        <div>{{ selectedCat3.label }}</div>
        <i class="material-icons p-main"
           style="font-size: 30px; margin-left: 12px">{{ cat3Open ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>

        <ul v-if="cat3Open" class="category-ul p-bg-white p-main position-absolute">
          <li class="size-14 dropdown-item" style="padding: 6px 16px"
              v-for="(cat3, idx) in selectedCat2.child" :key="'cat3-'+idx"
              @click.stop.prevent="clickCategory3(cat3)">{{ cat3.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'DropdownCategory',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "cat1Open": false,
      "cat2Open": false,
      "cat3Open": false,
      "category": undefined,
      "selectedCat1": {},
      "selectedCat2": undefined,
      "selectedCat3": undefined
    }
  },
  created() {
      this.init();
    },
  mounted() {

    },
  
  methods: {
    init() {
        this.category = this.$store.getters.category;
        let gnb = this.$route.query.gnb;
        if (gnb && gnb !== '') {
          gnb = Number(gnb);
        }

        for (let cat1 of this.category) {
          if (cat1.value === gnb) {
            this.selectedCat1 = cat1;
            if(cat1.child && cat1.child.length>0) {
              this.selectedCat2 = cat1.child[0];
            } else {
              this.selectedCat2 = undefined;
            }
            this.$emit('title', cat1.label);
            break;
          } else if (cat1.child && cat1.child.length > 0) {
            for (let cat2 of cat1.child) {
              if (cat2.value === gnb) {
                this.selectedCat1 = cat1;
                this.selectedCat2 = cat2;
                if(cat2.child && cat2.child.length>0) {
                  this.selectedCat3 = cat2.child[0];
                }  else {
                  this.selectedCat3 = undefined;
                }
                // this.$emit('title', `${cat1.label} / ${cat2.label}`);
                this.$emit('title', cat2.label);
                break;
              } else if (cat2.child && cat2.child.length > 0) {
                for (let cat3 of cat2.child) {
                  if (cat3.value === gnb) {
                    this.selectedCat1 = cat1;
                    this.selectedCat2 = cat2;
                    this.selectedCat3 = cat3;
                    // this.$emit('title', `${cat1.label} / ${cat2.label} / ${cat3.label}`);
                    this.$emit('title', cat3.label);
                    break;
                  }
                }
              }
            }
          }
        }
      },
    closeCategory1() {
        this.cat1Open = false;
      },
    closeCategory2() {
        this.cat2Open = false;
      },
    closeCategory3() {
        this.cat3Open = false;
      },
    toggleCategory1() {
        this.cat1Open = !this.cat1Open;
        this.cat2Open = false;
        this.cat3Open = false;
      },
    toggleCategory2() {
        this.cat1Open = false;
        this.cat2Open = !this.cat2Open;
        this.cat3Open = false;
      },
    toggleCategory3() {
        this.cat1Open = false;
        this.cat2Open = false;
        this.cat3Open = !this.cat3Open;
      },
    clickCategory1(item) {
        this.selectedCat1 = item;
        if (item.child && item.child.length !== 0) {
          this.selectedCat2 = item.child[0];
          this.selectedCat3 = {};
        } else {
          this.selectedCat2 = {};
          this.selectedCat3 = {};
        }
        this.$emit('title', item.label);
        //this.$router.push(`/product?gnb=${this.selectedCat1.value}`);
        this.pageRoute(this.selectedCat1.value);
        this.cat1Open = false;
      },
    clickCategory2(item) {
        this.selectedCat2 = item;
        if (item.child && item.child.length !== 0) {
          this.selectedCat3 = item.child[0];
        } else {
          this.selectedCat3 = {};
        }
        if (item.label === '전체') {
          //this.$router.push(`/product?gnb=${this.selectedCat1.value}`)
          this.pageRoute(this.selectedCat1.value);
        } else {
          //this.$router.push(`/product?gnb=${this.selectedCat2.value}`)
          this.pageRoute(this.selectedCat2.value);
        }
        // this.$emit('title', `${this.selectedCat1.label} / ${item.label}`);
        this.$emit('title', item.label);
        this.cat2Open = false;
      },
    clickCategory3(item) {
        this.selectedCat3 = item;
        if (item.label === '전체') {
          //this.$router.push(`/product?gnb=${this.selectedCat2.value}`)
          this.pageRoute(this.selectedCat2.value);
        } else {
          //this.$router.push(`/product?gnb=${this.selectedCat3.value}`)
          this.pageRoute(this.selectedCat3.value);
        }
        // this.$emit('title', `${this.selectedCat1.label} / ${this.selectedCat2.label} / ${item.label}`);
        this.$emit('title', item.label);
        this.cat3Open = false;
      },
    pageRoute(val) {
      let query = this.cloneItem(this.$route.query);
        query.gnb = val;
        this.$router.replace({
          path: this.$route.path,
          query: query
        });
    }
  },
  computed: {
    
  },
  watch: {
    $route() {
        this.init();
      },
    selectedCat1(n) {
        this.$emit('selectedCat1', n);
      },
    selectedCat2(n) {
        this.$emit('selectedCat2', n);
      },
    selectedCat3(n) {
        this.$emit('selectedCat3', n);
      }
  }
}
</script>
<style scoped>
.category {
    width: 260px;
    padding-right: 16px;
  }
  .category:last-child {
    padding: 0;
  }
  
  @media (max-width: 440px) {
    .category {
      width: 100%;
      padding: 0;
      padding-bottom: 8px;
    }
    .category:last-child {
      padding-bottom: 20px;
    }
  }

  .dropdown {
    width: 100%;
    height: 44px;
    justify-content: space-between;
    padding: 8px 16px;
  }

  .dropdown-ul {
    background-color: white;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.24);
    border: 1px solid #c7c7c7;
    border-radius: 4px;
    top: 42px;
    padding: 7px 0;
    right: 0;
    width: 116px;
  }

  .category-ul {
    border: 1px solid #e3e3e3;
    padding: 6px 0px;
    top: 39px;
    left: -1px;
    width: 100%;
    z-index: 1;
  }
</style>

