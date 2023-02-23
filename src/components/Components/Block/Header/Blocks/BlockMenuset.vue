<template>
<div>
<div ref="menu" class="menuset-container flex-align wrap full-width" v-show="visible" :style="containerStyle" :class="'block-menuset-'+index">
  <template v-for="(item, idx) in visibleList">
    <div :key="item.id"
      class="menu-item unselect size-14 position-relative" @click="clickMenu(item)"
      @mouseover="onHover(item)" :style="itemStyle">
      <div class="flex-align">
        <span class="menuset-name menuset-text-color" :style="currentItem(item) ? {color: parseColor(colorSet.sub)} : {}">{{ item.name }}</span>
        <!-- 인디케이터 -->
        <!--<div v-show="currentItem(item)" class="indicator" :style="colorSet.indicator"></div>-->
      </div>
      
      <template v-if="showChildState">
        <!-- 2차메뉴 상단 삼각형 -->
        <div class="position-absolute pointer" :class="{ 'hidden-style' : hiddenState }"
          :style="pointerStyle(item)"></div>
      </template>
    </div>
  </template>
  
  
  <div class="depth-container position-absolute flex-justify menuset-bg"
       :style="depth2Style"
       v-if="showChildState" @mouseleave="onLeave">
    
    <div :style="[pcMaxWidth]" class="flex-align">
      <!-- 2차 메뉴 각 아이템 -->
      <div v-for="item in childList" :key="'child-'+item.id"
        class="child-item unselect menuset-text-color-child"
        @click="clickChild(item)"
        :style="currentItem2Style(item)">
        {{ item.name }}</div>
    </div>
  </div>
</div>


</div>
</template>
<script>

