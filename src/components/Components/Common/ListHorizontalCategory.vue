<template>
<div class="p-bg-white" style="position:fixed;top:50px;width:100%;z-index:10">
  <div class="overflow-hidden full-width"
         v-dragscroll.x="true"
         @dragscrollmove.prevent.self="onDrag"
         :class="{'dragscroll':isIE}"
         ref="dragscroll1"
         :style="grabStyle">
    <div class="grab-bing flex-align full-width" ref="grabbing">
      <div v-for="(item,idx) in menu"
           :key="'tab-'+item.id" class="unselect list-item"
           :class="{
            'p-primary': selectedItem1 && item.id === selectedItem1.id,
            'p-border-bottom-primary': selectedItem1 && item.id === selectedItem1.id,
            'p-main': selectedItem1 && item.id !== selectedItem1.id,
            'p-border-bottom-main': selectedItem1 && item.id !== selectedItem1.id
           }"
           style="padding: 13px 16px; border-bottom-width: 2px"
           :style="{borderBottomColor: 'transparent'}"
           @click.stop.prevent="clickTab1(item,idx)"
           :ref="'tabItem'+idx">
           {{ item.name }}
            <!--<div v-if="item.id===selectedTab" class="indicator" :style="indicatorStyle"></div>     -->
      </div>
    </div>
  </div>
</div>
</template>
<script>
import BlockGnbMixin from "@/components/Components/Mixins/BlockGnbMixin"

export default {
  name: 'ListHorizontalCategory',
  components: {

  },
  mixins: [
    BlockGnbMixin
  ],
  props: {

  },
  data() {
    return {
      "menu": [],
      "type": "scroll",
      "dragging": false
    }
  },
  created() {
  },
  mounted() {

  },
  
  methods: {
    async getMenuset() {
      this.menu = [];
      let cat1 = this.$store.getters.category.filter(item => { return item.id === Number(this.$route.query.gnb) });
      if(cat1.length>0 && cat1[0].child && cat1[0].child.length>0) {
        this.menu = cat1[0].child.map(cat => {
          return {
            link: `product?gnb=${cat1[0].id}&cat=${cat.id}`,
            linkType: 'link',
            name: cat.name,
            id: cat.id,
            icon: cat.img_before,
            index: cat.index
          }
        });
        this.menu.splice(0,0, {
          link: `product?gnb=${cat1[0].id}`,
          linkType: 'link',
          name: '전체',
          id: cat1[0].id,
          index: 0
        });
      }
      
      this.$emit('onMenu', this.menu);
      
      if(this.type==='scroll') {
        // scroll array1 구성
        this.onReg1(); 
      }
      
      this.$nextTick(() => {
        // 라우트로 바로 진입했을때
        this.getInitItem();          
      });
      
    },
    itemStyle1(item) {
      let obj = {
        padding: '13px 16px'
      };
      
      if(this.selectedItem1 && item.id===this.selectedItem1.id) {
        obj.color = this.brandColor.primary.color;
        obj.borderBottom = `2px solid ${this.brandColor.primary.color}`;
      }
      else {
        obj.color = this.brandColor.main.color;
        obj.borderBottom = `2px solid transparent`;
      }
      return obj;
    },
    itemStyle2(item) {
      let obj = {
        padding: '13px 16px'
      };
      
      if(this.selectedItem2 && item.id===this.selectedItem2.id) {
        obj.color = this.brandColor.primary.color;
        obj.borderBottom = `2px solid ${this.brandColor.primary.color}`;
      }
      else {
        obj.color = this.brandColor.main.color;
        obj.borderBottom = `2px solid transparent`;
      }
      return obj;
    },
    itemStyle3(item) {
      let obj = {
        padding: '13px 16px'
      };
      
      if(this.selectedItem3 && item.id===this.selectedItem3.id) {
        obj.color = this.brandColor.primary.color;
        obj.borderBottom = `2px solid ${this.brandColor.primary.color}`;
      }
      else {
        obj.color = this.brandColor.main.color;
        obj.borderBottom = `2px solid transparent`;
      }
      return obj;
    }
  },
  computed: {
    indicatorStyle() {
      return {
        width: '100px',
        height: '2px',
        backgroundColor: 'red'
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.grab-bing {
  white-space: nowrap;
  position: relative;
}
.list-item {
  display: inline-block;
}
</style>

