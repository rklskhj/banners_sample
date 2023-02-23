<template>
<div v-show="visible">
  <div class="list-wrap full-width block-gnb-temp"
         v-dragscroll.x="true"
         @dragscrollmove.prevent.self="onDrag"
         :class="{'dragscroll':isIE}"
         ref="dragscroll1">
      <div class="grab-bing flex-align full-width" ref="grabbing">
        <div v-for="(item,idx) in menu"
             :key="'tab-'+idx" class="unselect list-item gnb-text-color"
             :style="itemStyle1(item)"
             @click.stop.prevent="$emit('clickTab', {item: item, idx: idx})"
             :ref="'tabItem'+idx">
             {{ item.name }}
              <!--<div v-if="item.id===selectedTab" class="indicator" :style="indicatorStyle"></div>     -->
        </div>
      </div>
    </div>
    
</div>
</template>
<script>

export default {
  name: 'BlockHeaderGnb',
  components: {

  },
  mixins: [

  ],
  props: {
    menu: {
      type: Array,
    },
    type: {
      type: String,
    },
    visible: {
      type: Boolean,
    },
    colorSet: {
      type: Object,
    },
    dragging: {
      type: Boolean,
    },
    selectedItem1: {
      type: Object,
    },

  },
  data() {
    return {

    }
  },
  created() {
  },
  mounted() {

  },
  
  methods: {
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.$emit('update:dragging', true);
      }
    },
    itemStyle1(item) {
      let obj = {
        padding: '13px 16px'
      };
      
      if(this.selectedItem1 && item.link===this.selectedItem1.link) {
        obj.color = this.parseColor(this.colorSet.sub);
        obj.borderBottom = `2px solid ${obj.color}`;
      }
      else {
        obj.color = this.parseColor(this.colorSet.main);
        obj.borderBottom = `2px solid transparent`;
      }
      return obj;
    }
  },
  computed: {
    grabStyle() {
      return {
        borderBottom: this.brandBorder.main.border,
      }
    },
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
.list-wrap {
  overflow: hidden;
}
.grab-bing {
  white-space: nowrap;
  position: relative;
}
.list-item {
  display: inline-block;
}
</style>

