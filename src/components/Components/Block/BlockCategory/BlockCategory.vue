<template>
<div class="p-bg-sub">
  <div>
    <div class="p-bg-white" :style="containBox">
      <div v-for="(category, idx) in categoryList" :key="'category-'+idx"
        style="width: 100%" :style="categoryListStyle(idx)">
        <div class="flex-between" style="min-height:48px;padding: 0 16px">
          <div @click="category.child && category.child.length > 0 ? clickArrow(category) : clickCategory1(category)"
            class="unselect size-16 weight-400 col-10 p-main">{{ category.name }}</div>
            <!--<div v-if="category.child.length !== 0 && category.isShow"-->
            <!--  @click="clickCategory1All(category)" class="unselect flex-center size-12 weight-500"-->
            <!--  style="margin-left: 16px; border-radius: 4px; width: 50px; height: 22px"-->
            <!--  :style="[brandColor.help, {border: `1px solid ${brandColor.help.color}`}]">-->
            <!--  <div class="flex-align">ALL <i class="material-icons" style="font-size: 14px">keyboard_arrow_right</i></div>-->
            <!--</div>-->
          <i v-if="category.child && category.child.length>0" style="font-size: 20px; padding:12px 0;text-align:right" @click="clickArrow(category)"
            class="unselect material-icons col-2 p-sub">{{ category.isShow ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
        </div>
        <template v-if="category.child && category.child.length>0 && category.isShow">
          <div v-for="(child, idx) in category.child" :key="'child-'+idx"
            style="width: 100%">
            <div class="flex-between p-bg-sub2" style="min-height: 44px;padding:0 16px 0 32px">
              <div @click="child.child && child.child.length > 0 ? clickArrow(child) : clickCategory2(child,category)"
                class="unselect size-14 weight-400 col-10 p-sub">{{ child.name }}</div>
              <i v-if="child.child && child.child.length>0" style="font-size: 20px; padding:12px 0;text-align:right" @click="clickArrow(child)"
                class="unselect material-icons col-2 p-sub2">{{ child.isShow ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
            </div>
            
            <template v-if="child.child && child.child.length>0 && child.isShow">
              <div v-for="(grand, idx) in child.child" :key="'children-'+idx"
                style="width: 100%">
                <div style="min-height: 44px;padding:0 16px 0 48px" class="flex-align p-bg-sub2">
                  <div @click="clickCategory3(grand,child,category)"
                    class="unselect size-14 weight-400 full-width p-sub2">{{ grand.name }}</div>
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
  name: 'BlockCategory',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
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
      let list = [];
      this.$store.getters.category.forEach(cat => {
        let child = [];
        
        if(cat.child && cat.child.length>0) {
          cat.child.forEach(chi => {
            let grand = [];
            
            if(chi.child && chi.child.length>0) {
              chi.child.forEach(gra => {
                grand.push({
                  link: `product?gnb=${gra.id}`,
                  linkType: 'link',
                  name: gra.name === '전체' ? '전체보기' : gra.name,
                  id: gra.id,
                  icon: gra.img_before,
                  index: gra.index,
                  packages: gra.packages
                })
              });  
            }
            
            child.push({
              link: `product?gnb=${chi.id}`,
              linkType: 'link',
              name: chi.name === '전체' ? '전체보기' : chi.name,
              id: chi.id,
              icon: chi.img_before,
              child: grand,
              index: chi.index,
              packages: chi.packages
            });
          });
        }
        
        list.push({
          link: `product?gnb=${cat.id}`,
          linkType: 'link',
          name: cat.name,
          id: cat.id,
          icon: cat.img_before,
          child: child,
          index: cat.index,
          packages: cat.packages
        });
      });
      
      list.forEach(item => {
        item.isShow = false; 

        if(item.child && item.child.length>0) {
          item.child.forEach(chi => {
            
            chi.isShow = false;
          })
        }
      });
      this.categoryList = list;

    },
    clickCategory1(item) {
      item.isShow = true;
      this.linkPush(item.link);
    },
    clickCategory2(item, parent) {
      item.isShow = true;
      parent.isShow = true;
      this.linkPush(item.link);
      // this.prop.toggle = false;
      // this.$emit('closePage');
    },
    clickCategory3(item, parent, grand) {
      item.isShow = true;
      parent.isShow = true;
      grand.isShow = true;
      this.linkPush(item.link);
      // this.prop.toggle = false;
      // this.$emit('closePage');
    },
    linkPush(link) {
      if(link.split('?')[0] === this.$route.path.replace('/','')) {
        setTimeout(() => {
          this.$router.replace(link);  
        },100);
      }
      else{
        this.routerPush(link);
      }
    },
    clickArrow(item) {
      item.isShow = !item.isShow;
    },
    categoryListStyle(idx) {
      let deco = {
        borderBottom: this.brandBorder.main.border
      };
      
      if (idx === this.categoryList.length - 1) deco.borderBottom = '0';
      return deco;
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
    
  }
}
</script>


