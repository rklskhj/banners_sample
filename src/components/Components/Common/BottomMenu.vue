<template>
<div class="flex-between full-width p-bg-white" :style="containerStyle">
  <div :style="menuItemStyle" class="unselect" @click="clickBottomMenu(item)"
    v-for="(item,idx) in menu.slice(0,limitIndex)" :key="`bottom-menu-${idx}`">
    <div class="flex-center">
      <div class="position-relative" style="width:24px;height:24px">
        <i class="material-icons-outlined p-icon position-relative"
          :class="{
            'p-brand': selectedMenu === item,
            'p-sub': selectedMenu !== item
          }"
          v-if="item.img_type === 'icon' && item.icon && item.icon!==''">{{ item.icon }}</i>
        <div v-else style="width:24px;height:24px"
             :style="imgStyle(item)"></div>
        <badge v-if="hasFeed(item)" :val="item.feed"></badge>
      </div>
    </div>
    <div class="size-10" style="margin-top: 4px"
      :class="{
        'p-brand': selectedMenu === item,
        'p-sub': selectedMenu !== item
      }">{{ item.name }}</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BottomMenu',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "menu": [],
      "isDev": false,
      "menuId": 7,
      "limitIndex": 6,
      "selectedMenu": {}
    }
  },
  created() {
    this.setMenu();
  },
  
  methods: {
    setMenu() {
      this.$axios.get('public/ui/menuset/style/bottom_menu?activated=true').then(res=>{
        this.menu = res.data[0].menu;
        let index = this.menu.findIndex(item => this.currentPath(item.link));
        if (index > -1) {
          this.selectedMenu = this.menu[index];
        }
      });
    },
    clickBottomMenu(item) {
      this.selectedMenu = item;
        if (item.emit) {
          this.$emit(item.emit);
        }
        else if(item.linkType === 'outlink') {
          if(item.outlink.indexOf('http')>0) {
            location.href = item.outlink;
          } else {
            this.$router.push(item.outlink);
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
      },
    currentPath(path) {
        return this.$route.path.indexOf(path) > -1;
      },
    imgStyle(item) {
        let deco = {
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
        deco.backgroundImage = `url(${item.img})`;
        /*if(!this.currentPath(item.link)) {
          deco.backgroundImage = `url(${item.img_before})`;
        } else {
          deco.backgroundImage = `url(${item.img_after})`;
        }*/
        return deco;
      },
    hasFeed(item) {
        return item.feed && item.feed !== '' && item.feed !== '0' && item.feed !== 0;
      }
  },
  computed: {
    containerStyle() {
        let sub = 0;
        if(this.$store.getters.browserType === 'pc' && !this.isDev)
          sub = 4;
        let pos = this.isDev ? '' : 'fixed';
          
        return {
          position: pos,
          zIndex: 10,
          borderTop: '1px solid #eee',
          width: `${this.$store.getters.deviceWidth - sub}px`,
          bottom: 0
        }
      },
    menuItemStyle() {
        let width = 100 / this.menu.length;
        return {
          width: `${width}%`,
          padding: '5px 0',
          textAlign: 'center',
          height:'50px'
        };
      }
  },
  watch: {
    '$route'(n) {
      let index = this.menu.findIndex(item => this.currentPath(item.link));
      if (index !== -1) {
        this.selectedMenu = this.menu[index];
      } else {
        this.selectedMenu = this.menu[0];
      }
    }
  }
}
</script>


