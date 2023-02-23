<template>
<div class="p-bg-sub">
  <div style="position: fixed; top: 0px; width: 100%; z-index: 10">
    <div class="flex-align position-relative size-16 bold p-main p-bg-white"
      style="width: 100%; justify-content: space-between; z-index: 10">
      <div class="flex-center unselect" @click="clickClose"
        style="min-width: 50px; height: 50px; line-height: 50px">
        <div class="flex-center"><i class="material-icons" style="font-size: 26px; margin: 0 10px">close</i></div>
      </div>
      <div style="position: absolute; left: 50%; transform: translateX(-50%); flex: 1">
        <span class="flex-center" style="width: 100%; height: 100%">카테고리</span>
      </div>
    </div>
  </div>
  <div style="margin-top: 50px; padding-top: 10px">
    <div class="p-bg-white" :style="containBox">
      <div v-for="(category, idx) in categoryList" :key="'category-'+idx"
        style="width: 100%"
        :class="{'p-border-bottom-main': idx !== categoryList.length - 1}">
        <div class="flex-between" style="min-height:48px;padding: 0 16px">
          <div @click="category.child.length > 0 ? clickArrow(category) : clickCategory1(category)"
            :class="{
              'p-brand': prop.selectedItem1 && category.id === prop.selectedItem1.id,
              'p-main': prop.selectedItem1 && category.id !== prop.selectedItem1.id
            }"
            class="unselect size-16 weight-400 col-10">{{ category.name }}</div>
          <i v-if="category.child.length>0" style="font-size: 20px; padding:12px 0;text-align:right" @click="clickArrow(category)"
            class="unselect material-icons col-2 p-sub">keyboard_arrow_{{ category.isShow ? 'up' : 'down' }}</i>
        </div>
        <template v-if="category.child.length>0 && category.isShow">
          <div v-for="(child, idx) in category.child" :key="'child-'+idx" style="width: 100%">
            <div class="flex-between p-bg-sub2" style="min-height: 44px;padding:0 16px 0 32px">
              <div @click="child.child.length > 0 ? clickArrow(child) : clickCategory2(child,category)"
                :class="{
                  'p-brand': prop.selectedItem2 && child.id === prop.selectedItem2.id,
                  'p-sub': prop.selectedItem2 && child.id !== prop.selectedItem2.id
                }"
                class="unselect size-14 weight-400 col-10">{{ child.name }}</div>
              <i v-if="child.child.length>0" style="font-size: 20px; padding:12px 0;text-align:right" @click="clickArrow(child)"
                class="unselect material-icons col-2 p-sub2">keyboard_arrow_{{ child.isShow ? 'up' : 'down' }}</i>
            </div>
            
            <template v-if="child.child.length>0 && child.isShow">
              <div v-for="(grand, idx) in child.child" :key="'children-'+idx"
                style="width: 100%">
                <div style="min-height: 44px;padding:0 16px 0 48px" class="flex-align p-bg-sub2">
                  <div @click="clickCategory3(grand,child,category)"
                    :class="{
                      'p-brand': prop.selectedItem3 && grand.id === prop.selectedItem3.id,
                      'p-sub2': prop.selectedItem3 && grand.id !== prop.selectedItem3.id
                    }"
                    class="unselect size-14 weight-400 full-width">{{ grand.name }}</div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockCategoryOverlay',
  components: {

  },
  mixins: [

  ],
  props: {
    prop: {
      type: Object,
    },

  },
  data() {
    return {
      "menusetId": 1,
      "categoryList": []
    }
  },
  created() {
    this.getCategory();
  },
  mounted() {
  },
  
  methods: {
    getCategory() {
      let list = this.cloneItem(this.$store.getters.category);
      list.forEach(item => {
        item.isShow = false; 
        item.link = `product?gnb=${item.id}`;
        if(item.child) {
          item.child.forEach(child => {
            child.link = `product?gnb=${child.id}`;
            child.isShow = false;
            if(child.child) {
              child.child.forEach(gchild => {
                gchild.link = `product?gnb=${gchild.id}`;
              });
            } else {
              child.child = [];
            }
          });
        } else {
          item.child = [];
        }
      });
      console.log('list', list)
      this.categoryList = list;
      
      this.getShow();
    },
    getShow() {
      this.categoryList.forEach(item => {
        item.isShow = this.prop.selectedItem1 && this.prop.selectedItem1.id === item.id;
        
        if(!item.isShow) {
         item.child.forEach(child => {
          child.isShow = this.prop.selectedItem2 && this.prop.selectedItem2.id === child.id;
        }) 
        }
      });
    },
    clickClose() {
      this.prop.toggle = false;
      this.$emit('closePage');
    },
    clickCategory1(item) {
      item.isShow = true;
      this.linkPush(item.link);
      this.prop.toggle = false;
      this.$emit('closePage');
    },
    clickCategory2(item, parent) {
      item.isShow = true;
      parent.isShow = true;
      this.linkPush(item.link);
      this.prop.toggle = false;
      this.$emit('closePage');
    },
    clickCategory3(item, parent, grand) {
      item.isShow = true;
      parent.isShow = true;
      grand.isShow = true;
      this.linkPush(item.link);
      this.prop.toggle = false;
      this.$emit('closePage');
    },
    linkPush(link) {
      if(link) {
        if(link.split('?')[0] === this.$route.path.replace('/','')) {
          setTimeout(() => {
            this.$router.replace(link);  
          },100);
        }
        else{
          this.routerPush(link);
        }
      }
    },
    clickArrow(item) {
      item.isShow = !item.isShow;
      this.$forceUpdate()
    }
  },
  computed: {
    containBox() {
      return {
        maxHeight: `${window.innerHeight - 60}px`,
        overflowY: 'auto'
      }
    }
  },
  watch: {
    'prop.toggle'(n) {
      if(n) {
        this.getShow();
      }
    }
  }
}
</script>


