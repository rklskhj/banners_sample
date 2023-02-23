<template>
<div class="position-relative block-hamburger" @mouseover="menuVisible(true)" @mouseleave="menuVisible(false)" v-show="visible">
    <!-- 햄버거 버튼 -->
    <div class="flex-align unselect" style="gap:8px" :style="{height: buttonHeight + 'px'}">
      <div>{{ buttonName }}</div>
      <i id="hamburger-icon" class="material-icons-round unselect">arrow_drop_{{ showMenu ? 'up' : 'down' }}</i>
    </div>
    <!-- 컨텍스트 메뉴 -->
    <div id="hamburger-menu" class="context-menu" :style="contextStyle" v-show="showMenu" @mouseleave="menuVisible(false)">
      
      <!-- 1차 메뉴 -->
      <div class="menu-wrapper" :style="brandBorder.sub">
        <div v-for="(item,idx) in list" :key="'context-menu-'+idx" 
        class="unselect menu-item" :style="itemStyle(item)" @click="clickItem(item)" @mouseover="hoverItem(1, item, list)">
          <img v-if="item.icon && item.icon !== ''" :src="item.icon">
          <div class="menuset-text-color">{{ item.name }}</div>
        </div>
      </div>
      
      <!-- 2차 메뉴 -->
      <div class="menu-wrapper" :style="[brandBorder.sub, {borderLeft: 0}]" v-if="list2 && list2.length>0">
        <div v-for="(item,idx) in list2" :key="'context-menu-'+idx"
            class="unselect menu-item" :style="itemStyle(item)" @click="clickItem(item)" @mouseover="hoverItem(2, item, list2)">
          <img v-if="item.icon && item.icon !== ''" :src="item.icon">
          <div class="menuset-text-color">{{ item.name }}</div>
        </div>
      </div>
      
      <!-- 3차 메뉴 -->
      <div class="menu-wrapper" :style="[brandBorder.sub, {borderLeft: 0}]" v-if="list2 && list2.length>0 && list3 && list3.length>0">
        <div v-for="(item,idx) in list3" :key="'context-menu-'+idx"
            class="unselect menu-item" :style="itemStyle(item)" @click="clickItem(item)"  @mouseover="hoverItem(3, item, list3)">
          <img v-if="item.icon && item.icon !== ''" :src="item.icon">
          <div class="menuset-text-color">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'BlockHamburger',
  components: {

  },
  mixins: [

  ],
  props: {
    id: {
      type: Number,
    },
    color: {
      type: String,
    },
    menuKey: {
      type: String,
      default: "hamburger",
    },
    visible: {
      type: Boolean,
    },
    guest_id: {
      type: Number,
      default: 0,
    },
    maxLength: {
      type: Number,
    },
    buttonName: {
      type: String,
      default: "카테고리",
    },
    activeColor: {
      type: String,
    },
    buttonHeight: {
      type: Number,
      default: 64,
    },
    visibleLimit: {
      type: Number,
      default: 20,
    },
    activeBgColor: {
      type: String,
    },

  },
  data() {
    return {
      "list": [],
      "hover": {},
      "isDev": false,
      "list2": undefined,
      "list3": undefined,
      "showMenu": false,
      "contextStyle": {
        "right": 0
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    hoverItem(idx, item, list) {
      list.forEach(i=>{ i.hover = false; });
      item.hover = true;
      this.hover[`item${idx}`] = item;
      if(item.child && idx<3) {
        this[`list${idx+1}`] = this.cloneItem(item.child);
      }
    },
    clickItem(item) {
      this.showMenu=false;
      if(item.linkType === 'link' || item.linkType === 'page') {
        this.routerPush(item.link);
      } else if(item.linkType === 'overlay') {
        this.routerOverlay(item.link);
      } else if(item.linkType === 'modal') {
        this.routerModal(item.link);
      } else if(item.linkType === 'drawer_left') {
        this.routerDrawerLeft(item.link);
      } else if(item.linkType === 'drawer_right') {
        this.routerDrawerRight(item.link);
      } else if(item.linkType === 'emit') {
        this.$emit(item.link);
      } else if(item.linkType === 'outlink') {
        if(item.link.indexOf('http')===0) {
          const a = document.createElement("a");
          a.href = item.link;
          a.setAttribute('target', '_blank');
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
        } else {
          this.routerPush(item.link);
        }
      }
    },
    menuVisible(value) {
      if(!this.isDev) {
        this.showMenu=value;
        if(value === false) {
         this.list.forEach(item=>{
          item.hover = false;
          if(item.child) {
            item.child.forEach(child=>{
              child.hover = false;
              if(child.child) {
                child.child.forEach(gchild=>{
                  gchild.hover = false;
                })
              }
            })
          }
        }); 
        }
      }
    },
    getData() {
      this.$axios.get(`public/ui/menuset/style/${this.menuKey}?activated=true`).then(res=>{
        let list = [];
        
        res.data[0].menu.forEach(item => {
          if(item.is_category) {
            list = list.concat(
              this.$store.getters.category.map(cat =>{
              let item =this.getCatItem(cat);
              if(cat.child) {
                item.vChild = true;
                item.child = cat.child.map(child=>{
                  let c = this.getCatItem(child);
                  if(child.child) {
                    child.vChild = false;
                    c.child = child.child.map(gchild=>{
                      return this.getCatItem(gchild);
                    });
                  }
                  return c;
                });
              }
              return item;
            })
            );
            
          } else {
            item.hover = false;
            list.push(item);
            if(item.children) {
              item.children.forEach(child => { 
                child.hover = false;
                if(child.children) {
                  child.children.forEach(gchild => {
                    gchild.hover = false;
                  });
                }
                child.child = child.children;
                delete child.children;
              })
              item.child = item.children;
              delete item.children;
            }
          }
        });
        this.list = list;
      });
    },
    getCatItem(item) {
      return {
        link: `product?gnb=${item.id}`,
        linkType: 'link',
        name: item.name,
        id: item.id,
        icon: item.img_before,
        hover: false
      }
    },
    itemStyle(item) {
      let deco = {};
      let color = this.parseColor(this.color);
      let activeColor = this.parseColor(this.activeColor);
      let bgColor = this.parseColor(this.activeBgColor);
      
      if(item.hover) {
        deco.color = activeColor;
        deco.backgroundColor = bgColor;
      } else {
        deco.color = color;
      }
      
      return deco;
    }
  },
  computed: {
    visibleList() {
      return this.list.slice(0, this.visibleLimit);
    }
  },
  watch: {
    showMenu(n) {
      if(n) {
        this.contextStyle = {
          top: this.buttonHeight + 'px'
        }
        if(this.$el && this.$el.getBoundingClientRect().top < 230) {
          this.contextStyle.left = 0;
        } else {
          this.contextStyle.right = 0;
        }
      }
    },
    '$store.getters.user'() {
      this.getData();
    }
  }
}
</script>
<style scoped>
#hamburger-icon {
  font-size: 24px;
}

.context-menu {
  position: absolute;
  background: white;
  top: 50px;
  z-index: 1;
  display: flex;
}

.menu-wrapper {
  width: 230px;
  max-height: 70vh;
  overflow-y: auto;
}

.menu-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 12px;
}
.menu-item img {
  margin-right: 12px;
  width: 24px;
  height: 24px;
}
</style>

