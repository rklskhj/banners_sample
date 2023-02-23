<template>
<div class="grid-box full-width" v-show="visible" :class="'block-menuset-'+index">
  <div v-for="(item,idx) in list" :class="`col-${12/list.length}`">
    <div :style="itemStyle">{{ item.name }}</div>
    <div v-for="(child,idx) in item.children">
      <div  :style="childStyle">{{ child.name }}</div>
    </div>  
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockFooterMenuset',
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
    visible: {
      type: Boolean,
      default: true,
    },
    colorSet: {
      type: Object,
    },
    menuItemStyle: {
      type: Object,
    },
    menuChildStyle: {
      type: Object,
    },

  },
  data() {
    return {
      "name": "BlockFooterMenuset"
    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    itemStyle() {
      let deco = this.menuItemStyle;
      deco.color = this.colorSet.main.color;
      return deco;
    },
    childStyle() {
      let deco = this.menuChildStyle;
      deco.color = this.colorSet.sub.color;
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