export default {
  name: 'BlockMenuset',
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
    moreBtn: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    colorSet: {
      type: Object,
    },
    maxLength: {
      type: Number,
      default: 10,
    },
    limitIndex: {
      type: Number,
      default: 10,
    },
    selectState: {
      type: Boolean,
      default: false,
    },
    visibleLimit: {
      type: Number,
      default: 5,
    },
    menuItemStyle: {
      type: Object,
    },
    containerStyle: {
      type: Object,
    },

  },
  data() {
    return {
      "isDev": false,
      "hoverMore": false,
      "showChild": false,
      "moreHoverIndex": undefined,
      "selectedMenuset": undefined,
      "selectedHoverMenu": undefined
    }
  },
  created() {
    this.getInit();
  },
  
  methods: {
    getInit() {
      let query = this.$route.query;
      if(query.category2) {
        this.selectedMenuset = this.list.filter(item => { return item.id === Number(query.category1)})[0];
      }
      else {
        if(query.gnb) {
          this.selectedMenuset = this.list.filter(item => { return item.id===Number(query.gnb )})[0];
        }
      }
    },
    clickChild(item) {
      this.selectedMenuset = this.list.filter(lis => { return lis.id === item.parent_id })[0];
      this.linkMenu(item);
    },
    onHover(item) {
      if(!this.isDev) {
        if(item.children && this.depth2) {
          item.children = item.children.slice(0, this.depth2.maxLength);
          this.selectedHoverMenu = item;  
        }
      }
    },
    onLeave() {
      if(!this.isDev) {
        this.selectedHoverMenu = undefined;
      }
    },
    pointerStyle(item) {
      let deco = {};
      let color = this.brandColor(this.depth2Style.backgroundColor);
      if(this.selectedHoverMenu && this.selectedHoverMenu.id===item.id) {
        deco.width = 0;
        deco.height = 0;
        deco.borderLeft = '6px solid transparent';
        deco.borderRight = '6px solid transparent';
        deco.borderBottom = `12px solid ${color}`;
        deco.bottom = '-2px';
        deco.left = '50%';
        deco.transform = 'translateX(-50%)';
      }
      else {
        if(!this.selectedHoverMenu && this.selectedMenuset&&this.selectedMenuset.id===item.id) {
          deco.width = 0;
          deco.height = 0;
          deco.borderLeft = '6px solid transparent';
          deco.borderRight = '6px solid transparent';
          deco.borderBottom = `12px solid ${color}`;
          deco.bottom = '-2px';
          deco.left = '50%';
          deco.transform = 'translateX(-50%)';
        }
      }
      return deco;
    },
    linkMenu(item) {
      if(item.link) {
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
          if(item.link.indexOf('http') === 0) {
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
      }
      else {
        if(item.children&&item.children.length>0) {
          this.linkMenu(item.children[0]);
        }
      }
    },
    clickMenu(item) {
      this.selectedMenuset = item;
      this.linkMenu(item);
    },
    closeMenu() {
      this.showMenu = false;
    },
    getPath(item) {
      let routes = item.split('?');
      let path = routes[0];
      let query = null;
      if(routes.length>0) {
        query = {};
        routes.slice(1).forEach(res => {
          res.split('&').forEach(item => { 
            let arr = item.split('=');
            query[arr[0]] = arr[1];
          });
        });
      }
      
      return {
        path: path,
        query: query
      }
    },
    currentItem(item) {
      let route = this.getPath(this.$route.fullPath.replace('/', ''));
      
      let result = false;
      
      if(this.selectState) {
        if(!item.linkType || item.linkType === 'link') {
          let item_route = this.getPath(item.link);
          
          if(item_route.path === route.path) {
            result = true;
            if(item_route.query) {
              Object.keys(item_route.query).forEach(key=>{
                if(item_route.query[key] !== route.query[key]) {
                  result = false;
                }
              });
            }
          }
        }
      }
      return result;
    },
    currentItem2Style(item) {
      let deco = {};
      
      if(this.currentItem(item)) {
        deco.color = this.parseColor(this.depth2.colorSet.sub);
      }
      return deco;
    }
  },
  computed: {
    visibleList() {
      return this.list.slice(0, this.limitIndex);
    },
    itemStyle() {
      let deco = {
        fontSize: '16px',
        padding: '20px 16px',
        fontWeight: '500'
      };
      if(this.menuItemStyle && Object.keys(this.menuItemStyle).length>0) {
        deco = this.menuItemStyle;
        if(deco.color) {
          deco.color = this.parseColor(deco.color);
        }
      }
      deco.color = this.parseColor(this.colorSet.main);
      return deco;
    },
    depth2Style() {
      let bgColor = this.parseColor(this.depth2.colorSet.backgroundColor);
      if(bgColor === '') {
        bgColor = this.brandBgColor.reverse.backgroundColor;
      }
      let color = this.parseColor(this.depth2.colorSet.main);
      if(color === '') {
        color = this.brandColor.reverse.color;
      }
      let deco = { backgroundColor: bgColor, color: color }
      
      let width = this.depth2.width;
      if (width && width !== '') {
        deco.width = width;
      }
      return deco;
    },
    childList() {
      if(this.selectedHoverMenu && this.selectedHoverMenu.children && this.selectedHoverMenu.children.length>0) {
        return this.selectedHoverMenu.children;
      }
      else {
        if(this.selectedMenuset && this.selectedMenuset.children && this.selectedMenuset.children.length>0) {
          return this.selectedMenuset.children;
        }
        else {
          return [];
        }
      }
    },
    showChildState() {
      if (!this.isDev && this.selectedHoverMenu) {
        return !!(this.selectedHoverMenu.children && this.selectedHoverMenu.children.length > 0);
      } else {
        return false;
      }
    },
    hiddenState() {
      if (this.selectedHoverMenu) {
        return !!(this.selectedHoverMenu.children && this.selectedHoverMenu.children.length===0);
      } else {
        return false;
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.indicator {
  width: 100%; 
  height: 3px; 
  position: absolute; 
  top: 58px; 
  left: 0; 
  right: 0;
  z-index: 1;
}
.more-list {
    top: 32px;
    left: 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
    min-width: 128px;
    padding: 8px 0;  
    font-weight: 500;
    z-index: 2;
  }
  .menu-item-more {
    padding: 14px 8px;
    white-space: pre;
    font-size: 12px;
    border-bottom: 1px solid #ddd;
    margin: 0 12px;
  }
  .menu-item-more:last-child {
    padding: 14px 8px;
    white-space: pre;
    font-size: 12px;
    margin: 0 12px;
    border: none;
  }
</style>

