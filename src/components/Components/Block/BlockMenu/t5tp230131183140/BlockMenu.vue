<template>
<div style="padding:25px 0" :style="containerBg">
    <div :style="gridStyle">
      <div v-for="(item,idx) in list" :key="item.id" 
        class="flex-center unselect"
        @click="clickCat(item)">
        <div class="img-wrap flex-center wrap" :style="boxStyle(idx)">
          <i v-if="item.img_type && item.img_type === 'icon'" :style="brandColor.main"
            class="material-icons-outlined" style="font-size: 32px">{{ item.icon }}</i>
          <e-image v-else :isBg="true" :isLazy="false"
            :img="item.img" :useThumb="true"
            :width="32" :useRatio="true"
            :imageRates="imageRates" class="flex-center position-relative">
          </e-image>
          <div class="full-width size-12 text-center weight-500" 
              style="margin-top: 8px;" :style="brandColor.main">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockMenu',
  components: {

  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "img": "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/41446278.jpeg",
      "key": "t3tp221201181850",
      "list": [],
      "title": "메뉴",
      "bgColor": "brandBgColor.main",
      "gridNum": 4,
      "imageRates": {
        "ratio": "1:1"
      },
      "visibleNum": 12
    }
  },
  created() {
    this.getData();
  },
  mounted() {
  
  },
  
  methods: {
    async getData() {
      let res = await this.$axios.get(`public/ui/menuset/style/${this.key}?activated=true`);
      let list = [];
      res.data[0].menu.forEach(menu => {
        if(menu.is_category) {
          list = list.concat(
            this.$store.getters.category.map(cat => {
              return {
                link: `product?gnb=${cat.id}`,
                linkType: 'link',
                name: cat.name,
                id: cat.id,
                img: cat.img_before ? cat.img_before : this.img
              }
            })
          )
        }
        else {
          if(menu.img_type === 'icon' && menu.icon === '') {
            menu.img_type = 'img';
            menu.img = this.img;
          } else if(menu.img) {
            menu.img_before = menu.img;
          } else if(!menu.img || !menu.img) {
            menu.img = this.img;
          }
          list.push(menu);
        }
      });
      
      this.list = list.slice(0, this.visibleNum);
    },
    clickCat(item) {
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
        const a = document.createElement("a");
        a.href = item.link;
        a.setAttribute('target', '_blank');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      }
    },
    boxStyle(idx) {
      const border = this.brandBorder.sub.border.replace(/1px/gi, '0.5px');
      let deco = {
        borderRight: border,
        borderBottom: border
      };
      
      if(idx%4===0) {
        deco.borderLeft = border;
      }
      
      if(idx<4) {
        deco.borderTop = border;
      }
      
      return deco;
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor)
      }
    },
    gridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.gridNum}, 1fr)`
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.img-wrap {
  width: 100%;
  height: 100px;
  padding: 14px 0;
}
.cat-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>

