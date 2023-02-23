<template>
<div style="margin-right: 40px">
  <!-- <div v-if="category1 && Object.keys(category1).length !== 0"
   class="size-20 weight-500 p-main p-border-bottom-main" style="padding-bottom: 8px">{{ category1.name }}</div> -->
  <div v-for="(cat, idx) in category" :key="'cat-'+idx+componentKey">
    <div :style="{
      'paddingBottom': idx !== category.length - 1 ? category1 && category1.id === cat.id ? '20px' : '16px' : '0px',
      'marginBottom': category1 && category1.id === cat.id ? '20px' : '0px'
    }" :class="{
      'p-border-bottom-sub': category1 && category1.id === cat.id
    }">
      <!-- 1차 카테고리 -->
      <div class="unselect flex-between p-main"
         @click="clickCat1(cat)">
        <div v-if="cat && Object.keys(cat).length > 0" class="size-18 weight-700">{{ cat.name }}</div>
        <!-- <i v-if="cat.child && cat.child.length !== 0"
              class="material-icons">{{ cat.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i> -->
      </div>
        
      <div class="unselect" v-if="cat.child && cat.child.length > 0 && cat.isOpen" style="margin-top: 20px">
        <!-- 2차 카테고리 -->
        <div v-for="(cat2, cat2_idx) in cat.child" :key="'cat2-'+cat2_idx">
          <div class="flex-between" @click="clickCat2(cat, cat2)"
            :class="{
              'p-brand': category2 && category2.id === cat2.id,
              'p-sub': category2 && category2.id !== cat2.id
            }"
            :style="cat2Style(cat.child, cat2_idx)">
            <div class="size-14">{{ cat2.name }}</div>
            <i v-if="cat2.child && cat2.child.length > 0"
              class="material-icons p-sub3">{{ cat2.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
          </div>
          <div v-if="cat2.child && cat2.child.length > 0 && cat2.isOpen"
            style="padding-left: 20px; margin-bottom: 12px; margin-top: 12px">
            <!-- 3차 카테고리 -->
            <div v-for="(cat3, cat3_idx) in cat2.child" :key="'cat3-'+cat3_idx">
              <div class="size-14 weight-400" @click="clickCat3(cat, cat2, cat3)"
                :class="{
                  'weight-500': (category3 && category3.id === cat3.id) || (category2 && category3 === undefined && cat3.id === category2.id),
                  'p-brand': category3 && category3.id === cat3.id,
                  'p-sub': category3 && category3.id !== cat3.id
                }"
                :style="cat3Style(cat2.child, cat3_idx)">{{ cat3.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'AsideCategory',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "clicked": false,
      "category": undefined,
      "category1": undefined,
      "category2": undefined,
      "category3": undefined,
      "componentKey": 0
    }
  },
  created() {
    this.init();
  },
  mounted() {

  },
  
  methods: {
    init() {
      // 카테고리
      if(!this.$store.getters.category) {
       this.$axios.get('public/category?depth=3').then(res => {
        this.setCategoryInit(res.data);
      }); 
      } else {
        this.setCategoryInit(this.cloneItem(this.$store.getters.category));
      }
      
    },
    setCategoryInit(data) {
      console.log('setCategoryInit')
      let gnb = this.$route.query.gnb;
      let selectedItem = null;
      if (gnb && gnb !== '') {
        gnb = Number(gnb);
      }

      data.forEach(i => {
        if (i.child && i.child.length > 0) {
          i.child = i.child.filter(ch => ch.label !== '전체');
          i.child.forEach(ch => {
            if (ch.child && ch.child.length > 0) {
              ch.child = ch.child.filter(grand => grand.label !== '전체')
            }
          })
        }
      })

      for (let cat1 of data) {
        cat1.isOpen = false;
        if (cat1.value === gnb) {
          this.emitCategory(cat1);
          cat1.isOpen = true;
          selectedItem = cat1;
        } 
        
        if (cat1.child && cat1.child.length > 0) {
          for (let cat2 of cat1.child) {
            cat2.isOpen = false;
            if (cat2.value === gnb) {
              cat1.isOpen = true;
              cat2.isOpen = true;
              this.emitCategory(cat1, cat2);
              selectedItem = cat1;
            }
            
            if (cat2.child && cat2.child.length > 0) {
              for (let cat3 of cat2.child) {
                if (cat3.value === gnb) {
                  cat1.isOpen = true;
                  cat2.isOpen = true;
                  this.emitCategory(cat1, cat2, cat3);
                  selectedItem = cat1;
                  break;
                }
              }
            }
          }
        }
      }
      if (selectedItem === null) {
        selectedItem = data[0]
      }
      console.log(selectedItem, 'item_sel')
      let filtered = data.filter(i => i.id !== selectedItem.id);
      filtered.unshift(selectedItem)
      this.category = filtered;
      this.componentKey += 1;
      this.$forceUpdate()
    },
    emitCategory(cat1, cat2, cat3) {
      this.category1 = cat1;
      this.category2 = cat2;
      this.category3 = cat3;
      this.$emit('category1', cat1);
      this.$emit('category2', cat2);
      this.$emit('category3', cat3);
    },
    clickCat1(cat) {
      this.category.forEach(cat1=>{
        if(cat.id !== cat1.id)
          cat1.isOpen = false;
        if(cat1.child) {
          cat1.child.forEach(cat2=>{
            cat2.isOpen = false;
          });
        }
      })
      
      if (cat.child && cat.child.length > 0) {
        cat.isOpen = true;
      } 
      
      this.clicked = true;
      this.routerPush(`/product?gnb=${cat.id}`);
      this.emitCategory(cat);
    },
    clickCat2(cat, cat2) {
      cat.child.forEach(item=>{
        if(item.id !== cat2.id)
          item.isOpen = false;
      });
      
      if (cat2.child && cat2.child.length > 0) {
        cat2.isOpen = !cat2.isOpen;
      }
      
      this.clicked = true;
      this.routerPush(`/product?gnb=${cat2.id}`);
      this.emitCategory(cat, cat2);
    },
    clickCat3(cat, cat2, cat3) {
      if (cat3.name === '전체') {
        this.emitCategory(cat, cat2);
        this.clicked = true;
        this.routerPush(`/product?gnb=${cat2.id}`);
      } else {
        this.emitCategory(cat, cat2, cat3);
        this.clicked = true;
        this.routerPush(`/product?gnb=${cat3.id}`);
      }
    },
    cat2Style(cat1_child, idx) {
      let deco = {
        marginBottom: '12px'
      }
      if (cat1_child && idx === cat1_child.length - 1) {
        if (cat1_child[idx].isOpen) {
          if (cat1_child.child && cat1_child.child.length > 0) {
            deco.marginBottom = '12px'
          } else {
            deco.marginBottom = '0px'
          }
        } else {
          deco.marginBottom = '0px'
        }
      } else {
        if (cat1_child[idx].isOpen) {
          deco.marginBottom = '12px'
        }
      }
      return deco;
    },
    cat3Style(cat2_child, idx) {
      let deco = {
        marginBottom: '12px'
      }
      if (cat2_child && idx === cat2_child.length - 1) {
        deco.marginBottom = '0px'
      }
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    $route() {
      this.setCategoryInit(this.category);
      // if(!this.clicked)
      this.clicked = false;
    }
  }
}
</script>


